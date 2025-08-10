<script lang='ts'>
    import {onMount} from 'svelte';
    import 'ol/ol.css';
    import {Feature, Overlay, View} from "ol";
    import TileLayer from 'ol/layer/Tile';
    import {OSM} from 'ol/source';
    import {ZoomSlider} from 'ol/control';
    import {useGeographic} from 'ol/proj';
    import {selectedLayer} from '../stores/layerStore';
    import type ILayer from '../model/ILayer';
    import FeaturesLayerFactory from '../ol-layers-logic/FeaturesLayerFactory';
    import BaseLayer from 'ol/layer/Base';
    import {Geometry} from 'ol/geom';
    import ClusteredFeaturesLayer from '../ol-layers-logic/ClusteredFeaturesLayer';
    import {appState} from '../AppState.svelte.ts';
    import Popup from './Popup.svelte';
    import URLStateManager from '../URLStateManager';
    import ResetPositionControl from './ResetPositionControl.svelte';

    let overlay: Overlay | undefined;

    let mapHTMLDiv: HTMLDivElement;

    let currentOlFeaturesLayer: BaseLayer | undefined;
    let currentClusteredFeatureLayer: ClusteredFeaturesLayer | undefined;

    onMount(() => {
        //Calling the useGeographic function in the 'ol/proj' module makes it so
        //the map view uses geographic coordinates (even if the view projection is not geographic).
        useGeographic();

        const map = appState.map;
        map.addLayer(new TileLayer({source: new OSM()}));
        map.addOverlay(overlay);
        map.setTarget(mapHTMLDiv);
        map.setView(new View({
                center: [0, 0],
                zoom: 0,
                maxZoom: 19
            }));

        map.addControl(new ZoomSlider());

        //Manually set the map view from the initial state when the page just loaded.
        setMapViewFromState();
        map.on('moveend', () => URLStateManager.getInstance().setMapState(map));
        map.on('click', onMapClick);
    });

    let isFirstSelectedLayerUpdate = true;
    selectedLayer.subscribe((selectedLayer: ILayer) => {
        if (isFirstSelectedLayerUpdate) {
            isFirstSelectedLayerUpdate = false;
            return;
        }

        if (currentOlFeaturesLayer) {
            appState.map.removeLayer(currentOlFeaturesLayer);
            currentOlFeaturesLayer = undefined;
            currentClusteredFeatureLayer = undefined;
        }
        overlay?.setPosition(undefined);
        if (selectedLayer) {
            URLStateManager.getInstance().setLayerState(selectedLayer.id);
            currentClusteredFeatureLayer = FeaturesLayerFactory.constructFeaturesLayer(selectedLayer)
            currentOlFeaturesLayer = currentClusteredFeatureLayer.olLayer;
            appState.map.addLayer(currentOlFeaturesLayer);
        }else {
            URLStateManager.getInstance().setLayerState(null);
        }
    });

    /**
     * Set the map view center/zoom to the values stored in the URL state.
     */
    const setMapViewFromState = () => {
        const urlState = URLStateManager.getInstance().state;
        appState.setVisibleView(urlState.viewCenter, urlState.viewZoom);
    }

    function onMapClick(event) {
        const map = appState.map;
        let hit = false;

        overlay.setPosition(undefined);

        map.forEachFeatureAtPixel(
            event.pixel,
            function (feature: Feature<Geometry>) {
                //Only keep the first hit
                if (!hit) {
                    hit = true;
                    currentClusteredFeatureLayer?.onFeatureClick(
                        feature, event.coordinate, map, overlay
                    );
                }
            },
            {
                hitTolerance: 3
            }
        );
    }
</script>

<section class='map-container'>
    <div bind:this={mapHTMLDiv} id='map'>
        <ResetPositionControl/>
    </div>
    <Popup bind:overlay={overlay} />
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
