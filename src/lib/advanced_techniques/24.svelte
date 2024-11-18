<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import gsap from 'gsap';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import GUI from 'lil-gui';
	import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js';

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
			console.log('Window size has changed.');
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
		// Cube render target
		const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType });
		// Loader
		// const cubeTextureLoader = new THREE.CubeTextureLoader();
		//  Low Dynamic Range LDR Cube texture
		// const environmentMap = cubeTextureLoader.load([
		// 	'/assets/advanced/24/environmentMaps/2/px.png',
		// 	'/assets/advanced/24/environmentMaps/2/nx.png',
		// 	'/assets/advanced/24/environmentMaps/2/py.png',
		// 	'/assets/advanced/24/environmentMaps/2/ny.png',
		// 	'/assets/advanced/24/environmentMaps/2/pz.png',
		// 	'/assets/advanced/24/environmentMaps/2/nz.png'
		// ]);

		// HDRI (RGBE Equirectangular)
		// const rgbeLoader = new RGBELoader();
		// rgbeLoader.load(
		// 	'/assets/advanced/24/environmentMaps/customEnvMapLightsBlender-2k.hdr',
		// 	(environmentMap) => {
		// 		environmentMap.mapping = THREE.EquirectangularReflectionMapping;
		// 		scene.background = environmentMap;
		// 		scene.environment = environmentMap;
		// 	}
		// );
		// HDRI (EXR Equirectangular)
		// const exrLoader = new EXRLoader();
		// exrLoader.load('/assets/advanced/24/environmentMaps/nvidiaCanvas-4k.exr', (environmentMap) => {
		// 	environmentMap.mapping = THREE.EquirectangularReflectionMapping;
		// 	scene.background = environmentMap;
		// 	scene.environment = environmentMap;
		// });
		const textureLoader = new THREE.TextureLoader();
		const environmentMap = textureLoader.load(
			'/assets/advanced/24/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg'
		);
		// Ground projected skybox
		const skybox = new GroundedSkybox(environmentMap, 15, 25);
		skybox.layers.enable(1);
		skybox.position.y = 15;
		// gui.add(skybox, 'radius', 1, 200, 0.1).name('skyboxRadius');
		// gui.add(skybox, 'height', 1, 200, 0.1).name('skyboxHeight');
		gui.add(skybox.position, 'y', 0, 30, 0.1).name('skyboxPos');
		environmentMap.mapping = THREE.EquirectangularReflectionMapping;
		environmentMap.colorSpace = THREE.SRGBColorSpace;
		//  Real time environment map

		// Meshes
		const holyDonut = new THREE.Mesh(
			new THREE.TorusGeometry(15, 1, 12, 6),
			new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 5, 2) })
		);
		holyDonut.layers.enable(1);
		holyDonut.scale.setScalar(3);
		holyDonut.rotation.z = Math.PI * 0.5;
		gsap.to(holyDonut.rotation, {
			y: 2 * Math.PI,
			x: 2 * Math.PI,
			duration: 3.6,
			repeat: -1,
			ease: 'linear',
			animationFillMode: 'forwards'
		});
		gui.add(holyDonut, 'visible').name('TorusLightVisibility');
		const torusKnotMesh = new THREE.Mesh(
			new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
			new THREE.MeshStandardMaterial({
				color: '#ffffff',
				roughness: 0.1,
				metalness: 1
				// envMap: environmentMap
			})
		);
		torusKnotMesh.position.y = 25;
		torusKnotMesh.scale.setScalar(3);

		gsap.to(torusKnotMesh.rotation, {
			y: 2 * Math.PI,
			duration: 3.6,
			repeat: -1, // Infinite repeat
			ease: 'linear',
			animationFillMode: 'forwards'
		});
		// Models
		const gltfLoder = new GLTFLoader();
		gltfLoder.load(
			'/assets/advanced/24/FlightHelmet/glTF/FlightHelmet.gltf',
			(gltfFlightHelmet) => {
				gltfFlightHelmet.scene.scale.setScalar(25);
				scene.add(gltfFlightHelmet.scene);
			}
		);
		// // Lights
		// const ambientLight = new THREE.AmbientLight('#ffffff');
		// const directionalLight = new THREE.DirectionalLight('#ffffff');
		// directionalLight.castShadow = true;
		// // Scene
		const scene = new THREE.Scene();
		// scene.background = new THREE.MeshStandardMaterial({ color: '#333333' });
		scene.environment = cubeRenderTarget.texture;
		scene.add(skybox, torusKnotMesh, holyDonut);
		// scene.background = environmentMap;
		// scene.environment = environmentMap
		gui.add(scene, 'environmentIntensity', 0, 10, 0.01);
		// gui.add(scene, 'backgroundIntensity', 0, 5, 0.01);
		// gui.add(scene, 'backgroundBlurriness', 0, 1, 0.01);
		// gui
		// 	.add(scene.backgroundRotation, 'y', 0, Math.PI * 2, Math.PI * 0.01)
		// 	.name('backgroundRotationY');
		gui
			.add(scene.environmentRotation, 'y', 0, Math.PI * 2, Math.PI * 0.01)
			.name('environmentRotationY');
		// Camera
		// Cube camera
		const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
		cubeCamera.layers.set(1);

		// Normal
		const camera = new THREE.PerspectiveCamera(75, parameters.aspectRatio);
		camera.position.set(0, 35, 75);
		const control = new OrbitControls(camera, canvas);
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setClearAlpha(0.5);
		renderer.setSize(parameters.width, parameters.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		// Play
		let tickId = 0;
		function tick() {
			cancelAnimationFrame(tickId);
			// Update
			control.update();
			cubeCamera.update(renderer, scene);
			// Render
			renderer.render(scene, camera);
			tickId = requestAnimationFrame(tick);
		}
		tick();
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
			cubeRenderTarget.dispose();
			environmentMap.dispose();
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
	@media (max-width: 666px) {
		span.lil-gui-placer {
			position: absolute;
			top: 19vh;
			left: calc(12vw + 1.5vh);
			width: 10vw;
		}
	}
</style>
