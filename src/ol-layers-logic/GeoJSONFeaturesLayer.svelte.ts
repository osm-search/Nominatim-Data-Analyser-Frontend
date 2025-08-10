import SourceVector from 'ol/source/Vector';
import {Vector as VectorLayer} from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import {Cluster} from 'ol/source';
import ClusteredFeaturesLayer from './ClusteredFeaturesLayer';
import {createEmpty, extend, getCenter} from 'ol/extent';
import type ILayer from '../model/ILayer';
import {Feature} from 'ol';
import type {FeatureLike} from 'ol/Feature';
import {Point} from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import {appState} from '../AppState.svelte.ts';

/**
 * Handles the logic for a features layer with a GeoJSON source.
 */
class GeoJSONFeaturesLayer extends ClusteredFeaturesLayer {
    private readonly source_url: any;

    constructor(layer: ILayer) {
        const getFeatureSize = (feature: Feature<Point>) => feature.get('features').length;
        super(8, 25, getFeatureSize);
        this.source_url = 'geojson_url' in layer ? layer['geojson_url'] : '';
    }

    /**
     * Construct the OpenLayers layer with the right informations and with a geojson source.
     * The current date is added to the source_url in order to avoid caching by
     * the browser or server.
     */
    get olLayer(): VectorLayer<VectorSource> {
        return new VectorLayer({
            source: new Cluster({
                distance: 50,
                source: new SourceVector({
                    url: this.source_url,
                    format: new GeoJSON()
                }),
            }),
            style: (feature: FeatureLike, resolution: number) => this.getStyle(feature)
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
        const originalFeatures = feature.get('features');
        if (originalFeatures.length > 1) {
            const view = appState.map.getView();
            const extent = createEmpty();
            originalFeatures.forEach(function(f: any, index: number, array: any){
                extend(extent, f.getGeometry().getExtent());
            });
            const resolution = view.getResolutionForExtent(extent);
            const targetZoom = view.getZoomForResolution(resolution);
            const location = getCenter(extent);
            view.animate({
                center: location,
                zoom: Math.max(targetZoom || 0, (view.getZoom() || 0) + 1),
                duration: 1000
            })
        } else {
            appState.selectedFeature = {
                properties: feature.get('features')[0].getProperties(),
                coordinates: coordinates
            };
        }
    }
}

export default GeoJSONFeaturesLayer;
