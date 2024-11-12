<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	onMount(() => {
		// alert('hola');
		// Utils
		const parameters = {
			color: '#994f7a',
			width: innerWidth * 0.75,
			height: innerHeight * 0.75,
			get aspect_ratio() {
				return this.width / this.height;
			},
			assets_path: '/assets/advanced/21/models',
			modelLoadReady: false
		};
		// Meshes
		const createSphere = () =>
			new THREE.Mesh(
				new THREE.SphereGeometry(1.5),
				new THREE.MeshStandardMaterial({ color: parameters.color, metalness: 0.3, roughness: 0.4 })
			);
		const spheres = [createSphere(), createSphere(), createSphere()];
		const [s1, s2, s3] = spheres;
		s1.receiveShadow = true;
		s2.receiveShadow = true;
		s3.receiveShadow = true;
		s1.position.x = -5;
		s3.position.x = 5;
		s1.updateMatrixWorld();
		s2.updateMatrixWorld();
		s3.updateMatrixWorld();
		// Lights
		const ambientLight = new THREE.AmbientLight('#ffffff');
		ambientLight.castShadow = true;
		const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.set(1024, 1024);
		directionalLight.position.set(0, 9, 3);
		// Raycaster
		const raycaster = new THREE.Raycaster();
		// Scene
		const scene = new THREE.Scene();
		scene.add(s1, s2, s3, ambientLight, directionalLight, new THREE.AxesHelper(100));
		// Coords
		let mouse = new THREE.Vector2(0, 0);
		canvas.addEventListener('mousemove', (event) => {
			mouse.x = ((event.clientX - canvas.offsetLeft) / parameters.width) * 2 - 1;
			mouse.y = -((event.clientY - canvas.offsetTop) / parameters.height) * 2 + 1;
			// console.log(`CX: ${event.clientX} CY:${event.clientY}`, event);
			// console.log(mouse);
		});
		canvas.addEventListener('click', (event) => {
			if (currentIntersect) {
				if (!currentIntersect.object) {
					// duckObj.scale.x === 5 ? duckObj.scale.set(1, 1, 1) : duckObj.scale.set(5, 5, 5);
					console.log('duck');
				} else {
					switch (currentIntersect.object) {
						case s1:
							console.log('s1');
							break;
						case s2:
							console.log('s2');
							break;
						case s3:
							console.log('s3');
							break;
						case duckObj:
							console.log('duck');
							break;
						default:
							console.log('no case');
					}
				}
			}
		});
		// Loader
		let duckObj: any = null;
		const gltfLoader = new GLTFLoader();
		const dracoLoader = new DRACOLoader();
		gltfLoader.setDRACOLoader(dracoLoader);
		dracoLoader.setDecoderPath('../../node_modules/three/examples/jsm/libs/draco/');
		gltfLoader.load(
			// `${parameters.assets_path}/Duck/glTF/Duck.gltf`,
			// `${ASSETS_PATH}/Duck/glTF-Binary/Duck.glb`,
			// `${ASSETS_PATH}/FlightHelmet/glTF/FlightHelmet.gltf`,
			`${parameters.assets_path}/Duck/glTF-Draco/Duck.gltf`,
			// `${parameters.assets_path}/Fox/glTF/Fox.gltf`,
			(gltf) => {
				// gltf.scene.scale.set(0.05, 0.05, 0.05);
				gltf.scene.scale.set(3, 3, 3);
				gltf.scene.position.z = -5;
				gltf.scene.rotation.y = Math.PI * 1.5;
				duckObj = gltf.scene;
				parameters.modelLoadReady = true;
				// scene.add(gltf.scene);
				// console.log('loaded');
			}
		);
		// Camera
		const camera = new THREE.PerspectiveCamera(75, parameters.aspect_ratio);
		camera.position.set(0, 6, 9);
		const control = new OrbitControls(camera, canvas);
		control.enableDamping = true;
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
		renderer.setSize(parameters.width, parameters.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		// Play
		const clock = new THREE.Clock();
		let currentIntersect: any = null;
		let tickId = 0;
		function tick() {
			// Updates
			if (parameters.modelLoadReady && !duckObj._isLoaded) {
				scene.add(duckObj);
				duckObj._isLoaded = true;
			}
			control.update();

			// Animate
			const elapsedTime = clock.getElapsedTime();
			s1.position.y = Math.sin(elapsedTime + Math.PI) * 1.5 * 3;
			s2.position.y = Math.sin(elapsedTime + Math.PI / 1.5) * 1.5 * 3;
			s3.position.y = Math.sin(elapsedTime + Math.PI / 2) * 1.5 * 3;
			// SPHERE Raycaster intersect
			// const raycasterOrigin = new THREE.Vector3(-9, 0, 0);
			// const raycasterDirection = new THREE.Vector3(10, 0, 0);
			// raycasterDirection.normalize(); // raycaster direction should be always normalized ( it requires a versor)
			// raycaster.set(raycasterOrigin, raycasterDirection);
			// const intersect = raycaster.intersectObject(s2);
			// console.log(intersect);
			raycaster.setFromCamera(mouse, camera);
			// @ts-ignore
			const intersects = raycaster.intersectObjects(spheres);
			for (const sphere of spheres) {
				// @ts-ignore
				sphere.material.color.set(parameters.color);
			}
			for (const intersect of intersects) {
				// @ts-ignore
				intersect.object?.material?.color.set('#ff3e99');
			}
			// Common asked code solution on bruno's course about events
			if (intersects.length) {
				if (!currentIntersect) {
					// console.log('mouse enter');
				}
				currentIntersect = intersects[0];
			} else if (currentIntersect) {
				// console.log('mouse leave');
				currentIntersect = null;
			}
			// DUCK Raycaster intersect
			if (duckObj?._isLoaded) {
				const modelIntersect = raycaster.intersectObject(duckObj);
				currentIntersect = modelIntersect;
				if (modelIntersect.length) {
					duckObj.scale.set(5, 5, 5);
				} else {
					duckObj.scale.set(3, 3, 3);
				}
				// console.log(modelIntersect);
			}
			// render
			renderer.render(scene, camera);

			// else
			tickId = requestAnimationFrame(tick);
		}
		tick();
		// Dispose
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
