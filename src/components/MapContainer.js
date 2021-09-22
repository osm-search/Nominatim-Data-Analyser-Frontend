import { useEffect, useRef } from "react";
import URLStateManager from "../ol-map-logic/URLStateManager.js";
import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import FeaturesLayerFactory from "../ol-map-logic/FeaturesLayerFactory";
import Overlay from 'ol/Overlay';
import {useGeographic as geographicProj} from 'ol/proj';
import CrossIcon from '../assets/icons/cross.svg';

/**
 * Contains the OpenLayers map with its logic.
 * @param {object} props
 * @param {object} props.selectedLayer Current selected layer among all the layers.
 */
const MapContainer = ( { selectedLayer } ) => {
    /**
     * Reference containing the Openlayers map.
     */
    const map = useRef();
    /**
     * State containing the current OpenLayers layer of features. Its reference
     * is needed to remove it from the map when the selected layer change.
     */
    const currentOlFeaturesLayer = useRef();
    /**
     * Current feature layer which contains the layer data extracted from the remote server.
     */
    const currentFeaturesLayer = useRef();
    /**
     * OpenLayers map overlay displayed when clicking on a feature.
     */
    const overlay = useRef();
    const mapContainer = useRef();
    const popup = useRef();
    const popupCloser = useRef();
    const popupContent = useRef();

    /**
     * When the component is loaded, we initialize the openlayers map and overlay.
     */
    useEffect(() => {
        //Calling the useGeographic function in the 'ol/proj' module makes it so 
        //the map view uses geographic coordinates (even if the view projection is not geographic).
        geographicProj();
    
        overlay.current = new Overlay({
            element: popup.current,
            autoPan: true,
            autoPanAnimation: {
              duration: 250,
            },
        });

        map.current = new Map({
            layers: [
                new TileLayer({
                source: new OSM(),
                })
            ],
            overlays: [overlay.current],
            target: mapContainer.current,
            view: new View({
                center: [0, 0],
                zoom: 0
            })
        })

        //Manually set the map view from the initial state when the page just loaded.
        setMapViewFromState();
        map.current.on('moveend', () => URLStateManager.getInstance().setMapState(map.current)); 
        map.current.on('click', onMapClick);

        popupCloser.current.onclick = function () {
            overlay.current.setPosition(undefined);
            return false;
        };
    }, [])

    /**
     * When the state of selectedLayer change, the openlayers features layer is updated
     * to match the new selected layer.
     */
    useEffect(() => {
        if (currentOlFeaturesLayer.current) {
            map.current.removeLayer(currentOlFeaturesLayer.current);
            currentOlFeaturesLayer.current = null;
            currentFeaturesLayer.current = null;
        }
        overlay.current.setPosition(undefined);
        if (selectedLayer) {
            URLStateManager.getInstance().setLayerState(selectedLayer.id);
            currentFeaturesLayer.current = FeaturesLayerFactory.constructFeaturesLayer(selectedLayer)
            currentOlFeaturesLayer.current = currentFeaturesLayer.current.olLayer;
            map.current.addLayer(currentOlFeaturesLayer.current);
        }else {
            URLStateManager.getInstance().setLayerState(null);
        }
    }, [selectedLayer])

    /**
     * Set the map view center/zoom to the values stored in the URL state.
     */
    const setMapViewFromState = () => {
        map.current.getView().setCenter(URLStateManager.getInstance().state.viewCenter);
        map.current.getView().setZoom(URLStateManager.getInstance().state.viewZoom);
    }

    /**
     * Called whenever the map is clicked.
     * The onFeatureClick() of the currentFeaturesLayer is called if
     * one feature has been clicked.
     */
    const onMapClick = (event) => {
        var hit = false;
        overlay.current.setPosition(undefined);
        map.current.forEachFeatureAtPixel(
            event.pixel,
            function (feature) {
                //Only keep the first hit
                if (!hit) {
                    hit = true;
                    currentFeaturesLayer.current.onFeatureClick(feature, event.coordinate, map.current, overlay.current, popupContent);
                }
            },
            {
                hitTolerance: 3
            }
        );
    }

    return (
        <div className='map-container'>
            <section ref={mapContainer} id='map'></section>
            <div ref={popup} className="ol-popup">
                <div className='popup-header'>
                    <p>Properties</p>
                    <div className='flex-one'></div>
                    <img src={CrossIcon} alt='close icon popup' ref={popupCloser} className="ol-popup-close-icon"/>
                </div>
                {/* <div className='ol-popup-content-wrapper'> */}
                <div ref={popupContent} className='ol-popup-content'></div>
            </div>
        </div>
    )
}

export default MapContainer
