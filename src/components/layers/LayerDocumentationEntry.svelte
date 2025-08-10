<script lang='ts'>
    import Markdown from 'svelte-exmarkdown'
    import type ILayer from '../../model/ILayer';

    /*
    * Map the keys of the layer documentation to a more
    * elaborate value.
    */
    const DOC_TITLE_MAPPING = {
        'description': 'Description of the layer',
        'why_problem': 'Why are these data wrong',
        'how_to_fix': 'How to fix these errors',
        'last_update': 'Last update of the layer'
    };

    let {layer, docEntry} : {
        layer: ILayer;
        docEntry: string;
    } = $props();
</script>

{#if layer?.doc[docEntry]}
    <div>
        <p class='doc-title'>{DOC_TITLE_MAPPING[docEntry] || docEntry}:</p>
        <div class='doc-content'>
            <Markdown md={layer.doc[docEntry]}/>
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
