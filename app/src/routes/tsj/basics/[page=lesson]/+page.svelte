<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import gsap from 'gsap';

	let canvas: HTMLCanvasElement;
	let lesson = $page.params.page;
	let lessonCode: any = null;
	onMount(async () => {
		lessonCode = (await import(`../../../../lib/basics/${lesson}.ts`)).default;
		if (typeof lessonCode === 'function') {
			lessonCode({ THREE, gsap, canvas });
		}
	});
</script>

{#if typeof lessonCode === 'string'}
	{@html lessonCode}
{:else}
	<canvas class="webgl" bind:this={canvas}></canvas>
{/if}
