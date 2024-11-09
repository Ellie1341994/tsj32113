<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import gsap from 'gsap';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	onMount(() => {
		// Utils
		const parameters = {
			color: '#994f7a',
			get width() {
				return innerWidth * 0.75;
			},
			get height() {
				return innerHeight * 0.75;
			},
			get aspect_ratio() {
				return this.width / this.height;
			},
			assets_path: '/assets/advanced/23',
			modelLoadReady: false
		};
		// Meshes
		const cylinderMesh = new THREE.Mesh(
			new THREE.CylinderGeometry(3, 2.5, 0.5, 64, 1, true),
			new THREE.MeshStandardMaterial({
				color: '#fff',
				metalness: 0.6,
				roughness: 0.6,
				side: THREE.DoubleSide
			})
		);
		cylinderMesh.castShadow = true;
		cylinderMesh.receiveShadow = true;
		cylinderMesh.position.y = 0.4; // circle position plus half cylinder's height for both meshes to match positionally
		const circleMesh = new THREE.Mesh(
			new THREE.CircleGeometry(2.5, 128, 0, Math.PI * 2),
			new THREE.MeshStandardMaterial({
				color: '#fff',
				metalness: 0.6,
				roughness: 0.6,
				side: THREE.DoubleSide
			})
		);
		circleMesh.receiveShadow = true;
		// dishMesh.castShadow = true;
		circleMesh.rotation.x = Math.PI * 0.5;
		circleMesh.position.y = 0.15;
		const dishMesh = new THREE.Group();
		dishMesh.add(circleMesh, cylinderMesh);
		// Particles
		const particlesGeometry = new THREE.BoxGeometry(10, 10, 10, 64, 64, 64);
		const particlesMaterial = new THREE.PointsMaterial({
			size: 0.1,
			sizeAttenuation: true,
			color: '#aa99aa'
		});

		const particles = new THREE.Points(particlesGeometry, particlesMaterial);
		particles.castShadow = true;
		particles.rotation.x = Math.PI * 0.5;
		particles.position.y = 1;
		// Lights
		const d = 25;
		const ambientLight = new THREE.AmbientLight('#ffffff');
		const directionalLight = new THREE.DirectionalLight('#ffffff', 2);
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.set(1024, 1024);
		directionalLight.shadow.camera.near = 1;
		directionalLight.shadow.camera.far = d;
		directionalLight.shadow.camera.left = -d;
		directionalLight.shadow.camera.right = d;
		directionalLight.shadow.camera.top = d;
		directionalLight.shadow.camera.bottom = -d;
		directionalLight.position.set(2.5, 6, 8);
		let hamburgerModel: any = undefined;
		// Raycaster
		const raycaster = new THREE.Raycaster();
		// Scene
		const scene = new THREE.Scene();
		scene.background = new THREE.Color('#993333');
		scene.add(dishMesh, particles, ambientLight, directionalLight);
		gsap.to(scene.rotation, { y: Math.PI, duration: 3.6, repeat: -1, yoyo: true });
		// Coords
		let mouse = new THREE.Vector2(0, 0);
		const setMousePosition = (event: MouseEvent) => {
			mouse.x = ((event.clientX - canvas.offsetLeft) / parameters.width) * 2 - 1;
			mouse.y = -((event.clientY - canvas.offsetTop) / parameters.height) * 2 + 1;
		};
		canvas.addEventListener('mousemove', setMousePosition);
		const triggerHamburgerAnimation = (event: MouseEvent) => {
			raycaster.setFromCamera(mouse, camera);
			const intersect = raycaster.intersectObject(hamburgerModel);
			if (event.button === 0 && hamburgerReady && intersect.length) {
				gsap.to(hamburgerModel.scale, { x: 2, z: 2, duration: 1 });
				gsap.to(hamburgerModel.scale, { x: 1, z: 1, duration: 1, delay: 1 });
				gsap.to(camera.rotation, { z: 0, duration: 0.5 });
			} else if (event.button === 1) {
				gsap.to(camera.rotation, { z: -Math.PI * 0.25, duration: 0.5 });
			} else {
				gsap.to(camera.rotation, { z: -camera.rotation.z, duration: 0.5 });
			}
		};
		canvas.addEventListener('mousedown', triggerHamburgerAnimation);
		// Loader
		let hamburgerReady = false;
		const gltfLoader = new GLTFLoader();
		const dracoLoader = new DRACOLoader();
		gltfLoader.setDRACOLoader(dracoLoader);
		dracoLoader.setDecoderPath('/assets/draco/');
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
		camera.rotation.x = -Math.PI * 0.2;
		camera.rotation.z = Math.PI * 0.25;
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.setSize(parameters.width, parameters.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		// Extras
		const setRendererSize = () => {
			console.log('Window size has changed.');
			// Camera AR update
			camera.aspect = parameters.width / parameters.height;
			camera.updateProjectionMatrix();

			// Renderer
			renderer.setSize(parameters.width, parameters.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
			renderer.render(scene, camera);
		};
		addEventListener('resize', setRendererSize);
		// Play
		const clock = new THREE.Clock();
		let tickId = 0;
		scene.scale.set(2, 2, 2);
		function tick() {
			// Animate

			// render
			renderer.render(scene, camera);

			// else
			tickId = requestAnimationFrame(tick);
		}
		tick();
		// Dispose
		function disposeScene() {
			removeEventListener('resize', setRendererSize);
			console.log(particles);
			window.cancelAnimationFrame(tickId);
			function disposeAll(node: any) {
				if (node.isMesh || node.isPoints) {
					node.material?.dispose();
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
			console.log('renderer.info', renderer.info);
			scene.traverse(disposeAll);
			scene.clear();
			scene.removeFromParent();
			console.log(`GUI destroyed`);
			console.log(`tickId`, tickId);
			console.log(`Tick disposed`);
			renderer.clear();
			renderer.dispose();
			console.log(`renderer.disposed`, renderer.info);
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
</style>
