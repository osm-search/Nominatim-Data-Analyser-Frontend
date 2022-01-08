<script lang='ts'>
    import {map} from '../store/mapStore';
    import {onDestroy, onMount} from 'svelte';
    import LayersList from './LayersList.svelte';
    import {Svroller} from 'svrollbar';

    let isMenuOpen = true;
    let menuHTMLSection: HTMLElement;

    function updateMapWidth() {
        map.update((map) => {
            map.updateSize();
            return map;
        });
    }

    function open() {
        isMenuOpen = true;
    }

    function close() {
        isMenuOpen = false;
    }

    onMount(() => {
        menuHTMLSection.addEventListener('transitionend', updateMapWidth);
    });

    onDestroy(() => {
        menuHTMLSection.removeEventListener('transitionend', updateMapWidth);
    });
</script>

<div>
    {#if !isMenuOpen}
        <div class='absolute-menu-icon-wrapper'>
            <img
                src='assets/icons/menu-icon.svg'
                alt='menu icon' class='menu-icon absolute-menu-icon'
                on:click={open}
            />
        </div>
    {/if}

    <section bind:this={menuHTMLSection} class={`main-menu-wrapper ${!isMenuOpen ? 'not-toggle' : ''}`}>
        <div class='menu-title-wrapper'>
            <h1>Nominatim QA</h1>
            <div class='flex-one'></div>
            <img src='assets/icons/left-arrow-icon.svg' alt='menu icon' class='menu-icon' on:click={close}/>
        </div>
        <p class='layers-label'>Layers:</p>
        <Svroller width='100%' height='100%'>
            <LayersList/>
        </Svroller>
        <!--    <Scrollbars autoHeight autoHeightMax={'100%'}>-->
        <!--        <LayersList selectedLayer={selectedLayer} setSelectedLayer={setSelectedLayer}/>-->
        <!--    </Scrollbars>-->
        <div class='github-wrapper'>
            <img src='assets/icons/github-icon.svg' alt='github icon'/>
            <a href='https://github.com/osm-search/Nominatim-Data-Analyser' target='_blank' rel="noreferrer">
                osm-search/Nominatim-Data-Analyser
            </a>
        </div>
    </section>
</div>

<style>
    .main-menu-wrapper {
        width: 400px;
        height: 100%;
        z-index: 2;
        position: relative;
        background-color: white;
        box-shadow: 2px 2px 10px #a3a3a3;
        opacity: 0.98;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: width 0.5s ease-out;
    }

    .main-menu-wrapper.not-toggle {
        opacity: 1;
        white-space: nowrap;
        width: 0;
        transition: width 0.5s ease-in;
    }

    .menu-title-wrapper {
        display: flex;
        align-items: center;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        padding-right: 1em;
        padding-left: 16px;
    }

    .menu-title-wrapper h1 {
        align-self: center;
        color: #1A73E8;
    }

    .menu-icon {
        width: 30px;
        cursor: pointer;
    }

    .absolute-menu-icon-wrapper {
        position: absolute;
        z-index: 1;
        top: 1.5em;
        left: 0;
        background-color: white;
        padding: 0.4em 0.8em 0.2em 0.8em;
        border-radius: 0 10px 10px 0;
    }

    .absolute-menu-icon {
        width: 30px;
        height: 30px;
    }

    .layers-label {
        padding-left: 16px;
        color: black;
        font-weight: bold;
        font-size: 1.2em;
        margin-bottom: 1em;
    }

    .github-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 1.3em;
        margin-top: 1.3em;
    }

    .github-wrapper img {
        width: 25px;
        margin-right: 0.5em;
    }

    .github-wrapper a {
        font-size: 0.8em;
        font-family: 'Roboto-Regular';
    }
</style>