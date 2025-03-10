<script lang="ts">
	// BIG NOTE: REMAINING MEMORY ALLOCATED SEEMS TO BE INTERNAT TO THREE.JS
	import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
	import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
	// import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	onMount(() => {
		const lessonAssetsPath = '/assets/basics/12';
		const LOADING_MANAGER = new THREE.LoadingManager();
		const TEXTURE_LOADER = new THREE.TextureLoader(LOADING_MANAGER);
		const MATCAP_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/textures/matcaps/2.png`);
		const MATCAP_TEXTURE_ALT = TEXTURE_LOADER.load(`${lessonAssetsPath}/textures/matcaps/2.png`);
		MATCAP_TEXTURE.colorSpace = THREE.SRGBColorSpace;
		MATCAP_TEXTURE_ALT.colorSpace = THREE.SRGBColorSpace;

		/**
		 * Base
		 */
		// Debug
		const gui = new GUI({
			width: 300,
			title: 'Slider U.I Panel',
			closeFolders: false,

			container: lilGuiPlacer
		});
		const openGui = (event: any) => {
			event.key === 'h' && gui.show(gui._hidden);
		};
		addEventListener('keydown', openGui);

		// Scene
		const scene = new THREE.Scene();

		/**
		 * Textures
		 */
		// const textureLoader = new THREE.TextureLoader();

		/**
		 * Object
		 */

		const DONUT_GEOMETRY = new THREE.TorusGeometry(0.6, 0.1, 20, 45, undefined);
		const DONUT_MATERIAL = new THREE.MeshMatcapMaterial({
			matcap: MATCAP_TEXTURE_ALT
		});
		const DONUTS: typeof DONUT = [];
		let DONUT: any = undefined;
		for (let i = 0; i <= 99; i++) {
			DONUT = new THREE.Mesh(DONUT_GEOMETRY, DONUT_MATERIAL);

			DONUTS.push(DONUT);

			['x', 'y', 'z'].forEach((dimension) => {
				DONUT.position[dimension] = (Math.random() - 0.5) * 25;
				DONUT.rotation[dimension] = Math.random() * Math.PI;
				DONUT.scale[dimension] = Math.random() * 2 + 0.5;
			});
		}
		scene.add(...DONUTS);

		// scene.add(cube)

		/**
		 * Sizes
		 */
		const sizes = {
			width: innerWidth * 0.75,
			height: innerHeight * 0.75
		};
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
		addEventListener('resize', setCanvasSize);

		// Full screen support feature
		const toggleFullscreen = () => {
			document.fullscreenElement ? document.exitFullscreen() : canvas?.requestFullscreen();
		};
		addEventListener('dblclick', toggleFullscreen);

		/**
		 * Camera
		 */
		// Base camera
		const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
		camera.position.set(0, 0, 15);
		scene.add(camera);

		// Controls
		const control = new OrbitControls(camera, canvas);
		control.enableDamping = true;
		/**
		 * Font
		 */
		const FONT_LOADER = new FontLoader();
		FONT_LOADER.load(`${lessonAssetsPath}/fonts/helvetiker_regular.typeface.json`, (font) => {
			// console.log('font loaded');
			let TEXT_GEOMETRY_OPTIONS = {
				font,
				size: 2,
				depth: 0,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.73,
				bevelSize: 0.1,
				bevelOffset: 0,
				bevelSegments: 9
			};
			let TEXT_GEOMETRY: any = new TextGeometry('Ellie Broocks', TEXT_GEOMETRY_OPTIONS);
			TEXT_GEOMETRY.computeBoundingBox();
			TEXT_GEOMETRY.translate(
				-(TEXT_GEOMETRY.boundingBox.max.x - TEXT_GEOMETRY_OPTIONS.bevelSize) * 0.5,
				-(TEXT_GEOMETRY.boundingBox.max.y - TEXT_GEOMETRY_OPTIONS.bevelSize) * 0.5,
				-(TEXT_GEOMETRY.boundingBox.max.z - TEXT_GEOMETRY_OPTIONS.bevelThickness) * 0.5
			);
			const TEXT_MATERIAL = new THREE.MeshMatcapMaterial({
				matcap: MATCAP_TEXTURE
			});
			let TEXT = new THREE.Mesh(TEXT_GEOMETRY, TEXT_MATERIAL);
			TEXT.position.set(0, 0, 0);
			scene.add(TEXT);
			gui.add(TEXT_GEOMETRY.parameters.options, 'bevelSize', 0, 1, 0.01).onChange((value: any) => {
				TEXT_GEOMETRY_OPTIONS.bevelSize = value;
				TEXT.geometry.dispose();
				TEXT_GEOMETRY = new TextGeometry('Ellie Broocks', TEXT_GEOMETRY_OPTIONS);
				TEXT_GEOMETRY.computeBoundingBox();
				TEXT_GEOMETRY.translate(
					-(TEXT_GEOMETRY.boundingBox.max.x - TEXT_GEOMETRY_OPTIONS.bevelSize) * 0.5,
					-(TEXT_GEOMETRY.boundingBox.max.y - TEXT_GEOMETRY_OPTIONS.bevelSize) * 0.5,
					-(TEXT_GEOMETRY.boundingBox.max.z - TEXT_GEOMETRY_OPTIONS.bevelThickness) * 0.5
				);
				TEXT.geometry = TEXT_GEOMETRY;
			});
		});
		/**
		 * Renderer
		 */
		const renderer = new THREE.WebGLRenderer({
			canvas: canvas
		});
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

		/**
		 * Animate
		 */
		const clock = new THREE.Clock();
		let tickId = 0;
		const tick = () => {
			const elapsedTime = clock.getElapsedTime();

			// Update control
			control.update();
			// gui.update()
			DONUTS.forEach((DONUT: any) => {
				DONUT.rotation.x += 0.01;
				DONUT.rotation.y += 0.01;
				DONUT.rotation.x += 0.01;
			});
			// Render
			renderer.render(scene, camera);
			gui.onChange(() => {
				renderer.render(scene, camera);
				console.log('Re-rendered');
			});

			// Call tick again on the next frame
			requestAnimationFrame(tick);
		};

		tick();
		function disposeScene() {
			function disposeAll(node: any) {
				if (node instanceof THREE.Mesh) {
					node.geometry?.dispose();
					node.material?.matcap?.dispose();
					node.material?.dispose();
					console.log(`${node.type} disposed`);
				} else if (node instanceof THREE.Texture) {
					node?.dispose();
				}
				// console.log(`node`, node);
			}
			scene.traverse(disposeAll);
			scene.clear();
			scene.removeFromParent();
			control.dispose();
			console.log(`disposed first project allocated resources`, renderer.info);
			gui.destroy();
			console.log('GUI destroyed');
			console.log('tickId', tickId);
			cancelAnimationFrame(tickId);
			removeEventListener('resize', setCanvasSize);
			removeEventListener('dbclick', toggleFullscreen);
			removeEventListener('keydown', openGui);
			console.log('Tick disposed');
			renderer.clear();
			renderer.dispose();
			console.log('Renderer cleared and diposed');
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
