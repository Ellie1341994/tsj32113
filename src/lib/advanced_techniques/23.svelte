<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import gsap from 'gsap';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
	import { nodeArray } from 'three/webgpu';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	onMount(() => {
		// Utils
		const parameters = {
			color: '#994f7a',
			width: innerWidth * 0.75,
			height: innerHeight * 0.75,
			get aspect_ratio() {
				return this.width / this.height;
			},
			assets_path: '/assets/advanced/23',
			modelLoadReady: false
		};
		// Meshes
		const dishMesh = new THREE.Mesh(
			new THREE.CircleGeometry(2.5, 128, 0, Math.PI * 2),
			new THREE.MeshStandardMaterial({
				color: '#fff',
				metalness: 0.6,
				roughness: 0.6,
				side: THREE.DoubleSide
			})
		);
		dishMesh.receiveShadow = true;
		// dishMesh.castShadow = true;
		dishMesh.rotation.x = Math.PI * 0.5;
		dishMesh.position.y = 0.15;
		// Lights
		const ambientLight = new THREE.AmbientLight('#ffffff');
		ambientLight.castShadow = true;
		const directionalLight = new THREE.DirectionalLight('#ffffff', 2);
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.set(1024, 1024);
		// directionalLight.shadow.camera.near = 1;
		// directionalLight.shadow.camera.far = 15;
		// directionalLight.shadow.camera.left = -15;
		// directionalLight.shadow.camera.right = 15;
		// directionalLight.shadow.camera.top = 15;
		// directionalLight.shadow.camera.bottom = -15;
		directionalLight.position.set(0, 6, 3);
		let hamburgerModel: any = undefined;
		// Raycaster
		const raycaster = new THREE.Raycaster();
		// Scene
		const scene = new THREE.Scene();
		scene.add(dishMesh, ambientLight, directionalLight);
		gsap.to(scene.rotation, { y: Math.PI, duration: 3.6, repeat: -1, yoyo: true });
		// Coords
		let mouse = new THREE.Vector2(0, 0);
		canvas.addEventListener('mousemove', (event) => {
			mouse.x = ((event.clientX - canvas.offsetLeft) / parameters.width) * 2 - 1;
			mouse.y = -((event.clientY - canvas.offsetTop) / parameters.height) * 2 + 1;
		});
		canvas.addEventListener('click', (event) => {
			const intersect = raycaster.intersectObject(hamburgerModel);
			console.log(intersect);
			if (hamburgerReady && intersect.length) {
				gsap.to(hamburgerModel.scale, { x: 2, z: 2, duration: 1 });
				gsap.to(hamburgerModel.scale, { x: 1, z: 1, duration: 1, delay: 1 });
			}
		});
		// Loader
		let hamburgerReady = false;
		const gltfLoader = new GLTFLoader();
		const dracoLoader = new DRACOLoader();
		gltfLoader.setDRACOLoader(dracoLoader);
		dracoLoader.setDecoderPath('../../node_modules/three/examples/jsm/libs/draco/');
		gltfLoader.load(`${parameters.assets_path}/tsjHamburger.glb`, (hamburgerGltf) => {
			hamburgerGltf.scene.traverse((node) => {
				// @ts-ignore
				if (node.isMesh) {
					node.receiveShadow = true;
					node.castShadow = true;
				}
			});
			hamburgerModel = hamburgerGltf.scene;
			scene.add(hamburgerGltf.scene);

			hamburgerReady = true;
		});
		// Camera
		const camera = new THREE.PerspectiveCamera(75, parameters.aspect_ratio);
		camera.position.set(0, 6, 9);
		const control = new OrbitControls(camera, canvas);
		control.enableDamping = true;
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.setSize(parameters.width, parameters.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		// Play
		const clock = new THREE.Clock();
		let currentIntersect: any = null;
		let tickId = 0;
		scene.scale.set(2, 2, 2);
		function tick() {
			// Updates
			control.update();

			// Animate
			const elapsedTime = clock.getElapsedTime();
			raycaster.setFromCamera(mouse, camera);

			// render
			renderer.render(scene, camera);

			// else
			tickId = requestAnimationFrame(tick);
		}
		tick();
		// Dispose
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
</style>
