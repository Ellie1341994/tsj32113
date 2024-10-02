<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	let canvas: HTMLCanvasElement;
	onMount(() => {
		const sizes = {
			width: window.innerWidth * 0.75,
			height: window.innerHeight * 0.75
		};

		// Resizing feature
		const setCanvasSize = () => {
			console.log('Window size has changed.');
			// Scene size update
			(sizes.width = window.innerWidth * 0.75), (sizes.height = window.innerHeight * 0.75);
			// Camera AR update
			camera.aspect = sizes.width / sizes.height;
			camera.updateProjectionMatrix();

			// Renderer
			renderer.setSize(sizes.width, sizes.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
		};
		window.addEventListener('resize', setCanvasSize);

		// Full screen support feature
		// Note: Safari may not have current support for this native js features and may need custom code to handle fullscreen support
		const fullscreenOnOff = () => {
			// console.log('Double clicked!');
			if (document.fullscreenElement) {
				document.exitFullscreen();
			} else {
				canvas.requestFullscreen();
			}
			// HTML_CANVAS.requestFullscreen();
			// console.log('Full Screen Mode on!');
			// if(document.fullscreenElement) {
			// console.log('Full Screen Mode off!');
			// document.exitFullscreen();
			// }
		};
		window.addEventListener('dblclick', fullscreenOnOff);

		// Scene
		const scene = new THREE.Scene();

		// Objects
		// Group
		const group = new THREE.Group();
		group.scale.set(1, 1, 1);
		group.position.z = -2;
		group.rotation.y = 0;
		// Cubes
		// CUBE3 written with previous code
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0xaf3306 });

		// Mesh
		const mesh = new THREE.Mesh(geometry, material);
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
		const ASPECT_RATIO = sizes.width / sizes.height;
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
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
		renderer.setSize(sizes.width, sizes.height);

		// OrbitControl
		const control = new OrbitControls(camera, canvas);
		// control.enabled = false;
		control.enableDamping = true;
		// control.target.y = -1;

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
		let tickId = 0;
		const tick = () => {
			group.rotation.x += 0.01;
			control.update();
			renderer.render(scene, camera);
			tickId = window.requestAnimationFrame(tick);
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
			control.dispose();
			console.log('disposed first project allocated resources', renderer.info);
			console.log('tickId', tickId);
			window.cancelAnimationFrame(tickId);
			renderer.clear();
			renderer.dispose();
			window.removeEventListener('resize', setCanvasSize);
			window.removeEventListener('dbclick', fullscreenOnOff);
			console.log('Renderer cleared and diposed');
		}
		return disposeScene;
	});
</script>

<canvas class="webgl" bind:this={canvas}></canvas>
