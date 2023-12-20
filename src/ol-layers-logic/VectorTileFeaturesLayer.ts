import 'ol/ol.css';
import Feature from 'ol/Feature';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import ClusteredFeaturesLayer from './ClusteredFeaturesLayer';
import {createXYZ} from 'ol/tilegrid';
import ILayer from '../model/ILayer';
import {Point} from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import OlMap from 'ol/Map';
import {Overlay} from 'ol';
import {objProperties} from '../stores/propertyStore';

/**
 * Handles the logic for a features layer with a VectorTile source.
 */
class VectorTileFeaturesLayer extends ClusteredFeaturesLayer {
    private readonly source_url: string;

    constructor(layer: ILayer) {
        const getFeatureSize = (feature: Feature<Point>) => {
            if (feature.get('cluster')) {
                return feature.get('point_count'); 
            }else {
                return 1;
            }
        }
        super(80, 500, getFeatureSize);
        this.source_url = 'vector_tile_url' in layer ? layer['vector_tile_url'] : '';
    }

    /**
     * Construct the OpenLayers layer with the right informations and with a vector tile source.
     * The current date is added to the source_url in order to avoid caching by
     * the browser or server.
     */
    get olLayer(): VectorTileLayer {
        return new VectorTileLayer({
            source: new VectorTileSource({
                format: new MVT({
                    featureClass: Feature
                }),
                tileGrid: createXYZ({maxZoom: 15}),
                url: this.source_url + '?time=' + new Date().getTime()
            }),
            style: (feature: Feature<Point>) => this.getStyle(feature)
        });
    }

    /**
     * Called when a feature of this layer has been clicked.
     * If the feature is a cluster, the map's view is zoomed to this
     * feature in order to display its child features.
     * 
     * If the feature is not a cluster, the popup is opened with the well constructed content inside.
     */
    onFeatureClick(feature: Feature<Point>, coordinates: number[],
                   map: OlMap, overlay: Overlay): void
    {
        if (feature.get('cluster')){
            map.getView().animate({
                center: coordinates,
                zoom: feature.get('clusterExpansionZoom'),
                duration: 1000
            })
        } else {
            objProperties.set({properties: this.getFeatureProperties(feature),
                               coordinates: coordinates});
            overlay.setPosition(coordinates); 
        }
    }

    /**
     * Returns the properties of the given feature object.
     */
    getFeatureProperties(feature): {[key: string]: any} {
        return feature.getProperties();
    }
}

export default VectorTileFeaturesLayer;
