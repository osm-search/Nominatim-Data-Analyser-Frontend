<script lang='ts'>
	import Map from './components/Map.svelte';
    import MainMenu from './components/MainMenu.svelte';
</script>

<div class='app'>
    <MainMenu/>
    <Map/>
</div>

<style>
    .app {
        height: 100%;
        display: flex;
    }
</style>