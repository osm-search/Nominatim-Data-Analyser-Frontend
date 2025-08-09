import {writable} from 'svelte/store';
import type IProperty from '../model/IProperty';

export const objProperties = writable<IProperty>({properties: null, coordinates: []});
