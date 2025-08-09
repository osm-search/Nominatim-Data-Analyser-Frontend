<script>
    import LocalStorageKeys from '../local-storage/localStorageKeys';
    import {onMount} from 'svelte';

    let isShown = false;

    onMount(() => {
        if (localStorage.getItem(LocalStorageKeys.IS_INFO_PANEL_HIDDEN) === 'false') {
            isShown = true;
        }
    })

    function close() {
        isShown = false;
        localStorage.setItem(LocalStorageKeys.IS_INFO_PANEL_HIDDEN, 'true');
    }

    function open() {
        isShown = true;
        localStorage.setItem(LocalStorageKeys.IS_INFO_PANEL_HIDDEN, 'false');
    }
</script>

{#if isShown}
    <section class='information-panel'>
            <div class='information-panel-title-wrapper'>
                <h2>Welcome to the <span class='blue-text'>Nominatim QA</span> Tool!</h2>
                <div class='flex-one'></div>
                <button class='information-panel-close-button' on:click={close}>
                    <img src='assets/icons/cross-icon.svg' alt='close icon' class='information-panel-close-icon'/>
                </button>
            </div>
            <p>
                This tool helps to improve the OpenStreetMap data quality by extracting suspect data from the <a href='https://nominatim.org/' target='_blank' rel="noreferrer">Nominatim</a> database. You can contribute to the development of this tool through the <a href='https://github.com/osm-search/Nominatim-Data-Analyser' target='_blank' rel="noreferrer">github repository</a>.
            </p>
            <p>
                The suspect data is distributed over multiple layers. You can find these layers in the menu on the left of your screen. Feel free to check the data and to correct it if you live nearby!
            </p>
            <p>
                We do not have a "report false positive" feature implemented yet. If you find a lot of data which should not be considered as errors, please come to the "Issues" section of the <a href='https://github.com/osm-search/Nominatim-Data-Analyser/issues' target='_blank' rel="noreferrer">github repository</a> to discuss this.
            </p>
    </section>
{:else}
    <button class='open-info-panel-button' on:click={open}>
        ?
    </button>
{/if}

<style>
    .information-panel {
        position: absolute;
        z-index: 2;
        right: 2%;
        top: 4%;
        max-width: 350px;
        height: 70px;
        padding: 1em 0.1em 1.5em 1.5em;
        display: none;
        flex-direction: column;
        background-color: white;
        overflow: hidden;
        border-radius: 10px;
    }

    .information-panel div, .information-panel p {
        margin-right: 1.5em;
    }

    .information-panel p:last-child {
        margin-bottom: 0;
    }

    .blue-text {
        color: #1A73E8;
    }

    .information-panel-title-wrapper {
        display: flex;
        align-items: flex-start;
    }

    .information-panel-close-button {
        margin-top: 6px;
        cursor: pointer;
        background: none;
        outline: none;
        border: none;
    }

    .information-panel-close-icon {
        width: 18px;
    }

    .open-info-panel-button {
        position: absolute;
        top: 0;
        right: 0;
        background-color: #1A73E8;
        color: white;
        font-size: 1.1em;
        font-weight: bold;
        padding: 0.3em 0.45em 0.3em 0.6em;
        border-radius: 0 0 0 5px;
        opacity: 0.7;
    }

    @media screen and (min-width: 800px) {
        .information-panel {
            display: flex;
        }
    }

    @media screen and (min-height: 210px) {
        .information-panel {
            height: 130px;
        }
    }

    @media screen and (min-height: 330px) {
        .information-panel {
            height: 250px;
        }
    }

    @media screen and (min-height: 480px) {
        .information-panel {
            height: 400px;
        }
    }

    @media screen and (min-height: 620px) {
        .information-panel {
            height: 520px;
        }
    }
</style>
