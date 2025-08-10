<script lang='ts'>
    import {appState} from '../AppState.svelte';
</script>

<button onclick={appState.setVisibleView([0, 0], 0)}>
    <img src='assets/icons/reset-icon.svg' alt='reset icon'/>
</button>

<style>
    button  {
        position: absolute;
        z-index: 10;
        left: 0.6em;
        top: 22.5em;
        background-color: #1A73E8;
        border-radius: 5px;
        opacity: 0.8;
        width: 28px;
        height: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
    }

    button:hover {
        opacity: 0.7;
    }

    img {
        width: 16px;
        height: 16px;
        border-radius: 5px;
        margin-top: 2px;
    }
</style>
