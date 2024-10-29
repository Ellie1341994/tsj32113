<script lang="ts">
	import gsap from 'gsap';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	let canvas: HTMLCanvasElement;
	onMount(() => {
		// Scene
		const scene = new THREE.Scene();
		// Axis Helper

		const axesHelper = new THREE.AxesHelper(27);
		axesHelper.rotation.set(Math.PI / 12, -Math.PI / 6, 0);
		axesHelper.setColors('green', 'magenta', 'yellow');

		// Objects
		// Group
		const group = new THREE.Group();
		group.scale.y = 1;
		group.rotation.y = 0;
		// Cubes
		// CUBE3 written with previous code
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0xaf6606 });

		// Mesh
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.x = 1.45;
		mesh.position.y = 0;
		mesh.position.z = 0;

		// Potentially useful prop.
		// mesh.position.normalize();

		mesh.scale.x = 1;
		mesh.scale.y = 1;
		mesh.scale.z = 1;

		// mesh.rotation.x = Math.PI * 0.25;
		mesh.rotation.y = Math.PI * 0.15;
		group.add(mesh);

		const CUBE2 = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({ color: 0x006669 })
		);
		CUBE2.position.x = 0;
		group.add(CUBE2);

		const CUBE3 = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshBasicMaterial({ color: 0xff0066 })
		);
		CUBE3.rotation.y = -Math.PI * 0.15;
		CUBE3.position.x = -1.45;
		group.add(CUBE3);

		// Aggregate
		scene.add(axesHelper);
		scene.add(group);

		// Sizes

		const sizes = {
			width: innerWidth * 0.75,
			height: innerHeight * 0.75
		};

		// Camera

		const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
		camera.position.z = 3;

		// Potentially useful prop.
		// camera.lookAt(mesh.position);

		// Aggregate +
		scene.add(camera);

		// Renderer

		const renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(sizes.width, sizes.height);

		// Animations with native js fix for differente machine framerates
		// let time = Date.now();

		// const Tick = () => {
		//     // test log
		//     console.log('tick')
		//     // Changing prop
		//     const CURRENT_TIME = Date.now();
		//     const DELTA_TIME = CURRENT_TIME - time;
		//     time = CURRENT_TIME;
		//     mesh.rotation.z += -0.001 * DELTA_TIME;
		//     CUBE2.rotation.x += 0.001 * DELTA_TIME;
		//     CUBE3.rotation.z += 0.001 * DELTA_TIME;
		//     // group.rotation.y += 0.01;
		//     // Render
		//     renderer.render(scene, camera);
		//     window.requestAnimationFrame(Tick);
		// }

		// Tick();

		// Animations using Clock solution for different machine framerates
		// const CLOCK = new THREE.Clock();
		// const Tick = () => {
		//     // test log
		//     console.log('tick')

		//     const ELAPSED_TIME = CLOCK.getElapsedTime();
		//     // Changing prop
		//     mesh.rotation.z = ELAPSED_TIME * Math.PI;
		//     CUBE2.rotation.x = ELAPSED_TIME * Math.PI * -0.5;
		//     CUBE3.rotation.z = ELAPSED_TIME * Math.PI;

		//     // Using trigonometry for fun animations
		//     CUBE2.position.y = Math.cos(ELAPSED_TIME);
		//     CUBE2.position.z = -Math.sin(ELAPSED_TIME);
		//     const scaleValue = Math.sin(ELAPSED_TIME) + 1.25;
		//     CUBE2.scale.set(scaleValue, scaleValue, scaleValue);

		//     // group.rotation.y += 0.01;
		//     // Render
		//     renderer.render(scene, camera);
		//     window.requestAnimationFrame(Tick);
		// }

		// Tick();

		// gsap.to(mesh.position, {duration: 1, delay: 0, x:2, repeat: -1, repeatDelay: 1});
		gsap.fromTo(
			mesh.position,
			{ x: 1.45 },
			{ duration: 1, delay: 0.1, x: 2, repeat: -1, yoyo: true }
		);
		gsap.fromTo(
			CUBE3.position,
			{ x: -1.45 },
			{ duration: 1, delay: 0.1, x: -2, repeat: -1, yoyo: true }
		);

		let tickId: number = 0;
		const Tick = () => {
			// test log
			console.log('tick');
			//     // Render
			renderer.render(scene, camera);
			tickId = window.requestAnimationFrame(Tick);
		};

		console.log(tickId);
		Tick();
		function disposeScene() {
			scene.traverse((node: any) => {
				if (node instanceof THREE.Mesh) {
					node.geometry?.dispose();
					node.material?.dispose();
					console.log(`${node.type} disposed`);
				}
			});
			axesHelper.dispose();
			scene.clear();
			scene.removeFromParent();
			console.log('disposed first project allocated resources', renderer.info);
			console.log('tickId', tickId);
			window.cancelAnimationFrame(tickId);
			renderer.clear();
			renderer.dispose();
			console.log('Renderer cleared and diposed');
		}
		return disposeScene;
	});
</script>

<canvas class="webgl" bind:this={canvas}></canvas>
