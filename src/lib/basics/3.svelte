<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	let canvas: HTMLCanvasElement;
	onMount(() => {
		const scene = new THREE.Scene();
		// Objects
		// const sphereGeometry = new THREE.SphereGeometry(1.5,32,32);
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
		// Mesh
		const mesh = new THREE.Mesh(geometry, material);
		// Aggregate
		scene.add(mesh);
		// Sizes
		const sizes = {
			width: 800,
			height: 600
		};
		// Camera
		const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
		camera.position.z = 3;
		// Aggregate +
		scene.add(camera);
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(sizes.width, sizes.height);
		// Render
		renderer.render(scene, camera);
		console.log('renderer info2', renderer.info);
		return () => {
			scene.traverse((node) => {
				if (node instanceof THREE.Mesh) {
					node.geometry?.dispose();
					node.material?.dispose();
					console.log(`${node.type} disposed`);
				}
			});
			scene.clear();
			scene.removeFromParent();
			console.log('disposed first project allocated resources', renderer.info);
			renderer.clear();
			renderer.dispose();
			console.log('Renderer cleared and diposed');
		};
	});
</script>

<canvas class="webgl" bind:this={canvas} />
