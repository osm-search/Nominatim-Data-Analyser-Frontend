<script lang='ts'>
    import {Overlay} from 'ol';
    import {onMount} from 'svelte';

    let popupHTMLDiv: HTMLDivElement;
    export let popupContent: HTMLDivElement;
    export let overlay: Overlay | undefined;

    onMount(() => {
        overlay = new Overlay({
            element: popupHTMLDiv,
            autoPan: true,
            autoPanAnimation: {
                duration: 250,
            },
        });
    })

    function close() {
        overlay.setPosition(undefined);
    }
</script>

<div bind:this={popupHTMLDiv} class='ol-popup'>
    <div class='popup-header'>
        <p>Properties</p>
        <div class='flex-one'></div>
        <img
            src='assets/icons/cross-icon.svg'
            alt='close icon popup'
            class='ol-popup-close-icon'
            on:click={close}
        />
    </div>
    <div bind:this={popupContent} class='ol-popup-content'></div>
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