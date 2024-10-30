<script lang="ts">
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	let canvas: HTMLCanvasElement;
	// naked tree
	// https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-4-kaykit/model.gltf
	// bushy tree
	// https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-lime/model.gltf
	// simple pumpkin
	// https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/pumpkin-a/model.gltf
	// pointy tree
	// https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-spruce/model.gltf
	onMount(() => {
		// Utils
		let pumpkinReady = false;
		let ankouReady = false;
		let nakedTreeReady = false;
		let bushyTreeReady = false;
		let pointyTreeReady = false;
		const parameters = {
			point3d: new THREE.Vector3(0, 0, 5),
			cursor: { x: 0, y: 0 },
			movement: { forward: 0, backwards: 0, leftwards: 0, rightwards: 0, rotation: 0 },
			width: window.innerWidth,
			height: window.innerHeight,
			color: '#999999',
			get aspectRatio() {
				return this.width / this.height;
			},
			modelsURL: {
				cart: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/ankou-with-cart/model.gltf',
				pumpkin:
					'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/jack-o-lantern/model.gltf',
				nakedTree:
					'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-4-kaykit/model.gltf',
				pointyTree:
					'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-spruce/model.gltf',
				bushyTree:
					'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-lime/model.gltf'
			},
			licenceURL: 'https://creativecommons.org/licenses/by/2.0/'
			//  '#ff3399'
		};
		// GUI
		// const gui = new GUI({ title: 'Dev. Panel' });
		// Texture loader
		const imageFormat = '.jpg';
		const loadingManager = new THREE.LoadingManager();
		const textureLoader = new THREE.TextureLoader(loadingManager);
		const texturesRootPath = '/assets/halloween/Jungle_Floor';
		const albedoMap = textureLoader.load(`${texturesRootPath}/basecolor${imageFormat}`);
		albedoMap.colorSpace = THREE.SRGBColorSpace;
		albedoMap.repeat.set(1, 4);
		albedoMap.wrapT = THREE.RepeatWrapping;
		albedoMap.minFilter = THREE.NearestFilter;
		// albedoMap.magFilter = THREE.NearestFilter;
		const normalMap = textureLoader.load(`${texturesRootPath}/normal${imageFormat}`);
		const ambientOcclusionMap = textureLoader.load(
			`${texturesRootPath}/ambientOcclusion${imageFormat}`
		);
		// const heightMap = textureLoader.load(`${texturesRootPath}/height.png`);
		// const metalnessMap = textureLoader.load(`${texturesRootPath}/metallic${imageFormat}`);
		const roughnessMap = textureLoader.load(`${texturesRootPath}/roughness${imageFormat}`);
		//  Models
		let ankouModel: any = null;
		let pumpkinModel: any = null;
		let nakedTreeModel: any = null;
		let bushyTreeModel: any = null;
		let ankouAnimations: any = null;
		let mixer: any = null;
		// Loaders
		const gltfLoader = new GLTFLoader();
		gltfLoader.load(parameters.modelsURL.cart, (gltfAnoku) => {
			gltfAnoku.scene.traverse((node) => {
				// @ts-ignore
				if (node.isMesh) {
					node.castShadow = true;
					node.receiveShadow = true;
				}
				if (node.name === 'head') {
					node.scale.set(0.01, 0.01, 0.01);
				}
			});
			ankouAnimations = gltfAnoku.animations;
			mixer = new THREE.AnimationMixer(gltfAnoku.scene);
			gltfAnoku.scene.rotation.y = Math.PI * 0.5;
			ankouModel = gltfAnoku.scene;
			ankouModel.rotation.y = Math.PI * 0.65;
			scene.add(gltfAnoku.scene);
			ankouReady = true;
		});
		gltfLoader.load(parameters.modelsURL.pumpkin, (gltfPumpkin) => {
			// console.log('gltfPumpkin', gltfPumpkin);
			const pumpkinMesh = gltfPumpkin.scene.getObjectByName('jackolantern_big') as THREE.Mesh;
			pumpkinMesh.castShadow = true;
			pumpkinMesh.receiveShadow = true;
			// pumpkinMesh.scale.set(0.5, 0.5, 0.5);
			pumpkinMesh.position.set(1, 1, 4);
			pumpkinMesh.rotation.y = Math.PI * 0.5;
			pumpkinMesh.material = new THREE.MeshStandardMaterial({
				color: '#994600',
				metalness: 0.9,
				roughness: 0.6
			});
			pumpkinModel = pumpkinMesh;
			scene.add(pumpkinMesh);
			pumpkinReady = true;
		});
		gltfLoader.load(parameters.modelsURL.nakedTree, (gltfNakedTree) => {
			console.log('gltfNakedTree', gltfNakedTree);
			const nakedTreeMesh = gltfNakedTree.scene.getObjectByName('treeD_graveyard') as THREE.Mesh;
			nakedTreeMesh.castShadow = true;
			nakedTreeMesh.receiveShadow = true;
			// @ts-ignore
			// nakedTreeMesh.material?.dipose();
			nakedTreeMesh.material.copy(platformMaterial);
			// @ts-ignore
			// nakedTreeMesh.material.color = new THREE.Color('#994600');
			nakedTreeMesh.position.set(1, -1.5, -4);
			nakedTreeMesh.rotation.x = -Math.PI * 0.25;
			nakedTreeMesh.scale.set(1, 3, 2);
			scene.add(nakedTreeMesh);
			nakedTreeModel = nakedTreeMesh;
			nakedTreeReady = true;
		});
		gltfLoader.load(parameters.modelsURL.bushyTree, (gltfbushyTree) => {
			console.log('gltfbushyTree', gltfbushyTree);
			const treeLimeMesh = gltfbushyTree.scene.getObjectByName('tree-lime') as THREE.Mesh;
			treeLimeMesh.castShadow = true;
			treeLimeMesh.receiveShadow = true;
			// @ts-ignore
			// nakedTreeMesh.material?.dipose();
			treeLimeMesh.material.copy(platformMaterial);
			// @ts-ignore
			// nakedTreeMesh.material.color = new THREE.Color('#994600');
			treeLimeMesh.position.set(1, -2, 5);
			treeLimeMesh.rotation.x = Math.PI * 0.25;
			treeLimeMesh.scale.set(0.5, 0.25, 0.5);
			scene.add(treeLimeMesh);
			bushyTreeModel = treeLimeMesh;
			bushyTreeReady = true;
		});

		addEventListener('mousemove', (event) => {
			parameters.cursor.x = event.clientX;
			parameters.cursor.y = event.clientY;
			console.log(parameters.cursor);
			parameters.point3d.set(
				(parameters.cursor.x / parameters.width - 0.5) * 20,
				(-parameters.cursor.y / parameters.height + 0.5) * 10 + 2,
				camera.position.z
			);
			// console.log(camera);
		});
		// Meshes
		const platformMaterial = new THREE.MeshStandardMaterial({
			color: '#aa9977',
			wireframe: false,
			visible: true,
			map: albedoMap,
			aoMap: ambientOcclusionMap,
			roughnessMap,
			normalMap,
			metalness: 0.1,
			roughness: 0.9,

			side: THREE.DoubleSide
		});
		// const starOfDavidGeometry = new THREE.Geometry()
		const platformA = new THREE.Mesh(new THREE.CylinderGeometry(7, 3, 3, 7), platformMaterial);
		platformA.receiveShadow = true;
		platformA.material.side = THREE.DoubleSide;
		platformA.rotation.y = Math.PI;
		platformA.rotation.x = Math.PI;
		platformA.position.y = -1.5;
		// Light
		const pointLight = new THREE.PointLight(0xffff00, 5, 1.75);
		// gui.addColor(pointLight, 'color');
		const ambientLight = new THREE.AmbientLight('#aaaaaa');
		const directionalLight = new THREE.DirectionalLight('#ffffff', 5);
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.set(1024, 1024);
		directionalLight.shadow.camera.near = 1;
		directionalLight.shadow.camera.far = 15;
		directionalLight.position.set(-3, 6, -3);
		// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
		// Scene
		const scene = new THREE.Scene();

		scene.add(platformA, ambientLight, directionalLight, pointLight);
		scene.rotation.y = Math.PI * 1.5;
		// Camera
		const camera = new THREE.PerspectiveCamera(75, parameters.aspectRatio);
		camera.position.set(0, 6, 12);
		const control = new OrbitControls(camera, canvas);
		control.enableDamping = true;

		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.setSize(parameters.width, parameters.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		// Play
		const clock = new THREE.Clock();
		let tickId = 0;
		let previousElapsedTime = clock.getElapsedTime();
		// scene.add(new THREE.AxesHelper(100));
		const orbitHorizontalDistance = 4;
		const orbitVerticalDistance = 4;
		function tick() {
			const elapsedTime = clock.getElapsedTime();
			const deltaTime = elapsedTime - previousElapsedTime;
			previousElapsedTime = elapsedTime;
			control.update();
			let sceneReady = [pumpkinReady, ankouReady, nakedTreeReady, bushyTreeReady].every(
				(modelLoaded) => modelLoaded
			);
			// console.log(parameters.movement);
			if (sceneReady) {
				const valueBetweenAhaldAndNegativeHalf = parameters.cursor.x / parameters.width - 0.5;
				// ANKOU ANIMATION
				let m1 = scene.children[3];
				m1.position.set(
					parameters.movement.forward,
					scene.children[3].position.y,
					parameters.movement.rightwards
				);
				m1.rotation.y = parameters.movement.rotation;
				// Control
				let horseWalk = mixer.clipAction(ankouAnimations[2]);
				horseWalk?.play();
				let cartMove = mixer.clipAction(ankouAnimations[4]);
				cartMove.play();
				mixer.update(deltaTime);
				// PUMPKIN ANIMATION
				pumpkinModel.position.set(
					Math.cos(elapsedTime) * 8 * Math.abs(valueBetweenAhaldAndNegativeHalf),
					Math.cos(elapsedTime * 1.5) +
						orbitVerticalDistance -
						4 * Math.abs(valueBetweenAhaldAndNegativeHalf),
					Math.sin(elapsedTime) * 8 * Math.abs(valueBetweenAhaldAndNegativeHalf)
				);
				pumpkinModel.lookAt(camera.position);
				// POINT LIGHT ANIMATION
				pointLight.position.copy(pumpkinModel.position);
				// TREE ANIMATION
				nakedTreeModel.scale.set(
					1,
					3 - 4 * Math.abs(valueBetweenAhaldAndNegativeHalf),
					2 - 2 * Math.abs(valueBetweenAhaldAndNegativeHalf)
				);
				bushyTreeModel.rotation.y = Math.PI * valueBetweenAhaldAndNegativeHalf * 4;
				// console.log('point3d', point3d);
				// pumpkinModel.lookAt(parameters.point3d);
				renderer.render(scene, camera);
			}
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
		/* margin: 0 5vw; */
	}
</style>
