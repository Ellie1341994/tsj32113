import {
	DirectionalLight,
	DirectionalLightHelper,
	type Scene,
	Texture,
	SRGBColorSpace,
	MeshStandardMaterial,
	Mesh
} from 'three';
import type Resources from '../utils/Resources';

export default class Environment {
	#sunlight: DirectionalLight = new DirectionalLight('#ffffff', 9);
	#environmentMap = { intensity: 0.4, texture: {} as Texture };
	constructor(
		private scene: Scene,
		private resources: Resources
	) {
		this.setSunlight();
		this.setEnvironmentMap();
		this.updateMaterials();
	}
	setSunlight() {
		this.#sunlight.castShadow = true;
		this.#sunlight.position.set(-3.5, 2, 1.25);
		this.#sunlight.shadow.camera.near = 1;
		this.#sunlight.shadow.camera.far = 15;
		this.#sunlight.shadow.mapSize.setScalar(1024);
		this.#sunlight.shadow.camera.left = -25;
		this.#sunlight.shadow.camera.right = 25;
		this.#sunlight.shadow.camera.top = 25;
		this.#sunlight.shadow.camera.bottom = -25;
		this.scene.add(this.#sunlight, new DirectionalLightHelper(this.#sunlight));
	}
	setEnvironmentMap() {
		this.#environmentMap.texture = this.resources.items.environmentMapTexture;
		this.#environmentMap.texture.colorSpace = SRGBColorSpace;
		this.scene.environment = this.#environmentMap.texture;
		// this.scene.background = this.#environmentMap.texture;
	}
	updateMaterials() {
		this.scene.traverse((node) => {
			if (node instanceof Mesh && node.material instanceof MeshStandardMaterial) {
				node.material.envMap = this.#environmentMap.texture;
				node.material.envMapIntensity = this.#environmentMap.intensity;
				node.material.needsUpdate = true;
			}
		});
	}
}
