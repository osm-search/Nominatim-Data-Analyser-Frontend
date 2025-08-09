import { Style, Circle, Stroke, Fill, Text, Icon } from "ol/style";
import {Feature} from 'ol';
import type {FeatureLike} from 'ol/Feature';
import {Point} from 'ol/geom';
import BaseLayer from 'ol/layer/Base';

/**
 * Class handling the logic of a clustered features layer.
 */
abstract class ClusteredFeaturesLayer {
    private readonly mediumSize: any;
    private readonly bigSize: any;
    private readonly getFeatureSize: any;
    private readonly textFill: Fill;
    private readonly greenFill: Fill;
    private readonly orangeFill: Fill;
    private readonly redFill: Fill;
    private readonly singlePointStyle: Style;
    private readonly styleCache: {[index: number]: Style};

    protected constructor(mediumSize: any, bigSize: any, getFeatureSize: any) {
        this.mediumSize = mediumSize;
        this.bigSize = bigSize;
        this.getFeatureSize = getFeatureSize;
        this.textFill = new Fill({color: '#fff'});
        this.greenFill = new Fill({color:"rgba(0,128,0,1)"});
        this.orangeFill = new Fill({color:"rgba(255,128,0,1)"});
        this.redFill = new Fill({color:"rgba(192,0,0,1)"});
        this.singlePointStyle = new Style({
            image: new Circle({
                radius: 8,
                fill: new Fill({color:"rgba(66, 117, 245,0.8)"})
            })
        });
        this.styleCache = {};
    }

    /**
     * Returns a Fill object different based on the size given in parameter. This function is needed
     * to not recreate a Fill object whenever we render a feature.
     * @param {number} size Size of the feature.
     * @returns {Fill} OpenLayers Fill object corresponding to the size. 
     */
    getFillBySize(size: number) {
        return size > this.bigSize ? this.redFill : size > this.mediumSize ? this.orangeFill : this.greenFill;
    }

    /**
     * Generate the OpenLayers Style for the given feature. The style is dynamically
     * generated based on the clustered feature size and other parameters.
     * @returns {Style} OpenLayers style of the feature.
     */
    getStyle(feature: FeatureLike){
        const size = this.getFeatureSize(feature);
        let style = this.styleCache[size];

        if (!style) {
            if (size === 1) {
                style = this.styleCache[size] = this.singlePointStyle;
            }else {
                const color = size>this.bigSize ? '192,0,0' : size>this.mediumSize ? '255,128,0' : '0,128,0';
                const radius = Math.max(8, Math.min(size * 0.15, 20));
                const dashPos = 2*Math.PI*radius/6;
                const dashes = [ 0, dashPos, dashPos, dashPos, dashPos, dashPos, dashPos ];

                style = this.styleCache[size] = new Style({
                    image: new Circle({
                        radius: radius,
                        stroke: new Stroke({
                        color: "rgba("+color+",0.5)", 
                        width: 15 ,
                        lineDash: dashes,
                        lineCap: "butt"
                        }),
                        fill: this.getFillBySize(size)
                    }),
                    text: new Text({
                        text: size.toString(),
                        fill: this.textFill
                    })
                });
            }
        }
        return style;
    }


    /**
     * Called when a feature of this layer has been clicked.
     * This method should be overriden by the child classes.
     */
    abstract onFeatureClick(feature: any, coordinates: any, map: any, overlay: any): void;

    abstract get olLayer(): BaseLayer;
}

export default ClusteredFeaturesLayer;
