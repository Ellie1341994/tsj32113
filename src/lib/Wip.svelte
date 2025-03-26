<script lang="ts">
	import gsap from 'gsap';
	// BIG NOTE: REMAINING MEMORY ALLOCATED SEEMS TO BE INTERNAT TO THREE.JS
	// import gsap from `gsap`;
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
	import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
	import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

	let { canvas = $bindable(), lilGuiPlacer = $bindable() } = $props();
	onMount(() => {
		// Other features
		// Feature: Fullscreen
		// Size fix on toggle off
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
		addEventListener(`resize`, setCanvasSize);
		// Full screen support
		const toggleFullscreen = () => {
			document.fullscreenElement ? document.exitFullscreen() : canvas?.requestFullscreen();
		};
		addEventListener(`dblclick`, toggleFullscreen);
		// Constants
		const sizes = { width: innerWidth * 0.75, height: innerHeight * 0.75 };
		const ASPECT_RATIO = sizes.width / sizes.height;
		// Teaks panel
		const gui = new GUI({
			width: 300,
			container: lilGuiPlacer,
			closeFolders: true,
			title: 'LPS Model Teaks'
		});
		gui.hide();

		/**
		 * Utils
		 */
		//  Loaders
		const FONT_LOADER = new FontLoader();
		FONT_LOADER.load(`/assets/basics/12/fonts/helvetiker_regular.typeface.json`, (font) => {
			// console.log('font loaded');
			let TEXT_GEOMETRY_OPTIONS = {
				font,
				size: 1,
				depth: 0,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.73,
				bevelSize: 0.1,
				bevelOffset: 0,
				bevelSegments: 9
			};
			let TEXT_GEOMETRY: any = new TextGeometry('Work in progress', TEXT_GEOMETRY_OPTIONS);
			TEXT_GEOMETRY.computeBoundingBox();
			TEXT_GEOMETRY.translate(
				-(TEXT_GEOMETRY.boundingBox.max.x - TEXT_GEOMETRY_OPTIONS.bevelSize) * 0.5,
				-(TEXT_GEOMETRY.boundingBox.max.y - TEXT_GEOMETRY_OPTIONS.bevelSize) * 0.5,
				-(TEXT_GEOMETRY.boundingBox.max.z - TEXT_GEOMETRY_OPTIONS.bevelThickness) * 0.5
			);
			const TEXT_MATERIAL = new THREE.MeshToonMaterial({ color: '#994f7a' });
			let TEXT = new THREE.Mesh(TEXT_GEOMETRY, TEXT_MATERIAL);
			TEXT.receiveShadow = true;
			TEXT.position.set(0, 1, 0);
			scene.add(TEXT);
		});
		const gtlfLoader = new GLTFLoader();
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('/assets/draco/');
		//  Models
		gtlfLoader.setDRACOLoader(dracoLoader);
		// gtlfLoader.load('/assets/utils/keyboard.gltf', (gltf) => {
		gtlfLoader.load('/assets/utils/keyboard.gltf', (gltf) => {
			// Model
			// const mesh = gltf.scene.children[0] as THREE.Mesh;
			gltf.scene.position.set(3, 0, 0);
			gltf.scene.rotation.x = Math.PI * 0.5;
			const [_case, cable, caps] = gltf.scene.children;
			console.log(gltf.scene);

			gsap.to(_case.rotation, { z: Math.PI * 2, repeat: -1, repeatDelay: 3, duration: 1 });

			gsap.to(caps.rotation, { z: Math.PI * 2, repeat: -1, repeatDelay: 3, duration: 1 });
			scene.add(gltf.scene);
		});
		// Meshes
		// Lights
		const ambientLight = new THREE.AmbientLight('#ffffff', 3);
		const horizontalLight = new THREE.HemisphereLight('#ffffff', '#000000', 2);
		const directionalLight = new THREE.DirectionalLight('#ffffff', 4);
		directionalLight.castShadow = true;
		directionalLight.position.set(0, 3, 9);
		directionalLight.lookAt(new THREE.Vector3(0, 0, 0));
		// Scene
		const scene = new THREE.Scene();
		scene.add(
			horizontalLight,
			directionalLight
			// ambientLight
			// new THREE.DirectionalLightHelper(directionalLight)
		);
		// Cam
		const camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO);
		camera.position.set(0, 0, 6);
		const control = new OrbitControls(camera, canvas);
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
		// Play
		const clock = new THREE.Clock();
		let tickId: number = 0;
		function tick() {
			// Update material
			// Update controls
			control.update();
			control.disconnect();
			renderer.render(scene, camera);
			tickId = requestAnimationFrame(tick);
		}
		tick();

		// Resources Management
		function disposeScene() {
			scene.clear();
			scene.removeFromParent();
			control.dispose();
			console.log(`disposed first project allocated resources`, renderer.info);
			gui.destroy();
			console.log(`GUI destroyed`);
			console.log(`tickId`, tickId);
			cancelAnimationFrame(tickId);
			removeEventListener(`resize`, setCanvasSize);
			removeEventListener(`dbclick`, toggleFullscreen);
			console.log(`Tick disposed`);
			renderer.clear();
			renderer.dispose();
			console.log(`Renderer cleared and`);
		}
		return disposeScene;
	});
</script>

<canvas class="webgl" bind:this={canvas}></canvas>
<span class="lil-gui-placer" bind:this={lilGuiPlacer}></span>

<style lang="scss">
	span.lil-gui-placer {
		position: absolute;
		top: 16vh;
		right: calc(12.5vw + 1vh);
	}
	canvas {
		border: none;
		box-shadow: none;
	}
	@media (max-width: 666px) {
		span.lil-gui-placer {
			position: absolute;
			top: 19vh;
			left: calc(12vw + 1.5vh);
			width: 10vw;
		}
	}
</style>
