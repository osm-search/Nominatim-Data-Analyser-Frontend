import { useEffect, useState, useRef } from "react";
import URLStateManager from "../ol-map-logic/URLStateManager.js";
import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import FeaturesLayerFactory from "../ol-map-logic/FeaturesLayerFactory";
import {unByKey} from 'ol/Observable';
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
     * State containing the Openlayers map.
     */
    const [map, setMap] = useState();
    /**
     * State containing the current OpenLayers layer of features. Its reference
     * is needed to remove it from the map when the selected layer change.
     */
    const [currentOlFeaturesLayer, setCurrentOlFeaturesLayer] = useState();
    /**
     * Current feature layer which contains the layer data extracted from the remote server.
     */
    const [currentFeaturesLayer, setCurrentFeaturesLayer] = useState();
    /**
     * OpenLayers map overlay displayed when clicking on a feature.
     */
    const [overlay, setOverlay] = useState();
    /**
     * Key of the event binding for the map.on('click). Used to reset the click event
     * when we want to change the callback.
     */
    const [clickBindKey, setClickBindKey] = useState();

    const urlStateManager = useRef(new URLStateManager());

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

        urlStateManager.current.loadState();
    
        const overlay = new Overlay({
            element: popup.current,
            autoPan: true,
            autoPanAnimation: {
              duration: 250,
            },
        });
        setOverlay(overlay);

        const initialMap = new Map({
            layers: [
                new TileLayer({
                source: new OSM(),
                })
            ],
            overlays: [overlay],
            target: mapContainer.current,
            view: new View({
                center: [0, 0],
                zoom: 0,
            })
        })

        setMapViewFromState(initialMap);
        initialMap.on('moveend', () => urlStateManager.current.setMapState(initialMap)); 
        setMap(initialMap);

        popupCloser.current.onclick = function () {
            overlay.setPosition(undefined);
            return false;
        };
    }, [])

    /**
     * When the state of selectedLayer change, the openlayers features layer is updated
     * to match the new selected layer.
     */
    useEffect(() => {
        if (map) {
            if (currentOlFeaturesLayer) {
                map.removeLayer(currentOlFeaturesLayer);
                setCurrentOlFeaturesLayer(null);
                setCurrentFeaturesLayer(null);
            }
            overlay.setPosition(undefined);
            if (selectedLayer) {
                urlStateManager.current.setLayerState(selectedLayer.name);
                const featureLayer = FeaturesLayerFactory.constructFeaturesLayer(selectedLayer)
                setCurrentFeaturesLayer(featureLayer);
                const olFeaturesLayer = FeaturesLayerFactory.constructFeaturesLayer(selectedLayer).olLayer;
                setCurrentOlFeaturesLayer(olFeaturesLayer);
                map.addLayer(olFeaturesLayer);
            }else {
                urlStateManager.current.setLayerState(null);
            }
        }
    }, [selectedLayer])

    /**
     * The onMapClick() function call a method from currentFeaturesLayer so we need to
     * update the onMapClick callback whenever the currentFeaturesLayer state change.
     */
    useEffect(() => {
        if (map && currentFeaturesLayer) {
            if (clickBindKey) {
                unByKey(clickBindKey);
            }
            setClickBindKey(map.on(['click'], onMapClick));
        }
    }, [currentFeaturesLayer])

    /**
     * Set the map view center/zoom/rotation to the values stored in the URL state.
     */
    const setMapViewFromState = (map) => {
        if (urlStateManager.current.state.viewCenter) {
            map.getView().setCenter(urlStateManager.current.state.viewCenter);
        }
        if (urlStateManager.current.state.viewZoom) {
            map.getView().setZoom(urlStateManager.current.state.viewZoom);
        }
        if (urlStateManager.current.state.viewRotation) {
            map.getView().setRotation(urlStateManager.current.state.viewRotation);
        }
    }

    /**
     * Called whenever the map is clicked.
     * The onFeatureClick() of the currentFeaturesLayer is called if
     * one feature has been clicked.
     */
    const onMapClick = (event) => {
        var hit = false;
        if (map) {
            overlay.setPosition(undefined);
            map.forEachFeatureAtPixel(
                event.pixel,
                function (feature) {
                    //Only keep the first hit
                    if (!hit) {
                        hit = true;
                        currentFeaturesLayer.onFeatureClick(feature, event.coordinate, map, overlay, popupContent);
                    }
                },
                {
                    hitTolerance: 3
                }
            );
        }
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
