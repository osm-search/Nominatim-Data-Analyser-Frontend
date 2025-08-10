import {Map} from 'ol';
import {defaults as defaultControls} from 'ol/control';
import type ILayer from './model/ILayer';

class AppState {
    selectedLayer: ILayer | undefined = $state.raw()

    #olMap : Map;

    constructor() {
        this.#olMap = new Map({
            controls: defaultControls({
                zoom: true,
                attribution: true,
                rotate: false
            })
        });
    }

    get map() {
        return this.#olMap;
    }

    setVisibleView(center: number[], zoom: number) {
        this.#olMap.getView()?.setCenter(center);
        this.#olMap.getView()?.setZoom(zoom);
    }
}

export const appState = new AppState();
