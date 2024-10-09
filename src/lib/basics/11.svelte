<script lang="ts">
	// BIG NOTE: REMAINING MEMORY ALLOCATED SEEMS TO BE INTERNAT TO THREE.JS
	import gsap from 'gsap';
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	onMount(() => {
		// const LOADING_MANAGER = new THREE.LoadingManager();
		// const TEXTURE_LOADER = new THREE.TextureLoader(LOADING_MANAGER);
		const lessonAssetsPath = '/assets/basics/11/textures';
		// const COLOR_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/door/color.jpg`);
		// const MATCAP_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/matcaps/1.png`);
		// const ALPHA_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/door/alpha.jpg`);
		// const HEIGHT_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/door/height.jpg`);
		// const NORMAL_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/door/normal.jpg`);
		// const AMBIENT_OCCLUSION_TEXTURE = TEXTURE_LOADER.load(
		// 	`${lessonAssetsPath}/door/ambientOcclusion.jpg`
		// );
		// const METALNESS_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/door/metalness.jpg`);
		// const ROUGHNESS_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/door/roughness.jpg`);
		// const GRADIENT_TEXTURE = TEXTURE_LOADER.load(`${lessonAssetsPath}/gradients/3.jpg`);
		// COLOR_TEXTURE.colorSpace = THREE.SRGBColorSpace;
		// MATCAP_TEXTURE.colorSpace = THREE.SRGBColorSpace;

		// Debug UI
		const gui = new GUI({
			width: 300,
			title: 'Slider U.I Panel',
			closeFolders: false,
			container: lilGuiPlacer
		});
		// gui.close();
		const openGui = (event: any) => {
			event.key === 'h' && gui.show(gui._hidden);
		};
		window.addEventListener('keydown', openGui);

		const debugObject = {
			color: new THREE.Color(0x888888),
			segments: { width: 2 },
			scale: 0,
			spinPlane: () => {},
			planeToBox: () => {},
			spinRing: () => {}
		};
		// Sizes

		const sizes = {
			width: window.innerWidth * 0.75,
			height: window.innerHeight * 0.75
		};

		// Resizing feature
		const setCanvasSize = () => {
			console.log('Window size has changed.');
			// Scene size update
			sizes.width = window.innerWidth * 0.75;
			sizes.height = window.innerHeight * 0.75;
			// Camera AR update
			camera.aspect = sizes.width / sizes.height;
			camera.updateProjectionMatrix();

			// Renderer
			renderer.setSize(sizes.width, sizes.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
		};
		window.addEventListener('resize', setCanvasSize);

		// Full screen support feature
		const toggleFullscreen = () => {
			document.fullscreenElement ? document.exitFullscreen() : canvas?.requestFullscreen();
		};
		window.addEventListener('dblclick', toggleFullscreen);

		// Scene
		const scene = new THREE.Scene();

		// Objects
		// const GENERIC_MATERIAL = new THREE.MeshBasicMaterial({
		// color: debugObject.color,
		// map: COLOR_TEXTURE,
		// alphaMap: ALPHA_TEXTURE,
		// aoMap: AMBIENT_OCCLUSION_TEXTURE,

		// });
		// GENERIC_MATERIAL.transparent = true;// <- needed for opacity to work
		// GENERIC_MATERIAL.opacity = 0.5;

		// MeshNormalMaterial
		// const GENERIC_MATERIAL = new THREE.MeshNormalMaterial(); // Nice colours

		// MeshNormalMaterial
		// const GENERIC_MATERIAL = new THREE.c({matcap: MATCAP_TEXTURE}); // Fake lightning effect ( optimized)

		// MeshDepthMaterial
		// const GENERIC_MATERIAL = new THREE.MeshDepthMaterial(); // Mostly used for shadows

		// MeshLambertMaterial
		// const GENERIC_MATERIAL = new THREE.MeshLambertMaterial(); // Actual light processing
		// const AMBIENT_LIGHT = new THREE.AmbientLight(0xffffff,1);
		// scene.add(AMBIENT_LIGHT);
		// const POINT_LIGHT = new THREE.PointLight(0xffffff,30);
		// scene.add(POINT_LIGHT);
		// POINT_LIGHT.position.set(0,0, 3);

		// MeshPhongMaterial
		// const GENERIC_MATERIAL = new THREE.MeshPhongMaterial(); //  More features for lighting but less performant
		// const AMBIENT_LIGHT = new THREE.AmbientLight(0xffffff,1);
		// scene.add(AMBIENT_LIGHT);
		// const POINT_LIGHT = new THREE.PointLight(0xffffff,30);
		// scene.add(POINT_LIGHT);
		// POINT_LIGHT.position.set(1,0, 3);
		// GENERIC_MATERIAL.shininess = 100;
		// GENERIC_MATERIAL.specular = new THREE.Color(0x1188ff);

		// MeshToonMaterial
		// const GENERIC_MATERIAL = new THREE.MeshToonMaterial();
		// const AMBIENT_LIGHT = new THREE.AmbientLight(0xffffff, 1);
		// scene.add(AMBIENT_LIGHT);
		// const POINT_LIGHT = new THREE.PointLight(0xffffff, 30);
		// scene.add(POINT_LIGHT);
		// POINT_LIGHT.position.set(3, -1, 3);
		// GRADIENT_TEXTURE.minFilter = THREE.NearestFilter;
		// GRADIENT_TEXTURE.magFilter = THREE.NearestFilter;
		// GRADIENT_TEXTURE.generateMipmaps = false;
		// GENERIC_MATERIAL.gradientMap = GRADIENT_TEXTURE;

		// MeshStandardMaterial
		// const GENERIC_MATERIAL = new THREE.MeshStandardMaterial({
		//     map: COLOR_TEXTURE,
		//     aoMap: AMBIENT_OCCLUSION_TEXTURE,
		//     aoMapIntensity: 2,
		//     displacementMap: HEIGHT_TEXTURE,
		//     displacementScale: 0.1,
		//     metalnessMap: METALNESS_TEXTURE,
		//     roughnessMap: ROUGHNESS_TEXTURE,
		//     normalMap: NORMAL_TEXTURE,
		//     normalScale: new THREE.Vector2(0.5,0.5),
		//     transparent: true,
		//     alphaMap: ALPHA_TEXTURE,
		// });

		// GENERIC_MATERIAL.roughness = 1;
		// GENERIC_MATERIAL.metalness = 1;
		// const AMBIENT_LIGHT = new THREE.AmbientLight(0xffffff, 1);
		// scene.add(AMBIENT_LIGHT);
		// const POINT_LIGHT = new THREE.PointLight(0xffffff, 30);
		// scene.add(POINT_LIGHT);
		// POINT_LIGHT.position.set(3, -1, 3);
		// GENERIC_MATERIAL.roughness = 0.1; // values before using aoMap to roughness-metalness maps
		// GENERIC_MATERIAL.metalness = 0.8;

		// MeshPhysicalMaterial
		const GENERIC_MATERIAL = new THREE.MeshPhysicalMaterial({
			// map: COLOR_TEXTURE,
			// aoMap: AMBIENT_OCCLUSION_TEXTURE,
			// aoMapIntensity: 2,
			// displacementMap: HEIGHT_TEXTURE,
			// displacementScale: 0.1,
			// metalnessMap: METALNESS_TEXTURE,
			// roughnessMap: ROUGHNESS_TEXTURE,
			// normalMap: NORMAL_TEXTURE,
			// normalScale: new THREE.Vector2(0.5,0.5),
			// transparent: true,
			// alphaMap: ALPHA_TEXTURE,
			// clearcoat: 1,
			// clearcoatRoughness: 0,
			// sheen: 1,
			// sheenRoughness: 0,
			// sheenColor: new THREE.Color(1,1,1),
			// iridescence: 1,
			// iridescenceIOR: 1,
			// iridescenceThicknessRange: [ 100, 800 ],
			transmission: 1,
			ior: 4, // index of refraction
			thickness: 0.5
		});

		GENERIC_MATERIAL.roughness = 0;
		// GENERIC_MATERIAL.metalness = 0;
		// gui.add(GENERIC_MATERIAL, 'metalness', 0, 1, 0.1);
		// gui.add(GENERIC_MATERIAL, 'roughness', 0, 1, 0.1);
		// gui.add(GENERIC_MATERIAL, 'clearcoat', 0, 1, 0.1);
		// gui.add(GENERIC_MATERIAL, 'clearcoatRoughness', 0, 1, 0.1);
		// gui.add(GENERIC_MATERIAL, 'sheen', 0, 1, 0.1);
		// gui.add(GENERIC_MATERIAL, 'sheenRoughness', 0, 1, 0.1);
		// gui.addColor(GENERIC_MATERIAL, 'sheenColor');
		// gui.add(GENERIC_MATERIAL, 'iridescence').min(0).max(1).step(0.0001);
		// gui.add(GENERIC_MATERIAL, 'iridescenceIOR').min(1).max(2.333).step(0.0001);
		// gui.add(GENERIC_MATERIAL.iridescenceThicknessRange, '0').min(1).max(1000).step(1);
		// gui.add(GENERIC_MATERIAL.iridescenceThicknessRange, '1').min(1).max(1000).step(1);
		// gui.add(GENERIC_MATERIAL, 'transmission').min(0).max(1).step(0.0001);
		// gui.add(GENERIC_MATERIAL, 'ior').min(1).max(10).step(1);
		// gui.add(GENERIC_MATERIAL, 'thickness').min(0).max(1).step(0.0001);

		// Environment map
		const RGBE_LOADER = new RGBELoader();
		const environmentMapDataTexutre = RGBE_LOADER.load(
			`${lessonAssetsPath}/environmentMap/2k.hdr`,
			(environmentMap: THREE.Texture) => {
				environmentMap.mapping = THREE.EquirectangularReflectionMapping;
				scene.background = environmentMap;
				scene.environment = environmentMap;
			}
		);

		// For all Material types
		GENERIC_MATERIAL.side = THREE.DoubleSide;
		// Rinrg
		const RING = new THREE.Mesh(new THREE.TorusGeometry(1, 0.35, 32, 100), GENERIC_MATERIAL);
		RING.position.set(1.5, 0, 0);
		RING.scale.set(0.5, 0.5, 0.5);
		// Cube
		const PLANE = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), GENERIC_MATERIAL);
		PLANE.position.set(0, 0, 0);

		const SPHERE = new THREE.Mesh(new THREE.SphereGeometry(), GENERIC_MATERIAL);
		SPHERE.position.set(-1.5, 0, 0);
		SPHERE.scale.set(0.5, 0.5, 0.5);

		// Group;
		const group = new THREE.Group();
		group.add(RING, PLANE, SPHERE);
		// Aggregate
		// scene.add(PLANE, RING, SPHERE);
		scene.add(group);

		// Gui objects
		// const LIMITS = [-25, 25, 1]
		const [MIN, MAX, STEP, ALIAS] = [-25, 25, 1, 'Horizontal mov.'];
		gui.add(PLANE.position, 'x', MIN, MAX, STEP).name(ALIAS);

		gui.add(PLANE, 'visible');

		// Support for whole scale modification
		debugObject.scale = 0;
		gui
			.add(debugObject, 'scale', 0, 5, 0.1)
			.name('Scale all')
			.onChange(() => {
				PLANE.scale.set(3, 3, 3);
				PLANE.scale.x = debugObject.scale;
			});

		gui.add(PLANE.material, 'wireframe');
		// solution that properly matches the color picked in lil-ui and three js internal color managemenr
		gui.addColor(debugObject, 'color').onChange(() => {
			PLANE.material.color.set(debugObject.color);
		});

		// Adding segment slider and geometry change (a box with segments)
		debugObject.segments = { width: 1 };
		gui
			.add(debugObject.segments, 'width')
			.min(1)
			.max(4)
			.step(1)
			.name('Width segments')
			.onFinishChange((value: any) => {
				PLANE.geometry.dispose(); // it frees memory and avoids leaks from previously instanced entities
				// debugObject.segments.width = value;
				PLANE.geometry = new THREE.PlaneGeometry(1, 1, 1, value);
			});

		debugObject.spinPlane = () => {
			gsap.to(PLANE.rotation, { y: PLANE.rotation.y + Math.PI * 0.5 });
		};
		debugObject.planeToBox = () => {
			PLANE.geometry.dispose();
			PLANE.geometry =
				PLANE.geometry instanceof THREE.PlaneGeometry
					? new THREE.BoxGeometry(1, 1, 1)
					: new THREE.PlaneGeometry(1, 1, debugObject.segments.width);
		};

		debugObject.spinRing = () => {
			gsap.to(RING.rotation, { y: RING.rotation.y + Math.PI * 0.5 });
		};
		// simple button click spin animation on the gui
		// GUI Folder code for organization
		const MESH_TWEAKS = gui.addFolder('Animation Folder');
		MESH_TWEAKS.add(debugObject, 'spinPlane');
		MESH_TWEAKS.add(debugObject, 'spinRing');
		MESH_TWEAKS.add(debugObject, 'planeToBox');
		MESH_TWEAKS.close();
		// Camera
		const ASPECT_RATIO = sizes.width / sizes.height;
		const camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO, 1, 100);

		camera.position.set(0, 0, 5);
		camera.lookAt(PLANE.position);
		// Aggregate +
		scene.add(camera);

		// Renderer

		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
		renderer.setSize(sizes.width, sizes.height);

		// OrbitControl
		const control = new OrbitControls(camera, canvas);
		control.enableDamping = true;
		let tickId: number;
		const tick = () => {
			group.rotation.x += 0.01;
			group.rotation.y += 0.01;
			group.rotation.z += 0.01;
			control.update();
			renderer.render(scene, camera);
			tickId = window.requestAnimationFrame(tick);
		};
		console.log(renderer.info);
		tick();
		function disposeScene() {
			// COLOR_TEXTURE.dispose();
			// MATCAP_TEXTURE.dispose();
			// ALPHA_TEXTURE.dispose();
			// HEIGHT_TEXTURE.dispose();
			// NORMAL_TEXTURE.dispose();
			// AMBIENT_OCCLUSION_TEXTURE.dispose();
			// METALNESS_TEXTURE.dispose();
			// ROUGHNESS_TEXTURE.dispose();
			// GRADIENT_TEXTURE.dispose();
			// group.traverse(disposeAll);
			// group.clear();
			GENERIC_MATERIAL.dispose();
			function disposeAll(node: any) {
				if (node instanceof THREE.Mesh) {
					node.geometry?.dispose();
					node.material?.texture?.dispose();
					node.material?.dispose();
					console.log(`${node.type} disposed`);
				} else if (node instanceof THREE.Texture) {
					node?.dispose();
				}
				// console.log(`node`, node);
			}
			scene.traverse(disposeAll);
			// scene.environment?.dispose();
			environmentMapDataTexutre.dispose();
			scene.clear();
			scene.removeFromParent();
			control.dispose();
			console.log(`disposed first project allocated resources`, renderer.info);
			gui.destroy();
			console.log('GUI destroyed');
			console.log('tickId', tickId);
			window.cancelAnimationFrame(tickId);
			window.removeEventListener('resize', setCanvasSize);
			window.removeEventListener('dbclick', toggleFullscreen);
			window.removeEventListener('keydown', openGui);
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

<style>
	span.lil-gui-placer {
		position: absolute;
		top: 20vh;
		right: 13.5vw;
	}
</style>
