<script lang="ts">
	import gsap from 'gsap';
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	onMount(() => {
		// Debug UI
		const gui = new GUI({
			width: 300,
			title: 'Mesh Panel',
			closeFolders: false,
			container: lilGuiPlacer
		});
		// gui.close();
		const openGui = (event: any) => {
			event.key === 'h' && gui.show(gui._hidden);
		};
		window.addEventListener('keydown', openGui);

		const debugObject = { color: 0x006633, segments: { width: 2 }, spin: () => {} };

		// Sizes

		const sizes = {
			width: window.innerWidth * 0.75,
			height: window.innerHeight * 0.75
		};

		// Resizing feature
		const setCanvasSize = () => {
			console.log('Window size has changed.');
			// Scene size update
			sizes.width = window.innerWidth;
			sizes.height = window.innerHeight;
			// Camera AR update
			camera.aspect = sizes.width / sizes.height;
			camera.updateProjectionMatrix();

			// Renderer
			renderer.setSize(sizes.width, sizes.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
		};
		window.addEventListener('resize', setCanvasSize);

		// Full screen support feature
		const fullscreenOnOff = () => {
			document.fullscreenElement ? document.exitFullscreen() : canvas?.requestFullscreen();
		};
		window.addEventListener('dblclick', fullscreenOnOff);

		// Scene
		const scene = new THREE.Scene();

		// Objects
		// Group
		const group = new THREE.Group();
		group.scale.set(1, 1, 1);
		group.position.z = 0;
		group.rotation.y = 0;
		// Cube
		const CUBE1 = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true })
		);
		// group.add(CUBE1);

		// Triangles
		const TRIANGLES_NUMBER = 9;
		const VERTEX_NUMBER = 3;
		const VERTEX_POSITIONS = 3;
		const TRIANGLES_POSITIONS_NUMBER = TRIANGLES_NUMBER * VERTEX_NUMBER * VERTEX_POSITIONS;
		const TRIANGLES_POSITIONS_ARRAY = new Float32Array(TRIANGLES_POSITIONS_NUMBER);
		// TRIANGLES_POSITIONS_ARRAY.fill(0);
		for (let index = 0, i = 0; index < TRIANGLES_POSITIONS_NUMBER - 1; index++) {
			TRIANGLES_POSITIONS_ARRAY[index] =
				index < 3 || index % 9 < 3 ? index / 2 : Math.random() * index;
		}
		console.log(TRIANGLES_POSITIONS_ARRAY);
		const TRIANGLES_POSITIONS_ATTRIBUTE = new THREE.BufferAttribute(TRIANGLES_POSITIONS_ARRAY, 3);
		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', TRIANGLES_POSITIONS_ATTRIBUTE);
		const material = new THREE.MeshBasicMaterial({ color: 0xff6622, wireframe: true });
		const triangles = new THREE.Mesh(geometry, material);
		// TRIANGLE.position.y = 2;

		group.add(triangles);
		// Aggregate
		scene.add(group);

		// Gui objects
		// const LIMITS = [-25, 25, 1]
		const [MIN, MAX, STEP, ALIAS] = [-25, 25, 1, 'Horizontal mov.'];
		gui
			.add(triangles.position, 'x', MIN, MAX, STEP)
			//  Alternative
			//  .min(-25)
			//  .max(25)
			//  .step(1)
			.name(ALIAS);

		gui.add(triangles, 'visible');
		gui.add(group.scale, 'x', 0.1, 5, 0.5).name('scale');
		gui.add(material, 'wireframe');
		// solution that properly matches the color picked in lil-ui and three js internal color managemenr
		gui.addColor(debugObject, 'color').onChange(() => {
			material.color.set(debugObject.color);
		});

		// Adding segment slider and geometry change (a box with segments)
		debugObject.segments = { width: 2 };
		// gui
		// 	.add(debugObject.segments, 'width')
		// 	.min(1)
		// 	.max(4)
		// 	.step(1)
		// 	.onFinishChange(() => {
		// 		triangles.geometry.dispose(); // it frees memory and avoids leaks from previously instanced entities
		// 		// const modifiedGeometry = new THREE.BufferGeometry();
		// 		// modifiedGeometry.setAttribute('position', TRIANGLES_POSITIONS_ATTRIBUTE);
		// 		geometry.setAttribute(
		// 			'position',
		// 			new THREE.BufferAttribute(TRIANGLES_POSITIONS_ARRAY, 3 * debugObject.segments.width);
		// 		);
		// 		// triangles.geometry = modifiedGeometry
		// 	});

		debugObject.spin = () => {
			gsap.to(triangles.rotation, { y: triangles.rotation.y + Math.PI * 2 });
		};
		// simple button click spin animation on the gui
		// gui.add(debugObject, 'spin');
		// GUI Folder code for organization
		const MESH_TWEAKS = gui.addFolder('Animation Folder');
		MESH_TWEAKS.add(debugObject, 'spin');
		MESH_TWEAKS.close();
		// Camera
		const ASPECT_RATIO = sizes.width / sizes.height;
		const camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO, 0.1, 250);

		camera.position.set(0, -50, 0);
		camera.lookAt(group.position);
		// Aggregate +
		scene.add(camera);

		// Renderer

		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
		renderer.setSize(sizes.width, sizes.height);

		// OrbitControl
		const control = new OrbitControls(camera, canvas);
		control.enableDamping = true;
		let tickId: number;
		const tick = () => {
			// group.rotation.x += 0.01;

			// console.log(camera.position);
			control.update();
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
			control.dispose();
			console.log('disposed first project allocated resources', renderer.info);
			gui.destroy();
			console.log('GUI destroyed');
			console.log('tickId', tickId);
			window.cancelAnimationFrame(tickId);
			window.removeEventListener('resize', setCanvasSize);
			window.removeEventListener('dbclick', setCanvasSize);
			window.removeEventListener('keydown', openGui);
			console.log('Tick disposed');
			renderer.clear();
			renderer.dispose();
			console.log('Renderer cleared and diposed');
		}
		return disposeScene;
	});
</script>

<canvas class="webgl" bind:this={canvas}></canvas>
<span class="lil-gui-placer" bind:this={lilGuiPlacer}></span>

<style>
	span.lil-gui-placer {
		position: absolute;
		top: 20vh;
		right: 13.5vw;
	}
</style>
