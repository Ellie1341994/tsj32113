<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
	import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
	import { goto } from '$app/navigation';
	import gsap from 'gsap';

	let canvas: HTMLCanvasElement;
	onMount(() => {
		// Utils
		const parameters = {
			s: 0,
			get width() {
				return innerWidth;
			},
			get height() {
				return innerHeight;
			},
			color: '#997766',
			get aspectRatio() {
				return this.width / this.height;
			},
			cursor: {
				x: 0,
				y: 0
			},
			intersections: [] as any
		};

		const setRendererSize = () => {
			// console.log('Window size has changed.');
			// Camera AR update
			camera.aspect = parameters.aspectRatio;
			camera.updateProjectionMatrix();
			// Renderer
			renderer.setSize(parameters.width, parameters.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
			renderer.render(scene, camera);
		};
		addEventListener('resize', setRendererSize);
		addEventListener('mousemove', ({ clientX, clientY }) => {
			parameters.cursor.x = (clientX / innerWidth) * 2 - 1;
			parameters.cursor.y = -((clientY / innerHeight) * 2 - 1);
		});
		addEventListener('mousedown', ({ button }) => {
			const leftClick = 0;
			if (button === leftClick) {
				const [{ object = { name: '' } } = {}] = parameters?.intersections;
				/challenges|basics/.test(object.name) && goto(`/${object.name}`);
				console.log(object);
			}
		});
		// Textures
		// Lights
		const light = new THREE.HemisphereLight('#ffffff', 9);
		// Scene
		const scene = new THREE.Scene();
		// Loader
		const fontLoader = new FontLoader();
		fontLoader.load('fonts/optimer_regular.typeface.json', (font) => {
			console.log('loaded');
			// Geometries
			const challengesTextGeometry = new TextGeometry('Challenges', {
				font,
				size: 0.5,
				depth: 0.2,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.03,
				bevelSize: 0.02,
				bevelOffset: 0,
				bevelSegments: 5
			});
			challengesTextGeometry.center();
			const projectsTextGeometry = new TextGeometry('[#]Projects', {
				font,
				size: 0.5,
				depth: 0.2,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.03,
				bevelSize: 0.02,
				bevelOffset: 0,
				bevelSegments: 5
			});
			projectsTextGeometry.center();
			// Materials
			const challengesTextMaterial = new THREE.MeshStandardMaterial({
				color: '#ff6699'
				// metalness: 0.3
				// roughness: 0.9
			});
			const projectsTextMaterial = new THREE.MeshStandardMaterial({
				color: '#ff6699',

				wireframe: false
			});
			// Meshes
			const challengesText = new THREE.Mesh(challengesTextGeometry, challengesTextMaterial);
			challengesText.name = 'challenges';
			const projectsText = new THREE.Mesh(projectsTextGeometry, projectsTextMaterial);
			projectsText.name = 'basics';
			// Params
			challengesText.position.x = -2;
			projectsText.position.x = 2;
			challengesText.rotation.y = Math.PI * 0.15;
			projectsText.rotation.y = -challengesText.rotation.y;
			scene.add(challengesText, projectsText);
		});
		scene.add(light);
		// Raycaster
		const raycaster = new THREE.Raycaster();
		// Camera
		const camera = new THREE.PerspectiveCamera(75, parameters.aspectRatio);
		camera.position.set(0, 0, 4);
		const control = new OrbitControls(camera, canvas);
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		renderer.setSize(parameters.width, parameters.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		// Play
		let tickId = 0;
		const clock = new THREE.Clock();
		let currentHoveredObj: any = undefined;
		let scalingAnimationOn = false;
		function tick() {
			const elapsedTime = clock.getElapsedTime();
			cancelAnimationFrame(tickId);
			// Update
			control.update();
			// Intersect
			const { x, y } = parameters.cursor;
			const pointer = new THREE.Vector2(x, y);
			raycaster.setFromCamera(pointer, camera);
			parameters.intersections = raycaster.intersectObjects(scene.children);
			if (!scalingAnimationOn) {
				if (parameters.intersections.length && !currentHoveredObj) {
					const [{ object }] = parameters?.intersections;
					currentHoveredObj = object;
					scalingAnimationOn = true;
					gsap.to(currentHoveredObj.scale, { x: 1.25, y: 1.25, z: 1.25, duration: 1 }).then(() => {
						scalingAnimationOn = false;
					});
				}
				if (!parameters.intersections.length && currentHoveredObj) {
					scalingAnimationOn = true;

					gsap.to(currentHoveredObj.scale, { x: 1, y: 1, z: 1, duration: 1 }).then(() => {
						scalingAnimationOn = false;
					});
					currentHoveredObj = undefined;
				}
			}
			// Render
			renderer.render(scene, camera);
			tickId = requestAnimationFrame(tick);
		}
		tick();
	});
</script>

<canvas class="webgl" bind:this={canvas}></canvas>

<!-- <div>
	<h1>
		<a class="" href="/challenges"> Challenges</a>
	</h1>
	<h1><a href="/basics">Projects</a></h1>
</div> -->

<style lang="scss">
	canvas {
		border: none;
		box-shadow: none;
	}
	// div {
	// 	height: 100%;
	// 	// width: 100%;
	// 	display: flex;
	// 	align-items: center;
	// 	justify-content: space-around;
	// 	h1 {
	// 		font-size: min(5vh, 5vw);
	// 		a {
	// 			text-decoration: none;
	// 			text-transform: capitalize;
	// 			color: var(--color-theme-3);
	// 			&:hover:not(.disabled-link) {
	// 				--shadow-color: white;
	// 				text-shadow:
	// 					0vh 0vh 0.1vh #000,
	// 					0vh 0vh 10vh var(--shadow-color),
	// 					0vh 0vh 10vh var(--shadow-color),
	// 					0vh 0vh 10vh var(--shadow-color),
	// 					0vh 0vh 15vh var(--shadow-color),
	// 					0vh 0vh 20vh var(--shadow-color),
	// 					0vh 0vh 25vh var(--shadow-color);
	// 			}
	// 		}
	// 	}
	// }
</style>
