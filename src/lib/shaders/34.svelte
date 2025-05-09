<script lang="ts">
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import vertexShader from './34/vertex.glsl';
	import fragmentShader from './34/fragment.glsl';
	let { canvas = $bindable(), lilGuiPlacer = $bindable() } = $props();
	onMount(() => {
		// Constants
		const sizes = {
			get width() {
				return innerWidth * 0.75;
			},
			get height() {
				return innerHeight * 0.75;
			},
			resolution: new THREE.Vector2(),
			pixelRatio: Math.min(window.devicePixelRatio, 2)
		};
		sizes.resolution.set(sizes.width, sizes.height);
		const ASPECT_RATIO = sizes.width / sizes.height;
		let rendererParameters = { clearColor: '#444d7e' };
		// Other features
		const setCanvasSize = () => {
			// Update camera
			camera.aspect = sizes.width / sizes.height;
			camera.updateProjectionMatrix();
			sizes.resolution.set(sizes.width, sizes.height);
			sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

			console.log(sizes);

			// Update renderer
			if (document.fullscreenElement) {
				canvas.setAttribute('style', 'border: none;');
			} else {
				canvas.setAttribute('style', 'border: 1vh solid var(--color-theme-4);');
			}
			renderer.setSize(sizes.width, sizes.height);
			renderer.setPixelRatio(sizes.pixelRatio);
		};
		addEventListener(`resize`, setCanvasSize);
		// Full screen support
		const toggleFullscreen = () => {
			document.fullscreenElement ? document.exitFullscreen() : canvas?.requestFullscreen();
		};
		addEventListener(`dblclick`, toggleFullscreen);
		// Teaks panel
		const gui = new GUI({
			width: 300,
			container: lilGuiPlacer,
			closeFolders: true,
			title: 'Tweaks Panel'
		});
		gui.hide();
		// Scene
		const scene = new THREE.Scene();
		// Fireworks
		const createFirework = (count = 100, position = new THREE.Vector3(), size = 0.5) => {
			const dimensions = 3;
			const positionsArray = new Float32Array(count * dimensions);
			for (let i = 0; i < count; i++) {
				const i3 = i * dimensions;
				positionsArray[i3 + 0] = Math.random() - 0.5;
				positionsArray[i3 + 1] = Math.random() - 0.5;
				positionsArray[i3 + 2] = Math.random() - 0.5;
			}
			// Geometry
			const geometry = new THREE.BufferGeometry();
			geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3));
			// Material
			const material = new THREE.ShaderMaterial({
				vertexShader,
				fragmentShader,
				uniforms: {
					uSize: new THREE.Uniform(size),
					uResolution: new THREE.Uniform(sizes.resolution)
				}
			});
			// Points
			const firework = new THREE.Points(geometry, material);
			firework.position.copy(position);
			scene.add(firework);
		};
		createFirework();
		// Animation
		// Loaders
		// Meshes
		// const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32), material);
		// Lights
		// Scene
		// Cam
		const camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO);
		camera.position.set(0, 0, 2);
		const control = new OrbitControls(camera, canvas);
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
		// Gui
		renderer.setClearColor(rendererParameters.clearColor);

		gui.addColor(rendererParameters, 'clearColor').onChange(() => {
			renderer.setClearColor(rendererParameters.clearColor);
		});
		// Play
		const clock = new THREE.Clock();
		let tickId: number = 0;
		function tick() {
			// Update material
			const elapsedTime = clock.getElapsedTime();

			// Update time uniform for pulsing effect
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
