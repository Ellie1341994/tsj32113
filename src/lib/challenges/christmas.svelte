<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import GUI from 'lil-gui';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import SnowflakeIcon from '$lib/challenges/christmas/SnowflakeIcon.svelte';
	import dateStore from './christmas/dateStore';
	let canvas: HTMLCanvasElement;
	let showSnowflake = false;
	let playScene = false;
	const clock = dateStore();
	const bodyElement: HTMLBodyElement = document.getElementsByTagName('body')[0];
	bodyElement.setAttribute(
		'style',
		'background-color: #114477; background-image: radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 100%);'
	);
	const wideScreen = innerWidth > 888;
	onMount(() => {
		// Utils
		// return 0;
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
			width: wideScreen ? 300 : 340 * 0.75
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
		manager.onStart = function (url, itemsLoaded, itemsTotal) {
			showSnowflake = true;
			console.log(
				'Started loading file: ' +
					url +
					'.\nLoaded ' +
					itemsLoaded +
					' of ' +
					itemsTotal +
					' files.'
			);
		};

		manager.onLoad = function () {
			console.log('Loading complete!');
			playScene = true;
			showSnowflake = false;
		};
		manager.onProgress = function (url, itemsLoaded, itemsTotal) {
			console.log(
				'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.'
			);
		};

		manager.onError = function (url) {
			console.log('There was an error loading ' + url);
		};

		// Loader
		const textureLoader = new THREE.TextureLoader(manager);
		const snowTextureNormal = textureLoader.load('/christmas/textures/snow/Snow_NORM.jpg');
		const snowTextureColor = textureLoader.load('/christmas/textures/snow/Snow_COLOR.jpg');
		const snowTextureDisplacement = textureLoader.load('/christmas/textures/snow/Snow_DISP.png');
		const snowTextureRoughness = textureLoader.load('/christmas/textures/snow/Snow_ROUGH.jpg');
		const snowTextureAmbientOcclusion = textureLoader.load('/christmas/textures/snow/Snow_OCC.jpg');

		// Geometry
		const geometry = new THREE.BoxGeometry(1, 0.01, 1);
		// Materials
		const material = new THREE.MeshStandardMaterial({
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
		const gltfLoader = new GLTFLoader(manager);
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
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
		// renderer.setClearColor('#11111ff', 0.5);
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
			if (playScene) {
				renderer.render(scene, camera);
			}
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
			bodyElement.setAttribute('style', '');
		}
		return disposeScene;
	});
</script>

<div id="chirstmast-clock-container">
	<SnowflakeIcon visible={showSnowflake} />
	<h1>Next <b>Christmas</b> in {$clock}</h1>
</div>
<canvas class="webgl" bind:this={canvas}></canvas>

<style lang="scss">
	@font-face {
		font-family: 'SnowdemChristmasRegular';
		src: url('$lib/fonts/SnowdemChristmas/SnowdemChristmasRegular.otf');
	}
	@font-face {
		font-family: 'SnowdemChristmasScript';
		src: url('$lib/fonts/SnowdemChristmas/SnowdemChristmasScript.otf');
	}
	#chirstmast-clock-container {
		font-family: 'SnowdemChristmasRegular';
		position: fixed;
		top: 0;
		width: 100vw;
		h1 {
			font-size: 9em;
			b {
				text-decoration: underline;
				text-decoration-style: double;
				text-decoration-skip-ink: auto;
				text-decoration-thickness: 3px;
			}
		}
	}
	canvas {
		border: none;
		box-shadow: none;
	}
</style>
