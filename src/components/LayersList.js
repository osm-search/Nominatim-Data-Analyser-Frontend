import { trackPromise } from 'react-promise-tracker';
import { useEffect, useState } from 'react';
import URLStateManager from "../ol-map-logic/URLStateManager.js";
import config from '../config/config.json';
import Layer from './Layer';
import LoadingIndicator from './LoadingIndicator';

/**
 * Handles the loading and display of all layers.
 * @param {object} props
 * @param {object} props.selectedLayer Current selected layer among all the layers.
 * @param {CallableFunction} props.setSelectedLayer Callback to update the state of selectedLayer.
 */
const LayersList = ( { selectedLayer, setSelectedLayer } ) => {
    /**
     * State which contains all the layers.
     */
    const [layers, setLayers] = useState([]);

    /**
     * Layers are loaded from the server when the component is
     * initialized.
     */
    useEffect(() => {
        loadAndWaitLayers()
    }, [])

    useEffect(() => {
        const urlStateManager = URLStateManager.getInstance();
        if (urlStateManager.state.layerName) {
            const layer = layers.find(l => l.name === decodeURI(urlStateManager.state.layerName));
            setSelectedLayer(layer);
        }
    }, [layers])

    /**
     * Wrapper function needed to track all the promises (with trackPromise()) 
     * executed in loadLayers() at once.
     */
    const loadAndWaitLayers = async () => {
        await trackPromise(loadLayers(), 'layers-fetch');
    }

    /**
     * Load layers.json files from the remote server.
     * For each layer, its data content is loaded from the remove server as well.
     */
    const loadLayers = async () => {
        const requestInit = {
            method: 'GET',
            cache: 'no-cache'
        };
        const layersResponse = await fetch(`${config.WEB_PATH}/layers.json`, requestInit);
        if (layersResponse.ok) {
            const layersList = await layersResponse.json();
            const loadedLayers = []
            for (const layerURL of layersList.layers) {
                const layerResponse = await fetch(layerURL, requestInit);
                if (layerResponse.ok) {
                    const layerData = await layerResponse.json();
                    //Set the id to an unique id.
                    layerData['id'] = layersList.layers.indexOf(layerURL);
                    loadedLayers.push(layerData);
                }
            }
            setLayers(loadedLayers);
        }
 
    }

    return (
        <div className='layers-list-wrapper'>
            <LoadingIndicator size={60} area='layers-fetch' className='layers-loading-indicator'/>
            {layers.map(layer => <Layer key={layer.id} layerData={layer} selectedLayer={selectedLayer} setSelectedLayer={setSelectedLayer}/>)}
        </div>
    )
}

export default LayersList
