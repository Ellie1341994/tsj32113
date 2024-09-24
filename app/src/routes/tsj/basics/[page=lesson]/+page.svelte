<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import gsap from 'gsap';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
	import GUI from 'lil-gui';
	import { lessonTitles } from '$lib/lessonTitles';

	let canvas: HTMLCanvasElement;
	let lesson = parseInt($page.params.page);
	let lessonCode: any = null;

	onMount(async () => {
		lessonCode = (await import(`../../../../lib/basics/${lesson}.ts`)).default;
		if (typeof lessonCode === 'function') {
			lessonCode({ THREE, gsap, OrbitControls, GUI, RGBELoader, canvas });
		}
	});
</script>

{#if typeof lessonCode === 'string'}
	{@html lessonCode}
{:else}
	<!-- <h2>{lessonTitles[lesson]}</h2> -->
	<canvas class="webgl" bind:this={canvas}></canvas>
{/if}
