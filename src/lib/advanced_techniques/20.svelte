<script lang="ts">
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import * as CANNON from 'cannon-es';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	onMount(() => {
		// Constants
		const randomPositionWithinPlane = () => ({
			x: (Math.random() - 0.5) * 12.5,
			y: Math.random() * 12.5 + 9,
			z: (Math.random() - 0.5) * 12.5
		});
		let parameters = {
			sizes: { width: window.innerWidth * 0.75, height: window.innerHeight * 0.75 },
			color: '#994f7a',
			createSphere: () => createSphere(Math.random() * 2 + 0.2, randomPositionWithinPlane()),
			createBox: () => createBox(Math.random() * 2 + 0.2, randomPositionWithinPlane()),
			reset: () => {
				for (const { mesh, body } of sphereRefs) {
					scene.remove(mesh);
					body.removeEventListener('collide', playHitSound);
					world.removeBody(body);
				}
				for (const { mesh, body } of boxRefs) {
					scene.remove(mesh);
					body.removeEventListener('collide', playHitSound);
					world.removeBody(body);
				}
			}
		};
		const ASPECT_RATIO = parameters.sizes.width / parameters.sizes.height;
		const ASSETS_PATH = '/assets/advanced/20';
		// UI
		const gui = new GUI({
			title: 'Tweaks Panel',
			width: 300,
			closeFolders: true,
			container: lilGuiPlacer
		});
		gui.add(parameters, 'createSphere');
		gui.add(parameters, 'createBox');
		gui.add(parameters, 'reset');
		// Sound
		const hitSound = new Audio(`${ASSETS_PATH}/sounds/hit.mp3`);
		function playHitSound(collision: any) {
			const objectVelocity = collision.contact.getImpactVelocityAlongNormal();
			if (objectVelocity > 1) {
				hitSound.volume = 1 - 1 / objectVelocity;
				hitSound.currentTime = 0;
				hitSound.play();
			}
		}
		// Textures
		const cubeTextureLoader = new THREE.CubeTextureLoader();
		const environmentMapTexture = cubeTextureLoader.load([
			`${ASSETS_PATH}/textures/environmentMaps/0/px.png`,
			`${ASSETS_PATH}/textures/environmentMaps/0/nx.png`,
			`${ASSETS_PATH}/textures/environmentMaps/0/py.png`,
			`${ASSETS_PATH}/textures/environmentMaps/0/ny.png`,
			`${ASSETS_PATH}/textures/environmentMaps/0/pz.png`,
			`${ASSETS_PATH}/textures/environmentMaps/0/nz.png`
		]);

		// Meshes
		// const cube = new THREE.Mesh(
		// 	new THREE.BoxGeometry(1, 1),
		// 	new THREE.MeshStandardMaterial({ color: parameters.color })
		// );
		const plane = new THREE.Mesh(
			new THREE.PlaneGeometry(25, 25),
			new THREE.MeshStandardMaterial({
				// color: '#777777',
				metalness: 0.9,
				roughness: 0.3,
				envMap: environmentMapTexture,
				envMapIntensity: 1
			})
		);
		plane.rotation.set(1.5 * Math.PI, 0, Math.PI * 0);
		plane.position.set(0, 0, 0);
		plane.material.side = THREE.DoubleSide;
		plane.receiveShadow = true;
		// const sphere = new THREE.Mesh(
		// 	new THREE.SphereGeometry(1.5),
		// 	new THREE.MeshStandardMaterial({
		// 		color: parameters.color,
		// 		metalness: 0.3,
		// 		roughness: 0.4,
		// 		envMap: environmentMapTexture,
		// 		envMapIntensity: 0.7
		// 	})
		// );
		// sphere.castShadow = true;
		// sphere.position.set(0, 1.5 * 3, 0);

		// Lights
		const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
		// const directionalLigherHelper = new THREE.DirectionalLightHelper(directionalLight);
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.set(1024, 1024);
		directionalLight.shadow.camera.far = 25;
		directionalLight.shadow.camera.left = -14;
		directionalLight.shadow.camera.top = 14;
		directionalLight.shadow.camera.right = 14;
		directionalLight.shadow.camera.bottom = -14;
		directionalLight.position.set(3, 6, 3);
		// directionalLight.position.set(0, 9, 0);
		const ambientLight = new THREE.AmbientLight('#ffffff');
		// Physics
		// World
		const world = new CANNON.World();
		world.broadphase = new CANNON.SAPBroadphase(world);
		world.allowSleep = true;
		world.gravity.set(0, -9.82, 0);
		// Materials
		// const concreteMaterial = new CANNON.Material('concrete');
		// const plasticMaterial = new CANNON.Material('plastic');
		// const concretePlasticCM = new CANNON.ContactMaterial(concreteMaterial, plasticMaterial, {
		// 	friction: 0.1,
		// 	restitution: 0.6
		// });
		const defaultMaterial = new CANNON.Material();
		const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
			friction: 0.1,
			restitution: 0.9
		});
		world.addContactMaterial(defaultContactMaterial);
		world.defaultContactMaterial = defaultContactMaterial;

		// Bodies
		// const sphereShape = new CANNON.Sphere(1.5);
		// const sphereBody = new CANNON.Body({
		// 	mass: 1,
		// 	position: new CANNON.Vec3(0, 1.5 * 6, 0),
		// 	shape: sphereShape
		// 	// material: defaultMaterial
		// });
		// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0));
		const planeShape = new CANNON.Box(new CANNON.Vec3(12.5, 12.5, 0.1));
		const planeBody = new CANNON.Body({ mass: 0 });
		// planeBody.mass = 1;
		planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 1.5 * Math.PI);
		// planeBody.material = defaultMaterial;
		planeBody.addShape(planeShape);

		// world.addBody(sphereBody);
		world.addBody(planeBody);

		// gui
		// 	.add(sphere.position, 'y', 1, 9, 1)
		// 	.name('Sphere Height')
		// 	.onFinishChange((v: any) => {
		// 		sphereBody.position.set(0, v, 0);
		// 		console.log(v);
		// 	});
		// Scene
		const scene = new THREE.Scene();
		scene.add(
			// sphere,
			plane,
			// ambientLight
			directionalLight
			// directionalLigherHelper
			// new THREE.AxesHelper(100)
		);
		// Camera
		const camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO, 0.1, 100);
		camera.position.set(0, 18, 27);
		const control = new OrbitControls(camera, canvas);
		control.enableDamping = true;
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(parameters.sizes.width, parameters.sizes.height);
		// renderer.render(scene, camera);
		// Utils
		type SMesh = THREE.Mesh<
			THREE.SphereGeometry,
			THREE.MeshStandardMaterial,
			THREE.Object3DEventMap
		>;
		type BMesh = THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>;
		const sphereRefs: { mesh: SMesh; body: any }[] = [];
		const boxRefs: { mesh: BMesh; body: any }[] = [];

		// createSphere mesh args
		const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
		const sphereMaterial = new THREE.MeshStandardMaterial({
			// color: parameters.color,
			metalness: 0.3,
			roughness: 0.4,
			envMap: environmentMapTexture,
			envMapIntensity: 0.5
		});
		// createSphere body args
		function createSphere(radius: number, position: { x: number; y: number; z: number }) {
			// Three.js Mesh
			const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
			mesh.scale.set(radius, radius, radius);
			mesh.castShadow = true;
			mesh.position.copy(position);
			scene.add(mesh);

			// Cannon.js Body
			const shape = new CANNON.Sphere(radius);
			const body = new CANNON.Body({
				mass: 1,
				shape
				// position: new CANNON.Vec3(0, position.y, 0),
				// material: defaultMaterial
			});
			body.position.copy(position as CANNON.Vec3);
			body.addEventListener('collide', playHitSound);
			world.addBody(body);

			// Objects references for posterior handling
			sphereRefs.push({ mesh, body });
		}

		createSphere(1.5, { x: 0, y: 1.5 * 5, z: 0 });
		createSphere(1.5, { x: 0, y: 1.5 * 3, z: 0 });
		createSphere(1.5, { x: 0, y: 1.5, z: 0 });

		// createBox mesh args
		const boxGeometry = new THREE.BoxGeometry(2, 2);
		const boxMaterial = new THREE.MeshStandardMaterial({
			// color: parameters.color,
			metalness: 0.3,
			roughness: 0.9,
			envMap: environmentMapTexture
		});
		// createBox body args
		function createBox(size: number, position: { x: number; y: number; z: number }) {
			// Three.js Mesh
			const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
			mesh.scale.set(size, size, size);
			mesh.castShadow = true;
			mesh.position.copy(position);
			scene.add(mesh);

			// Cannon.js Body
			const shape = new CANNON.Box(new CANNON.Vec3(size, size, 1));
			const body = new CANNON.Body({
				mass: 1,
				// position: new CANNON.Vec3(0, position.y, 0),
				shape
				// material: defaultMaterial
			});
			body.position.copy(position as CANNON.Vec3);
			body.addEventListener('collide', playHitSound);
			world.addBody(body);

			// Objects references for posterior handling
			boxRefs.push({ mesh, body });
		}

		// Play
		const clock = new THREE.Clock();
		let tickId = 0;
		let previousElapsedTime = clock.getElapsedTime();
		function tick() {
			// Data
			const elapsedTime = clock.getElapsedTime();
			const deltaTime = elapsedTime - previousElapsedTime;

			// Ligh animation
			// directionalLight.position.set(Math.cos(elapsedTime) * 2, 1, Math.sin(elapsedTime) * 2);

			// Physics Update
			world.step(1 / 60, deltaTime, 3);
			for (const { mesh, body } of sphereRefs) {
				mesh.position.copy(body.position);
				body.applyForce(new CANNON.Vec3(-0.5, 0, 0), body.position);
			}
			for (const { mesh, body } of boxRefs) {
				mesh.position.copy(body.position);
				mesh.quaternion.copy(body.quaternion);
			}
			// plane.rotation.z += y > 1.6 ? y / 60 : 0;
			// let h = Math.hypot(x, z);
			// Other updates
			control.update();
			renderer.render(scene, camera);
			tickId = window.requestAnimationFrame(tick);
		}

		tick();
		// Dispose
		// There's still 1 texture from envMap that couldn't get disposed as no access seem to work
		function disposeScene() {
			parameters.reset(); // remove all collide eventListeners
			let disposedNumber = 0;
			console.log(
				`Scene disposal start G:${renderer.info.memory.geometries} T:${renderer.info.memory.textures}`
			);
			function disposeAll(node: any) {
				if (node.isMesh) {
					node.material?.envMap?.dispose();
					node.material?.dispose();
					console.log(node.material);
					node.geometry?.dispose();
					console.log(`Disposed ${node.type} G:${node.geometry.type} M:${node.material.type} `);
					disposedNumber += 2;
				} else if (node.isLight) {
					node.dispose();
					console.log(`Disposed ${node.type}`);
					disposedNumber += 1;
				}
			}
			scene.traverse(disposeAll);
			console.log(`Disposed method execution times on traversing ${disposedNumber}`);
			scene.clear();
			scene.removeFromParent();
			gui.destroy();
			console.log(`GUI destroyed`);
			console.log(`tickId`, tickId);
			window.cancelAnimationFrame(tickId);
			console.log(`Tick removed`);
			console.log('Scene disposal end', renderer.info);
			renderer.dispose();
			renderer.clear();
			console.log(`Renderer cleared and diposed`);
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
		right: 13vw;
	}
	canvas {
		border: none;
		box-shadow: none;
	}
</style>
