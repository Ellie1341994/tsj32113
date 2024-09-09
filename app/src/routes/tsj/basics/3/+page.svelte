<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	let canvas: any = null;
	onMount(() => {
		// scene
		const scene = new THREE.Scene();

		// Objects

		// const sphereGeometry = new THREE.SphereGeometry(1.5,32,32);

		const GEOMETRY = new THREE.BoxGeometry(1, 1, 1);

		const MATERIAL = new THREE.MeshBasicMaterial({ color: 0xff0000 });

		// Mesh
		const MESH = new THREE.Mesh(GEOMETRY, MATERIAL);

		// Aggregate

		scene.add(MESH);

		// sizes

		const sizes = {
			width: 800,
			height: 600
		};

		// camera

		const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
		camera.position.z = 3;

		// Aggregate +
		scene.add(camera);

		// renderer

		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(sizes.width, sizes.height);

		// Render

		renderer.render(scene, camera);
	});
</script>

<canvas class="webgl" bind:this={canvas}></canvas>
