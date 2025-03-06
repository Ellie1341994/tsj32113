<script lang="ts">
	import gsap from 'gsap';
	// BIG NOTE: REMAINING MEMORY ALLOCATED SEEMS TO BE INTERNAT TO THREE.JS
	// import gsap from `gsap`;
	import GUI from 'lil-gui';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	interface HTMLSpanElementExtended extends HTMLSpanElement {
		scrollTopMax?: number;
	}
	let scrollContainer: HTMLSpanElementExtended;
	onMount(() => {
		// Constants
		const ASSETS_BASE_PATH = '/assets/classic/19/textures';
		const sizes = { width: window.innerWidth * 0.75, height: innerHeight * 0.75 };
		const ASPECT_RATIO = sizes.width / sizes.height;
		const parameters = { materialColor: '#994f7a', autoScroll: true, scrollOffset: -2 };
		const meshDistance = 6;
		// Features
		// Feature: Fullscreen
		let cursor = { x: 0, y: 0, ratioX: 0, ratioY: 0 };
		window.addEventListener('mousemove', (event) => {
			cursor.x = event.clientX;
			cursor.y = event.clientY;
			cursor.ratioX = event.clientX / sizes.width - 0.5;
			cursor.ratioY = event.clientY / sizes.height - 0.5;
		});
		// Size fix on toggle off
		const setCanvasSize = () => {
			// Update camera
			camera.updateProjectionMatrix();

			// Update renderer
			renderer.setSize(sizes.width, sizes.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		};
		window.addEventListener(`resize`, setCanvasSize);
		// Full screen support
		const toggleFullscreen = () => {
			const withinCanvasArea =
				window.innerHeight * 0.15 <= cursor.y &&
				cursor.y <= window.innerHeight * 0.75 &&
				window.innerWidth * 0.125 <= cursor.x &&
				cursor.x <= window.innerWidth * 0.875;
			console.log(`WH${window.innerHeight * 0.15} cursor.y ${cursor.y}`);
			if (document.fullscreenElement) {
				document.exitFullscreen();
			} else if (withinCanvasArea) {
				canvas?.requestFullscreen();
			}
		};
		window.addEventListener(`dblclick`, toggleFullscreen);
		// GUI
		const gui = new GUI({
			title: 'Tweaks panel | Press SPACE to hide',
			container: lilGuiPlacer,
			width: 300,
			closeFolders: true
		});
		gui.add(parameters, 'autoScroll').name('Scroll animation');
		// gui.hide();
		// Hide UI
		const hideGui = (event: any) => {
			event.key === ' ' && gui.show(gui._hidden);
		};
		window.addEventListener('keydown', hideGui);
		// Textures
		const textureLoader = new THREE.TextureLoader();
		const gradientTexture = textureLoader.load(`${ASSETS_BASE_PATH}/gradients/3.jpg`);
		gradientTexture.magFilter = THREE.NearestFilter;
		// Meshes
		// const cube = new THREE.Mesh(
		// 	new THREE.BoxGeometry(1, 1),
		// 	new THREE.MeshBasicMaterial({ color: parameters.materialColor })
		// );
		const toonMaterial = new THREE.MeshToonMaterial({
			color: parameters.materialColor,
			gradientMap: gradientTexture
		});

		const torus = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), toonMaterial);
		const cone = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), toonMaterial);
		const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), toonMaterial);
		torus.position.y = -meshDistance * 2;
		cone.position.y = -meshDistance * 1;
		knot.position.y = -meshDistance * 0;

		torus.position.x = 2;
		cone.position.x = -2;
		knot.position.x = 2;
		const meshes = [knot, cone, torus];
		// Textures
		const TEXTURE_LOADER = new THREE.TextureLoader();
		const PARTICLE_TEXTURE = TEXTURE_LOADER.load(`/assets/classic/17/textures/particles/9.png`);

		// Particles
		const particlesAmount = 9999;
		const dimensions = 3;
		const vertices = new Float32Array(particlesAmount * dimensions);
		for (let i = 0; i < particlesAmount; i++) {
			const i3 = i * dimensions;
			vertices[i3] = (Math.random() - 0.5) * 10;
			vertices[i3 + 1] = meshDistance * 0.5 - Math.random() * meshDistance * meshes.length;
			vertices[i3 + 2] = (Math.random() - 0.5) * 10;
		}
		const pGeometry = new THREE.BufferGeometry();
		pGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, dimensions));
		const pMaterial = new THREE.PointsMaterial({
			color: parameters.materialColor,
			sizeAttenuation: true,
			size: 0.1,
			transparent: true,
			alphaMap: PARTICLE_TEXTURE,
			depthWrite: false
		});
		const particles = new THREE.Points(pGeometry, pMaterial);
		// particles.position.set(0, 1, -3);
		gui
			.addColor(parameters, 'materialColor')
			.name('Model color')
			.onChange(() => {
				toonMaterial.color.set(parameters.materialColor);
				pMaterial.color.set(parameters.materialColor);
			});
		// Lights
		const directionalLight = new THREE.DirectionalLight(parameters.materialColor, 3);
		directionalLight.position.set(1, 1, 0);
		// Scene
		const scene = new THREE.Scene();
		scene.add(knot, cone, torus, directionalLight, particles);
		// Camera
		const camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO, 0.1, 100);
		camera.position.z = 3;
		const cameraGroup = new THREE.Group();
		cameraGroup.add(camera);
		scene.add(cameraGroup);
		// const control = new OrbitControls(camera, canvas);
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true }); // alpha makes canvas background transparent
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearAlpha(0);

		// renderer.render(scene, camera);
		// Play
		// Scroll behavior
		const clock = new THREE.Clock();
		let previousTime = 0;
		const lerpingFactor = 5;
		const parallaxAmplitude = 0.5;
		let tickId = 0;
		let scrollY = scrollContainer.scrollTop;
		let currentView = 0;
		const updateScrollY = () => {
			scrollY = scrollContainer.scrollTop;
			const newView = Math.round(scrollY / sizes.height);
			if (currentView !== newView) {
				currentView = newView;
				// spin animation
				gsap.to(meshes[currentView].rotation, {
					duration: 1.5,
					ease: 'power2.inOut',
					x: '+=6',
					y: '+=3',
					z: '+=1.5'
				});
			}
			// console.log(`ST:${scrollContainer.scrollTop} SL:${scrollContainer.scrollLeft}`);
		};
		scrollContainer.addEventListener('scroll', updateScrollY);
		// Parallax
		gui.add(parameters, 'scrollOffset', -9, -1).step(-1).name('S. Animation speed');
		const pause = 0;
		function tick() {
			// control.update();
			const elapsedTime = clock.getElapsedTime();
			const deltaTime = elapsedTime - previousTime;
			const scrollDown = scrollContainer.scrollTop <= 0;
			const scrollUp = scrollContainer.scrollTop >= scrollContainer.scrollTopMax!;
			// console.log(
			// 	`SU ${scrollUp} SD ${scrollDown} S ${scrollContainer.scrollTop} O ${-scrollOffset}`
			// );
			if (scrollUp || scrollDown) {
				parameters.scrollOffset = -parameters.scrollOffset;
			}
			scrollContainer.scrollTop += parameters.autoScroll ? parameters.scrollOffset : pause;
			previousTime = elapsedTime;
			for (const mesh of meshes) {
				mesh.rotation.x += deltaTime * 0.1;
				mesh.rotation.y += deltaTime * 0.12;
			}

			camera.position.y = (-scrollY / sizes.height) * meshDistance;

			const parallaxX = cursor.ratioX * parallaxAmplitude;
			const parallaxY = -cursor.ratioY * parallaxAmplitude;
			// "easing - smoothing -lerping"
			cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * lerpingFactor * deltaTime;
			cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * lerpingFactor * deltaTime;
			renderer.render(scene, camera);
			tickId = window.requestAnimationFrame(tick);
		}
		tick();
		// Resources Management
		function disposeScene() {
			function disposeAll(node: any) {
				pGeometry?.dispose();
				gradientTexture.dispose();
				if (node instanceof THREE.Mesh) {
					node.geometry?.dispose();
					node.material?.dispose();
					node.material?.alphaMap?.dispose();
					console.log(`${node.type} disposed`);
				} else if ((node instanceof THREE.Texture || node.isObject3D) && node.dispose) {
					node.dispose();
				}
			}
			PARTICLE_TEXTURE.dispose();
			scene.traverse(disposeAll);
			scene.clear();
			scene.removeFromParent();
			console.log(`disposed first project allocated resources`, renderer.info);
			gui.destroy();
			console.log(`GUI destroyed`);
			console.log(`tickId`, tickId);
			window.cancelAnimationFrame(tickId);
			window.removeEventListener(`resize`, setCanvasSize);
			window.removeEventListener(`dbclick`, toggleFullscreen);
			window.removeEventListener(`keydown`, hideGui);
			console.log(`Tick disposed`);
			renderer.clear();
			renderer.dispose();
			console.log(`Renderer cleared and`);
		}
		return disposeScene;
	});
