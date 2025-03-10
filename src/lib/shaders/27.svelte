<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import gsap from 'gsap';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import GUI from 'lil-gui';
	// import testVertexShadow from './27/colorInterpolationTerrain/vertex.vert?raw';
	// import testFragmentShader from './27/colorInterpolationTerrain/fragment.frag?raw';
	import testVertexShadow from './27/deformation/vertex.vert?raw';
	import testFragmentShader from './27/deformation/fragment.frag?raw';
	import anotherVertexShadow from './27/nonRawShader/vertex.vert?raw';
	import anotherFragmentShader from './27/nonRawShader/fragment.frag?raw';
	let canvas: HTMLCanvasElement;
	let lilGuiPlacer: HTMLSpanElement;
	const wideScreen = innerWidth > 888;
	onMount(() => {
		// Utils
		const parameters = {
			s: 0,
			get width() {
				return innerWidth * 0.75;
			},
			get height() {
				return innerHeight * 0.75;
			},
			color: '#997766',
			get aspectRatio() {
				return this.width / this.height;
			}
		};
		const gui = new GUI({
			title: 'Tweaks panel',
			width: wideScreen ? 300 : 340 * 0.75,
			container: lilGuiPlacer
		});
		// Extras
		const setRendererSize = () => {
			// console.log('Window size has changed.');
			// Camera AR update
			camera.aspect = parameters.aspectRatio;
			camera.updateProjectionMatrix();
			// Renderer
			renderer.setSize(parameters.width, parameters.height);
			renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); // avoid pixel ratios above 2 ( or 3) due to over rendering
			renderer.render(scene, camera);
		};
		addEventListener('resize', setRendererSize);
		gui.close();
		// Textures
		// Loader
		const textureLoader = new THREE.TextureLoader();
		const flagTexture = textureLoader.load('/assets/shaders/27/textures/arg-flag.jpg');
		const anotherFlagTexture = textureLoader.load('/assets/shaders/27/textures/flatargflag.jpg');
		// Meshes
		const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

		const count = geometry.attributes.position.count;
		const randoms = new Float32Array(count);
		for (let i = 0; i < count; i++) {
			randoms[i] = Math.random();
		}
		console.log(geometry);
		geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
		// Shaders
		// Materials
		const material = new THREE.RawShaderMaterial({
			vertexShader: testVertexShadow,
			fragmentShader: testFragmentShader,
			uniforms: {
				uFrequency: { value: new THREE.Vector2(10, 5) },
				uTime: { value: 0 },
				uColor: { value: new THREE.Color('orange') },
				uTexture: { value: flagTexture }
			},
			side: THREE.DoubleSide
		});
		gui.add(material.uniforms.uFrequency.value, 'x', -20, 20, 0.01).name('uniform_uFrequency');
		gui.add(material.uniforms.uFrequency.value, 'y', -20, 20, 0.01).name('uniform_uFrequency');
		const realisticFlag = new THREE.Mesh(geometry, material);
		realisticFlag.scale.set(1.5, 1, 1.5);

		// anotherMesh
		const anotherGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
		const anotherMaterial = new THREE.ShaderMaterial({
			vertexShader: anotherVertexShadow,
			fragmentShader: anotherFragmentShader,
			uniforms: {
				uFrequency: { value: new THREE.Vector2(10, 5) },
				uTime: { value: 0 },
				uColor: { value: new THREE.Color('red') },
				uTexture: { value: anotherFlagTexture }
			},
			side: THREE.DoubleSide
		});
		const unrealisticFlag = new THREE.Mesh(anotherGeometry, anotherMaterial);
		unrealisticFlag.scale.set(1.5, 1, 1.5);

		// Lights
		const abmbientLight = new THREE.AmbientLight('#ffffff', 6);
		// Scene
		const scene = new THREE.Scene();
		unrealisticFlag.visible = false;
		gui
			.add(unrealisticFlag, 'visible')
			.name('Swap flags')
			.onChange(() => {
				realisticFlag.visible = !realisticFlag.visible;
			});
		scene.add(abmbientLight, realisticFlag, unrealisticFlag);
		// Camera
		// Cube camera
		// Normal
		const camera = new THREE.PerspectiveCamera(75, parameters.aspectRatio);
		camera.position.set(0, 0, 2);
		const control = new OrbitControls(camera, canvas);
		// Renderer
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		renderer.setSize(parameters.width, parameters.height);
		renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

		// Play
		let tickId = 0;
		const clock = new THREE.Clock();
		function tick() {
			const elapsedTime = clock.getElapsedTime();
			material.uniforms.uTime.value = elapsedTime;
			anotherMaterial.uniforms.uTime.value = elapsedTime;
			cancelAnimationFrame(tickId);
			// Update
			control.update();
			// Render
			renderer.render(scene, camera);
			tickId = requestAnimationFrame(tick);
		}
		tick();
		// Dispose
		function disposeScene() {
			removeEventListener('resize', setRendererSize);
			cancelAnimationFrame(tickId);
			function disposeAll(node: any) {
				if (node instanceof THREE.Mesh || node instanceof THREE.Points) {
					for (const key in node.material) {
						if (node.material[key] && typeof node.material[key].dispose === 'function') {
							node.material[key].dispose();
							console.log(`${key} disposed`);
						}
					}
					node.material?.dispose();
					node.geometry?.dispose();
					console.log(
						`Disposed ${node.name} ${node.type} G:${node.geometry.type} M:${node.material.type} `
					);
				} else if (node instanceof THREE.Light || node instanceof THREE.CameraHelper) {
					node.dispose();
					console.log(`Disposed ${node.type}`);
				} else if (node instanceof THREE.Texture) {
					node.dispose();
					console.log(`Disposed ${node.type}`);
				} else {
					console.log('NOT DISPOSED', node);
				}
			}
			control.dispose();
			scene.environment?.dispose;
			scene.traverse(disposeAll);
			gui.destroy();
			renderer.dispose();
			console.log(`Experience ended`, renderer.info);
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
		right: calc(12.5vw + 1vh);
	}
	canvas {
		border: none;
		box-shadow: none;
	}
	@media (max-width: 666px) {
		span.lil-gui-placer {
			position: absolute;
			top: 19vh;
			left: calc(12vw + 1.5vh);
			width: 10vw;
		}
	}
</style>
