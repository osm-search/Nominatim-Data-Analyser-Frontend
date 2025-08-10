<script lang='ts'>
    import type ILayer from '../../model/ILayer';
    import {appState} from '../../AppState.svelte';
    import LayerDocumentationEntry from './LayerDocumentationEntry.svelte';
    import URLStateManager from '../../URLStateManager';

    let {layer} : {layer: ILayer} = $props();
    let isOpen = $derived(layer == appState.selectedLayer);

    function setSelectedLayer() {
        if (isOpen) {
            appState.selectedLayer = null;
            URLStateManager.getInstance().setLayerState(null);
        } else {
            appState.selectedLayer = layer;
            URLStateManager.getInstance().setLayerState(layer.id);
        }
    }
</script>

<div class={`layer-wrapper ${isOpen ? 'layer-toggle' : ''}`}>
    <button class='layer-title-arrow-wrapper' title={isOpen ? 'Click to close' : 'Click to select'} onclick={setSelectedLayer}>
        <h3>{layer.name}</h3>
        <div class="flex-one"></div>
        <img
            class='layer-arrow-icon'
            alt='layer arrow icon'
            src={isOpen ? 'assets/icons/arrow-down-icon.svg' : 'assets/icons/arrow-right-icon.svg'}
        />
    </button>
    <div class={`layer-data-wrapper ${isOpen ? 'layer-data-toggle' : ''}`}>
        <LayerDocumentationEntry layer={layer} docEntry='description'/>
        <LayerDocumentationEntry layer={layer} docEntry='why_problem'/>
        <LayerDocumentationEntry layer={layer} docEntry='how_to_fix'/>
        <LayerDocumentationEntry layer={layer} docEntry='last_update'/>
    </div>
</div>

<style>
    .layer-wrapper:not(:first-child) {
        border-top: solid 1px #e8e8e8;
    }

    .layer-wrapper {
        padding: 1em;
        color: #383838;
    }

    .layer-wrapper {
        transition: max-height 0.15s ease-out;
    }

    .layer-wrapper:hover {
        background-color: #f5f5f5;
    }

    .layer-wrapper.layer-toggle {
        background-color: #f5f5f5;
    }

    .layer-title-arrow-wrapper {
        font-size: 1em;
        display: flex;
        cursor: pointer;
        align-items: center;
        width: 100%;
    }

    .layer-wrapper h3 {
        font-size: 0.95em;
        word-wrap: break-word;
        overflow: hidden;
    }

    .layer-data-wrapper {
        font-family: 'Roboto-Regular';
        max-height: 0;
        transition: max-height 0.5s ease-out;
        overflow: hidden;
    }

    .layer-data-wrapper.layer-data-toggle {
        max-height: 10000px;
        transition: max-height 0.5s ease-in;
    }

    .layer-arrow-icon {
        width: 1.2em;
        margin-left: 1em;
    }
</style>
