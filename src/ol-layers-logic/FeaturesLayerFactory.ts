import GeoJSONFeaturesLayer from "./GeoJSONFeaturesLayer";
import VectorTileFeaturesLayer from "./VectorTileFeaturesLayer";
import ILayer from '../model/ILayer';
import ClusteredFeaturesLayer from './ClusteredFeaturesLayer';

/**
 * Factory to create the right features layers based on the layer definition.
 */
class FeaturesLayerFactory {
    static constructFeaturesLayer(layer: ILayer): ClusteredFeaturesLayer {
        if ('geojson_url' in layer) {
            return new GeoJSONFeaturesLayer(layer)
        }else if ('vector_tile_url') {
            return new VectorTileFeaturesLayer(layer);
        }else {
            return null;
        }
    }
}

export default FeaturesLayerFactory;