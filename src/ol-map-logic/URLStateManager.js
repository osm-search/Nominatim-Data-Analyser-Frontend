export default class URLStateManager {
    constructor() {
        this.state = {          
            viewZoom: 0,
            viewCenter: [0, 0],
            layerName: null
        }
    }

    loadState() {
        const hash = window.location.hash.replace('#map=', '').replace('#layer=', '/');
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
                this.state.layerID = parseFloat(hashParts[3]);
            }
        }
    }
    
    writeState() {
        let hash =
            '#map=' +
            this.state.viewZoom.toFixed(2) +
            '/' +
            this.state.viewCenter[1].toFixed(2) +
            '/' +
            this.state.viewCenter[0].toFixed(2);
        if (this.state.layerName) {
            hash += '#layer=' + this.state.layerName;
        }
        window.history.pushState(this.state, 'map', hash);
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
