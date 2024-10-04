<script lang="ts">
	import gsap from 'gsap';
	// import { page } from `$app/stores`;
	// BIG NOTE: REMAINING MEMORY ALLOCATED SEEMS TO BE INTERNAT TO THREE.JS
	// import gsap from `gsap`;
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { Sky } from 'three/addons/objects/Sky.js';
	import { Timer } from 'three/addons/misc/Timer.js';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;

	onMount(() => {
		const lessonAssetsPath = `../../src/lib/classic_techniques/assets/16/`;
		// import { gsap } from "gsap/index.js";

		/**
		 * Base
		 */
		// Debug
		const gui = new GUI({
			// width: 300,
			title: 'Tweaks Panel',
			closeFolders: false,
			container: lilGuiPlacer
		});
		gui.hide();
		const openGui = (event: any) => {
			event.key === 'h' && gui.show(gui._hidden);
		};
		window.addEventListener('keydown', openGui);
		// Scene
		const scene = new THREE.Scene();
		// scene.fog = new THREE.Fog("#34343f", 0, 27);
		const setCanvasSize = () => {
			// Update camera
			camera.aspect = sizes.width / sizes.height;
			camera.updateProjectionMatrix();

			// Update renderer
			renderer.setSize(sizes.width, sizes.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		};
		window.addEventListener(`resize`, setCanvasSize);
		// Full screen support feature
		const fullscreenOnOff = () => {
			document.fullscreenElement ? document.exitFullscreen() : canvas?.requestFullscreen();
		};
		window.addEventListener(`dblclick`, fullscreenOnOff);

		/**
		 * Textures
		 */
		const textureLoader = new THREE.TextureLoader();

		// Floor texture
		const floorAlphaTexture = textureLoader.load(`${lessonAssetsPath}floor/alpha.webp`);
		const floorColorTexture = textureLoader.load(
			`${lessonAssetsPath}floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp`
		);
		const floorARMTexture = textureLoader.load(
			`${lessonAssetsPath}floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp`
		);
		const floorNormalTexture = textureLoader.load(
			`${lessonAssetsPath}floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp`
		);
		const floorDisplacementTexture = textureLoader.load(
			`${lessonAssetsPath}floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp`
		);
		floorColorTexture.repeat.set(8, 8);
		floorARMTexture.repeat.set(8, 8);
		floorNormalTexture.repeat.set(8, 8);
		floorDisplacementTexture.repeat.set(8, 8);

		floorColorTexture.wrapS = THREE.RepeatWrapping;
		floorARMTexture.wrapS = THREE.RepeatWrapping;
		floorNormalTexture.wrapS = THREE.RepeatWrapping;
		floorDisplacementTexture.wrapS = THREE.RepeatWrapping;

		floorColorTexture.wrapT = THREE.RepeatWrapping;
		floorARMTexture.wrapT = THREE.RepeatWrapping;
		floorNormalTexture.wrapT = THREE.RepeatWrapping;
		floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

		floorColorTexture.colorSpace = THREE.SRGBColorSpace;
		// Walls texture
		const wallColorTexture = textureLoader.load(
			`${lessonAssetsPath}wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp`
		);
		const wallARMTexture = textureLoader.load(
			`${lessonAssetsPath}wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp`
		);
		const wallNormalTexture = textureLoader.load(
			`${lessonAssetsPath}wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp`
		);

		wallColorTexture.colorSpace = THREE.SRGBColorSpace;

		// Roof texture
		const roofColorTexture = textureLoader.load(
			`${lessonAssetsPath}roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp`
		);
		const roofARMTexture = textureLoader.load(
			`${lessonAssetsPath}roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp`
		);
		const roofNormalTexture = textureLoader.load(
			`${lessonAssetsPath}roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp`
		);

		roofColorTexture.repeat.set(3, 1);
		roofARMTexture.repeat.set(3, 1);
		roofNormalTexture.repeat.set(3, 1);

		roofColorTexture.wrapS = THREE.RepeatWrapping;
		roofARMTexture.wrapS = THREE.RepeatWrapping;
		roofNormalTexture.wrapS = THREE.RepeatWrapping;

		roofColorTexture.colorSpace = THREE.SRGBColorSpace;
		// Bush texture
		const bushColorTexture = textureLoader.load(
			`${lessonAssetsPath}bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp`
		);
		const bushARMTexture = textureLoader.load(
			`${lessonAssetsPath}bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp`
		);
		const bushNormalTexture = textureLoader.load(
			`${lessonAssetsPath}bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp`
		);

		bushColorTexture.repeat.set(2, 1);
		bushARMTexture.repeat.set(2, 1);
		bushNormalTexture.repeat.set(2, 1);

		bushColorTexture.wrapS = THREE.RepeatWrapping;
		bushARMTexture.wrapS = THREE.RepeatWrapping;
		bushNormalTexture.wrapS = THREE.RepeatWrapping;

		bushColorTexture.colorSpace = THREE.SRGBColorSpace;
		// Grave texture
		const graveColorTexture = textureLoader.load(
			`${lessonAssetsPath}grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp`
		);
		const graveARMTexture = textureLoader.load(
			`${lessonAssetsPath}grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp`
		);
		const graveNormalTexture = textureLoader.load(
			`${lessonAssetsPath}grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp`
		);

		graveColorTexture.colorSpace = THREE.SRGBColorSpace;

		graveColorTexture.repeat.set(0.3, 0.4);
		graveARMTexture.repeat.set(0.3, 0.4);
		graveNormalTexture.repeat.set(0.3, 0.4);
		// Door texture from bruno simon
		// const doorColorTexture = textureLoader.load("./door/color.webp");
		// const doorAlphaTexture = textureLoader.load("./door/alpha.webp");
		// const doorAmbientOcclusionTexture = textureLoader.load(
		//   "./door/ambientOcclusion.webp"
		// );
		// const doorHeightTexture = textureLoader.load("./door/height.webp");
		// const doorNormalTexture = textureLoader.load("./door/normal.webp");
		// const doorMetalnessTexture = textureLoader.load("./door/metalness.webp");
		// const doorRoughnessTexture = textureLoader.load("./door/roughness.webp");

		// Door Texture
		const doorColorTexture = textureLoader.load(
			`${lessonAssetsPath}door/wooden-door-texture/color.webp`
		);
		// const doorAlphaTexture = textureLoader.load("./door/wooden-door-texture/.webp");
		const doorAmbientOcclusionTexture = textureLoader.load(
			`${lessonAssetsPath}door/wooden-door-texture/ao.webp`
		);
		const doorDisplacementTexture = textureLoader.load(
			`${lessonAssetsPath}door/wooden-door-texture/displacement.webp`
		);
		const doorNormalTexture = textureLoader.load(
			`${lessonAssetsPath}door/wooden-door-texture/normal_gl.webp`
		);
		const doorMetalnessTexture = textureLoader.load(
			`${lessonAssetsPath}door/wooden-door-texture/albedo_roughness_metallic_arm.webp`
		);
		const doorRoughnessTexture = textureLoader.load(
			`${lessonAssetsPath}door/wooden-door-texture/roughness.webp`
		);

		doorColorTexture.colorSpace = THREE.SRGBColorSpace;
		/**
		 * House
		 */
		// Floor
		const floor = new THREE.Mesh(
			new THREE.PlaneGeometry(30, 30, 100, 100),
			new THREE.MeshStandardMaterial({
				alphaMap: floorAlphaTexture,
				transparent: true,
				map: floorColorTexture,
				aoMap: floorARMTexture,
				roughnessMap: floorARMTexture,
				metalnessMap: floorARMTexture,
				normalMap: floorNormalTexture,
				displacementMap: floorDisplacementTexture,
				displacementScale: 0.3,
				displacementBias: -0.1
			})
		);
		floor.rotation.x = -Math.PI * 0.5;
		floor.material.side = THREE.DoubleSide;
		floor.receiveShadow = true;
		scene.add(floor);
		// Floor GUI
		// gui
		//   .add(floor.material, "displacementScale")
		//   .min(0)
		//   .max(1)
		//   .step(0.001)
		//   .name("floorDisplacementScale");
		// gui
		//   .add(floor.material, "displacementBias")
		//   .min(-1)
		//   .max(1)
		//   .step(0.001)
		//   .name("floorDisplacementBias");
		// Group scene
		const house = new THREE.Group();
		scene.add(house);
		// gui
		//   .add(floor.material, "displacementScale")
		//   .min(0)
		//   .max(1)
		//   .step(0.001)
		//   .name("floorDisplacementScale");
		// Walls
		const walls = new THREE.Mesh(
			new THREE.BoxGeometry(4, 2.5, 4),
			new THREE.MeshStandardMaterial({
				map: wallColorTexture,
				aoMap: wallARMTexture,
				roughnessMap: wallARMTexture,
				metalnessMap: wallARMTexture,
				normalMap: wallNormalTexture
			})
		);
		walls.position.y += 1.25; // Because y pos is 0, addition or asignation evaluates to the same result
		walls.castShadow = true;
		walls.receiveShadow = true;
		house.add(walls);

		// Roof
		const roof = new THREE.Mesh(
			new THREE.ConeGeometry(3.5, 9.5, 4),
			new THREE.MeshStandardMaterial({
				map: roofColorTexture,
				aoMap: roofARMTexture,
				roughnessMap: roofARMTexture,
				metalnessMap: roofARMTexture,
				normalMap: roofNormalTexture
			})
		);
		roof.position.y = walls.geometry.parameters.height + roof.geometry.parameters.height / 2;
		roof.rotation.y = Math.PI / 4;
		roof.castShadow = true;
		house.add(roof);

		// Door
		const door = new THREE.Mesh(
			new THREE.PlaneGeometry(1, 2, 100, 100),
			new THREE.MeshStandardMaterial({
				map: doorColorTexture,
				transparent: true,
				// alphaMap: doorAlphaTexture,
				aoMap: doorAmbientOcclusionTexture,
				displacementMap: doorDisplacementTexture,
				displacementScale: 0.15,
				displacementBias: -0.04,
				normalMap: doorNormalTexture,
				metalnessMap: doorMetalnessTexture,
				roughnessMap: doorRoughnessTexture
				// wireframe: true,
			})
		);
		door.position.set(
			0,
			door.geometry.parameters.height / 2,
			walls.geometry.parameters.width / 2 + 0.01
		);
		// door.rotation.y = Math.PI / 2;
		house.add(door);

		// Bushes
		const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
		const bushMaterial = new THREE.MeshStandardMaterial({
			map: bushColorTexture,
			aoMap: bushARMTexture,
			roughnessMap: bushARMTexture,
			metalnessMap: bushARMTexture,
			normalMap: bushNormalTexture
		});
		const bushesParameters: Array<[number, [number, number, number]]> = [
			[0.5, [0.8, 0.2, 2.2]],
			[0.25, [1.4, 0.1, 2.1]],
			[0.4, [-0.8, 0.1, 2.2]],
			[0.15, [-1, 0.05, 2.6]]
		];
		const bushMeshes = bushesParameters.map(([f, positionValues]) => {
			// const [f, positionValues]: [number, Array<number>] = arr;
			const Mesh = new THREE.Mesh(bushGeometry, bushMaterial);
			Mesh.scale.set(f, f, f);
			Mesh.position.set(...positionValues);
			Mesh.rotation.x = -0.75;
			return Mesh;
		});
		house.add(...bushMeshes);

		// Graves
		const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
		const graveMaterial = new THREE.MeshStandardMaterial({
			map: graveColorTexture,
			aoMap: graveARMTexture,
			roughnessMap: graveARMTexture,
			metalnessMap: graveARMTexture,
			normalMap: graveNormalTexture
		});

		const graves = new THREE.Group();
		scene.add(graves);

		const graveMeshes = Array(30);
		const gravesState = { floating: false };

		for (let i = 0; i < graveMeshes.length; i++) {
			graveMeshes[i] = new THREE.Mesh(
				new THREE.BoxGeometry(0.6, 0.8 + 2 * Math.random(), 0.2),
				graveMaterial
			);
			// graveMeshes[i].geometry.position.y += + 3 * Math.random();
			const angle = Math.random() * 2 * Math.PI;
			// const randomValX = (Math.random() - 1 / 2) * 10;
			// const randomValY = (Math.random() - 1 / 2) * 10;
			// const posX = randomValX < 0 ? randomValX - 2 : randomValX + 2;
			// const posZ = randomValY < 0 ? randomValY - 2 : randomValY + 2;
			// The solution above only worksn with the corners of the space
			// due to posX > 2 and 0 < posY < 2 (and viceversa) never happening
			//  which is why trig(onometric are used to archieve this result

			const cos = Math.cos(angle);
			const sin = Math.sin(angle);
			const radius = 6 + Math.random() * 4;
			const posX = cos * radius;
			const posZ = sin * radius;
			graveMeshes[i].position.set(
				posX,
				gravesState.floating ? i / 3 : graveMeshes[i].geometry.parameters.height / 2,
				posZ
			);
			const rotVal = (Math.random() - 0.5) * 0.4;
			graveMeshes[i].rotation.set(rotVal, rotVal, rotVal);
			graveMeshes[i].castShadow = true;
			graveMeshes[i].receiveShadow = true;
		}
		graves.add(...graveMeshes);
		const levitateGravesByKeyPress = (event: any) => {
			event.key === ' ' && graveyardAnimations.levitateGraves();
		};
		window.addEventListener('keydown', levitateGravesByKeyPress);
		const graveyardAnimations: any = {};
		graveyardAnimations.levitateGraves = () => {
			gravesState.floating = !gravesState.floating;
			graveMeshes.forEach((mesh, i) => {
				// console.log(gravesState.floating);
				gsap.to(mesh.position, {
					duration: 2,
					ease: `expoScale(0.5,5,none)`,
					y: gravesState.floating ? 0.8 + i / 3 : 0.8
				});
			});
		};
		gui.add(graveyardAnimations, `levitateGraves`).name(`Levitate graveyard`);
		/**
		 * Lights
		 */
		// Ambient light
		const ambientLight = new THREE.AmbientLight(`#86cdff`, 0.275);
		scene.add(ambientLight);

		// Directional light
		const directionalLight = new THREE.DirectionalLight(`#86cdff`, 1);
		directionalLight.position.set(3, 2, -8);
		directionalLight.shadow.mapSize.width = 256;
		directionalLight.shadow.mapSize.height = 256;
		directionalLight.shadow.camera.top = 8;
		directionalLight.shadow.camera.right = 8;
		directionalLight.shadow.camera.bottom = -8;
		directionalLight.shadow.camera.left = -8;
		directionalLight.shadow.camera.near = 1;
		directionalLight.shadow.camera.far = 20;
		scene.add(directionalLight);
		// for x in *.jpg; do  ffmpeg -i $x ${x%.jpg}.webp; done
		// Door light
		const doorLight = new THREE.RectAreaLight(`#ff6633`, 2, 1, 1);
		doorLight.position.set(0, 1, 2.5);
		house.add(doorLight);
		/**
		 * Sizes
		 */
		const sizes = {
			width: window.innerWidth * 0.75,
			height: window.innerHeight * 0.75
		};

		window.addEventListener(`resize`, () => {
			// Update camera
			camera.aspect = sizes.width / sizes.height;
			camera.updateProjectionMatrix();

			// Update renderer
			renderer.setSize(sizes.width, sizes.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		});

		/**
		 * Ghosts
		 */
		const ghosts = [`#ff3333`, `#ff6666`, `#ff9999`].map((ghostTone) => {
			const ghost = new THREE.PointLight(ghostTone, 6);
			ghost.castShadow = true;
			ghost.shadow.mapSize.set(256, 256);
			ghost.shadow.camera.far = 10;
			return ghost;
		});
		scene.add(...ghosts);

		/**
		 * Sky
		 */
		const sky = new Sky();
		sky.material.uniforms[`turbidity`].value = 3;
		sky.material.uniforms[`rayleigh`].value = 4;
		sky.material.uniforms[`mieCoefficient`].value = 0.01;
		sky.material.uniforms[`mieDirectionalG`].value = 0.7;
		sky.material.uniforms[`sunPosition`].value.set(1, 0.003, -2);
		sky.scale.set(100, 100, 100);
		scene.add(sky);
		const effectController = {
			turbidity: 10,
			rayleigh: 3,
			mieCoefficient: 0.005,
			mieDirectionalG: 0.7,
			elevation: 2,
			azimuth: 180,
			// getter below is just not needed but used to practice this keyworkd and getters
			get sunPosition() {
				return {
					x: 1,
					y: THREE.MathUtils.degToRad(90 - this.elevation),
					z: THREE.MathUtils.degToRad(this.azimuth)
				};
			}
		};

		// gui.add(sky.material.uniforms, 'turbidity');
		// gui.add(sky.material.uniforms, 'rayleigh');
		// gui.add(sky.material.uniforms, 'mieCoefficient');
		// gui.add(sky.material.uniforms, 'mieDirectionalG');
		// gui.add(sky.material.uniforms, 'elevation');
		const updateSkyProps = () => {
			// sky.material.uniforms[`turbidity`].value = effectController.turbidity;
			// sky.material.uniforms[`rayleigh`].value = effectController.rayleigh;
			// sky.material.uniforms[`sunPosition`].value.copy(
			// 	new THREE.Vector3().setFromSphericalCoords(
			// 		effectController.sunPosition.x,
			// 		effectController.sunPosition.y,
			// 		effectController.sunPosition.z
			// 	)
			// );
		};
		// gui.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(updateSkyProps);
		// gui.add(effectController, 'azimuth', -180, 180, 0.1).onChange(updateSkyProps);
		// gui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(updateSkyProps);
		// gui.add( effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( guiChanged );
		// gui.add( effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( guiChanged );
		// gui.add( effectController, 'sunPosition', 0, 90, 0.1 ).onChange( guiChanged );
		/**
		 * Camera
		 */
		// Base camera
		const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 0.1, 100);
		camera.position.x = 10;
		camera.position.y = 3.5;
		camera.position.z = 10;
		scene.add(camera);

		// Controls
		const control = new OrbitControls(camera, canvas);
		control.enableDamping = true;

		/**
		 * Renderer
		 */
		const renderer = new THREE.WebGLRenderer({
			canvas: canvas
		});
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		// renderer.toneMapping = THREE.ACESFilmicToneMapping;
		// renderer.toneMappingExposure = 0.85;

		// Cast and receive
		directionalLight.castShadow = true;

		/**
		 * Animate
		 */
		const timer = new Timer();
		let tickId = 0;
		const tick = () => {
			// Timer
			timer.update();
			const elapsedTime = timer.getElapsed();

			ghosts.forEach((ghost, index, arr) => {
				const displacementeFactor = 2 * index + 1;
				const ghostAngle = elapsedTime * (1 / displacementeFactor);
				ghost.position.x = Math.cos(ghostAngle) * (6 + displacementeFactor);
				ghost.position.z = Math.sin(ghostAngle) * (6 + displacementeFactor);
				ghost.position.y =
					0.5 + Math.sin(ghostAngle) * Math.sin(ghostAngle * 2.34) * Math.sin(ghostAngle * 3.45);
			});

			control.update();

			// Render
			renderer.render(scene, camera);
			// Call tick again on the next frame
			tickId = window.requestAnimationFrame(tick);
		};
		gsap.to(roof.rotation, { y: 3, duration: 6, repeat: -1, yoyo: true });
		tick();

		function disposeScene() {
			let disposeExecutions = 0;
			function disposeAll(node: any) {
				if (node instanceof THREE.Mesh) {
					node.geometry?.dispose();
					if (node.material) {
						node.material.alphaMap?.dispose(),
							node.material.map?.dispose(),
							node.material.aoMap?.dispose(),
							node.material.roughnessMap?.dispose(),
							node.material.metalnessMap?.dispose(),
							node.material.normalMap?.dispose(),
							node.material.displacementMap?.dispose(),
							node.material?.dispose();
					}
					console.log(`${node.type} disposed`);
					disposeExecutions++;
				} else if ((node instanceof THREE.Texture || node.isObject3D) && node.dispose) {
					node.dispose();
					disposeExecutions++;
				}
			}
			scene.traverse(disposeAll);
			scene.clear();
			scene.removeFromParent();
			control.dispose();
			console.log(`disposed first project allocated resources`, renderer.info);
			gui.destroy();
			console.log(`GUI destroyed`);
			console.log(`tickId`, tickId);
			window.cancelAnimationFrame(tickId);
			window.removeEventListener(`resize`, setCanvasSize);
			window.removeEventListener(`dbclick`, fullscreenOnOff);
			console.log(`Tick disposed`);
			renderer.clear();
			renderer.dispose();
			console.log(`Renderer cleared and diposed ${disposeExecutions + 2} times`);
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
