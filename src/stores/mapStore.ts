import {writable} from 'svelte/store';
import OlMap from 'ol/Map';

export const map = writable<OlMap>();