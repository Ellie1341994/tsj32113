<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import gsap from 'gsap';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	onMount(() => {
		// Utils
		const parameters = {
			width: innerWidth * 0.75,
			height: innerHeight * 0.75,
			color: '#997766',
			get aspectRatio() {
				return this.width / this.height;
			}
		};
		// Loader
		const gltfLoader = new GLTFLoader();
		// Meshes
		const torusKnotMesh = new THREE.Mesh(
			new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
			new THREE.MeshBasicMaterial({ color: '#ffffff' })
		);
		// Lights
		const ambientLight = new THREE.AmbientLight('#ffffff');
		const directionalLight = new THREE.DirectionalLight('#ffffff');
		directionalLight.castShadow = true;
		// Scene
		const scene = new THREE.Scene();
		scene.add(torusKnotMesh, ambientLight, directionalLight);
		// Camera
		const camera = new THREE.PerspectiveCamera(75, parameters.aspectRatio);
		camera.position.z = 5;
		const control = new OrbitControls(camera, canvas);
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(parameters.width, parameters.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		// Play
		let tickId = 0;
		function tick() {
			cancelAnimationFrame(tickId);
			// Update
			control.update();
			// Render
			renderer.render(scene, camera);
			tickId = requestAnimationFrame(tick);
		}
		tick();
		// Dispose
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
