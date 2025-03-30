<script lang="ts">
	import gsap from 'gsap';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
	import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
	import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
	import GUI from 'lil-gui';
	// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
	let canvas: HTMLCanvasElement;
	onMount(() => {
		// Utils
		let sceneReady = false;
		const parameters = {
			width: innerWidth * 1,
			height: innerHeight * 1,
			color: '#999999',
			asset_path: '/assets/challenges',
			get aspect_ratio() {
				return this.width / this.height;
			}
		};
		const gui = new GUI({
			width: 300,
			closeFolders: true,
			title: 'Panel Tweaks'
		});
		// Loader
		const gltfLoader = new GLTFLoader();
		const textureLoader = new THREE.TextureLoader();
		// Models
		// const dracoLoader = new DRACOLoader();
		// gltfLoader.setDRACOLoader(dracoLoader);
		gltfLoader.load(
			`${parameters.asset_path}/cinemaChair.glb`,
			(gltf) => {
				// Set Cinema Chairs
				const originalMesh = gltf.scene.children[0].children[0] as THREE.Mesh;
				const geometry = originalMesh.geometry as THREE.BufferGeometry;
				const material = originalMesh.material as THREE.MeshStandardMaterial;
				material.metalness = 0.5; // Ambient light won't work on materials fully metallic
				console.log('geo', geometry);
				// rowks and columns should be even numbers
				const rows = 8;
				const columns = 12;
				const middleSpaceAmplitud = columns / 2 - 1; // should not be less than columns / 2
				const chairInitialPosX = middleSpaceAmplitud - columns;
				const chairInitialPosZ = -4;
				const instanceCount = rows * columns; // Equals chair count
				const instancedMesh = new THREE.InstancedMesh(geometry, material, instanceCount);
				instancedMesh.receiveShadow = true;
				const matrix = new THREE.Matrix4();
				// Rotation
				const eulerRotation = new THREE.Euler(0, Math.PI, 0);
				matrix.makeRotationFromEuler(eulerRotation);
				// Position
				const verticalPosition = (geometry.boundingBox!.max.y - geometry.boundingBox!.min.y) / 2;
				function generateChairBreakpoints(initialValue: number): number[] {
					return Array(rows)
						.fill(initialValue)
						.map((v, i) => v + i * columns);
				}
				for (
					let chairIndex = 0, chairPosX = chairInitialPosX, chairPosZ = chairInitialPosZ;
					chairIndex < instanceCount;
					chairIndex++, chairPosX++
				) {
					// step for empty middle space
					const middleSpaceBreakpoints = generateChairBreakpoints(columns / 2);
					const nextRowBreakpoints = generateChairBreakpoints(columns);
					if (middleSpaceBreakpoints.some((n) => n === chairIndex)) {
						chairPosX += Math.abs(chairPosX) * 2 + 1;
						// set row to base position and go up one column position
					} else if (nextRowBreakpoints.some((n) => n === chairIndex)) {
						chairPosZ++;
						chairPosX = chairInitialPosX;
					}
					matrix.setPosition(chairPosX, verticalPosition, chairPosZ); // Set position for each instance

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
		const wallNormalTexture = textureLoader.load(
			`/assets/lobby/textures/Wood_Wicker/Wood_Wicker_002_normal.jpg`
		);
		const wallHeightTexture = textureLoader.load(
			`/assets/lobby/textures/Wood_Wicker/Wood_Wicker_002_height.png`
		);
		const wallAOTexture = textureLoader.load(
			`/assets/lobby/textures/Wood_Wicker/Wood_Wicker_002_ambientOcclusion.jpg`
		);
		const wallRoughnessTexture = textureLoader.load(
			`/assets/lobby/textures/Wood_Wicker/Wood_Wicker_002_roughness.jpg`
		);
		const wallColorTexture = textureLoader.load(
			`/assets/lobby/textures/Wood_Wicker/Wood_Wicker_002_basecolor.jpg`
		);

		const floorNormalTexture = textureLoader.load(`/assets/lobby/textures/Wood_Floor/normal.png`);
		const floorHeightTexture = textureLoader.load(`/assets/lobby/textures/Wood_Floor/height.png`);
		const floorAOTexture = textureLoader.load(`/assets/lobby/textures/Wood_Floor/ao.png`);
		const floorRoughnessTexture = textureLoader.load(
			`/assets/lobby/textures/Wood_Floor/roughness.png`
		);
		const floorColorTexture = textureLoader.load(`/assets/lobby/textures/Wood_Floor/color.png`);
		[
			floorColorTexture,
			floorRoughnessTexture,
			floorAOTexture,
			floorHeightTexture,
			floorNormalTexture,
			wallColorTexture,
			wallRoughnessTexture,
			wallAOTexture,
			wallHeightTexture,
			wallNormalTexture
		].forEach((texture) => {
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set(3, 3);
			texture.rotation = THREE.MathUtils.degToRad(90);
		});
		// Meshes
		// Walls
		const wallGeometry = new THREE.PlaneGeometry(2 * 9, 9);
		const wallMaterial = new THREE.MeshStandardMaterial({
			// color: 'gray',
			map: wallColorTexture,
			aoMap: wallAOTexture,
			normalMap: wallNormalTexture,
			roughnessMap: wallRoughnessTexture
		});
		const wallVerticalPos = wallGeometry.parameters.height / 2;
		const westWall = new THREE.Mesh(wallGeometry, wallMaterial);
		westWall.position.set(-9, wallVerticalPos, 0);
		westWall.rotateY(Math.PI * 0.5);
		const eastWall = new THREE.Mesh(wallGeometry, wallMaterial);
		eastWall.position.set(9, wallVerticalPos, 0);
		eastWall.rotateY(-Math.PI * 0.5);
		const northWall = new THREE.Mesh(wallGeometry, wallMaterial);
		northWall.position.set(0, wallVerticalPos, -9);
		const southWall = new THREE.Mesh(wallGeometry, wallMaterial);
		southWall.position.set(0, wallVerticalPos, 9);
		southWall.rotateY(-Math.PI);
		const wallGroup = new THREE.Group();
		wallGroup.add(westWall, eastWall, southWall, northWall);
		// Floor
		const floorGeometry = new THREE.PlaneGeometry(2 * 9, 2 * 9);
		const floorMaterial = new THREE.MeshStandardMaterial({
			// color: 'gray',
			map: floorColorTexture,
			aoMap: floorAOTexture,
			normalMap: floorNormalTexture,
			roughnessMap: floorRoughnessTexture
		});
		const floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.rotateX(-Math.PI * 0.5);
		// Big Screen
		const cinemaScreenHeight = wallGeometry.parameters.height * 0.75;
		const cinemaScreenWidth = wallGeometry.parameters.width * 0.75;
		const bigCinemaScreenGeometry = new RoundedBoxGeometry(
			cinemaScreenWidth,
			cinemaScreenHeight,
			0.5,
			32,
			1
		);
		bigCinemaScreenGeometry.computeVertexNormals();

		const bigCinemaScreenMaterial = new THREE.MeshStandardMaterial({
			metalness: 1,
			roughness: 0
		});
		const bigCinemaScreen = new THREE.Mesh(bigCinemaScreenGeometry, bigCinemaScreenMaterial);
		// Setup
		bigCinemaScreen.position.set(0, 4.5, -8.75);
		// Carpet
		const geometry = new THREE.PlaneGeometry(2, 8);
		const material = new THREE.MeshStandardMaterial({ color: '#661111', side: THREE.DoubleSide });
		const carpetPlaceholderMesh = new THREE.Mesh(geometry, material);
		carpetPlaceholderMesh.rotateX(Math.PI * 0.5);
		carpetPlaceholderMesh.position.set(0, 0.01, 0);
		// Light
		const ambientLight = new THREE.AmbientLight('#aaaaaa', 0.25);
		const directionalLight = new THREE.DirectionalLight('#ffffff', 1);

		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.set(1024, 1024);
		directionalLight.position.set(3, 9, 6);
		RectAreaLightUniformsLib.init();
		const rAreaLight = new THREE.RectAreaLight(
			'#ffffff',
			0,
			cinemaScreenWidth * 0.95,
			cinemaScreenHeight * 0.9
		);
		rAreaLight.position.set(0, 4.5, -8.49);
		rAreaLight.rotateY(Math.PI);
		gui
			.add(rAreaLight, 'intensity', 0, 1, 0.1)
			.name('Big Screen intensity')
			.onChange((v: number) => {
				directionalLight.intensity = 1 - v;
			});
		// Scene
		const scene = new THREE.Scene();
		scene.add(
			// ambientLight,
			directionalLight,
			new THREE.DirectionalLightHelper(directionalLight),
			rAreaLight,
			new RectAreaLightHelper(rAreaLight),
			carpetPlaceholderMesh,
			floor,
			wallGroup,
			bigCinemaScreen
		);
		// Camera
		const camera = new THREE.PerspectiveCamera(75, parameters.aspect_ratio);
		camera.position.set(0, 1, 6);
		const control = new OrbitControls(camera, canvas);
		control.enableDamping = true;

		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: false });
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

<style lang="scss">
	canvas {
		border: none;
		box-shadow: none;
	}
</style>
