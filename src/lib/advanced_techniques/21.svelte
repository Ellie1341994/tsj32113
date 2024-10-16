<script lang="ts">
	import gsap from 'gsap';
	// import { page } from `$app/stores`;
	// import gsap from `gsap`;
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	// @ts-ignore
	import * as CANNON from 'cannon-es';
	import { rendererReference } from 'three/webgpu';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	onMount(() => {
		// Utils
		const parameters = {
			width: window.innerWidth * 0.75,
			height: window.innerHeight * 0.75,
			color: '#ff3399'
		};
		const ASPECT_RATIO = parameters.width / parameters.height;
		// Meshes
		const cube = new THREE.Mesh(
			new THREE.BoxGeometry(3, 9),
			new THREE.MeshToonMaterial({ color: parameters.color })
		);
		cube.receiveShadow = true;
		// Light
		const ambientLight = new THREE.AmbientLight('#aaaaaa');
		ambientLight.castShadow = true;
		// Scene
		const scene = new THREE.Scene();
		scene.add(cube, ambientLight);
		// Camera
		const camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO);
		camera.position.set(0, 3, 9);
		const control = new OrbitControls(camera, canvas);
		control.enableDamping = true;

		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(parameters.width, parameters.height);

		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		// renderer.shadowMap.enabled = true;

		// Play
		let tickId = 0;
		function tick() {
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
	canvas {
		border: none;
		box-shadow: none;
	}
</style>
