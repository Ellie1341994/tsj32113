<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
	let canvas: HTMLCanvasElement;
	onMount(() => {
		// Utils
		let sceneReady = false;
		const parameters = {
			width: window.innerWidth * 0.9,
			height: window.innerHeight * 0.9,
			color: '#999999',
			get aspectRatio() {
				return this.width / this.height;
			},
			modelsURL: {
				cart: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/ankou-with-cart/model.gltf',
				pumpkin:
					'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/jack-o-lantern/model.gltf'
			},
			licenceURL: 'https://creativecommons.org/licenses/by/2.0/'
			//  '#ff3399'
		};

		//  Models
		const ankouModel: any = null;
		const pumpkinModel: any = null;
		// Loaders
		const gltfLoader = new GLTFLoader();
		gltfLoader.load(
			parameters.modelsURL.cart,
			(gltf) => {
				let recursivelyFindHead = (obj: any) => {
					if (obj?.children) {
						const i = obj.children.findIndex(({ name }: any) => {
							return name === 'head';
						});
						console.log('i', i);
						if (i >= 0) {
							obj.children[i].scale.set(0.001, 0.001, 0.001);
							console.log('head removed');
						} else {
							recursivelyFindHead(obj.children);
						}
					} else if (Array.isArray(obj)) {
						obj.forEach((c) => {
							recursivelyFindHead(c);
						});
					}
				};
				recursivelyFindHead(gltf.scene);
				scene.add(gltf.scene);
				sceneReady = true;
			},
			() => {
				// console.log('loading');
				sceneReady = false;
			},
			() => {
				console.log('load error');
			}
		);
		gltfLoader.load(
			parameters.modelsURL.pumpkin,
			(gltfPumpkin) => {
				gltfPumpkin.scene.scale.set(0.5, 0.5, 0.5);
				gltfPumpkin.scene.position.y = 2.55;
				scene.add(gltfPumpkin.scene);

				sceneReady = true;
			},
			() => {
				// console.log('loading');
				sceneReady = false;
			},
			() => {
				console.log('load error');
			}
		);
		// Meshes
		const platform = new THREE.Mesh(
			new THREE.BoxGeometry(10, 0.1, 10),
			new THREE.MeshStandardMaterial({ color: parameters.color })
		);
		platform.receiveShadow = true;
		// Light
		const ambientLight = new THREE.AmbientLight('#aaaaaa');
		ambientLight.castShadow = true;
		const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
		directionalLight.shadow.mapSize.set(1024, 1024);
		directionalLight.position.set(3, 3, 6);
		// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
		// Scene
		const scene = new THREE.Scene();
		scene.add(platform, ambientLight, directionalLight);
		// Camera
		const camera = new THREE.PerspectiveCamera(75, parameters.aspectRatio);
		camera.position.set(0, 2, 4);
		const control = new OrbitControls(camera, canvas);
		control.enableDamping = true;

		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
		renderer.setSize(parameters.width, parameters.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		// Play
		const clock = new THREE.Clock();
		let tickId = 0;
		function tick() {
			const elapsedTime = clock.getElapsedTime();

			// Control
			control.update();

			sceneReady && renderer.render(scene, camera);
			tickId = window.requestAnimationFrame(tick);
		}
		tick();
		// Dispose
		function disposeScene() {
			function disposeAll(node: any) {
				if (node.isMesh || node instanceof THREE.Mesh) {
					// node.material?.envMap?.dispose();
					if (node.type === 'SkinnedMesh') {
						console.log(node);
						node.material?.map?.dispose();
					}
					node.material?.dispose();
					console.log(node.material);
					node.geometry?.dispose();
					console.log(`Disposed ${node.type} G:${node.geometry.type} M:${node.material.type} `);
				} else if (node.isLight || node instanceof THREE.Light) {
					node.dispose();
					console.log(`Disposed ${node.type}`);
				} else if (node.isTexture || node instanceof THREE.Texture) {
					node.dispose();
					console.log(`Disposed ${node.type}`);
				}
			}
			scene.traverse(disposeAll);
			// mixer?.dispose();
			scene.clear();
			scene.removeFromParent();
			control.dispose();
			console.log(`disposed first project allocated resources`, renderer.info);
			console.log(`GUI destroyed`);
			console.log(`tickId`, tickId);
			window.cancelAnimationFrame(tickId);
			console.log(`Tick disposed`);
			renderer.clear();
			renderer.dispose();
			console.log(`Renderer cleared and`);
		}
		return disposeScene;
	});
</script>

<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		border: none;
		box-shadow: none;
		margin: 0 5vw;
	}
</style>
