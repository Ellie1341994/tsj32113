import {
	DirectionalLight,
	DirectionalLightHelper,
	type Scene,
	Texture,
	SRGBColorSpace,
	MeshStandardMaterial,
	Mesh,
	Vector2
} from 'three';
import type Resources from '../utils/Resources';
import Gui from '../utils/Gui';

export default class Environment {
	#sunlight: DirectionalLight = new DirectionalLight('#ffffff', 6);
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
		this.#sunlight.shadow.mapSize.setScalar(512 * 4);
		this.#sunlight.shadow.camera.left = -25;
		this.#sunlight.shadow.camera.right = 25;
		this.#sunlight.shadow.camera.top = 25;
		this.#sunlight.shadow.camera.bottom = -25;
		this.updateMaterials = this.updateMaterials.bind(this);
		this.scene.add(
			this.#sunlight
			// new DirectionalLightHelper(this.#sunlight)
		);
	}
	setEnvironmentMap() {
		this.#environmentMap.texture = this.resources.items.environmentMapTexture;
		this.#environmentMap.texture.colorSpace = SRGBColorSpace;
		this.scene.environment = this.#environmentMap.texture;
		// this.scene.background = this.#environmentMap.texture;
		if (location.hash === '#devMode') {
			const gui = new Gui().instance;
			const shadowParams = { shadowMapSizeOption: 512 * 4 };
			const environmentFolder = gui!.addFolder('Environment');
			environmentFolder
				.add(this.#environmentMap, 'intensity', 0, 10, 0.1)
				.name('envMapIntensity')
				.onFinishChange(this.updateMaterials);
			environmentFolder
				.add(this.#sunlight, 'intensity', 0, 10, 0.1)
				.name('sunlightIntensity')
				.onFinishChange(this.updateMaterials);
			environmentFolder
				.add(this.#sunlight.position, 'x', -10, 10, 0.1)
				.name('sunlightHorizontalPos')
				.onFinishChange(this.updateMaterials);
			environmentFolder
				.add(shadowParams, 'shadowMapSizeOption', [512 / 2, 512, 512 * 2, 512 * 3, 512 * 4])
				.name('sunlightShadowMapSize')
				.onFinishChange((size: number) => {
					this.#sunlight.shadow.map?.dispose();
					this.#sunlight.shadow.map = null;
					this.#sunlight.shadow.mapSize = new Vector2(size, size);
				});
		}
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
