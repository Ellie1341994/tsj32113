<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	let canvas: HTMLCanvasElement;
	onMount(() => {
		// Sizes

		const SIZES = {
			width: 800,
			height: 600
		};

		/*
    Cursor
*/
		const CURSOR = { x: 0, y: 0 };
		const setCursorCoordinates = (event: any) => {
			CURSOR.x = event.clientX / SIZES.width - 0.5;
			CURSOR.y = event.clientY / SIZES.height - 0.5;
			console.log(`x:${CURSOR.x} y:${CURSOR.y}`);
		};
		window.addEventListener('mousemove', setCursorCoordinates);

		// Scene
		const scene = new THREE.Scene();

		// Objects
		// Group
		const group = new THREE.Group();
		group.scale.set(1, 1, 1);
		group.rotation.y = 0;
		// Cubes
		// CUBE3 written with previous code
		const GEOMETRY = new THREE.BoxGeometry(1, 1, 1);
		const MATERIAL = new THREE.MeshBasicMaterial({ color: 0xaf6606 });

		// Mesh
		const mesh = new THREE.Mesh(GEOMETRY, MATERIAL);
		mesh.position.x = 1.45;
		mesh.position.y = 0;
		mesh.position.z = 0;

		// mesh.rotation.x = Math.PI * 0.25;
		// mesh.rotation.y = Math.PI * 0.15;
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

		CUBE3.position.x = -1.45;
		group.add(CUBE3);

		// Aggregate
		// scene.add(AXES_HELPER)
		scene.add(group);

		// Camera
		const ASPECT_RATIO = SIZES.width / SIZES.height;
		const camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO, 1, 100);

		// const camera = new THREE.OrthographicCamera(
		//     -1 * ASPECT_RATIO,
		//     1 * ASPECT_RATIO, 1,
		//     -1,
		//     0.1,
		//     99);
		camera.position.set(0, 0, 3);
		camera.lookAt(group.position);
		// Aggregate +
		scene.add(camera);

		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(SIZES.width, SIZES.height);

		// OrbitControl
		const orbitControl = new OrbitControls(camera, canvas);
		orbitControl.enableDamping = true;
		// CONTROL.target.y = -1;

		// Object rotation using the mouse
		// const tick = () => {

		//     group.rotation.x += 0.01;
		//     camera.position.set(
		//         Math.sin(CURSOR.x * Math.PI * 2) * 3,
		//         CURSOR.y * 4,
		//         Math.cos(CURSOR.x * Math.PI * 2)  * 3
		//     );
		//     camera.lookAt(group.position);
		//     renderer.render(scene, camera);
		//     window.requestAnimationFrame(tick);
		// }

		// tick();
		const tickId: number = 0;
		const tick = () => {
			group.rotation.x += 0.01;
			orbitControl.update();
			renderer.render(scene, camera);
			window.requestAnimationFrame(tick);
		};

		tick();
		function disposeScene() {
			scene.traverse((node: any) => {
				if (node instanceof THREE.Mesh) {
					node.geometry?.dispose();
					node.material?.dispose();
					console.log(`${node.type} disposed`);
				}
			});
			scene.clear();
			scene.removeFromParent();
			orbitControl.dispose();
			console.log('disposed first project allocated resources', renderer.info);
			console.log('tickId', tickId);
			window.cancelAnimationFrame(tickId);
			renderer.clear();
			renderer.dispose();
			window.removeEventListener('mousemove', setCursorCoordinates);
			console.log('Renderer cleared and diposed');
		}
		return disposeScene;
	});
</script>

<canvas class="webgl" bind:this={canvas}></canvas>
