<script lang='ts'>
    import ILayer from '../../model/ILayer';
    import {selectedLayer} from '../../store/layerStore';
    import LayerDocumentationEntry from './LayerDocumentationEntry.svelte';

    export let layer: ILayer;
    let isOpen = false;

    selectedLayer.subscribe((selectedLayer) => {
        isOpen = selectedLayer === layer;
    })

    function setSelectedLayer() {
        selectedLayer.update((selectedLayer) => {
            return selectedLayer === layer ? null : layer;
        })
    }
</script>

<div class={`layer-wrapper ${isOpen ? 'layer-toggle' : ''}`}>
    <div class='layer-title-arrow-wrapper' on:click={setSelectedLayer}>
        <h3>{layer.name}</h3>
        <div class="flex-one"></div>
        <img
            class='layer-arrow-icon'
            alt='layer arrow icon'
            src={isOpen ? 'assets/icons/arrow-down-icon.svg' : 'assets/icons/arrow-right-icon.svg'}
        />
    </div>
    <div class={`layer-data-wrapper ${isOpen ? 'layer-data-toggle' : ''}`}>
        <LayerDocumentationEntry layer={layer} docEntry='description'/>
        <LayerDocumentationEntry layer={layer} docEntry='why_problem'/>
        <LayerDocumentationEntry layer={layer} docEntry='how_to_fix'/>
    </div>
</div>

<style>
    .layer-wrapper:not(:first-child) {
        border-top: solid 1px #e8e8e8;;
    }

    .layer-wrapper {
        padding: 1em;
        color: #383838;
    }

    .layer-wrapper {
        transition: max-height 0.15s ease-out;
    }

    .layer-wrapper:hover {
        background-color: #f5f5f5;
    }

    .layer-wrapper.layer-toggle {
        background-color: #f5f5f5;
    }

    .layer-title-arrow-wrapper {
        display: flex;
        cursor: pointer;
        align-items: center;
    }

    .layer-wrapper h3 {
        font-size: 0.95em;
        word-wrap: break-word;
        overflow: hidden;
    }

    .layer-data-wrapper {
        font-family: 'Roboto-Regular';
        max-height: 0;
        transition: max-height 0.5s ease-out;
        overflow: hidden;
    }

    .layer-data-wrapper.layer-data-toggle {
        max-height: 500px;
        transition: max-height 0.5s ease-in;
    }

    .layer-arrow-icon {
        width: 1.2em;
        margin-left: 1em;
    }
</style>