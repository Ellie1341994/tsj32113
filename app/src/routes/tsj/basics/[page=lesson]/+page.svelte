<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	let canvas: HTMLCanvasElement;
	let lesson = $page.params.page;
	let lessonLogic: any = null;
	onMount(async () => {
		lessonLogic = (await import(`../../../../lib/basics/${lesson}`)).default;
		console.log(lessonLogic);
		if (typeof lessonLogic === 'function') {
			lessonLogic({ THREE, canvas });
		}
	});
</script>

{#if typeof lessonLogic === 'string'}
	{@html lessonLogic}
{:else}
	<canvas class="webgl" bind:this={canvas}></canvas>
{/if}
