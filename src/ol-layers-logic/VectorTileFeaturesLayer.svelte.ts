import 'ol/ol.css';
import Feature from 'ol/Feature';
import type FeatureLike from 'ol/Feature';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import ClusteredFeaturesLayer from './ClusteredFeaturesLayer';
import type ILayer from '../model/ILayer';
import {Point} from 'ol/geom';
import {appState} from '../AppState.svelte.ts';

/**
 * Handles the logic for a features layer with a VectorTile source.
 */
class VectorTileFeaturesLayer extends ClusteredFeaturesLayer {
    private readonly source_url: string;

    constructor(layer: ILayer) {
        const getFeatureSize = (feature: Feature<Point>) => {
            if (feature.get('cluster')) {
                return feature.get('point_count'); 
            } else {
                return 1;
            }
        }
        super(80, 500, getFeatureSize);
        this.source_url = layer?.vector_tile_url || '';
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
                maxZoom: 15,
                url: this.source_url
            }),
            style: (feature, resolution) => this.getStyle(feature),
            maxZoom: 19
        });
    }

    /**
     * Called when a feature of this layer has been clicked.
     * If the feature is a cluster, the map's view is zoomed to this
     * feature in order to display its child features.
     * 
     * If the feature is not a cluster, the popup is opened with the well constructed content inside.
     */
    onFeatureClick(feature: Feature<Point>, coordinates: number[]): void
    {
        if (feature.get('cluster')) {
            const view = appState.map.getView();
            if (view) {
                view.animate({
                    center: coordinates,
                    zoom: Math.max(feature.get('clusterExpansionZoom'),
                                   (view.getZoom() || 0) + 1),
                    duration: 1000
                });
            }
        } else {
            appState.selectedFeature = {
                properties: feature.getProperties(),
                coordinates: coordinates
            };
        }
    }
}

export default VectorTileFeaturesLayer;
