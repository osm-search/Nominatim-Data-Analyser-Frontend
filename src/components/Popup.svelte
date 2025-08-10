<script lang='ts'>
    import {appState} from '../AppState.svelte';
    import {Overlay} from 'ol';
    import {onMount} from 'svelte';

    let { visible = $bindable() } : { visible: boolean } = $props();

    let popupHTMLDiv: HTMLDivElement;
    let overlay: Overlay | undefined;

    /**
     * Filter containing all the keys which should be ignored when
     * the properties of a feature are rendered.
     */
    const FILTERED_PROPERTY_KEYS = [
        'geometry',
        'layer'
    ];
    const OSM_TYPE = {n: 'node', w: 'way', r: 'relation'};
    const OSM_TYPE_LABEL = {n: 'Node ID', w: 'Way ID', r: 'Relation ID'};

    onMount(() => {
        overlay = new Overlay({
            element: popupHTMLDiv,
            autoPan: true,
            autoPanAnimation: {
                duration: 250,
            },
        });
        appState.map.addOverlay(overlay);
    })

    let props: object[] = $derived.by(() => {
        const value = appState.selectedFeature;
        if (value) {
            let newprops = [];

            for (let k in value.properties) {
                if (value.properties.hasOwnProperty(k) && !FILTERED_PROPERTY_KEYS.includes(k)) {
                    let v = value.properties[k].toString();
                    if ((k === 'node_id' || k === 'way_id' || k === 'relation_id' || k.match('^[nwr]\/@id'))
                        && v.match(/^[0-9]+$/)) {
                        newprops.push({kind: 'ID', osm_type: k.charAt(0), osm_id: v,
                                       coords: value.coordinates,
                                       bbox: [
                        (value.coordinates[0] - 0.001), // left
                        (value.coordinates[1] + 0.001), // top
                        (value.coordinates[0] + 0.001), // right
                        (value.coordinates[1] - 0.001)  // bottom
                    ]});
                    } else {
                        if (k === 'timestamp') {
                            k = 'Timestamp';
                            v = v.replace(/^([0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9])T([0-9][0-9]:[0-9][0-9]:[0-9][0-9])Z$/, "$1 $2");
                        }
                        newprops.push({kind: 'prop', k: k, v: v});
                    }
                }
            }
            return newprops;
        }

        return [];
    });

    $effect(() => {
        if (appState.selectedFeature) {
            overlay?.setPosition(appState.selectedFeature.coordinates);
            visible = true;
        }
    });

    $effect(() => {
        if (!visible) {
            overlay?.setPosition(undefined);
        }
    });
</script>

<div bind:this={popupHTMLDiv} class='ol-popup'>
    <div class='popup-header'>
        <p>Properties</p>
        <div class='flex-one'></div>
        <button title="Close" onclick={() => {visible = false}}><img
            src='assets/icons/cross-icon.svg'
            alt='close icon popup'
            class='ol-popup-close-icon'
        /></button>
    </div>
    <div class='ol-popup-content'>
      {#each props as prop}
        {#if prop.kind === 'ID'}
        <p><span class='bold'>{OSM_TYPE_LABEL[prop.osm_type]}</span>: <a target="_blank" href="https://www.openstreetmap.org/{OSM_TYPE[prop.osm_type]}/{prop.osm_id}">{prop.osm_id}</a> <a href="https://www.openstreetmap.org/edit?editor=id&lon={prop.coords[0]}&lat={prop.coords[1]}&zoom=18&{OSM_TYPE[prop.osm_type]}={prop.osm_id}" target="_blank" title="Edit in ID editor"><img src="assets/icons/to_id.png" alt="Open ID" /></a> <a href="http://localhost:8111/load_and_zoom?bottom={prop.bbox[3]}&{'top'}={prop.bbox[1]}&left={prop.bbox[0]}&right={prop.bbox[2]}&select={OSM_TYPE[prop.osm_type]}{prop.osm_id}&zoom_mode=download" target="hiddenIframe" title="Edit in JOSM (JOSM must be running and JOSM remote control plugin must be enabled for this to work)"><img src="assets/icons/to_josm.png" alt="Open JOSM" /></a>
        </p>
        {:else}
        <p><span class='bold'>{prop.k}</span>: {prop.v}</p>
        {/if}
      {/each}
    </div>
</div>

<style>
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

    :global(.ol-popup-content p) {
        max-width: 800px;
        white-space: pre-wrap;
        margin: 0.5em 0 0;
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
