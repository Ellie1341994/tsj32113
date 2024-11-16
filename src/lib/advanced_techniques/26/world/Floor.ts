import {
	CircleGeometry,
	DoubleSide,
	Mesh,
	MeshStandardMaterial,
	RepeatWrapping,
	SRGBColorSpace,
	Texture,
	type Scene
} from 'three';
import type Resources from '../utils/Resources';
type FloorMesh = Mesh<CircleGeometry, MeshStandardMaterial>;
export default class Floor {
	#geometry = new CircleGeometry(5, 64);
	#textures = { color: {} as Texture, normal: {} as Texture };
	#material = new MeshStandardMaterial();
	constructor(
		private scene: Scene,
		private resources: Resources,
		public instance = new Mesh()
	) {
		this.setTextures();
		this.setMesh();
	}
	setTextures() {
		// Color
		this.#textures.color = this.resources.items.grassColorTexture;
		this.#textures.color.colorSpace = SRGBColorSpace;
		this.#textures.color.repeat.setScalar(1.5);
		this.#textures.color.wrapS = RepeatWrapping;
		this.#textures.color.wrapT = RepeatWrapping;
		//  Normal
		this.#textures.normal = this.resources.items.grassNormalTexture;
		this.#textures.normal.repeat.setScalar(1.5);
		this.#textures.normal.wrapS = RepeatWrapping;
		this.#textures.normal.wrapT = RepeatWrapping;
		// Setup
		this.#material.map = this.#textures.color;
		this.#material.normalMap = this.#textures.normal;
	}

	setMesh() {
		this.instance.name = 'Floor';
		this.instance.geometry = this.#geometry;
		this.instance.material = this.#material;
		this.instance.material.side = DoubleSide;
		this.instance.rotation.x = -Math.PI * 0.5;
		this.instance.receiveShadow = true;
		this.scene.add(this.instance);
	}
	destroy() {
		const renderedMesh = this.scene.getObjectByName('Floor') as FloorMesh;
		renderedMesh.geometry.dispose();
		renderedMesh.material.map?.dispose();
		renderedMesh.material.normalMap?.dispose();
		renderedMesh.material.dispose();
	}
}
