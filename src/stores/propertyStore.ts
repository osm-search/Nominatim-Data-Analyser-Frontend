import {writable} from 'svelte/store';
import Property from '../model/IProperty';

export const objProperties = writable<Property>({properties: null, coordinates: []});
