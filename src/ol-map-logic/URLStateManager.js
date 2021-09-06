import {format} from 'ol/coordinate';

export default class URLStateManager {
    constructor() {
        if (!URLStateManager._instance) {
            this.state = {          
                viewZoom: 0,
                viewCenter: [0, 0],
                layerName: null
            }
            this._loadState();
            return this;
        }
        return URLStateManager._instance;
    }

    static getInstance() {
        if (!URLStateManager._instance) {
            URLStateManager._instance = new URLStateManager();
        }
        return URLStateManager._instance;
    }

    _loadState() {
        const hash = window.location.hash.replace('#map=', '').replace('?layer=', '/');
        const hashParts = hash.split('/');
        if (hashParts.length >= 3) {
            //Parse the layer name
            if (hashParts.length === 4) {
                this.state.layerName = hashParts.pop();
            }
            //Parse the map state.
            if (hashParts.every((e) => !isNaN(e))) {
                this.state.viewZoom = parseFloat(hashParts[0]);
                this.state.viewCenter = [parseFloat(hashParts[2]), parseFloat(hashParts[1])];
            }
        }
    }
    
    writeState() {
        let hash =
            '#map=' +
            this.state.viewZoom.toFixed(2) +
            '/' +
            format(this.state.viewCenter, '{y}/{x}', 2);
        if (this.state.layerName) {
            hash += '?layer=' + this.state.layerName;
        }
        window.history.replaceState(this.state, 'state', hash);
    }

    setMapState(map) {
        const view = map.getView();
        this.state.viewZoom = view.getZoom();
        this.state.viewCenter = view.getCenter();
        this.writeState();
    }

    setLayerState(layerName) {
        this.state.layerName = layerName;
        this.writeState();
    }
}
