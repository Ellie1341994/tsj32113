<script lang="ts">
	import gsap from 'gsap';
	// import { page } from '$app/stores';
	// BIG NOTE: REMAINING MEMORY ALLOCATED SEEMS TO BE INTERNAT TO THREE.JS
	// import gsap from 'gsap';
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	onMount(() => {
		/**
		 * Base
		 */
		// Debug
		const gui = new GUI({
			// width: 300,
			title: 'Tweaks Panel',
			closeFolders: false,
			container: lilGuiPlacer
		});

		// Scene
		const scene = new THREE.Scene();

		/**
		 * Lights
		 */
		const AMBIENT_LIGHT = new THREE.AmbientLight(0x241f31, 1);
		// AMBIENT_LIGHT.color = new THREE.Color(0xffffff); alternative property access
		const DIRECTIONAL_LIGHT = new THREE.DirectionalLight(0xa51d2d, 2);
		const HEMISPHERE_LIGHT = new THREE.HemisphereLight(0xa51d2d, 0x0000ff, 1);
		const POINT_LIGHT = new THREE.PointLight(0x99c1f1, 1);
		const RECT_AREA_LIGHT = new THREE.RectAreaLight(0x613583, 3, 1, 1);
		const SPOT_LIGHT = new THREE.SpotLight(0xf9f06b, 4.5, 10, Math.PI * 0.1, 0.25, 1);
		RECT_AREA_LIGHT.lookAt(new THREE.Vector3());
		POINT_LIGHT.position.set(1, -0.5, 1);
		RECT_AREA_LIGHT.position.set(-1.5, 0, 1.5);
		SPOT_LIGHT.position.set(0, 2, 3);
		SPOT_LIGHT.target.position.x = -0.75;
		const lightsFolder = gui.addFolder('Lights');
		[
			AMBIENT_LIGHT,
			DIRECTIONAL_LIGHT,
			HEMISPHERE_LIGHT,
			POINT_LIGHT,
			RECT_AREA_LIGHT,
			SPOT_LIGHT
		].forEach((light) => {
			const sliderBaseName = light.type.replace(/Light/, '');
			lightsFolder.addColor(light, 'color').name(sliderBaseName);
			lightsFolder
				.add(light, 'intensity')
				.min(0)
				.max(9)
				.step(1)
				.name(`${sliderBaseName[0]}. Intensity`);
		});
		scene.add(
			AMBIENT_LIGHT,
			DIRECTIONAL_LIGHT,
			HEMISPHERE_LIGHT,
			POINT_LIGHT,
			RECT_AREA_LIGHT,
			SPOT_LIGHT,
			SPOT_LIGHT.target
		);
		gsap.fromTo(
			POINT_LIGHT,
			{ intensity: 0 },
			{ intensity: 9, duration: 9, repeat: -1, yoyo: true }
		);
		// No helper for ambient light
		const POINT_LIGHT_HELPER = new THREE.PointLightHelper(POINT_LIGHT, 0.5);
		const HEMISPHERE_LIGHT_HELPER = new THREE.HemisphereLightHelper(HEMISPHERE_LIGHT, 0.2);
		const DIRECTIONAL_LIGHT_HELPER = new THREE.DirectionalLightHelper(DIRECTIONAL_LIGHT);
		const SPOT_LIGHT_HELPER = new THREE.SpotLightHelper(SPOT_LIGHT);
		const RECT_AREA_LIGHT_HELPER = new RectAreaLightHelper(RECT_AREA_LIGHT);
		SPOT_LIGHT_HELPER.visible = false;
		RECT_AREA_LIGHT_HELPER.visible = false;

		scene.add(
			POINT_LIGHT_HELPER,
			HEMISPHERE_LIGHT_HELPER,
			DIRECTIONAL_LIGHT_HELPER,
			SPOT_LIGHT_HELPER,
			RECT_AREA_LIGHT_HELPER
		);
		const lightHelpers = gui.addFolder('Light Helpers');
		[
			POINT_LIGHT_HELPER,
			HEMISPHERE_LIGHT_HELPER,
			DIRECTIONAL_LIGHT_HELPER,
			SPOT_LIGHT_HELPER,
			RECT_AREA_LIGHT_HELPER
		].forEach((helper) => {
			lightHelpers
				.add(helper, 'visible')
				.name(`${helper.type.replace(/LightHelper/, '')} Visibility`);
		});
		gui.folders.forEach((folder) => folder.close());

		/**
		 * Objects
		 */
		// Material
		const material = new THREE.MeshStandardMaterial();
		// material.color.set('0xffffff');
		material.roughness = 0.1;
		// Objects
		const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
		sphere.position.x = -1.5;

		const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

		const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material);
		torus.position.x = 1.5;

		const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
		plane.material.side = THREE.DoubleSide;
		plane.rotation.x = -Math.PI * 0.5;
		plane.position.y = -0.65;

		scene.add(sphere, cube, torus, plane);

		/**
		 * Sizes
		 */
		const sizes = {
			width: window.innerWidth * 0.75,
			height: window.innerHeight * 0.75
		};
		const setCanvasSize = () => {
			// Update camera
			camera.aspect = sizes.width / sizes.height;
			camera.updateProjectionMatrix();

			// Update renderer
			renderer.setSize(sizes.width, sizes.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		};
		window.addEventListener('resize', setCanvasSize);
		// Full screen support feature
		const toggleFullscreen = () => {
			document.fullscreenElement ? document.exitFullscreen() : canvas?.requestFullscreen();
		};
		window.addEventListener('dblclick', toggleFullscreen);
		/**
		 * Camera
		 */
		// Base camera
		const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
		camera.position.x = 3;
		camera.position.y = 2;
		// camera.rotation.z = Math.PI / 6;
		camera.position.z = 4.5;
		scene.add(camera);

		// Controls
		const control = new OrbitControls(camera, canvas);
		control.enableDamping = true;

		/**
		 * Renderer
		 */
		const renderer = new THREE.WebGLRenderer({
			canvas
		});
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		/**
		 * Animate
		 */
		const clock = new THREE.Clock();
		let tickId = 0;
		const tick = () => {
			const elapsedTime = clock.getElapsedTime();

			// Update objects
			sphere.rotation.y = 0.1 * elapsedTime;
			cube.rotation.y = 0.1 * elapsedTime;
			torus.rotation.y = 0.1 * elapsedTime;

			sphere.rotation.x = 0.15 * elapsedTime;
			cube.rotation.x = 0.15 * elapsedTime;
			torus.rotation.x = 0.15 * elapsedTime;

			// Update controls
			control.update();

			// Render
			renderer.render(scene, camera);

			// Call tick again on the next frame
			tickId = window.requestAnimationFrame(tick);
		};

		tick();
		function disposeScene() {
			let disposeExecutions = 0;
			function disposeAll(node: any) {
				if (node instanceof THREE.Mesh) {
					node.geometry?.dispose();
					node.material?.dispose();
					console.log(`${node.type} disposed`);
					disposeExecutions++;
				} else if (node instanceof THREE.Texture || (node.isObject3D && node?.dispose)) {
					node.dispose();
					disposeExecutions++;
				}
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
			console.log('Tick disposed');
			renderer.clear();
			renderer.dispose();
			console.log(`Renderer cleared and diposed ${disposeExecutions + 2} times`);
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
