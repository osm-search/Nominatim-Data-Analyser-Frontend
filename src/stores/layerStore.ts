import {writable} from 'svelte/store';
import Layer from '../model/ILayer';

export const selectedLayer = writable<Layer>();