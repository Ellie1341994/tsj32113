<script lang="ts">
	import gsap from 'gsap';
	// BIG NOTE: REMAINING MEMORY ALLOCATED SEEMS TO BE INTERNAT TO THREE.JS
	// import gsap from `gsap`;
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import vertexShader from './32/vertex.glsl';
	import fragmentShader from './32/fragment.glsl';
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
			title: 'Tweaks Panel'
		});
		gui.hide();
		//  Loaders
		const gtlfLoader = new GLTFLoader();
		const textureLoader = new THREE.TextureLoader();
		/**
		 * Utils
		 */
		// Texture
		const uPerlinTexture = textureLoader.load('/assets/shaders/32/textures/perlin.png');
		uPerlinTexture.wrapS = THREE.RepeatWrapping;
		uPerlinTexture.wrapT = THREE.RepeatWrapping;
		// Material

		//  Models
		gtlfLoader.load('/assets/shaders/32/models/coffeModelBaked.glb', (gltf) => {
			// Model
			console.log(gltf);
			const mesh = gltf.scene;
			scene.add(mesh);
		});
		//

		// Lights
		// const ambientLight = new THREE.AmbientLight('#ffffff', 3);
		//  Mesh
		const planeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64);
		planeGeometry.translate(0, 0.5, 0);
		planeGeometry.scale(1.5, 6, 1.5);
		const planeMaterial = new THREE.ShaderMaterial({
			vertexShader,
			fragmentShader,
			uniforms: {
				uTime: new THREE.Uniform(0),
				uPerlinTexture: new THREE.Uniform(uPerlinTexture)
			},
			side: THREE.DoubleSide,
			transparent: true,
			depthWrite: false
			// wireframe: true
		});
		const smokeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
		smokeMesh.position.y = 1.83;
		// Scene
		const scene = new THREE.Scene();
		scene.add(smokeMesh);
		// Cam
		const camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO);
		camera.position.set(0, 6, 9);
		const control = new OrbitControls(camera, canvas);
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
		// Play
		const clock = new THREE.Clock();
		let tickId: number = 0;
		function tick() {
			// Update material
			const elapsedTime = clock.getElapsedTime();
			planeMaterial.uniforms.uTime.value = elapsedTime;
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
