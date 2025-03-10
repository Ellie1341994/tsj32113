<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import gsap from 'gsap';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import GUI from 'lil-gui';
	import vertexShader from './29/water/vertex.glsl?raw';
	import fragmentShader from './29/water/fragment.glsl?raw';
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
			colors: { depth: '#1a5fb4', surface: '#99c1f1' },
			get aspectRatio() {
				return this.width / this.height;
			}
		};
		const gui = new GUI({
			title: 'Water configurations',
			width: wideScreen ? 300 : 340 * 0.75,
			container: lilGuiPlacer
		});
		// Extras
		const setRendererSize = () => {
			// Camera AR update
			camera.aspect = parameters.aspectRatio;
			camera.updateProjectionMatrix();
			// Renderer
			renderer.setSize(parameters.width, parameters.height);
			renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
			renderer.render(scene, camera);
		};
		addEventListener('resize', setRendererSize);
		// gui.close();
		// Textures
		// Loader
		const textureLoader = new THREE.TextureLoader();

		const geometry = new THREE.PlaneGeometry(2, 2, 512, 512);
		// Shaders
		// Materials
		const waterMaterial = new THREE.ShaderMaterial({
			vertexShader,
			fragmentShader,
			uniforms: {
				uBigWavesElevation: { value: 0.3 },
				uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
				uBigWavesSpeed: { value: 0.75 },
				uTime: { value: 0 },
				uDepthColor: { value: new THREE.Color(parameters.colors.depth) },
				uSurfaceColor: { value: new THREE.Color(parameters.colors.surface) },
				uColorOffset: { value: 0.4 },
				uColorMultiplier: { value: 2.5 },
				uSmallWavesElevation: { value: 0.15 },
				uSmallWavesFrequency: { value: 3 },
				uSmallWavesSpeed: { value: 0.2 },
				uSmallIterations: { value: 4 }
			}
		});
		gui
			.add(waterMaterial.uniforms.uBigWavesElevation, 'value', 0, 1, 0.001)
			.name('uBigWavesElevation');
		gui
			.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x', 0, 10, 0.001)
			.name('uBigWavesFrequencyX');
		gui
			.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y', 0, 10, 0.001)
			.name('uBigWavesFrequencyY');
		gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value', 0, 1, 0.05).name('uBigWavesSpeed');
		const changeColor = () => {
			waterMaterial.uniforms.uDepthColor.value.set(parameters.colors.depth);
			waterMaterial.uniforms.uSurfaceColor.value.set(parameters.colors.surface);
		};
		gui.addColor(parameters.colors, 'depth').name('uDepthColor').onChange(changeColor);
		gui.addColor(parameters.colors, 'surface').name('uSurfaceColor').onChange(changeColor);
		gui.add(waterMaterial.uniforms.uColorOffset, 'value', 0, 1, 0.001).name('uColorOffset');
		gui
			.add(waterMaterial.uniforms.uColorMultiplier, 'value', 0, 10, 0.001)
			.name('uColorMultiplier');
		gui
			.add(waterMaterial.uniforms.uSmallWavesElevation, 'value', 0, 1, 0.001)
			.name('uSmallWavesElevation');
		gui
			.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value', 0, 30, 0.001)
			.name('uSmallWavesFrequency');
		gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value', 0, 4, 0.001).name('uSmallWavesSpeed');
		gui.add(waterMaterial.uniforms.uSmallIterations, 'value', 0, 5, 1).name('uSmallIterations');
		waterMaterial.side = THREE.DoubleSide;
		// Meshes
		const water = new THREE.Mesh(geometry, waterMaterial);
		// water.rotation.set(Math.PI * 0.25, 0, Math.PI * 0.25);
		water.rotation.x = -Math.PI * 0.5;
		// Lights
		// Scene
		const scene = new THREE.Scene();
		scene.add(water);
		// Camera
		// Cube camera
		// Normal
		const camera = new THREE.PerspectiveCamera(75, parameters.aspectRatio, 0.1, 100);
		camera.position.set(2, 1.5, 2);
		const control = new OrbitControls(camera, canvas);
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		renderer.setSize(parameters.width, parameters.height);
		renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
		const logCameraPosition = () => {
			console.log('camera position:', camera.position);
			console.log('camera rotation:', camera.rotation);
		};
		addEventListener('mousedown', logCameraPosition);
		// Play
		let tickId = 0;
		const clock = new THREE.Clock();
		function tick() {
			const elapsedTime = clock.getElapsedTime();
			waterMaterial.uniforms.uTime.value = elapsedTime;
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
			// control.dispose();
			scene.environment?.dispose;
			scene.traverse(disposeAll);
			gui.destroy();
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
