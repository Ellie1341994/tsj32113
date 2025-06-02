<script lang="ts">
	import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
	import { PMREMGenerator } from 'three';
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import vertexShader from './35/vertex.glsl';
	import fragmentShader from './35/fragment.glsl';
	let { canvas = $bindable(), lilGuiPlacer = $bindable() } = $props();
	onMount(() => {
		// Other features
		// Feature: Fullscreen
		// Size fix on toggle off
		let rendererParameters = { clearColor: '#000' };
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
		// addEventListener(`dblclick`, toggleFullscreen);
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
		// gui.hide();
		// Scene
		const scene = new THREE.Scene();
		// Light helpers
		const directionalLightHelper = new THREE.Mesh(
			new THREE.PlaneGeometry(),
			new THREE.MeshBasicMaterial()
		);
		directionalLightHelper.material.color.setRGB(0.1, 0.1, 1);
		directionalLightHelper.material.side = THREE.DoubleSide;
		directionalLightHelper.position.set(0, 0, 3);
		const pointLightHelper = new THREE.Mesh(
			new THREE.IcosahedronGeometry(0.1, 2),
			new THREE.MeshBasicMaterial()
		);
		pointLightHelper.material.color.setRGB(1, 0.1, 0.1);
		pointLightHelper.position.set(0, 2.5, 0);
		scene.add(directionalLightHelper, pointLightHelper);
		// Material
		const materialParameters = { color: '#ffffff' };
		gui.addColor(materialParameters, 'color').onChange(() => {
			material.uniforms.uColor.value = new THREE.Color(materialParameters.color);
		});
		const material = new THREE.ShaderMaterial({
			vertexShader,
			fragmentShader,
			uniforms: {
				// 	uTime: { value: 0 },
				uColor: new THREE.Uniform(new THREE.Color(materialParameters.color))
				// 	drawCallIterationId: new THREE.Uniform(1)
			}
			// transparent: true,
			// side: THREE.DoubleSide,
			// depthWrite: false,
			// blending: THREE.AdditiveBlending
		});
		// Meshes
		//  Loaders
		const rgbeLoader = new RGBELoader();
		rgbeLoader.load('/assets/advanced/24/environmentMaps/1/2k.hdr', (texture) => {
			const pmremGenerator = new PMREMGenerator(renderer);
			const envMap = pmremGenerator.fromEquirectangular(texture).texture;
			texture.dispose();
			pmremGenerator.dispose();
			scene.environment = envMap;
		});
		const gtlfLoader = new GLTFLoader();

		let suzanne: THREE.Object3D;
		gtlfLoader.load('/assets/shaders/33/suzanne.glb', (gltf) => {
			suzanne = gltf.scene;

			suzanne.traverse((child) => {
				if (child instanceof THREE.Mesh) child.material = material;
			});
			scene.add(gltf.scene);
		});

		const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32), material);
		torusKnot.position.x = 3;
		// Sphere
		const sphere = new THREE.Mesh(new THREE.SphereGeometry(), material);
		sphere.position.x = -3;
		// Lights
		// Scene
		scene.add(
			torusKnot,
			sphere
			// new THREE.Mesh(new THREE.BoxGeometry(2, 2), new THREE.MeshStandardMaterial())
		);

		// Cam
		const camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO);
		camera.position.set(7, 7, 7);
		const control = new OrbitControls(camera, canvas);
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
		// Gui
		renderer.setClearColor(rendererParameters.clearColor);

		// });
		// Play
		const clock = new THREE.Clock();
		let tickId: number = 0;
		function tick() {
			// Update material
			const elapsedTime = clock.getElapsedTime();

			if (suzanne) {
				suzanne.rotation.y = elapsedTime * 0.2;
			}
			sphere.rotation.y = elapsedTime * 0.2;
			torusKnot.rotation.y = elapsedTime * 0.2;
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
