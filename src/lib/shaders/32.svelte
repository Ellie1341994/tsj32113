<script lang="ts">
	import gsap from 'gsap';
	// BIG NOTE: REMAINING MEMORY ALLOCATED SEEMS TO BE INTERNAT TO THREE.JS
	// import gsap from `gsap`;
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
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
		//  Loaders
		const textureLoader = new THREE.TextureLoader();
		const gtlfLoader = new GLTFLoader();
		/**
		 * Utils
		 */
		const updateAllMaterials = () => {
			scene.traverse((child) => {
				if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
					// child.material.envMapIntensity = 1;
					child.material.wireframe = true;
					child.material.needsUpdate = true;
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});
		};
		// Texture

		const mapTexture = textureLoader.load('/assets/shaders/31/models/color.jpg');
		const normalTexture = textureLoader.load('/assets/shaders/31/models/normal.jpg');
		// Material

		//  Models
		gtlfLoader.load('/assets/shaders/32/models/coffee.glb', (gltf) => {
			// Model
			console.log(gltf);
			const mesh = gltf.scene;
			mesh.scale.set(0.1, 0.1, 0.1);
			scene.add(mesh);
			// Update materials
			// updateAllMaterials();
		});
		// Meshes
		const cube = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1),
			new THREE.MeshStandardMaterial({ color: '0x696969' })
		);
		// Lights
		const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.set(1024, 1024);
		directionalLight.shadow.camera.far = 15;
		// directionalLight.shadow.normalBias = 0.0;
		directionalLight.shadow.bias = -0.05;
		directionalLight.position.set(0, 2, -4);
		const ambientLight = new THREE.AmbientLight('#ffffff', 3);
		//  Mesh
		const plane = new THREE.Mesh(
			new THREE.PlaneGeometry(15, 15, 15),
			new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, wireframe: true })
		);
		plane.castShadow = false;
		// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
		// plane.rotation.x = Math.PI;
		// plane.position.x = 0;
		// plane.position.y = -3;
		// plane.position.z = 6;
		// plane.position.set(0, -5, 0);
		// Scene
		const scene = new THREE.Scene();
		scene.add(ambientLight);
		// Cam
		const camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO);
		camera.position.set(18, 5, 3);
		const control = new OrbitControls(camera, canvas);
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFShadowMap;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1;
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
		// Play
		const clock = new THREE.Clock();
		let tickId: number = 0;
		function tick() {
			// Update material
			const elapsedTime = clock.getElapsedTime();
			// Update controls
			control.update();
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
	@media (max-width: 666px) {
		span.lil-gui-placer {
			position: absolute;
			top: 19vh;
			left: calc(12vw + 1.5vh);
			width: 10vw;
		}
	}
</style>
