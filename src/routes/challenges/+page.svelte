<script lang="ts">
	import gsap from 'gsap';
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
			width: innerWidth * 1,
			height: innerHeight * 1,
			color: '#999999'
		};
		const ASPECT_RATIO = parameters.width / parameters.height;
		const ASSETS_PATH = '/assets/challenges';
		// Loader
		const gltfLoader = new GLTFLoader();
		// Models
		const dracoLoader = new DRACOLoader();
		gltfLoader.setDRACOLoader(dracoLoader);
		gltfLoader.load(
			`${ASSETS_PATH}/cinemaChair.glb`,
			(gltf) => {
				// Set Cinema Chairs
				const originalMesh = gltf.scene.children[0].children[0] as THREE.Mesh;
				const geometry = originalMesh.geometry;
				const material = originalMesh.material as THREE.MeshStandardMaterial;
				material.metalness = 0.5; // Ambient light won't work on materials fully metallic
				const instanceCount = 18; // Equals chair count
				const instancedMesh = new THREE.InstancedMesh(geometry, material, instanceCount);
				instancedMesh.receiveShadow = true;
				const matrix = new THREE.Matrix4();
				// Rotation
				const eulerRotation = new THREE.Euler(0, Math.PI, 0);
				matrix.makeRotationFromEuler(eulerRotation);
				// Position
				for (
					let chairIndex = 0, chairPosX = -5, chairPosZ = 0;
					chairIndex < instanceCount;
					chairIndex++, chairPosX++
				) {
					if ([3, 9, 15].some((n) => n === chairIndex)) {
						chairPosX += 5; // step for middle space
					} else if ([6, 9, 12].some((n) => n === chairIndex)) {
						chairPosZ++;
						chairPosX = -5;
					}
					matrix.setPosition(chairPosX, 0, chairPosZ); // Set position for each instance

					instancedMesh.setMatrixAt(chairIndex, matrix);
				}
				// Add Chairs
				scene.add(instancedMesh);

				sceneReady = true;
				console.log(gltf.scene);
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
		const axis = new THREE.AxesHelper(5);
		const geometry = new THREE.PlaneGeometry(2, 8);
		const material = new THREE.MeshStandardMaterial({ color: '#661111', side: THREE.DoubleSide });
		const carpetPlaceholderMesh = new THREE.Mesh(geometry, material);
		carpetPlaceholderMesh.rotateX(Math.PI * 0.5);
		carpetPlaceholderMesh.position.set(0, -0.5, 0);
		// Light
		const ambientLight = new THREE.AmbientLight('#aaaaaa', 6);
		const directionalLight = new THREE.DirectionalLight('#ffffff', 3);

		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.set(1024, 1024);
		directionalLight.position.set(3, 3, 6);
		// Scene
		const scene = new THREE.Scene();
		scene.add(directionalLight, carpetPlaceholderMesh);
		// Camera
		const camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO);
		camera.position.set(0, 1, 6);
		const control = new OrbitControls(camera, canvas);
		control.enableDamping = true;

		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.setSize(parameters.width, parameters.height);
		renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

		// Play
		// gsap.to(scene.rotation, { y: Math.PI * 2, duration: 15, repeat: -1, yoyo: true });
		const clock = new THREE.Clock();
		let previousElapsedTime = clock.getElapsedTime();
		let tickId = 0;
		function tick() {
			const elapsedTime = clock.getElapsedTime();
			previousElapsedTime = elapsedTime;

			// Control
			control.update();

			sceneReady && renderer.render(scene, camera);
			tickId = requestAnimationFrame(tick);
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
			cancelAnimationFrame(tickId);
			console.log(`Tick disposed`);
			renderer.clear();
			renderer.dispose();
			console.log(`Renderer cleared and`);
		}
		return disposeScene;
	});
</script>

<canvas class="webgl" bind:this={canvas}></canvas>

<!-- Provisional nav link to challenges  -->
<main>
	<h1><a href="/challenges/halloween">Halloween challenge</a></h1>
	<h1><a href="/challenges/christmas">Christmas challenge</a></h1>
</main>

<style lang="scss">
	main {
		position: fixed;
		top: 0;
		width: 100vw;
		height: 10vh;
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin: 0;
		padding: 0;
		h1 {
			font-size: 27px;
			a {
				font-weight: bold;
				color: var(--color-theme-3);
				text-shadow: 2px 2px 4px gray;
			}
		}
	}
	canvas {
		border: none;
		box-shadow: none;
	}
</style>
