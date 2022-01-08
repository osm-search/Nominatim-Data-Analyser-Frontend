<script lang='ts'>
    import {onMount} from 'svelte';
    import 'ol/ol.css';
    import {Overlay, View} from "ol";
    import Map from 'ol/Map';
    import TileLayer from 'ol/layer/Tile';
    import {OSM} from 'ol/source';
    import {defaults as defaultControls} from 'ol/control';
    import {useGeographic} from 'ol/proj';
    import {map} from '../store/mapStore';

    let mapHTMLDiv;
    let overlay;
    let overlayHTMLDiv;

    onMount(() => {
        //Calling the useGeographic function in the 'ol/proj' module makes it so
        //the map view uses geographic coordinates (even if the view projection is not geographic).
        useGeographic();

        overlay = new Overlay({
            element: overlayHTMLDiv,
            autoPan: true,
            autoPanAnimation: {
                duration: 250,
            },
        });

        map.set(new Map({
            layers: [
                new TileLayer({
                    source: new OSM(),
                })
            ],
            controls: defaultControls({
                zoom: false,
                attribution: true,
                rotate: false
            }),
            overlays: [overlay],
            target: mapHTMLDiv,
            view: new View({
                center: [0, 0],
                zoom: 0
            })
        }));
    });
</script>

<section class='map-container'>
    <div bind:this={mapHTMLDiv} id='map'></div>
    <div bind:this={overlayHTMLDiv} class='ol-popup'>
        <div class='popup-header'>
            <p>Properties</p>
            <div class='flex-one'></div>
            <img src='assets/icons/cross-icon.svg' alt='close icon popup' class='ol-popup-close-icon'/>
        </div>
<!--        <div ref={popupContent} class='ol-popup-content'></div>-->
    </div>
</section>

<style>
    .map-container {
        flex: 1;
        height: 100%;
    }

    #map {
        flex: 1;
        height: 100%;
    }

    .ol-popup {
        position: absolute;
        width: 220px;
        background-color: white;
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        padding: 10px 15px 15px 15px;
        border-radius: 10px;
        border: 1px solid #cccccc;
        bottom: 12px;
        left: -50px;
    }

    .popup-header {
        display: flex;
        margin-bottom: 10px;
    }

    .popup-header p {
        margin: 0;
        font-weight: bold;
    }

    .ol-popup-close-icon {
        width: 15px;
        cursor: pointer;
    }

    .ol-popup-content p {
        margin: 0;
        max-width: 800px;
        white-space: pre-wrap;
        margin-top: 0.5em;
        font-size: 0.9em;
    }

    .ol-popup:after, .ol-popup:before {
        top: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }

    .ol-popup:after {
        border-top-color: white;
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
    }

    .ol-popup:before {
        border-top-color: #cccccc;
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
    }
</style>