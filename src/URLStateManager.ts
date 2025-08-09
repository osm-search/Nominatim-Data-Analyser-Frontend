import {format} from 'ol/coordinate';
import OlMap from 'ol/Map';

interface URLState {
    viewZoom: number;
    layerID: string;
    viewCenter: number[];
}

export default class URLStateManager {
    private static _instance: URLStateManager;
    readonly state: URLState;

    constructor() {
        console.assert(!URLStateManager._instance, "URLStateManager shouldn't be called directly.");
        this.state = {
            viewZoom: 0,
            viewCenter: [0, 0],
            layerID: ''
        }
        this._loadState();
        return this;
    }

    static getInstance(): URLStateManager {
        if (!URLStateManager._instance) {
            URLStateManager._instance = new URLStateManager();
        }
        return URLStateManager._instance;
    }

    _loadState(): void {
        const hash = window.location.hash.replace('#map=', '').replace('&layer=', '/');
        const hashParts = hash.split('/');
        if (hashParts.length >= 3) {
            //Parse the layer name
            if (hashParts.length === 4) {
                this.state.layerID = hashParts.pop() || '';
            }
            //Parse the map state.
            if (hashParts.every((e) => !isNaN(Number(e)))) {
                this.state.viewZoom = parseFloat(hashParts[0]);
                this.state.viewCenter = [parseFloat(hashParts[2]), parseFloat(hashParts[1])];
            }
        }
    }

    writeState(): void {
        let hash =
            '#map=' +
            this.state.viewZoom.toFixed(2) +
            '/' +
            format(this.state.viewCenter, '{y}/{x}', 2);
        if (this.state.layerID) {
            hash += '&layer=' + this.state.layerID;
        }
        window.history.replaceState(this.state, 'state', hash);
    }

    setMapState(map: OlMap): void {
        const view = map.getView();
        this.state.viewZoom = view.getZoom() ?? this.state.viewZoom;
        this.state.viewCenter = view.getCenter() ?? this.state.viewCenter;
        this.writeState();
    }

    setLayerState(layerID: string): void {
        this.state.layerID = layerID;
        this.writeState();
    }
}
