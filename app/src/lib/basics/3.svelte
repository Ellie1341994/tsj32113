<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	let canvas: HTMLCanvasElement;

	onMount(() => {
		const SCENE = new THREE.Scene();
		// Objects
		// const sphereGeometry = new THREE.SphereGeometry(1.5,32,32);
		const GEOMETRY = new THREE.BoxGeometry(1, 1, 1);
		const MATERIAL = new THREE.MeshBasicMaterial({ color: 0xff0000 });
		// Mesh
		const MESH = new THREE.Mesh(GEOMETRY, MATERIAL);
		// Aggregate
		SCENE.add(MESH);
		// Sizes
		const SIZES = {
			width: 800,
			height: 600
		};
		// Camera
		const CAMERA = new THREE.PerspectiveCamera(75, SIZES.width / SIZES.height);
		CAMERA.position.z = 3;
		// Aggregate +
		SCENE.add(CAMERA);
		// Renderer
		const RENDERER = new THREE.WebGLRenderer({ canvas });
		RENDERER.setSize(SIZES.width, SIZES.height);
		// Render
		RENDERER.render(SCENE, CAMERA);
		console.log('renderer info2', RENDERER.info);
		return () => {
			SCENE.traverse((node) => {
				if (node instanceof THREE.Mesh) {
					node.geometry?.dispose();
					node.material?.dispose();
					console.log(`${node.type} disposed`);
				}
			});
			SCENE.clear();
			SCENE.removeFromParent();
			console.log('disposed first project allocated resources', RENDERER.info);
			RENDERER.clear();
			RENDERER.dispose();
			console.log('Renderer cleared and diposed');
		};
	});
</script>

<canvas class="webgl" bind:this={canvas} />
