<script lang='ts'>
    import {onMount} from 'svelte';
    import 'ol/ol.css';
    import {Feature, View} from "ol";
    import TileLayer from 'ol/layer/Tile';
    import {OSM} from 'ol/source';
    import {ZoomSlider} from 'ol/control';
    import {useGeographic} from 'ol/proj';
    import FeaturesLayerFactory from '../ol-layers-logic/FeaturesLayerFactory.svelte.ts';
    import BaseLayer from 'ol/layer/Base';
    import {Geometry} from 'ol/geom';
    import ClusteredFeaturesLayer from '../ol-layers-logic/ClusteredFeaturesLayer';
    import {appState} from '../AppState.svelte';
    import Popup from './Popup.svelte';
    import URLStateManager from '../URLStateManager';
    import ResetPositionControl from './ResetPositionControl.svelte';

    let popupVisible: boolean = $state(false);

    let mapHTMLDiv: HTMLDivElement;

    let currentOlFeaturesLayer: BaseLayer | undefined;
    let currentClusteredFeatureLayer: ClusteredFeaturesLayer | undefined;

    onMount(() => {
        //Calling the useGeographic function in the 'ol/proj' module makes it so
        //the map view uses geographic coordinates (even if the view projection is not geographic).
        useGeographic();

        const urlState = URLStateManager.getInstance().state;

        const map = appState.map;
        map.addLayer(new TileLayer({source: new OSM()}));
        map.setTarget(mapHTMLDiv);
        map.setView(new View({
                center: urlState.viewCenter,
                zoom: urlState.viewZoom,
                maxZoom: 19
            }));

        map.addControl(new ZoomSlider());

        map.on('moveend', () => URLStateManager.getInstance().setMapState(map));
        map.on('click', onMapClick);
    });

    $effect(() => {
        const selectedLayer = appState.selectedLayer;
        if (currentOlFeaturesLayer) {
            appState.map.removeLayer(currentOlFeaturesLayer);
            currentOlFeaturesLayer = undefined;
            currentClusteredFeatureLayer = undefined;
        }
        popupVisible = false;
        if (selectedLayer) {
            currentClusteredFeatureLayer = FeaturesLayerFactory.constructFeaturesLayer(selectedLayer)
            currentOlFeaturesLayer = currentClusteredFeatureLayer.olLayer;
            appState.map.addLayer(currentOlFeaturesLayer);
        }
    });

    function onMapClick(event) {
        let hit = false;

        appState.map.forEachFeatureAtPixel(
            event.pixel,
            function (feature: Feature<Geometry>) {
                //Only keep the first hit
                if (!hit) {
                    hit = true;
                    currentClusteredFeatureLayer?.onFeatureClick(feature, event.coordinate);
                }
            },
            {
                hitTolerance: 3
            }
        );

        if (!hit) {
            popupVisible = false;
        }
    }
</script>

<section class='map-container'>
    <div bind:this={mapHTMLDiv} id='map'>
        <ResetPositionControl/>
    </div>
    <Popup bind:visible={popupVisible} />
</section>

<style>
    .map-container {
        flex: 1;
        height: 100%;
    }

    #map {
        flex: 1;
        height: 100%;
        position: relative;
    }
</style>
