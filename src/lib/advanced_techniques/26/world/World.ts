import { BoxGeometry, Mesh, MeshStandardMaterial, Scene } from 'three';
import type Resources from '../utils/Resources';
import Environment from './Environment';
import Floor from './Floor';
import Wolf from './Wolf';
import type Time from '../utils/Time';

export default class World {
	constructor(
		public scene: Scene,
		private resources: Resources,
		private time: Time
	) {
		// Env
		this.resources.on('assetsReady', () => {
			new Floor(scene, resources);
			const wolfInstance = new Wolf(scene, resources);
			this.update = () => {
				wolfInstance.update(time.delta);
			};
			new Environment(scene, resources);
			this.resources.items.wolfModel.scene.position.y = 1;
		});
	}
	update() {}
}
