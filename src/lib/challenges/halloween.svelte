<script lang="ts">
	import { fade, fly, slide } from 'svelte/transition';
	import gsap from 'gsap';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import dateStore from '$lib/dateStore.ts';
	import SquaredSpiral from '$lib/challenges/icons/SquaredSpiral.svelte';
	import LightIcon from '$lib/challenges/icons/Light.svelte';
	import PumpkinIcon from '$lib/challenges/icons/Pumpkin.svelte';
	import BranchIcon from '$lib/challenges/icons/Branch.svelte';
	import TransformFigure from '$lib/challenges/icons/TransformFigure.svelte';
	$: now = new Date();
	$: isHalloween = now === new Date(now.getFullYear(), 9, 31);
	const clock = dateStore();
	let canvas: HTMLCanvasElement;
	let halloweenTitle: HTMLElement;
	$: sceneReady = false;
	onMount(() => {
		// Utils
		let pumpkinReady = false;
		let ankouReady = false;
		let nakedTreeReady = false;
		let bushyTreeReady = false;
		let pointyTreeReady = false;
		let normalPumpkinReady = false;
		const parameters = {
			point3d: new THREE.Vector3(0, 0, 5),
			cursor: { x: 0, y: 0 },
			width: window.innerWidth,
			height: window.innerHeight,
			color: '#999999',
			colors: [
				'#ffffff',
				'#000000',
				'#0000ff',
				'#00ff00',
				'#ff0000',
				'#ffff00',
				'#00ffff',
				'#ff00ff'
			],
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
					'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-lime/model.gltf',
				normalPumpkin:
					'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/pumpkin-a/model.gltf'
			},
			licenceURL: 'https://creativecommons.org/licenses/by/2.0/'
			//  '#ff3399'
		};
		const initialModelPhysics: any = {};
		// GUI
		// const gui = new GUI({ title: 'Dev. Panel' });
		/**
		 * Fonts
		 */
		// const fontLoader = new FontLoader();
		// fontLoader.load('three/examples/fonts/optimer_regular.typeface.json', (font) => {
		// 	console.log('loaded');
		// });
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
		//  Loaded Models
		let ankouModel: any = null;
		let pumpkinModel: any = null;
		let nakedTreeModel: any = null;
		let bushyTreeModel: any = null;
		let pointyTreeModel: any = null;
		let ankouAnimations: any = null;
		let normalPumpkinMetaGroup: any = null;
		//  Loaded Animations
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
			// console.log(ankouAnimations);
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
		let clonedNakedTreeMeshes: any;
		gltfLoader.load(parameters.modelsURL.nakedTree, (gltfNakedTree) => {
			// console.log('gltfNakedTree', gltfNakedTree);
			const nakedTreeMesh = gltfNakedTree.scene.getObjectByName('treeD_graveyard') as THREE.Mesh;
			clonedNakedTreeMeshes = [
				nakedTreeMesh.clone(),
				nakedTreeMesh.clone(),
				nakedTreeMesh.clone(),
				nakedTreeMesh.clone(),
				nakedTreeMesh.clone(),
				nakedTreeMesh.clone(),
				nakedTreeMesh.clone()
			];
			nakedTreeMesh.castShadow = true;
			nakedTreeMesh.receiveShadow = true;
			// @ts-ignore
			// nakedTreeMesh.material?.dipose();
			nakedTreeMesh.material.copy(platformMaterial);
			// @ts-ignore
			// nakedTreeMesh.material.color = new THREE.Color('#994600');
			nakedTreeMesh.position.set(0, -2, -5);
			nakedTreeMesh.rotation.x = -Math.PI * 0.25;
			nakedTreeMesh.scale.set(1, 3, 2);
			scene.add(nakedTreeMesh);
			nakedTreeModel = nakedTreeMesh;
			initialModelPhysics[nakedTreeMesh.name] = {
				position: {
					x: nakedTreeMesh.position.x,
					y: nakedTreeMesh.position.y,
					z: nakedTreeMesh.position.z
				},
				rotation: {
					x: nakedTreeMesh.rotation.x,
					y: nakedTreeMesh.rotation.y,
					z: nakedTreeMesh.rotation.z
				}
			};
			nakedTreeReady = true;
		});
		gltfLoader.load(parameters.modelsURL.bushyTree, (gltfbushyTree) => {
			// console.log('gltfbushyTree', gltfbushyTree);
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
			initialModelPhysics[treeLimeMesh.name] = {
				position: {
					x: treeLimeMesh.position.x,
					y: treeLimeMesh.position.y,
					z: treeLimeMesh.position.z
				},
				rotation: {
					x: treeLimeMesh.rotation.x,
					y: treeLimeMesh.rotation.y,
					z: treeLimeMesh.rotation.z
				}
			};

			bushyTreeReady = true;
		});
		gltfLoader.load(parameters.modelsURL.pointyTree, (gltfpointyTree) => {
			// console.log('gltfpointyTree', gltfpointyTree);
			const pointyTreeMesh = gltfpointyTree.scene.getObjectByName('tree-spruce') as THREE.Mesh;
			pointyTreeMesh.castShadow = true;
			pointyTreeMesh.receiveShadow = true;
			// nakedTreeMesh.material?.dipose();
			// @ts-ignore
			pointyTreeMesh.material.copy(platformMaterial);
			// @ts-ignore
			pointyTreeMesh.material.color = new THREE.Color('#ffaa66');
			pointyTreeMesh.position.set(-1, -1, 3);
			pointyTreeMesh.rotation.x = Math.PI * 0.1;
			pointyTreeMesh.scale.set(0.5, 0.25, 0.5);
			scene.add(pointyTreeMesh);
			pointyTreeModel = pointyTreeMesh;
			initialModelPhysics[pointyTreeMesh.name] = {
				position: {
					x: pointyTreeMesh.position.x,
					y: pointyTreeMesh.position.y,
					z: pointyTreeMesh.position.z
				},
				rotation: {
					x: pointyTreeMesh.rotation.x,
					y: pointyTreeMesh.rotation.y,
					z: pointyTreeMesh.rotation.z
				}
			};

			pointyTreeReady = true;
		});
		gltfLoader.load(parameters.modelsURL.normalPumpkin, (gltfNormalPumpkin) => {
			const normalPumpkinGroup = gltfNormalPumpkin.scene.getObjectByName(
				'pumpkinLarge'
				// 'Sphere018'
				// 'Sphere018_1'
			) as THREE.Mesh;
			// console.log('normalPumpkinMesh', normalPumpkinGroup);
			normalPumpkinGroup.castShadow = true;
			normalPumpkinGroup.receiveShadow = true;
			// nakedTreeMesh.material?.dipose();
			normalPumpkinGroup.children.forEach((part) => {
				// @ts-ignore
				if (part.name === 'Sphere018') {
					// @ts-ignore
					part.material = new THREE.MeshStandardMaterial({ color: new THREE.Color('#998866') });
				} else {
					// @ts-ignore
					part.material = new THREE.MeshStandardMaterial({ color: new THREE.Color('#666633') });
				}
			});
			// scene.add(normalPumpkinGroup);
			const pumpkinMetaGroup = new THREE.Group();
			const normalPumpkinGroupFirstClone = normalPumpkinGroup.clone();
			normalPumpkinGroupFirstClone.position.set(1, -1, -4);
			normalPumpkinGroupFirstClone.rotation.x = Math.PI * 0.5;
			normalPumpkinGroupFirstClone.rotation.z = -Math.PI * 0.1;
			const normalPumpkinGroupSecondClone = normalPumpkinGroup.clone();
			normalPumpkinGroupSecondClone.position.set(1, -2, -4);
			normalPumpkinGroup.scale.set(2, 3, 2);
			normalPumpkinGroup.position.set(2, -1, -4);

			pumpkinMetaGroup.add(
				normalPumpkinGroupFirstClone,
				normalPumpkinGroup,
				normalPumpkinGroupSecondClone
			);
			pumpkinMetaGroup.position.set(0, 0, 0);
			scene.add(pumpkinMetaGroup);
			normalPumpkinMetaGroup = pumpkinMetaGroup;
			// normalPumpkinMetaGroup.rotation.z = -Math.PI * 0.5;
			normalPumpkinReady = true;
		});
		addEventListener('mousemove', (event) => {
			parameters.cursor.x = event.clientX;
			parameters.cursor.y = event.clientY;
			// console.log(parameters.cursor);
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
		const platformA = new THREE.Mesh(new THREE.CylinderGeometry(7, 3, 3, 7), platformMaterial);
		platformA.receiveShadow = true;
		platformA.material.side = THREE.DoubleSide;
		platformA.rotation.x = Math.PI;
		platformA.position.y = -1.5;
		let platformRotated = false;
		const setCanvasSize = () => {
			console.log('Window size has changed.');
			// Scene size update
			parameters.width = innerWidth;
			parameters.height = innerHeight;
			// Camera AR update
			camera.aspect = parameters.width / parameters.height;
			camera.updateProjectionMatrix();

			// Renderer
			renderer.setSize(parameters.width, parameters.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
			renderer.render(scene, camera);
		};
		addEventListener('resize', setCanvasSize);
		let previousExecutionTimestamp = 0;
		const timeBetweenTransformations = 2;
		addEventListener('dblclick', (event) => {
			const timestampDelta = event.timeStamp / 1000 - previousExecutionTimestamp;
			let runListener = timestampDelta > timeBetweenTransformations;
			previousExecutionTimestamp = event.timeStamp / 1000;
			if (!runListener) return;
			if (platformRotated) {
				gsap.to('#TransformFigureIcon', { rotation: 0, duration: 1 });
				[nakedTreeModel, bushyTreeModel, pointyTreeModel].forEach((model) => {
					gsap.to(model.position, {
						...initialModelPhysics[model.name].position,
						duration: 1,
						delay: 1.25
					});
					gsap.to(model.rotation, {
						...initialModelPhysics[model.name].rotation,
						duration: 1,
						delay: 1.25
					});
				});
				gsap.to(platformA.position, { y: -7, duration: 1 });
				gsap.to(platformA.rotation, { z: 0, duration: 1, delay: 0.5 });
				gsap.to(platformA.position, { y: -1.5, duration: 1, delay: 1 });
				clonedNakedTreeMeshes.forEach((mesh: any, i: any) => {
					gsap.to(mesh.scale, { x: 0, y: 0, z: 0, duration: 0.25 }).then(() => {
						mesh.position.x = 1 / mesh.position.x;
						mesh.position.z = 1 / mesh.position.z;

						mesh.lookAt(pumpkinModel.position);
					});
					gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 1, delay: 1.75 });
				});
				gsap.to(normalPumpkinMetaGroup.position, { y: 0, x: 0, duration: 0.5, delay: 1 });
			} else {
				gsap.to('#TransformFigureIcon', { rotation: 180, opacity: 0.7, duration: 1 });

				// gsap.to('#TransformFigureIcon', {
				// 	fill: '#' + pointLight.color.getHexString() + 'aa',
				// 	duration: 1
				// });

				gsap.to(normalPumpkinMetaGroup.position, { y: 2, x: -4, duration: 0.5, delay: 1 });
				[nakedTreeModel, bushyTreeModel, pointyTreeModel].forEach((model) => {
					gsap.to(model.position, { y: 0, duration: 1, delay: 1.25 });
					gsap.to(model.rotation, { x: 0.1, y: 0.1, z: 0.1, duration: 1, delay: 0.5 });
				});
				gsap.to(platformA.position, { y: -7, duration: 1 });
				gsap.to(platformA.rotation, { z: Math.PI, duration: 1, delay: 0.5 });
				gsap.to(platformA.position, { y: -1.5, duration: 1, delay: 1 });
				clonedNakedTreeMeshes.forEach((mesh: any, i: any) => {
					gsap.to(mesh.scale, { x: 0, y: 0, z: 0, duration: 0.5 }).then(() => {
						const alteredPumpkinPos = new THREE.Vector3(0, 69, 0);
						// const isFraccionZ = Math.abs(mesh.position.z) < 1;
						// const isFraccionX = Math.abs(mesh.position.x) < 1;
						// 						isFraccionX ? mesh.position.x :
						// isFraccionZ ? mesh.position.z :
						mesh.position.x = 1 / mesh.position.x;
						mesh.position.z = 1 / mesh.position.z;
						mesh.lookAt(alteredPumpkinPos);
					});
					const offset = (Math.random() * i) / 3;
					gsap.to(mesh.scale, {
						x: 2 + offset,
						y: 4,
						z: 2 + offset,
						duration: 1,
						delay: 1.75
					});
				});
			}
			platformRotated = !platformRotated;
		});
		// Light
		const randomColor = parameters.colors[Math.floor(Math.random() * parameters.colors.length)];
		const pointLight = new THREE.PointLight(randomColor, 5, 1.75);
		const ambientLight = new THREE.AmbientLight('#ffffff');
		const directionalLight = new THREE.DirectionalLight(
			'#ffffff',
			new Date().getHours() < 9 || new Date().getHours() > 18 ? 4 : 6
		);
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.set(1024, 1024);
		directionalLight.shadow.camera.near = 1;
		directionalLight.shadow.camera.far = 15;
		directionalLight.shadow.camera.left = -15;
		directionalLight.shadow.camera.right = 15;
		directionalLight.shadow.camera.top = 15;
		directionalLight.shadow.camera.bottom = -15;

		directionalLight.position.set(-3, 6, -3);
		// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
		// Scene
		const scene = new THREE.Scene();

		scene.add(platformA, ambientLight, directionalLight, pointLight);
		scene.rotation.y = Math.PI * 1.5;
		// Camera
		const camera = new THREE.PerspectiveCamera(75, parameters.aspectRatio);
		camera.position.set(0, 6, 15);
		const control = new OrbitControls(camera, canvas);
		control.enableDamping = true;

		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.setSize(parameters.width, parameters.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		let wheelPressedCount = 0;
		addEventListener('mousedown', (event) => {
			const colorsLength = parameters.colors.length;
			const colorSelection = parameters.colors[wheelPressedCount];
			switch (event.button) {
				case 0:
					if (intersect.length) {
						const nakedTreeMesh = intersect.shift().object;
						const isScaled = nakedTreeMesh.scale.x > 1;
						gsap.to('#BranchIcon', { scale: !isScaled ? 1.5 : 1, opacity: 0.7, duration: 1 });
						gsap.to(nakedTreeMesh.scale, {
							x: isScaled ? 1 : 5,
							z: isScaled ? 1 : 5,
							duration: 1
						});
					}
					break;
				case 1:
					ambientLight.color = new THREE.Color(colorSelection);
					gsap.to('#LightIcon', { fill: colorSelection, opacity: 0.7, duration: 1 });
					gsap.to('#halloweenTitle', { color: colorSelection, duration: 1 });

					wheelPressedCount += wheelPressedCount !== colorsLength ? 1 : -colorsLength;
					break;
				case 2:
					pointLight.color = new THREE.Color(colorSelection);
					gsap.to('#PumpkinIcon path', {
						stroke: colorSelection,
						fill: colorSelection + '00',
						opacity: 1,
						duration: 1
					});
					gsap.to('#halloweenTitle', { color: colorSelection, duration: 1 });
					wheelPressedCount += wheelPressedCount !== colorsLength ? 1 : -colorsLength;
					break;
			}
		});
		// Play
		const raycaster = new THREE.Raycaster();
		let intersect: any = [];
		const clock = new THREE.Clock();
		let tickId = 0;
		let previousElapsedTime = clock.getElapsedTime();
		// scene.add(new THREE.AxesHelper(100));
		const orbitHorizontalDistance = 4;
		const orbitVerticalDistance = 4;
		let nakedTreeRingCreated = false;
		function tick() {
			const elapsedTime = clock.getElapsedTime();
			const deltaTime = elapsedTime - previousElapsedTime;
			previousElapsedTime = elapsedTime;
			control.update();
			sceneReady = [
				pumpkinReady,
				ankouReady,
				nakedTreeReady,
				bushyTreeReady,
				pointyTreeReady
			].every((modelLoaded) => modelLoaded);
			if (sceneReady) {
				// Utils
				raycaster.setFromCamera(
					new THREE.Vector2(
						(parameters.cursor.x / innerWidth) * 2 - 1,
						-(parameters.cursor.y / innerHeight) * 2 + 1
					),
					camera
				);
				intersect = raycaster.intersectObject(nakedTreeModel);
				if (!nakedTreeRingCreated) {
					clonedNakedTreeMeshes.forEach((mesh: any, i: any) => {
						const horizontalOffset = 4;
						mesh.position.set(
							Math.cos((Math.PI * 2 * i) / 7) * horizontalOffset,
							-2,
							Math.sin((Math.PI * 2 * i) / 7) * horizontalOffset
						);
						mesh.lookAt(pumpkinModel.position);
						mesh.rotation.x = -Math.PI * 0.4;
						scene.add(mesh);
						nakedTreeRingCreated = true;
					});
				}
				// ANKOU ANIMATION
				let horseWalk = mixer.clipAction(ankouAnimations[2]);
				horseWalk?.play();
				let cartMove = mixer.clipAction(ankouAnimations[4]);
				cartMove.play();
				mixer.update(deltaTime);
				// PUMPKIN ANIMATION
				const valueBetweenAhaldAndNegativeHalf = parameters.cursor.x / parameters.width - 0.5;
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
				// DIRECTIONAL LIGHT ANIMATION
				directionalLight.position.set(
					Math.cos((2 * Math.PI * elapsedTime) / 60) * orbitHorizontalDistance,
					directionalLight.position.y,
					Math.sin((2 * Math.PI * elapsedTime) / 60) * orbitHorizontalDistance
				);
				directionalLight.lookAt(platformA.position);
				pointyTreeModel.scale.set(0.5, 0.5 - Math.abs(valueBetweenAhaldAndNegativeHalf) / 2, 0.5);
				bushyTreeModel.rotation.y = Math.PI * valueBetweenAhaldAndNegativeHalf * 4;
				renderer.render(scene, camera);
			}
			cancelAnimationFrame(tickId);
			tickId = requestAnimationFrame(tick);
		}
		tick();

		// Dispose
		function disposeScene() {
			window.cancelAnimationFrame(tickId);
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
			console.log(`Tick disposed`);
			renderer.clear();
			renderer.dispose();
			console.log(`Renderer cleared and`);
		}
		return disposeScene;
	});
</script>

<canvas in:fade={{ duration: 2500, delay: 1000 }} bind:this={canvas}></canvas>
{#if !sceneReady}
	<div out:fade={{ duration: 1000, delay: 0 }} id="spiralLoader">
		<SquaredSpiral />
	</div>
{:else}
	<div id="timeUntilHalloweenPlacer">
		{#if isHalloween}
			<p style="font-size: 10vh;"><strong id="halloweenTitle">Halloween !</strong></p>
		{:else}
			<p>{$clock} until <strong id="halloweenTitle">Halloween</strong></p>
		{/if}
		<div id="interactionIcons">
			<LightIcon style="opacity: 0.25" />
			<PumpkinIcon style="opacity: 0.25" />
			<BranchIcon style="opacity: 0.25" />
			<TransformFigure style="opacity: 0.25" />
		</div>
	</div>
{/if}

<style lang="scss">
	#spiralLoader {
		position: fixed;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 100vh;
	}
	canvas {
		border: none;
		box-shadow: none;
	}

	:global(body) {
		background-color: var(--color-bg-2);
		background-image: radial-gradient(
			50% 50% at 50% 50%,
			rgba(255, 255, 255, 0.5) 0%,
			rgba(255, 255, 255, 0) 100%
		);
	}
	@font-face {
		font-family: 'NemoNightmares';
		src: url('$lib/fonts/NemoNightmares.ttf') format('truetype');
	}
	#timeUntilHalloweenPlacer {
		#interactionIcons {
			display: flex;
			width: 100%;
			height: 25vh;
			align-items: center;
			justify-content: space-evenly;
		}
		p {
			margin: 0;
		}
		z-index: -1;
		line-break: anywhere;
		font-family: 'NemoNightmares';
		font-size: min(7vh, 7vw);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		width: 100vw;
		height: 100vh;
		top: 0vh;
	}
</style>
