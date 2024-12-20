<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import gsap from 'gsap';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import vertexShader from './28/A/vertex.glsl?raw';
	import fragmentShader from './28/A/fragment.glsl?raw';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	const wideScreen = innerWidth > 888;
	onMount(() => {
		// Utils
		const parameters = {
			s: 0,
			get width() {
				return innerWidth * 0.75;
			},
			get height() {
				return innerHeight * 0.75;
			},
			color: '#997766',
			get aspectRatio() {
				return this.width / this.height;
			}
		};

		// Extras
		const setRendererSize = () => {
			// Camera AR update
			camera.aspect = parameters.aspectRatio;
			camera.updateProjectionMatrix();
			// Renderer
			renderer.setSize(parameters.width, parameters.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
			renderer.render(scene, camera);
		};
		addEventListener('resize', setRendererSize);
		// Textures
		// Loader
		const textureLoader = new THREE.TextureLoader();

		const geometry = new THREE.BoxGeometry(1, 1, 1);
		// Shaders
		// Materials
		const material = new THREE.ShaderMaterial({
			vertexShader,
			fragmentShader
		});
		// Meshes
		const mesh = new THREE.Mesh(geometry, material);
		// Lights
		const ambientLight = new THREE.AmbientLight('#ffffff', 6);
		// Scene
		const scene = new THREE.Scene();
		scene.add(ambientLight, mesh);
		gsap.to(scene.rotation, { y: 2 * Math.PI, duration: 2 * 3.6, repeat: -1, ease: 'linear' });
		// Camera
		// Cube camera
		// Normal
		const camera = new THREE.PerspectiveCamera(75, parameters.aspectRatio);
		camera.position.set(1, 1, 1);
		const control = new OrbitControls(camera, canvas);
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
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
		// Dispose
		function disposeScene() {
			removeEventListener('resize', setRendererSize);
			cancelAnimationFrame(tickId);
			function disposeAll(node: any) {
				if (node instanceof THREE.Mesh || node instanceof THREE.Points) {
					for (const key in node.material) {
						if (node.material[key] && typeof node.material[key].dispose === 'function') {
							node.material[key].dispose();
							console.log(`${key} disposed`);
						}
					}
					node.material?.dispose();
					node.geometry?.dispose();
					console.log(
						`Disposed ${node.name} ${node.type} G:${node.geometry.type} M:${node.material.type} `
					);
				} else if (node instanceof THREE.Light || node instanceof THREE.CameraHelper) {
					node.dispose();
					console.log(`Disposed ${node.type}`);
				} else if (node instanceof THREE.Texture) {
					node.dispose();
					console.log(`Disposed ${node.type}`);
				} else {
					console.log('NOT DISPOSED', node);
				}
			}
			control.dispose();
			scene.environment?.dispose;
			scene.traverse(disposeAll);
			renderer.dispose();
			console.log(`Experience ended`, renderer.info);
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
