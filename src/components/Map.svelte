<script lang='ts'>
    import {onMount} from 'svelte';
    import 'ol/ol.css';
    import {Feature, Overlay, View} from "ol";
    import Map from 'ol/Map';
    import TileLayer from 'ol/layer/Tile';
    import {OSM} from 'ol/source';
    import {defaults as defaultControls, ZoomSlider} from 'ol/control';
    import {useGeographic} from 'ol/proj';
    import {selectedLayer} from '../stores/layerStore';
    import ILayer from '../model/ILayer';
    import FeaturesLayerFactory from '../ol-layers-logic/FeaturesLayerFactory';
    import BaseLayer from 'ol/layer/Base';
    import {Geometry} from 'ol/geom';
    import ClusteredFeaturesLayer from '../ol-layers-logic/ClusteredFeaturesLayer';
    import OlMap from 'ol/Map';
    import {map} from '../stores/mapStore';
    import Popup from './Popup.svelte';
    import URLStateManager from '../URLStateManager';

    let localMap: OlMap;
    let overlay: Overlay | undefined;

    let mapHTMLDiv: HTMLDivElement;
    let popupContent: HTMLDivElement;

    let currentOlFeaturesLayer: BaseLayer | undefined;
    let currentClusteredFeatureLayer: ClusteredFeaturesLayer | undefined;

    onMount(() => {
        //Calling the useGeographic function in the 'ol/proj' module makes it so
        //the map view uses geographic coordinates (even if the view projection is not geographic).
        useGeographic();

        localMap = new Map({
            layers: [
                new TileLayer({
                    source: new OSM(),
                })
            ],
            controls: defaultControls({
                zoom: true,
                attribution: true,
                rotate: false
            }),
            overlays: [overlay],
            target: mapHTMLDiv,
            view: new View({
                center: [0, 0],
                zoom: 0
            })
        });

        localMap.addControl(new ZoomSlider());

        //Manually set the map view from the initial state when the page just loaded.
        setMapViewFromState();
        localMap.on('moveend', () => URLStateManager.getInstance().setMapState(localMap));
        localMap.on('click', onMapClick);

        map.set(localMap);
    });

    let isFirstSelectedLayerUpdate = true;
    selectedLayer.subscribe((selectedLayer: ILayer) => {
        if (isFirstSelectedLayerUpdate) {
            isFirstSelectedLayerUpdate = false;
            return;
        }

        if (currentOlFeaturesLayer) {
            localMap.removeLayer(currentOlFeaturesLayer);
            currentOlFeaturesLayer = undefined;
            currentClusteredFeatureLayer = undefined;
        }
        overlay?.setPosition(undefined);
        if (selectedLayer) {
            URLStateManager.getInstance().setLayerState(selectedLayer.id);
            currentClusteredFeatureLayer = FeaturesLayerFactory.constructFeaturesLayer(selectedLayer)
            currentOlFeaturesLayer = currentClusteredFeatureLayer.olLayer;
            localMap.addLayer(currentOlFeaturesLayer);
        }else {
            URLStateManager.getInstance().setLayerState(null);
        }
    });

    /**
     * Set the map view center/zoom to the values stored in the URL state.
     */
    const setMapViewFromState = () => {
        localMap.getView().setCenter(URLStateManager.getInstance().state.viewCenter);
        localMap.getView().setZoom(URLStateManager.getInstance().state.viewZoom);
    }

    function onMapClick(event) {
        let hit = false;

        overlay.setPosition(undefined);

        localMap.forEachFeatureAtPixel(
            event.pixel,
            function (feature: Feature<Geometry>) {
                //Only keep the first hit
                if (!hit) {
                    hit = true;
                    currentClusteredFeatureLayer?.onFeatureClick(
                        feature, event.coordinate, localMap, overlay, popupContent
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
    <div bind:this={mapHTMLDiv} id='map'></div>
    <Popup bind:overlay={overlay} bind:popupContent={popupContent}/>
</section>

<style>
    .map-container {
        flex: 1;
        height: 100%;
    }

    #map {
        flex: 1;
        height: 100%;
    }
</style>