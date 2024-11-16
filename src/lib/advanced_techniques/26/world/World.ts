import type { Scene } from 'three';
import type Resources from '../utils/Resources';
import Environment from './Environment';
import Floor from './Floor';
import Wolf from './Wolf';
import type Time from '../utils/Time';

export default class World {
	// This methos are initialized and further redefined
	update() {}
	destroy() {}
	constructor(
		public scene: Scene,
		private resources: Resources,
		private time: Time,
		public items: { [name: string]: any } = {}
	) {
		// Env
		this.resources.on('assetsReady', () => {
			const floor = new Floor(scene, resources);
			this.items[floor.instance.name] = floor;
			const wolf = new Wolf(scene, resources);
			this.update = () => {
				wolf.update(this.time.delta);
			};
			this.resources.items.wolfModel.scene.position.y = 1;
			const environment = new Environment(scene, resources);
			this.destroy = () => {
				floor.destroy();
				wolf.destroy();
				environment.destroy();
			};
		});
	}
}
