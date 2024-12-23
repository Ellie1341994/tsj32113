<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import GUI from 'lil-gui';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { text } from '@sveltejs/kit';
	import { normalMap } from 'three/webgpu';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	const wideScreen = innerWidth > 888;
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
			title: 'Tweaks panel',
			width: wideScreen ? 300 : 340 * 0.75,
			container: lilGuiPlacer
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
		// Manager
		const manager = new THREE.LoadingManager();
		// Loader
		const textureLoader = new THREE.TextureLoader(manager);
		const snowTextureNormal = textureLoader.load('/christmas/textures/snow/Snow_NORM.jpg');
		const snowTextureColor = textureLoader.load('/christmas/textures/snow/Snow_COLOR.jpg');
		const snowTextureDisplacement = textureLoader.load('/christmas/textures/snow/Snow_DISP.png');
		const snowTextureRoughness = textureLoader.load('/christmas/textures/snow/Snow_ROUGH.jpg');
		const snowTextureAmbientOcclusion = textureLoader.load('/christmas/textures/snow/Snow_OCC.jpg');

		// Geometry
		const geometry = new THREE.BoxGeometry(1, 0.1, 1);
		// Materials
		const material = new THREE.MeshStandardMaterial({
			// color: '#993333',
			map: snowTextureColor,
			normalMap: snowTextureNormal,
			bumpMap: snowTextureDisplacement,
			aoMap: snowTextureAmbientOcclusion,
			roughnessMap: snowTextureRoughness
		});
		// Meshes
		const sampleBoxMesh = new THREE.Mesh(geometry, material);
		sampleBoxMesh.scale.setScalar(2);
		// Lights
		const light = new THREE.SpotLight();
		// const abmbientLight = new THREE.AmbientLight('#ffffff', 6);
		// Scene
		const scene = new THREE.Scene();
		//  External Meshes
		// Loader
		const gltfLoader = new GLTFLoader();
		gltfLoader.load('/christmas/models/santas-hat/scene.gltf', (asset) => {
			asset.scene.position.y = 0;
			asset.scene.scale.setScalar(0.25);
			scene.add(asset.scene);
		});

		scene.add(sampleBoxMesh, light);
		// Camera
		// Cube camera
		// Normal
		const camera = new THREE.PerspectiveCamera(75, parameters.aspectRatio);
		camera.position.set(0, 1, 2);
		const control = new OrbitControls(camera, canvas);
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setClearColor('#11111ff', 0.5);
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
