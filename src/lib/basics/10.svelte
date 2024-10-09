<script lang="ts">
	// BIG NOTE: REMAINING MEMORY ALLOCATED SEEMS TO BE INTERNAT TO THREE.JS
	import gsap from 'gsap';
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	onMount(() => {
		// Image
		//     // load
		// const IMAGE = new Image();
		// IMAGE.onload = () => {
		//     console.log('Image loaded')
		// }
		// const TEXTURE = new THREE.Texture(IMAGE);
		//     // texture
		// IMAGE.addEventListener('load', () => {
		//     TEXTURE.needsUpdate = true;
		// });
		// IMAGE.src = './static/textures/door/color.jpg'
		// LoaderManager
		const LOADING_MANAGER = new THREE.LoadingManager();
		// LOADING_MANAGER.onStart = () => {};
		// LOADING_MANAGER.onLoad = () => {};
		// LOADING_MANAGER.onProgress = () => () => {};
		// LOADING_MANAGER.onError = () => {};

		const TEXTURE_LOADER = new THREE.TextureLoader(LOADING_MANAGER);
		const lessonAssetsPath = '/assets/basics/10';
		const IMG_TEXTURE = false ? 'checkerboard-1024x1024.png' : 'minecraft.png';
		const COLOR_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/textures/${IMG_TEXTURE}`);
		// COLOR_TEXTURE.minFilter = THREE.NearestFilter;
		COLOR_TEXTURE.magFilter = THREE.NearestFilter;
		// COLOR_TEXTURE.repeat.set(2,19);
		// // COLOR_TEXTURE.wrapT = THREE.RepeatWrapping;
		// const ALPHA_TEXTURE = TEXTURE_LOADER.load(`${projectPath}/textures/door/alpha.jpg`);
		// const HEIGHT_TEXTURE = TEXTURE_LOADER.load(`${projectPath}/textures/door/height.jpg`);
		// const NORMAL_TEXTURE = TEXTURE_LOADER.load(`${projectPath}/textures/door/normal.jpg`);
		// const AMBIENT_OCCLUSION_TEXTURE = TEXTURE_LOADER.load(`${projectPath}/textures/door/ambientOcclusion.jpg`);
		// const METALNESS_TEXTURE = TEXTURE_LOADER.load(`${projectPath}/textures/door/metalness.jpg`);
		// const ROUGHNESS_TEXTURE = TEXTURE_LOADER.load(`${projectPath}/textures/door/roughness.jpg`);

		COLOR_TEXTURE.colorSpace = THREE.SRGBColorSpace;
		// Debug UI

		const gui = new GUI({
			width: 300,
			title: 'Slider U.I Panel',
			closeFolders: false,
			container: lilGuiPlacer
		});
		// gui.close();
		const openGui = (event: any) => {
			event.key === 'h' && gui.show(gui._hidden);
		};
		window.addEventListener('keydown', openGui);

		const debugObject = { color: 0x9a9996, segments: { width: 2 }, scale: 0, spin: () => {} };

		// Sizes

		const sizes = {
			width: window.innerWidth * 0.75,
			height: window.innerHeight * 0.75
		};

		// Resizing feature
		const setCanvasSize = () => {
			console.log('Window size has changed.');
			// Scene size update
			sizes.width = window.innerWidth * 0.75;
			sizes.height = window.innerHeight * 0.75;
			// Camera AR update
			camera.aspect = sizes.width / sizes.height;
			camera.updateProjectionMatrix();

			// Renderer
			renderer.setSize(sizes.width, sizes.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
		};
		window.addEventListener('resize', setCanvasSize);

		// Full screen support feature
		const toggleFullscreen = () => {
			document.fullscreenElement ? document.exitFullscreen() : canvas?.requestFullscreen();
		};
		window.addEventListener('dblclick', toggleFullscreen);

		// Scene
		const scene = new THREE.Scene();

		// Objects
		// Rinrg
		const RING1 = new THREE.Mesh(
			new THREE.TorusGeometry(1, 0.35, 32, 100),
			new THREE.MeshBasicMaterial({
				color: debugObject.color,
				wireframe: false,
				map: COLOR_TEXTURE
			})
		);
		RING1.position.set(-1, 0, 0);
		// Cube
		const CUBE_GEOMETRY = new THREE.BoxGeometry(1, 1, 1);

		const CUBE1 = new THREE.Mesh(
			CUBE_GEOMETRY,
			new THREE.MeshBasicMaterial({
				color: debugObject.color,
				wireframe: false,
				map: COLOR_TEXTURE
			})
		);
		CUBE1.position.set(1, 0, 0);

		// Aggregate
		scene.add(CUBE1);
		scene.add(RING1);

		// Gui objects
		// const LIMITS = [-25, 25, 1]
		const [MIN, MAX, STEP, ALIAS] = [-25, 25, 1, 'Horizontal mov.'];
		gui.add(CUBE1.position, 'x', MIN, MAX, STEP).name(ALIAS);

		gui.add(CUBE1, 'visible');

		// Support for whole scale modification
		debugObject.scale = 0;
		gui
			.add(debugObject, 'scale', 0, 5, 0.1)
			.name('Scale all')
			.onChange(() => {
				CUBE1.scale.set(3, 3, 3);
				CUBE1.scale.x = debugObject.scale;
			});

		gui.add(CUBE1.material, 'wireframe');
		// solution that properly matches the color picked in lil-ui and three js internal color managemenr
		gui.addColor(debugObject, 'color').onChange(() => {
			CUBE1.material.color.set(debugObject.color);
		});

		// Adding segment slider and geometry change (a box with segments)
		debugObject.segments = { width: 2 };
		gui
			.add(debugObject.segments, 'width')
			.min(1)
			.max(4)
			.step(1)
			.name('Width segments')
			.onFinishChange(() => {
				CUBE1.geometry.dispose(); // it frees memory and avoids leaks from previously instanced entities
				CUBE1.geometry = new THREE.BoxGeometry(1, 1, 1, debugObject.segments.width);
			});

		debugObject.spin = () => {
			gsap.to(CUBE1.rotation, { y: CUBE1.rotation.y + Math.PI * 2 });
		};
		// simple button click spin animation on the gui
		// gui.add(debugObject, 'spin');
		// GUI Folder code for organization
		const MESH_TWEAKS = gui.addFolder('Animation Folder');
		MESH_TWEAKS.add(debugObject, 'spin');
		MESH_TWEAKS.close();
		// Camera
		const ASPECT_RATIO = sizes.width / sizes.height;
		const camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO, 1, 100);

		camera.position.set(0, 0, 5);
		camera.lookAt(CUBE1.position);
		// Aggregate +
		scene.add(camera);

		// Renderer

		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
		renderer.setSize(sizes.width, sizes.height);

		// OrbitControl
		const control = new OrbitControls(camera, canvas);
		control.enableDamping = true;
		let tickId: number = 0;
		const tick = () => {
			// group.rotation.x += 0.01;
			control.update();
			renderer.render(scene, camera);
			tickId = window.requestAnimationFrame(tick);
		};

		tick();

		function disposeScene() {
			// RING1.material.map?.dispose();
			// CUBE1.material.map?.dispose();
			function disposeAll(node: any) {
				if (node instanceof THREE.Mesh) {
					node.geometry?.dispose();
					node.material?.map?.dispose();
					node.material?.dispose();
					console.log(`${node.type} disposed`);
				} else if (node instanceof THREE.Texture) {
					node?.dispose();
				}
				// console.log(`node`, node);
			}
			scene.traverse(disposeAll);
			scene.clear();
			scene.removeFromParent();
			control.dispose();
			console.log(`disposed first project allocated resources`, renderer.info);
			gui.destroy();
			console.log('GUI destroyed');
			console.log('tickId', tickId);
			window.cancelAnimationFrame(tickId);
			window.removeEventListener('resize', setCanvasSize);
			window.removeEventListener('dbclick', toggleFullscreen);
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
