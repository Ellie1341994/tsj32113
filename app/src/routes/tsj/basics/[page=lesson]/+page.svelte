<script lang="ts">
	import { page } from '$app/stores';
	import { lessonThree } from '$lib/basics/3';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	let canvas: any = null;
	let lesson = $page.params.page;
	console.log($page.params);
	!/^[1-2]$/.test(lesson) &&
		onMount(() => {
			lessonThree({ THREE, canvas });
		});
</script>

{#if /^1$/.test(lesson)}
	<div class="text-column">
		<h1>Just the course introduction</h1>
		<p>Getting ready for 3D on the Web.</p>
	</div>
{:else if /^2$/.test(lesson)}
	<div class="text-column">
		<h1>WebGL & ThreeJS</h1>
		<p>ThreeJS is a library that uses WebGL that allows for faster 3D development on the web!</p>
	</div>
{:else}
	<canvas class="webgl" bind:this={canvas}></canvas>
{/if}
