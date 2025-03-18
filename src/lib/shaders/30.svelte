<script lang="ts">
	import gsap from 'gsap';
	// BIG NOTE: REMAINING MEMORY ALLOCATED SEEMS TO BE INTERNAT TO THREE.JS
	// import gsap from `gsap`;
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import vertexShader from './30/vertex.glsl?raw';
	import fragmentShader from './30/fragment.glsl?raw';
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
		// Tweaks panel
		const gui = new GUI({
			width: 300,
			container: lilGuiPlacer,
			closeFolders: true,
			title: 'Galaxy Tweaks'
		});
		// Constants
		const sizes = { width: innerWidth * 0.75, height: innerHeight * 0.75 };
		const ASPECT_RATIO = sizes.width / sizes.height;
		// Scene
		const scene = new THREE.Scene();

		// Meshes
		const cube = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1),
			new THREE.MeshBasicMaterial({ color: '0x696969' })
		);
		// Galaxy Gen
		const parameters = {
			count: 200000,
			size: 2.0,
			radius: 5,
			branches: 3,
			spin: 0,
			randomness: 0.5,
			randomnessPower: 3,
			insideColor: '#ff6030',
			outsideColor: '#1b3984'
		};
		let geometry: any = null;
		let material: any = null;
		let points: any = null;
		function generateGalaxy() {
			if (points) {
				geometry.dispose();
				material.dispose();
				scene.remove(points);
				console.log('Previously generated galaxy disposed?', renderer.info);
			}
			geometry = new THREE.BufferGeometry();
			const dimensions = 3;
			const vertices = new Float32Array(parameters.count * dimensions);
			const colors = new Float32Array(parameters.count * dimensions);
			const scales = new Float32Array(parameters.count);
			const randomness = new Float32Array(parameters.count * dimensions);
			for (let p = 0; p < parameters.count; p++) {
				const p3 = p * dimensions;
				const radius = Math.random() * parameters.radius;
				const branchAngle = ((p % parameters.branches) / parameters.branches) * Math.PI * 2;
				const spinAngle = parameters.spin * radius;

				const randomX =
					Math.pow(Math.random(), parameters.randomnessPower) *
					(Math.random() < 0.5 ? 1 : -1) *
					parameters.randomness *
					radius;
				const randomY =
					Math.pow(Math.random(), parameters.randomnessPower) *
					(Math.random() < 0.5 ? 1 : -1) *
					parameters.randomness *
					radius;
				const randomZ =
					Math.pow(Math.random(), parameters.randomnessPower) *
					(Math.random() < 0.5 ? 1 : -1) *
					parameters.randomness *
					radius;
				// all x
				vertices[p3] = Math.cos(branchAngle + spinAngle) * radius;
				// all y
				vertices[p3 + 1] = 0;
				// all z
				vertices[p3 + 2] = Math.sin(branchAngle + spinAngle) * radius;
				//  Randomness
				randomness[p3] = randomX;
				randomness[p3 + 1] = randomY;
				randomness[p3 + 2] = randomZ;
				// Colors

				const colorInside = new THREE.Color(parameters.insideColor);
				const colorOutside = new THREE.Color(parameters.outsideColor);
				const mixedColor = colorInside.clone();
				mixedColor.lerp(colorOutside, radius / parameters.radius);
				colors[p3] = mixedColor.r;
				colors[p3 + 1] = mixedColor.g;
				colors[p3 + 2] = mixedColor.b;
				// Scales
				scales[p] = Math.random();
			}
			console.log(scales.length);
			geometry.setAttribute('position', new THREE.BufferAttribute(vertices, dimensions));
			geometry.setAttribute('color', new THREE.BufferAttribute(colors, dimensions));
			geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
			geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, dimensions));

			material = new THREE.ShaderMaterial({
				depthWrite: false,
				blending: THREE.AdditiveBlending,
				vertexColors: true,
				vertexShader,
				fragmentShader,
				uniforms: {
					uTime: { value: 0 },
					uSize: { value: 21 * renderer.getPixelRatio() }
				}
			});

			points = new THREE.Points(geometry, material);
			scene.add(points);
		}
		// Organization
		gui.add(parameters, 'count', 100, 100000, 100).name('Particles').onFinishChange(generateGalaxy);
		gui.add(parameters, 'size', 0.001, 0.1, 0.001).name('P. Size').onFinishChange(generateGalaxy);
		gui.add(parameters, 'radius', 0.01, 20, 0.01).name('P. Radius').onFinishChange(generateGalaxy);
		gui
			.add(parameters, 'branches', 1, 20, 1)
			.name('Galaxy. Branches')
			.onFinishChange(generateGalaxy);
		gui.add(parameters, 'spin', -5, 5, 0.001).name('P. Spin').onFinishChange(generateGalaxy);
		gui
			.add(parameters, 'randomness', 0, 2, 0.001)
			.name('P. Randomness')
			.onFinishChange(generateGalaxy);
		gui
			.add(parameters, 'randomnessPower', 1, 10, 0.001)
			.name('P. Rand. Power')
			.onFinishChange(generateGalaxy);

		gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy).name('G. insideColor');
		gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy).name('G. outsideColor');

		// Cam
		const camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO);
		camera.position.set(0, 3, 3);
		const control = new OrbitControls(camera, canvas);
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(sizes.width, sizes.height);

		renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
		// Play
		generateGalaxy();
		const clock = new THREE.Clock();
		let tickId: number = 0;
		function tick() {
			const elapsedTime = clock.getElapsedTime();
			material.uniforms.uTime.value = elapsedTime;
			control.update();
			renderer.render(scene, camera);
			tickId = requestAnimationFrame(tick);
		}
		tick();

		// Resources Management
		function disposeScene() {
			geometry.dispose();
			material.dispose();
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
