<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	let { canvas = $bindable() } = $props();
	onMount(() => {
		// Utils
		const sizes = {
			get width() {
				return innerWidth * 0.75;
			},
			get height() {
				return innerHeight * 0.75;
			}
		};
		const setCanvasSize = () => {
			// Update camera
			camera.aspect = sizes.width / sizes.height;
			camera.updateProjectionMatrix();

			// Update renderer
			renderer.setSize(sizes.width, sizes.height);
			renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
			renderer.render(scene, camera);
		};
		addEventListener(`resize`, setCanvasSize);
		const scene = new THREE.Scene();
		// Objects
		// const sphereGeometry = new THREE.SphereGeometry(1.5,32,32);
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
		// Mesh
		const mesh = new THREE.Mesh(geometry, material);
		// Aggregate
		scene.add(mesh);
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

<canvas class="webgl" bind:this={canvas}></canvas>
