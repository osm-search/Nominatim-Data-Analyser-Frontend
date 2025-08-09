import {writable} from 'svelte/store';
import type ILayer from '../model/ILayer';

export const selectedLayer = writable<ILayer>();
