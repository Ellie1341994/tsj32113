import { DirectionalLight, DirectionalLightHelper, type Scene } from 'three';

export default class Environment {
	#sunlight: DirectionalLight = new DirectionalLight('#ffffff', 9);
	constructor(
		private scene: Scene
		// protected sunlight?: DirectionalLight
	) {
		this.setSunlight();
	}
	setSunlight() {
		this.#sunlight.castShadow = true;
		this.#sunlight.position.set(3.5, 2, 1.25);
		this.#sunlight.shadow.camera.near = 1;
		this.#sunlight.shadow.camera.far = 15;
		this.#sunlight.shadow.mapSize.setScalar(1024);
		this.#sunlight.shadow.camera.left = -25;
		this.#sunlight.shadow.camera.right = 25;
		this.#sunlight.shadow.camera.top = 25;
		this.#sunlight.shadow.camera.bottom = -25;
		this.scene.add(this.#sunlight, new DirectionalLightHelper(this.#sunlight));
	}
}
