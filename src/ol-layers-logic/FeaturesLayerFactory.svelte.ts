import GeoJSONFeaturesLayer from './GeoJSONFeaturesLayer.svelte';
import VectorTileFeaturesLayer from './VectorTileFeaturesLayer.svelte';
import type ILayer from '../model/ILayer';
import ClusteredFeaturesLayer from './ClusteredFeaturesLayer';

/**
 * Factory to create the right features layers based on the layer definition.
 */
class FeaturesLayerFactory {
    static constructFeaturesLayer(layer: ILayer): ClusteredFeaturesLayer {
        if ('geojson_url' in layer) {
            return new GeoJSONFeaturesLayer(layer)
        } else {
            return new VectorTileFeaturesLayer(layer);
        }
    }
}

export default FeaturesLayerFactory;
