<script lang='ts'>
    import type ILayer from '../../model/ILayer';
    import web_path from 'CFG_WEB_PATH';
    import type ILayersList from '../../model/ILayersList';
    import {onMount} from 'svelte';
    import Spinner from '../Spinner.svelte';
    import Layer from './Layer.svelte';
    import {appState} from '../../AppState.svelte.js';
    import URLStateManager from '../../URLStateManager';

    let allLayers: ILayer[] | undefined = $state();

    onMount(() => {
        loadLayers();
    });

    async function loadLayers() {
        const requestInit: RequestInit = {
            method: 'GET',
            cache: 'no-cache'
        };

        try {
            const layersResponse = await fetch(`${web_path}/layers.json`, requestInit);
            if (layersResponse.ok) {
                const layersList: ILayersList = await layersResponse.json();
                loadEachLayer(requestInit, layersList).then((layers) => {
                    allLayers = layers;
                    loadInitialSelectedLayer();
                });
            }
        } catch (error) {
            console.warn('Error while loading the layers list from the server.');
        }
    }

    async function loadEachLayer(requestInit: RequestInit, layersList: ILayersList): Promise<ILayer[]> {
        const loadedLayers: ILayer[] = [];
        for (const layerURL of layersList.layers) {
            try {
                const layerResponse = await fetch(layerURL, requestInit);
                if (layerResponse.ok) {
                    const layer = await layerResponse.json();
                    loadedLayers.push(layer);
                }
            } catch (error) {
                console.warn('Error while loading the layer: ' + layerURL + ' from the server');
            }
        }
        return loadedLayers;
    }

    function loadInitialSelectedLayer() {
        if (allLayers.length > 0) {
            const urlStateManager = URLStateManager.getInstance();
            if (urlStateManager.state.layerID) {
                const stateLayer = decodeURI(urlStateManager.state.layerID);
                const layer = allLayers.find(l => l.id === stateLayer);
                appState.selectedLayer = layer;
            }
        }
    }
</script>

<div class='layers-list-wrapper'>
    {#if allLayers === undefined}
        <div class='layers-loading-indicator'>
            <Spinner/>
        </div>
    {:else}
        {#each allLayers as layer}
            <Layer layer={layer}/>
        {/each}
    {/if}
</div>

<style>
    .layers-list-wrapper {
        margin-bottom: 1em;
    }

    .layers-loading-indicator {
        padding-left: 16px;
    }
</style>
