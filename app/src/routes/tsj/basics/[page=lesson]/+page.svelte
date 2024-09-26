<script lang="ts">
	import { page } from '$app/stores';
	import { getContext, onMount, SvelteComponent } from 'svelte';
	import * as THREE from 'three';
	import gsap from 'gsap';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
	import GUI from 'lil-gui';
	import { lessonTitles } from '$lib/lessonTitles';
	// console.log($page.data);

	let lesson = parseInt($page.params.page);
	let canvas: HTMLCanvasElement;
</script>

{#await import(`../../../../lib/basics/${lesson}.svelte`)}
	"Loading lesson " {lesson}
{:then Scene}
	<svelte:component this={Scene.default} />
{/await}
