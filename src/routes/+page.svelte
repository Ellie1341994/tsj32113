<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import GUI from 'lil-gui';
	let canvas: HTMLCanvasElement;
	onMount(() => {
		// Utils
		const parameters = {
			s: 0,
			get width() {
				return innerWidth;
			},
			get height() {
				return innerHeight;
			},
			color: '#997766',
			get aspectRatio() {
				return this.width / this.height;
			}
		};
		const gui = new GUI({
			title: 'Tweaks panel'
		});
		const setRendererSize = () => {
			// console.log('Window size has changed.');
			// Camera AR update
			camera.aspect = parameters.aspectRatio;
			camera.updateProjectionMatrix();
			// Renderer
			renderer.setSize(parameters.width, parameters.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
			renderer.render(scene, camera);
		};
		addEventListener('resize', setRendererSize);
		gui.close();
		// Textures
		// Loader
		const textureLoader = new THREE.TextureLoader();
		// Geometry
		const geometry = new THREE.TorusGeometry(1, 1, 3, 3);
		// Materials
		const material = new THREE.MeshStandardMaterial({ color: '#993333' });
		// Meshes
		const sampleMesh = new THREE.Mesh(geometry, material);
		sampleMesh.receiveShadow = true;
		sampleMesh.castShadow = true;
		// Lights
		const abmbientLight = new THREE.HemisphereLight('#ffffff', 9);
		// Scene
		const scene = new THREE.Scene();

		scene.add(abmbientLight, sampleMesh);
		// Camera
		// Cube camera
		// Normal
		const camera = new THREE.PerspectiveCamera(75, parameters.aspectRatio);
		camera.position.set(0, 0, 4);
		const control = new OrbitControls(camera, canvas);
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setClearColor('#11111ff', 0);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		renderer.setSize(parameters.width, parameters.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		// Play
		let tickId = 0;
		const clock = new THREE.Clock();
		function tick() {
			const elapsedTime = clock.getElapsedTime();
			cancelAnimationFrame(tickId);
			// Update
			control.update();
			// Render
			renderer.render(scene, camera);
			tickId = requestAnimationFrame(tick);
		}
		tick();
	});
</script>

<canvas class="webgl" bind:this={canvas}></canvas>

<!-- <div>
	<h1>
		<a class="" href="/challenges"> Challenges</a>
	</h1>
	<h1><a href="/basics">Projects</a></h1>
</div> -->

<style lang="scss">
	canvas {
		border: none;
		box-shadow: none;
	}
	// div {
	// 	height: 100%;
	// 	// width: 100%;
	// 	display: flex;
	// 	align-items: center;
	// 	justify-content: space-around;
	// 	h1 {
	// 		font-size: min(5vh, 5vw);
	// 		a {
	// 			text-decoration: none;
	// 			text-transform: capitalize;
	// 			color: var(--color-theme-3);
	// 			&:hover:not(.disabled-link) {
	// 				--shadow-color: white;
	// 				text-shadow:
	// 					0vh 0vh 0.1vh #000,
	// 					0vh 0vh 10vh var(--shadow-color),
	// 					0vh 0vh 10vh var(--shadow-color),
	// 					0vh 0vh 10vh var(--shadow-color),
	// 					0vh 0vh 15vh var(--shadow-color),
	// 					0vh 0vh 20vh var(--shadow-color),
	// 					0vh 0vh 25vh var(--shadow-color);
	// 			}
	// 		}
	// 	}
	// }
</style>