</script>

<canvas class="webgl" bind:this={canvas}></canvas>
<span class="scroll-container" bind:this={scrollContainer}>
	{#each ['knot', 'cone', 'torus'] as TITLE, i (TITLE)}
		{#if (i + 1) % 2}
			<h2>{TITLE}<sub>GEOMETRY</sub></h2>
		{:else}
			<h2><sub>{TITLE}</sub> GEOMETRY</h2>
		{/if}
	{/each}
</span>
<span class="lil-gui-placer" bind:this={lilGuiPlacer}></span>

<style lang="scss">
	span.lil-gui-placer {
		position: absolute;
		top: 15vh;
		right: 12.5vw;
		z-index: 2;
	}
	canvas {
		border: none;
		box-shadow: none;
	}
	span.scroll-container {
		overflow-y: scroll;
		scrollbar-width: none;
		// &::-webkit-scrollbar {
		// 	display: none; /* Safari and Chrome */
		// }
		position: absolute;
		color: white;
		height: 75vh;
		width: 75vw;
		padding: 1vw;
		top: 13.5vh;
		z-index: 1;
		h2 {
			height: 75vh;
			width: 75vw;
			text-transform: uppercase;
			line-height: 750%; // Centers text
			// display: flex;
			// align-items: center;
			&:nth-child(odd) {
				text-align: start;
				vertical-align: center;
				// align-self: flex-end;
			}
			&:nth-child(even) {
				// align-self: flex-start;
				text-align: end;
			}
			font-size: 69px;
		}
	}
</style>
