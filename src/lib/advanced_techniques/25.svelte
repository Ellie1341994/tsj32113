<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import gsap from 'gsap';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import GUI from 'lil-gui';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	const wideScreen = innerWidth > 888;
	onMount(() => {
		// Utils
		const parameters = {
			s: 0,
			get width() {
				return innerWidth * 0.75;
			},
			get height() {
				return innerHeight * 0.75;
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
		// Extras
		const setRendererSize = () => {
			// console.log('Window size has changed.');
			// Camera AR update
			camera.aspect = parameters.aspectRatio;
			camera.updateProjectionMatrix();
			// Renderer
			renderer.setSize(parameters.width, parameters.height);
			renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
			renderer.render(scene, camera);
		};
		addEventListener('resize', setRendererSize);
		gui.close();
		// Textures
		const textureLoader = new THREE.TextureLoader();
		const woodARMTexture = textureLoader.load(
			'/assets/advanced/25/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg'
		);
		const woodDiffTexture = textureLoader.load(
			'/assets/advanced/25/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg'
		);
		woodDiffTexture.colorSpace = THREE.SRGBColorSpace;
		const woodNorTexture = textureLoader.load(
			'/assets/advanced/25/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png'
		);
		const castleARMTexture = textureLoader.load(
			'/assets/advanced/25/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg'
		);
		const castleDiffTexture = textureLoader.load(
			'/assets/advanced/25/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg'
		);
		castleDiffTexture.colorSpace = THREE.SRGBColorSpace;

		const castleNorTexture = textureLoader.load(
			'/assets/advanced/25/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png'
		);
		// Loader
		// HDRI (RGBE Equirectangular)
		const rgbeLoader = new RGBELoader();
		rgbeLoader.load('/assets/advanced/25/environmentMaps/0/2k.hdr', (environmentMap) => {
			environmentMap.mapping = THREE.EquirectangularReflectionMapping;
			scene.background = environmentMap;
			scene.environment = environmentMap;
		});
		// Meshes
		const woodPlane = new THREE.Mesh(
			new THREE.PlaneGeometry(32, 32),
			new THREE.MeshStandardMaterial({
				normalMap: woodNorTexture,
				aoMap: woodARMTexture,
				metalnessMap: woodARMTexture,
				roughnessMap: woodARMTexture,
				map: woodDiffTexture,
				side: THREE.DoubleSide
			})
		);
		woodPlane.name = 'woodPlane';
		woodPlane.receiveShadow = true;
		woodPlane.rotation.x = -Math.PI * 0.5;
		const castlePlane = new THREE.Mesh(
			new THREE.PlaneGeometry(32, 32),
			new THREE.MeshStandardMaterial({
				normalMap: castleNorTexture,
				aoMap: castleARMTexture,
				metalnessMap: castleARMTexture,
				roughnessMap: castleARMTexture,
				map: castleDiffTexture,
				side: THREE.DoubleSide
			})
		);
		castlePlane.name = 'castlePlane';
		castlePlane.position.z = -16;
		castlePlane.position.y = 16;
		castlePlane.receiveShadow = true;

		// Models
		const gltfLoader = new GLTFLoader();
		gltfLoader.load(
			'/assets/advanced/24/FlightHelmet/glTF/FlightHelmet.gltf',
			(gltfFlightHelmet) => {
				gltfFlightHelmet.scene.scale.setScalar(25);
				gltfFlightHelmet.scene.traverse((node) => {
					// @ts-ignore
					if (node.isMesh) {
						node.castShadow = true;
						node.receiveShadow = true;
					}
				});
				scene.add(gltfFlightHelmet.scene);
			}
		);
		const dracoLoader = new DRACOLoader();
		gltfLoader.setDRACOLoader(dracoLoader);
		dracoLoader.setDecoderPath('/assets/draco/');
		gltfLoader.load(`/assets/advanced/23/tsjHamburger.glb`, (hamburgerGltf) => {
			hamburgerGltf.scene.traverse((node) => {
				// @ts-ignore
				if (node.isMesh) {
					node.receiveShadow = true;
					node.castShadow = true;
				}
			});
			hamburgerGltf.scene.scale.setScalar(5);
			hamburgerGltf.scene.position.y = 20;
			scene.add(hamburgerGltf.scene);
			gsap.to(hamburgerGltf.scene.rotation, {
				y: 2 * Math.PI,
				duration: 3.6,
				repeat: -1, // Infinite repeat
				ease: 'linear'
			});
		});
		// // Lights
		// const ambientLight = new THREE.AmbientLight('#ffffff');
		const directionalLight = new THREE.DirectionalLight('#ffffff', 6);
		directionalLight.castShadow = true;
		directionalLight.position.set(-15, 30, 25);
		directionalLight.target.position.set(0, 10, 0);
		directionalLight.target.updateMatrixWorld();
		directionalLight.shadow.camera.near = 1;
		directionalLight.shadow.camera.far = 75;
		directionalLight.shadow.camera.left = -25;
		directionalLight.shadow.camera.right = 25;
		directionalLight.shadow.camera.top = 25;
		directionalLight.shadow.camera.bottom = -25;
		directionalLight.shadow.mapSize.setScalar(512);
		directionalLight.shadow.normalBias = 0.03;
		directionalLight.shadow.bias = -0.005;
		gui.add(directionalLight, 'castShadow');
		gui.add(directionalLight, 'intensity', 0, 10, 0.01).name('lightIntensity');
		gui.add(directionalLight.position, 'x', -1000, 1000, 1).name('directionalLight position x');
		gui.add(directionalLight.position, 'y', -1000, 1000, 1).name('directionalLight position y');
		gui.add(directionalLight.position, 'z', -1000, 1000, 1).name('directionalLight position z');
		gui.add(directionalLight.shadow, 'normalBias', -0.05, 0.05, 0.001);
		gui.add(directionalLight.shadow, 'bias', -0.05, 0.05, 0.001);
		const directionalLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
		directionalLightShadowHelper.visible = false;
		gui.add(directionalLightShadowHelper, 'visible').name('directionalLightShadowHelper visbility');
		// Scene
		const scene = new THREE.Scene();
		scene.add(directionalLight, woodPlane, castlePlane, directionalLightShadowHelper);
		// Camera
		// Cube camera
		// Normal
		const camera = new THREE.PerspectiveCamera(75, parameters.aspectRatio);
		camera.position.set(0, 35, 35);
		const control = new OrbitControls(camera, canvas);
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		renderer.setSize(parameters.width, parameters.height);
		renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
		//  Tone mapping
		renderer.toneMapping = THREE.ReinhardToneMapping;
		renderer.toneMappingExposure = 1;
		gui.add(renderer, 'toneMapping', {
			No: THREE.NoToneMapping,
			Linear: THREE.LinearToneMapping,
			Reinhard: THREE.ReinhardToneMapping,
			Cineon: THREE.CineonToneMapping,
			ACESFilmic: THREE.ACESFilmicToneMapping
		});
		gui.add(renderer, 'toneMappingExposure', 0, 10, 0.1).name('toneMappingExposure');

		// Play
		let tickId = 0;
		function tick() {
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
					// node.material.normalMap;
					// node.material.aoMap?.dispose();
					// node.material.metalnessMap?.dispose();
					// node.material.roughnessMap?.dispose();
					// node.material.map?.dispose();
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
			woodARMTexture.dispose();
			woodDiffTexture.dispose();
			woodNorTexture.dispose();
			castleARMTexture.dispose();
			castleDiffTexture.dispose();
			castleNorTexture.dispose();
			directionalLightShadowHelper.dispose();
			dracoLoader.dispose();
			control.dispose();
			scene.environment?.dispose;
			scene.traverse(disposeAll);
			gui.destroy();
			renderer.dispose();
			console.log(`Experience ended`, renderer.info);
		}
		// console.log(renderer.info.memory);
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
