<script lang="ts">
	import gsap from 'gsap';
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	let canvas: HTMLCanvasElement;
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
			movement: {
				forward: 0,
				backwards: 0,
				leftwards: 0,
				rightwards: 0,
				rotation: 0,
				upwards: 0,
				downwards: 0
			},
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
			console.log(ankouAnimations);
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
			nakedTreeMesh.position.set(1, -1.5, -4);
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
			console.log('gltfpointyTree', gltfpointyTree);
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
			console.log('normalPumpkinMesh', normalPumpkinGroup);
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
		addEventListener('dblclick', (event) => {
			if (platformRotated) {
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
					gsap.to(mesh.scale, { x: 0, y: 0, z: 0, duration: 0.5 }).then(() => {
						mesh.position.x = 1 / mesh.position.x;
						mesh.position.z = 1 / mesh.position.z;

						mesh.lookAt(pumpkinModel.position);
					});
					gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 1, delay: 1.25 });
				});
				gsap.to(normalPumpkinMetaGroup.position, { y: 0, x: 0, duration: 0.5, delay: 1 });
			} else {
				gsap.to(normalPumpkinMetaGroup.position, { y: 2, x: -2, duration: 0.5, delay: 1 });
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
						const isFraccionZ = Math.abs(mesh.position.z) < 1;
						const isFraccionX = Math.abs(mesh.position.x) < 1;
						mesh.position.x = isFraccionX ? mesh.position.x : 1 / mesh.position.x;
						mesh.position.z = isFraccionZ ? mesh.position.z : 1 / mesh.position.z;
						mesh.lookAt(alteredPumpkinPos);
					});
					const offset = (Math.random() * i) / 3;
					gsap.to(mesh.scale, {
						x: 2 + offset,
						y: 4,
						z: 2 + offset,
						duration: 1,
						delay: 1.25
					});
				});
			}
			platformRotated = !platformRotated;
		});
		// Light
		const pointLight = new THREE.PointLight(0xffff00, 5, 1.75);
		// gui.addColor(pointLight, 'color');
		const ambientLight = new THREE.AmbientLight('#aaaaaa');
		const directionalLight = new THREE.DirectionalLight(
			'#ffffff',
			new Date().getHours() < 9 || new Date().getHours() > 18 ? 3 : 5
		);
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

		addEventListener('keydown', (event) => {
			switch (event.key) {
				case 'a':
					parameters.movement.rightwards -= 1;
					break;
				case 'w':
					parameters.movement.upwards += 1;
					break;
				case 's':
					parameters.movement.upwards -= 1;
					break;
				case 'd':
					parameters.movement.rightwards += 1;
					break;
			}
			camera.position.y = parameters.movement.upwards;
			renderer.render(scene, camera);
		});
		// Play
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
			let sceneReady = [
				pumpkinReady,
				ankouReady,
				nakedTreeReady,
				bushyTreeReady,
				pointyTreeReady
			].every((modelLoaded) => modelLoaded);
			if (sceneReady) {
				// Utils
				if (!nakedTreeRingCreated) {
					// console.log('creating tree ring', clonedNakedTreeMeshes);
					clonedNakedTreeMeshes.forEach((mesh: any, i: any) => {
						const horizontalOffset = 4;
						mesh.position.set(
							Math.cos((Math.PI * 2 * i) / 7 + Math.random() * 0.5) * horizontalOffset,
							-2,
							Math.sin((Math.PI * 2 * i) / 7 + Math.random() * 0.5) * horizontalOffset
						);
						mesh.lookAt(pumpkinModel.position);
						mesh.rotation.x = -Math.PI * 0.4;
						scene.add(mesh);
						nakedTreeRingCreated = true;
					});
				}
				parameters.movement.upwards = camera.position.y;
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
				// DIRECTIONAL LIGHT ANIMATION
				directionalLight.position.set(
					Math.cos((2 * Math.PI * elapsedTime) / 60) * orbitHorizontalDistance,
					directionalLight.position.y,
					Math.sin((2 * Math.PI * elapsedTime) / 60) * orbitHorizontalDistance
				);
				directionalLight.lookAt(platformA.position);
				// TREE ANIMATION
				nakedTreeModel.scale.set(
					1,
					3 - 4 * Math.abs(valueBetweenAhaldAndNegativeHalf),
					2 - 2 * Math.abs(valueBetweenAhaldAndNegativeHalf)
				);

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

<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		border: none;
		box-shadow: none;
		/* margin: 0 5vw; */
	}
</style>
