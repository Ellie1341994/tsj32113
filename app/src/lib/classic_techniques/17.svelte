<script lang="ts">
	import gsap from 'gsap';
	// import { page } from `$app/stores`;
	// BIG NOTE: REMAINING MEMORY ALLOCATED SEEMS TO BE INTERNAT TO THREE.JS
	// import gsap from `gsap`;
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { Sky } from 'three/addons/objects/Sky.js';
	import { Timer } from 'three/addons/misc/Timer.js';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
</script>

<canvas class="webgl" bind:this={canvas}></canvas>
<span class="lil-gui-placer" bind:this={lilGuiPlacer}></span>

<style>
	span.lil-gui-placer {
		position: absolute;
		top: 20vh;
		right: 13.5vw;
	}
</style>
