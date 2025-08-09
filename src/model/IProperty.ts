import {Feature} from 'ol';
import {Point} from 'ol/geom';

export default interface IProperty {
    properties: {[key: string]: any} | null;
    coordinates: number[];
}
