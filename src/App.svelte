<script lang='ts'>
	import Map from './components/Map.svelte';
    import MainMenu from './components/MainMenu.svelte';
    import InformationPanel from './components/InformationPanel.svelte';
</script>

<div class='app'>
    <MainMenu/>
    <Map/>
    <InformationPanel/>
    <iframe id="hiddenIframe" name="hiddenIframe" title="hiddenIframe"></iframe>
</div>

<style>
    .app {
        height: 100%;
        display: flex;
    }
    #hiddenIframe {
        display: none;
    }
</style>