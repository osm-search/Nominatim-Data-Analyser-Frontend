<script lang='ts'>
    import Markdown from 'svelte-exmarkdown'
    /*
    * Map the keys of the layer documentation to a more
    * elaborate value.
    */
    import ILayer from '../../model/ILayer';

    const DOC_TITLE_MAPPING = {
        'description': 'Description of the layer',
        'why_problem': 'Why are these data wrong',
        'how_to_fix': 'How to fix these errors',
        'last_update': 'Last update of the layer'
    };

    export let layer: ILayer;
    export let docEntry: string;
    const docTitle = docEntry in DOC_TITLE_MAPPING ? DOC_TITLE_MAPPING[docEntry] : docEntry;
</script>

{#if layer.doc && docEntry in layer.doc}
    <div>
        <p class='doc-title'>{docTitle}:</p>
        <div class='doc-content'>
            <Markdown md={layer['doc'][docEntry]}/>
        </div>
    </div>
{/if}

<style>
    .doc-title, .doc-content {
        font-size: 0.95em;
    }

    .doc-title {
        color: #1A73E8;
    }
</style>
