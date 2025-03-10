<script lang="ts">
	import gsap from 'gsap';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	let canvas: HTMLCanvasElement;
	onMount(() => {
		// Sizes

		const sizes = {
			width: innerWidth * 0.75,
			height: innerHeight * 0.75
		};

		// Resizing feature
		const setCanvasSize = () => {
			// Update camera
			camera.aspect = sizes.width / sizes.height;
			camera.updateProjectionMatrix();

			// Update renderer
			if (document.fullscreenElement) {
				renderer.setSize(innerWidth, innerHeight);
				canvas.setAttribute('style', 'border: none;');
			} else {
				canvas.setAttribute('style', 'border: 1vh solid var(--color-theme-4);');
				renderer.setSize(sizes.width, sizes.height);
			}
			renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
		};
		addEventListener('resize', setCanvasSize);

		// Full screen support feature
		// Note: Safari may not have current support for this native js features and may need custom code to handle fullscreen support
		const toggleFullscreen = () => {
			document.fullscreenElement ? document.exitFullscreen() : canvas?.requestFullscreen();
		};
		addEventListener('dblclick', toggleFullscreen);

		// Scene
		const scene = new THREE.Scene();
		// const ah = new THREE.AxesHelper(50);
		// scene.add(ah);
		// Objects
		// Group
		const group = new THREE.Group();
		group.scale.set(1, 1, 1);
		group.position.z = -2;
		group.rotation.y = 0;
		// Cube
		const CUBE1 = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({ color: 0xff0066, wireframe: true })
		);
		group.add(CUBE1);

		// Triangle
		// const POSITIONS_ARRAY = new Float32Array([
		//     0,0,0,
		//     0,1,0,
		//     1,0,0
		// ]);

		// const POSITIONS_ATTRIBUTE = new THREE.BufferAttribute(POSITIONS_ARRAY,3);

		// // POSITIONS_ARRAY.fill(0); IF GIVEN NUMBER LENGTH TO FLOAT32ARRAY
		// // POSITIONS_ARRAY[4] = 1;
		// // POSITIONS_ARRAY[6] = 1;

		// const geometry = new THREE.BufferGeometry();
		// geometry.setAttribute("position", POSITIONS_ATTRIBUTE);

		// const material = new THREE.MeshBasicMaterial({color: 0xff6666, wireframe: true})

		// const TRIANGLE = new THREE.Mesh(geometry, material);
		// TRIANGLE.position.y = 2;
		// group.add(TRIANGLE);

		// Triangles
		const TRIANGLES_NUMBER = 9;
		const VERTEX_NUMBER = 3;
		const VERTEX_POSITIONS = 3;
		const TRIANGLES_POSITIONS_NUMBER = TRIANGLES_NUMBER * VERTEX_NUMBER * VERTEX_POSITIONS;
		const TRIANGLES_POSITIONS_ARRAY = new Float32Array(TRIANGLES_POSITIONS_NUMBER);
		TRIANGLES_POSITIONS_ARRAY.fill(0);
		for (
			let index = 4, step = 0, i = 0;
			index < TRIANGLES_POSITIONS_NUMBER - 1;
			index += step, i++
		) {
			TRIANGLES_POSITIONS_ARRAY[index] = Math.random() * 4 + i;
			step = step === 2 ? 7 : 2;
		}
		// console.log(TRIANGLES_POSITIONS_ARRAY);
		const TRIANGLES_POSITIONS_ATTRIBUTE = new THREE.BufferAttribute(TRIANGLES_POSITIONS_ARRAY, 3);
		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', TRIANGLES_POSITIONS_ATTRIBUTE);
		const material = new THREE.MeshBasicMaterial({ color: 0xff6622, wireframe: true });
		const triangle = new THREE.Mesh(geometry, material);
		triangle.position.y = 2;

		group.add(triangle);
		// Aggregate
		scene.add(group);

		// Camera
		const ASPECT_RATIO = sizes.width / sizes.height;
		const camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO, 1, 100);

		camera.position.set(0, -10, 25);
		camera.lookAt(group.position);
		// Aggregate +
		scene.add(camera);

		// Renderer

		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
		renderer.setSize(sizes.width, sizes.height);

		// OrbitControl
		const control = new OrbitControls(camera, canvas);
		control.enableDamping = true;
		let tickId = 0;
		const tick = () => {
			console.log('Scene 8 tick');
			control.update();
			renderer.render(scene, camera);
			tickId = requestAnimationFrame(tick);
		};
		gsap.fromTo(triangle.rotation, { y: 0 }, { duration: 3.6, y: 2 * Math.PI, repeat: -1 });
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
			cancelAnimationFrame(tickId);
			renderer.clear();
			renderer.dispose();
			removeEventListener('resize', setCanvasSize);
			removeEventListener('dbclick', setCanvasSize);
			console.log('Renderer cleared and diposed');
		}
		return disposeScene;
	});
</script>

<canvas class="webgl" bind:this={canvas}></canvas>
