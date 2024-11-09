<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import gsap from 'gsap';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import GUI from 'lil-gui';

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
		const gui = new GUI({ title: 'Tweaks panel', width: 300, container: lilGuiPlacer });
		// Textures
		// Loader
		const cubeTextureLoader = new THREE.CubeTextureLoader();
		//  Low Dynamic Range LDR Cube texture
		const environmentMap = cubeTextureLoader.load([
			'/assets/advanced/24/environmentMaps/2/px.png',
			'/assets/advanced/24/environmentMaps/2/nx.png',
			'/assets/advanced/24/environmentMaps/2/py.png',
			'/assets/advanced/24/environmentMaps/2/ny.png',
			'/assets/advanced/24/environmentMaps/2/pz.png',
			'/assets/advanced/24/environmentMaps/2/nz.png'
		]);
		// Meshes
		const torusKnotMesh = new THREE.Mesh(
			new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
			new THREE.MeshStandardMaterial({
				color: '#ffffff',
				roughness: 0.3,
				metalness: 1
				// envMap: environmentMap
			})
		);
		torusKnotMesh.position.y = -5;
		// Models
		const gltfLoder = new GLTFLoader();
		gltfLoder.load(
			'/assets/advanced/24/FlightHelmet/glTF/FlightHelmet.gltf',
			(gltfFlightHelmet) => {
				gltfFlightHelmet.scene.scale.set(10, 10, 10);
				scene.add(gltfFlightHelmet.scene);
			}
		);
		// // Lights
		// const ambientLight = new THREE.AmbientLight('#ffffff');
		// const directionalLight = new THREE.DirectionalLight('#ffffff');
		// directionalLight.castShadow = true;
		// // Scene
		const scene = new THREE.Scene();
		scene.background = environmentMap;
		scene.environment = environmentMap;
		scene.add(torusKnotMesh);
		gui.add(scene, 'environmentIntensity', 0, 10, 0.01);
		gui.add(scene, 'backgroundIntensity', 0, 5, 0.01);
		gui.add(scene, 'backgroundBlurriness', 0, 1, 0.01);
		gui
			.add(scene.backgroundRotation, 'y', 0, Math.PI * 2, Math.PI * 0.01)
			.name('backgroundRotationY');
		gui
			.add(scene.environmentRotation, 'y', 0, Math.PI * 2, Math.PI * 0.01)
			.name('environmentRotationY');
		// Camera
		const camera = new THREE.PerspectiveCamera(75, parameters.aspectRatio);
		camera.position.set(0, 10, 10);
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
