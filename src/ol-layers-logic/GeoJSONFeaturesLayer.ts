import SourceVector from 'ol/source/Vector';
import {Vector as VectorLayer} from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import {Cluster} from 'ol/source';
import ClusteredFeaturesLayer from './ClusteredFeaturesLayer';
import {createEmpty, extend, getCenter} from 'ol/extent';
import ILayer from '../model/ILayer';
import {Feature, Overlay} from 'ol';
import {Point} from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import OlMap from 'ol/Map';
import {objProperties} from '../stores/propertyStore';

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
    get olLayer(): VectorLayer<VectorSource<Point>> {
        return new VectorLayer({
            source: new Cluster({
                distance: 50,
                source: new SourceVector({
                    url: this.source_url + '?time=' + new Date().getTime(),
                    format: new GeoJSON()
                }),
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
        const originalFeatures = feature.get('features');
        if (originalFeatures.length > 1){
            const extent = createEmpty();
            originalFeatures.forEach(function(f, index, array){
                extend(extent, f.getGeometry().getExtent());
            });
            const resolution = map.getView().getResolutionForExtent(extent);
            const targetZoom = map.getView().getZoomForResolution(resolution);
            const location = getCenter(extent);
            map.getView().animate({
                center: location,
                zoom: targetZoom,
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
    getFeatureProperties(feature: Feature<Point>): {[key: string]: any} {
        return feature.get('features')[0].getProperties();
    }
}

export default GeoJSONFeaturesLayer;
