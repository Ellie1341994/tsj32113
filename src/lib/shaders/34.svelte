<script lang="ts">
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import vertexShader from './34/vertex.glsl';
	import fragmentShader from './34/fragment.glsl';
	import gsap from 'gsap';
	import { Sky } from 'three/addons/objects/Sky.js';
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
		sizes.resolution.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);
		const ASPECT_RATIO = sizes.width / sizes.height;
		let rendererParameters = { clearColor: '#444d7e' };
		// Other features
		const setCanvasSize = () => {
			// Update camera
			camera.aspect = sizes.width / sizes.height;
			camera.updateProjectionMatrix();
			sizes.resolution.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);
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
		// Loader
		const textureLoader = new THREE.TextureLoader();
		const particleTextures = [
			textureLoader.load('/assets/shaders/34/particles/1.png'),
			textureLoader.load('/assets/shaders/34/particles/2.png'),
			textureLoader.load('/assets/shaders/34/particles/3.png'),
			textureLoader.load('/assets/shaders/34/particles/4.png'),
			textureLoader.load('/assets/shaders/34/particles/5.png'),
			textureLoader.load('/assets/shaders/34/particles/6.png'),
			textureLoader.load('/assets/shaders/34/particles/7.png'),
			textureLoader.load('/assets/shaders/34/particles/8.png')
		];

		// Fireworks
		const createFirework = (
			count = 100,
			position = new THREE.Vector3(),
			size = 0.25,
			texture = particleTextures[7],
			radius = 1.0,
			color = new THREE.Color('#8affff')
		) => {
			const dimensions = 3;
			const positionsArray = new Float32Array(count * dimensions);
			const sizesArray = new Float32Array(count);
			const timeMultipliersArray = new Float32Array(count);
			const sphericalPosition = new THREE.Vector3();
			let spherical = new THREE.Spherical(
				radius * Math.random() * 0.5,
				Math.random() * Math.PI,
				Math.random() * Math.PI * 2
			);
			const vectors = [];
			let i3 = dimensions;
			for (let i = 0; i < count; i++) {
				i3 = i * dimensions;
				spherical.set(radius, Math.random() * Math.PI, Math.random() * Math.PI * 2);
				sphericalPosition.setFromSpherical(spherical);
				positionsArray[i3 + 0] = sphericalPosition.x;
				positionsArray[i3 + 1] = sphericalPosition.y;
				positionsArray[i3 + 2] = sphericalPosition.z;

				sizesArray[i] = Math.random();

				timeMultipliersArray[i] = 1 + Math.random();
			}

			// Geometry
			const geometry = new THREE.BufferGeometry();
			geometry.setAttribute(
				'position',
				new THREE.Float32BufferAttribute(positionsArray, dimensions)
			);
			geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(positionsArray, 1));
			geometry.setAttribute(
				'aTimeMultiplier',
				new THREE.Float32BufferAttribute(timeMultipliersArray, 1)
			);
			// Material
			texture.flipY = false;
			const material = new THREE.ShaderMaterial({
				vertexShader,
				fragmentShader,
				transparent: true,
				depthWrite: false,
				blending: THREE.AdditiveBlending,
				uniforms: {
					uSize: new THREE.Uniform(size),
					uResolution: new THREE.Uniform(sizes.resolution),
					uTexture: new THREE.Uniform(texture),
					uColor: new THREE.Uniform(color),
					uProgress: new THREE.Uniform(0)
				}
			});
			// Points
			const firework = new THREE.Points(geometry, material);
			firework.position.copy(position);
			scene.add(firework);
			// Dispose
			const disposeFirework = () => {
				scene.remove(firework);
				geometry.dispose();
				material.dispose();
			};
			// Animation
			gsap.to(material.uniforms.uProgress, {
				value: 1,
				duration: 3,
				ease: 'linear',
				onComplete: disposeFirework
			});
		};
		const createRandomFirework = (event: MouseEvent) => {
			event.screenX;
			const count = Math.round(400 + Math.random() * 1000);
			const position = new THREE.Vector3(
				5 * ((event.screenX - innerWidth * 0.125 - sizes.width / 2) / sizes.width),
				-5 * ((event.screenY - innerHeight * 0.125 - sizes.height / 2) / sizes.height),
				0
				// (Math.random() - 0.5) * 2,
				// Math.random(),
				// (Math.random() - 0.5) * 2
			);
			console.log(position);
			console.log(event.screenX);
			console.log(event.screenX - innerWidth * 0.125);
			const size = 0.1 + Math.random() * 0.1;
			const texture = particleTextures[Math.floor(Math.random() * particleTextures.length)];
			const radius = Math.random() / 2 + 0.5;
			const color = new THREE.Color();
			color.setHSL(Math.random(), 1, 0.7);

			createFirework(count, position, size, texture, radius, color);
		};
		canvas.addEventListener('click', createRandomFirework);
		// Sly
		const sky = new Sky();
		sky.material.uniforms[`turbidity`].value = 5;
		sky.material.uniforms[`rayleigh`].value = 1;
		sky.material.uniforms[`mieCoefficient`].value = 0.95;
		sky.material.uniforms[`mieDirectionalG`].value = 0.75;
		sky.material.uniforms[`sunPosition`].value.set(10, 0.003, -15);
		sky.scale.set(100, 100, 100);
		scene.add(sky);

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
