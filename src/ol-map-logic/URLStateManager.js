export default class URLStateManager {
    constructor() {
        this.state = {
            viewCenter: [0, 0],
            viewZoom: 0,
            viewRotation: 0,
            layerID: null
        }
    }

    loadState() {
        const hash = window.location.hash.replace('#state=', '');
        const hashParts = hash.split('/');
        if (hashParts.length === 5) {
            const layerID = hashParts.pop();
            if (hashParts.every((e) => !isNaN(e))) {
                this.state.viewCenter = [parseFloat(hashParts[1]), parseFloat(hashParts[2])];
                this.state.viewZoom = parseFloat(hashParts[0]);
                this.state.viewRotation = parseFloat(hashParts[3]);
                this.state.layerID = parseFloat(hashParts[4]);
            }
            if (layerID && !isNaN(layerID)) {
                this.state.layerID = parseFloat(layerID);
            }
        }
    }
    
    writeState() {
        const hash =
            '#state=' +
            this.state.viewZoom.toFixed(2) +
            '/' +
            this.state.viewCenter[0].toFixed(2) +
            '/' +
            this.state.viewCenter[1].toFixed(2) +
            '/' +
            this.state.viewRotation +
            '/' +
            this.state.layerID;
        window.history.pushState(this.state, 'map', hash);
    }

    setMapState(map) {
        const view = map.getView();
        this.state.viewCenter = view.getCenter();
        this.state.viewZoom = view.getZoom();
        this.state.viewRotation = view.getRotation();
        this.writeState();
    }

    setLayerState(layerID) {
        this.state.layerID = layerID;
        this.writeState();
    }
}
