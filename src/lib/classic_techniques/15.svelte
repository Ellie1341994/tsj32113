<script lang="ts">
	import gsap from 'gsap';
	// import { page } from '$app/stores';
	// BIG NOTE: REMAINING MEMORY ALLOCATED SEEMS TO BE INTERNAT TO THREE.JS
	// import gsap from 'gsap';
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;

	onMount(() => {
		// Texture
		const textureLoader = new THREE.TextureLoader();
		const lessonAssetsPath = '/assets/classic/15/textures';
		// const bakedShadows = textureLoader.load("./textures/bakedShadow.jpg");
		// bakedShadows.colorSpace = THREE.SRGBColorSpace;
		const simpleShadows = textureLoader.load(`${lessonAssetsPath}/simpleShadow.jpg`);
		simpleShadows.colorSpace = THREE.SRGBColorSpace;
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
		 * Lights
		 */
		// Ambient light
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
		gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001);
		scene.add(ambientLight);

		// Directional light
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1.3);
		directionalLight.position.set(2, 2, -1);
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.width = 1024 * 2;
		directionalLight.shadow.mapSize.height = 1024 * 2;
		directionalLight.shadow.camera.near = 1;
		directionalLight.shadow.camera.far = 6;
		directionalLight.shadow.camera.top = 2;
		directionalLight.shadow.camera.right = 2;
		directionalLight.shadow.camera.bottom = -2;
		directionalLight.shadow.camera.left = -2;
		// directionalLight.shadow.radius = 10; Does not work with PCFSoftShadowMap
		gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001);
		gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
		gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
		gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);
		scene.add(directionalLight);
		// Directional light helper
		const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
		directionalLightCameraHelper.visible = false;
		scene.add(directionalLightCameraHelper);
		// Spot light
		const spotLight = new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3);
		spotLight.castShadow = true;
		spotLight.position.set(0, 2, 2);
		spotLight.shadow.mapSize.width = 1024 * 2;
		spotLight.shadow.mapSize.height = 1024 * 2;
		spotLight.shadow.camera.near = 1;
		spotLight.shadow.camera.far = 6;
		scene.add(spotLight);

		const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
		spotLightCameraHelper.visible = false;
		scene.add(spotLightCameraHelper);

		// Point light
		const pointLight = new THREE.PointLight(0xffffff, 2.7);
		pointLight.castShadow = true;
		pointLight.position.set(-1, 1, 0);
		pointLight.shadow.mapSize.width = 1024 * 2;
		pointLight.shadow.mapSize.height = 1024 * 2;
		pointLight.shadow.camera.near = 0.1;
		pointLight.shadow.camera.far = 5;
		scene.add(pointLight);

		const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
		pointLightCameraHelper.visible = false;
		scene.add(pointLightCameraHelper);

		/**
		 * Materials
		 */
		const material = new THREE.MeshStandardMaterial();
		material.roughness = 0.7;
		material.side = THREE.DoubleSide;
		gui.add(material, 'metalness').min(0).max(1).step(0.001);
		gui.add(material, 'roughness').min(0).max(1).step(0.001);

		/**
		 * Objects
		 */
		const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
		// sphere.position.y = 1;
		sphere.castShadow = true;

		const plane = new THREE.Mesh(
			new THREE.PlaneGeometry(5, 5),
			material
			// new THREE.MeshBasicMaterial({ map: bakedShadows })
		);
		plane.rotation.x = -Math.PI * 0.5;
		plane.position.y = -0.5;
		plane.receiveShadow = true;

		const sphereShadow = new THREE.Mesh(
			new THREE.PlaneGeometry(1.5, 1.5),
			new THREE.MeshBasicMaterial({
				color: 0x000000,
				transparent: true,
				alphaMap: simpleShadows
			})
		);
		// sphereShadow.rotation.set(-Math.PI * 0.5, plane.position.y * 0.01, 0);
		sphereShadow.rotation.x = -Math.PI * 0.5;
		sphereShadow.position.y = plane.position.y + 0.01;

		const axesHelper = new THREE.AxesHelper(10);
		axesHelper.setColors('red', 'blue', 'yellow');
		scene.add(sphere, sphereShadow, plane, axesHelper);
		gsap.fromTo(plane.rotation, { z: 0 }, { duration: 9, z: 3, repeat: -1, yoyo: true });
		gsap.fromTo(axesHelper.rotation, { z: 0 }, { duration: 9, z: 3, repeat: -1, yoyo: true });
		/**
		 * Sizes
		 */
		const sizes = {
			width: window.innerWidth * 0.75,
			height: window.innerHeight * 0.75
		};

		window.addEventListener('resize', () => {
			// Update sizes
			sizes.width = window.innerWidth;
			sizes.height = window.innerHeight;

			// Update camera
			camera.aspect = sizes.width / sizes.height;
			camera.updateProjectionMatrix();

			// Update renderer
			renderer.setSize(sizes.width, sizes.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		});

		/**
		 * Camera
		 */
		// Base camera
		const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
		camera.position.x = 4;
		camera.position.y = 2;
		camera.position.z = 4;
		scene.add(camera);

		// Controls
		const control = new OrbitControls(camera, canvas);
		control.enableDamping = true;

		/**
		 * Renderer
		 */
		const renderer = new THREE.WebGLRenderer({
			canvas: canvas
		});
		renderer.shadowMap.enabled = false;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		/**
		 * Animate
		 */
		const clock = new THREE.Clock();
		let tickId = 0;
		const tick = () => {
			const elapsedTime = clock.getElapsedTime();
			// Update the sphere
			sphere.position.x = Math.cos(elapsedTime) * 1.5;
			sphere.position.z = Math.sin(elapsedTime) * 1.5;
			sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

			// Update the shadow
			sphereShadow.position.x = sphere.position.x;
			sphereShadow.position.z = sphere.position.z;
			sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;
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
					node.material?.alphaMap?.dispose();
					console.log(`${node.type} disposed`);
					disposeExecutions++;
				} else if ((node instanceof THREE.Texture || node.isObject3D) && node.dispose) {
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
