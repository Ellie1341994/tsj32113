<script lang="ts">
	import gsap from 'gsap';
	// import { page } from `$app/stores`;
	// BIG NOTE: REMAINING MEMORY ALLOCATED SEEMS TO BE INTERNAT TO THREE.JS
	// import gsap from `gsap`;
	import GUI from 'lil-gui';
	import { onMount, tick } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { Sky } from 'three/addons/objects/Sky.js';
	import { Timer } from 'three/addons/misc/Timer.js';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	onMount(() => {
		// Constants

		const sizes = { width: window.innerWidth * 0.75, height: window.innerHeight * 0.75 };
		const ASPECT_RATIO = sizes.width / sizes.height;
		const ASSETS_BASE_PATH = `../../src/lib/classic_techniques/assets/17/textures`;
		const gui = new GUI({
			container: lilGuiPlacer,
			width: 300,
			closeFolders: true,
			title: 'Tweaks Panel'
		});
		// Textures
		const TEXTURE_LOADER = new THREE.TextureLoader();
		const PARTICLE_TEXTURE = TEXTURE_LOADER.load(`${ASSETS_BASE_PATH}/particles/2.png`);
		// Particles
		const sphericParticles = new THREE.Points(
			new THREE.SphereGeometry(1, 32, 32),
			new THREE.PointsMaterial({ color: 0xff3456, size: 0.02, sizeAttenuation: true })
		);
		const visibilityFolder = gui.addFolder('Visibility');
		visibilityFolder.add(sphericParticles, 'visible').name(sphericParticles.type + ' Sphere');
		sphericParticles.visible = false;

		// Custom Particles
		const bfG = new THREE.BufferGeometry();
		const particleAmount = 5000;
		const dimensions = 3;
		const verticesSize = particleAmount * dimensions;
		const vertices = new Float32Array(verticesSize).map(() => (Math.random() - 0.5) * 10);
		// console.log('vertices', vertices);
		bfG.setAttribute('position', new THREE.BufferAttribute(vertices, dimensions));
		// sphericParticles.material.color = new THREE.Color('0xffffff');
		// sphericParticles.material.size = 0.1;
		const customParticles = new THREE.Points(
			bfG,
			// sphericParticles.material
			new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, sizeAttenuation: true })
		);
		customParticles.material.color = new THREE.Color('#f6d32d');
		const colorFolder = gui.addFolder('Color');
		colorFolder.addColor(customParticles.material, 'color');
		// Dealing with particle nuances
		customParticles.material.transparent = true;
		// customParticles.material.alphaTest = 0.001;
		// customParticles.material.depthTest = false;
		// depthTest positional issue example with cube
		const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
		cube.visible = false;
		visibilityFolder.add(cube, 'visible').name(cube.type + ' Cube');

		customParticles.material.depthWrite = false;

		customParticles.material.alphaMap = PARTICLE_TEXTURE;
		// Scene
		const scene = new THREE.Scene();
		scene.add(cube, sphericParticles, customParticles);
		// Cam
		const camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO);
		camera.position.z = 3;
		const control = new OrbitControls(camera, canvas);
		// Feature: Fullscreen
		// Size fix on toggle off
		const setCanvasSize = () => {
			// Update camera
			camera.aspect = sizes.width / sizes.height;
			camera.updateProjectionMatrix();

			// Update renderer
			renderer.setSize(sizes.width, sizes.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		};
		window.addEventListener(`resize`, setCanvasSize);
		// Full screen support
		const toggleFullscreen = () => {
			document.fullscreenElement ? document.exitFullscreen() : canvas?.requestFullscreen();
		};
		window.addEventListener(`dblclick`, toggleFullscreen);
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		// Play
		const timer = new Timer();
		let tickId: number;
		function tick() {
			timer.update();
			// const elapsedTime = timer.getElapsed();
			control.update();
			renderer.render(scene, camera);
			tickId = window.requestAnimationFrame(tick);
		}
		tick();
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
