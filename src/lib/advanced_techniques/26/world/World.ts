import { BoxGeometry, Mesh, MeshStandardMaterial, Scene } from 'three';
import type Resources from '../utils/Resources';
import Environment from './Environment';
import Floor from './Floor';

export default class World {
	constructor(
		public scene: Scene,
		private resources: Resources
	) {
		// const geometry = new BoxGeometry(1, 1, 1);
		// const material = new MeshStandardMaterial({ color: 0x996699 });
		// const mesh = new Mesh(geometry, material);
		// this.scene.add(mesh);

		// Env
		this.resources.on('assetsReady', () => {
			new Floor(scene, resources);
			new Environment(scene, resources);
			this.resources.items.wolfModel.scene.position.y = 1;
			this.scene.add(this.resources.items.wolfModel.scene);
		});
	}
}
