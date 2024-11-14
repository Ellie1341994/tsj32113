<script lang="ts">
	import Experience from './26/Experience.ts';
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	onMount(() => {
		new Experience(canvas);
	});
</script>

<canvas class="webgl" bind:this={canvas}></canvas>
<span class="lil-gui-placer" bind:this={lilGuiPlacer}></span>

<style lang="scss">
	span.lil-gui-placer {
		position: absolute;
		top: 16vh;

		right: calc(12.5vw + 1vh);
	}
	@media (max-width: 666px) {
		span.lil-gui-placer {
			position: absolute;
			top: 19vh;
			left: calc(12vw + 1.5vh);
			width: 10vw;
		}
	}
</style>
