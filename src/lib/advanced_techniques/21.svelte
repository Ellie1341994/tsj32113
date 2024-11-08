<script lang="ts">
	import gsap from 'gsap';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	onMount(() => {
		// Utils
		let sceneReady = false;
		const parameters = {
			width: window.innerWidth * 0.75,
			height: window.innerHeight * 0.75,
			color: '#999999'
			//  '#ff3399'
		};
		const ASPECT_RATIO = parameters.width / parameters.height;
		const ASSETS_PATH = '/assets/advanced/21/models';
		// Loader
		const gltfLoader = new GLTFLoader();
		// Models
		const dracoLoader = new DRACOLoader();
		// dracoLoader.setDecoderPath('/assets/advanced/21/workers/draco/');
		// dracoLoader.setDecoderPath('/assets/advanced/21/workers/draco/');
		// dracoLoader.setDecoderPath('../../node_modules/three/examples/jsm/libs/draco/');
		gltfLoader.setDRACOLoader(dracoLoader);
		let mixer: any = null;
		let actions: any = null;
		gltfLoader.load(
			// `${ASSETS_PATH}/Duck/glTF/Duck.gltf`,
			// `${ASSETS_PATH}/Duck/glTF-Binary/Duck.glb`,
			// `${ASSETS_PATH}/FlightHelmet/glTF/FlightHelmet.gltf`,
			// `${ASSETS_PATH}/Duck/glTF-Draco/Duck.gltf`,
			`${ASSETS_PATH}/Fox/glTF/Fox.gltf`,
			(gltf) => {
				// scene.add(gltf.scene.children[0]); //Duck
				// for (const child of gltf.scene.children) {
				// 	child.scale.set(0.05, 0.05, 0.05);
				// }
				// scene.add(...gltf.scene.children);
				// const [fox]: any = gltf.scene.children[0].children;
				// console.log(fox);
				// fox.material.color.set(new THREE.Color(parameters.color));
				gltf.scene.traverse((node) => {
					// @ts-ignore
					if (node.isMesh) {
						node.receiveShadow = true;
						node.castShadow = true;
					}
				});
				gltf.scene.scale.set(0.05, 0.05, 0.05);
				mixer = new THREE.AnimationMixer(gltf.scene);
				actions = gltf.animations;
				// const action = mixer.clipAction(gltf.animations[2]);
				// action.play();
				scene.add(gltf.scene);
				sceneReady = true;
				console.log('loaded');
			},
			() => {
				console.log('loading');
			},
			() => {
				console.log('load error');
			}
		);
		// Meshes
		const platform = new THREE.Mesh(
			new THREE.BoxGeometry(10, 0.1, 10),
			new THREE.MeshStandardMaterial({ color: parameters.color, metalness: 0.5, roughness: 0.7 })
		);
		platform.receiveShadow = true;
		const anotherPlatform = platform.clone();
		anotherPlatform.rotation.y = Math.PI * 0.25;
		// platform.castShadow = true;
		// Light
		const ambientLight = new THREE.AmbientLight('#aaaaaa');
		const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.set(1024, 1024);
		directionalLight.position.set(3, 3, 6);
		// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
		// Scene
		const scene = new THREE.Scene();
		scene.add(platform, anotherPlatform, ambientLight, directionalLight);
		// Camera
		const camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO);
		camera.position.set(0, 3, 9);
		const control = new OrbitControls(camera, canvas);
		control.enableDamping = true;

		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.setSize(parameters.width, parameters.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		// Play
		gsap.to(scene.rotation, { y: Math.PI * 2, duration: 15, repeat: -1, yoyo: true });
		const clock = new THREE.Clock();
		let previousElapsedTime = clock.getElapsedTime();
		let prolongatedElapsedTime = clock.getElapsedTime();
		let animationTriggeringSeconds = 3;
		let animationIndex = 0;
		let tickId = 0;
		let action: any = null;
		function tick() {
			const elapsedTime = clock.getElapsedTime();
			const deltaTime = elapsedTime - previousElapsedTime;
			let prolongatedDeltaTime = elapsedTime - prolongatedElapsedTime;
			previousElapsedTime = elapsedTime;
			// Mixer
			if (sceneReady) {
				// action.play();
				if (prolongatedDeltaTime > animationTriggeringSeconds) {
					prolongatedElapsedTime = elapsedTime;
					prolongatedDeltaTime = 0;
					if (action) {
						action.stop();
					}
					action = mixer.clipAction(actions[animationIndex]);
					// action.setDuration(animationTriggeringSeconds);
					action.play();

					animationIndex += animationIndex < 2 ? 1 : -animationIndex;
				}
				mixer.update(deltaTime);
			}
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

<canvas class="webgl" bind:this={canvas}></canvas>
<span class="lil-gui-placer" bind:this={lilGuiPlacer}></span>

<style>
	span.lil-gui-placer {
		position: absolute;
		top: 20vh;
		right: 13.5vw;
	}
	canvas {
		border: none;
		box-shadow: none;
	}
</style>
