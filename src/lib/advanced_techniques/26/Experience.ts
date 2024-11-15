import World from './world/World.ts';
import Camera from './utils/Camera.ts';
import Renderer from './utils/Renderer.ts';
import Sizes from './utils/Sizes.ts';
import Time from './utils/Time.ts';
import { Scene } from 'three';
import Environment from './world/Environment.ts';
import Resources from './utils/Resources.ts';
import sources from './sources.ts';

declare const window: Window & {
	experience?: Experience;
};

let singletonInstance: Experience | null = null;
export default class Experience {
	constructor(
		public canvas: HTMLCanvasElement,
		public sizes = new Sizes(),
		public time = new Time(),
		public scene = new Scene(),
		public resources = new Resources(sources),
		public camera = new Camera(sizes, canvas),
		public renderer = new Renderer(canvas, scene, sizes, camera.instance),
		public world = new World(scene, resources, time)
	) {
		// Checks
		if (!canvas) {
			throw new Error('Corrupted or missing HTMLCanvasElement');
		}
		if (singletonInstance) {
			return singletonInstance;
		}
		singletonInstance = this;
		//  Setup
		sizes.on('resize', () => {
			this.resize();
		});
		time.on('tick', () => {
			this.update();
		});

		// Browser access
		window.experience = this;
	}
	resize() {
		this.sizes.updateAll();
		this.camera.resize();
		this.renderer.resize();
	}
	update() {
		// console.log('Tick update');
		this.camera.update();
		this.world.update();
		this.renderer.update();
	}
}
