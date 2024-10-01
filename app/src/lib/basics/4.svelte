<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	let canvas: HTMLCanvasElement;
	onMount(() => {
		// Scene
		const scene = new THREE.Scene();

		// Axis Helper

		const axesHelper = new THREE.AxesHelper(2);

		// Objects
		// Group
		const group = new THREE.Group();
		group.scale.y = 1;
		group.rotation.y = 0;
		// Cubes
		// CUBE3 written with previous code
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0xaf0006 });

		// Mesh
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.x = 1.45;
		mesh.position.y = 0;
		mesh.position.z = 0;

		// Potentially useful prop.
		// mesh.position.normalize();

		mesh.scale.x = 1;
		mesh.scale.y = 1;
		mesh.scale.z = 1;

		// mesh.rotation.x = Math.PI * 0.25;
		mesh.rotation.y = Math.PI * 0.15;
		group.add(mesh);

		const CUBE2 = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({ color: 0x006669 })
		);
		CUBE2.position.x = 0;
		group.add(CUBE2);

		const CUBE3 = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({ color: 0xff0066 })
		);
		CUBE3.rotation.y = -Math.PI * 0.15;
		CUBE3.position.x = -1.45;
		group.add(CUBE3);

		// Aggregate
		scene.add(axesHelper);
		scene.add(group);

		// Sizes

		const sizes = {
			width: 800,
			height: 600
		};

		// Camera

		const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
		camera.position.z = 3;

		// Potentially useful prop.
		// camera.lookAt(mesh.position);

		// Aggregate +
		scene.add(camera);

		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(sizes.width, sizes.height);

		// Render

		renderer.render(scene, camera);
		console.log('renderer info', renderer.info);

		function disposeScene() {
			scene.traverse((node: any) => {
				if (node instanceof THREE.Mesh) {
					node.geometry?.dispose();
					node.material?.dispose();
					console.log(`${node.type} disposed`);
				}
			});
			axesHelper.dispose();
			scene.clear();
			scene.removeFromParent();
			console.log('disposed first project allocated resources', renderer.info);
			renderer.clear();
			renderer.dispose();
			console.log('Renderer cleared and diposed');
		}
		return disposeScene;
	});
</script>

<canvas class="webgl" bind:this={canvas}> </canvas>
