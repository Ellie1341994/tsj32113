<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	let canvas: HTMLCanvasElement;
	let lesson = $page.params.page;
	let lessonCode: any = null;
	onMount(async () => {
		lessonCode = (await import(`../../../../lib/basics/${lesson}`)).default;
		if (typeof lessonCode === 'function') {
			lessonCode({ THREE, canvas });
		}
	});
</script>

{#if typeof lessonCode === 'string'}
	{@html lessonCode}
{:else}
	<canvas class="webgl" bind:this={canvas}></canvas>
{/if}
