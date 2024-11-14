import {
	BoxGeometry,
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

export default class Floor {
	#geometry = new CircleGeometry(5, 64);
	#textures = { color: {} as Texture, normal: {} as Texture };
	#material = new MeshStandardMaterial();
	#mesh = new Mesh();
	constructor(
		private scene: Scene,
		private resources: Resources
	) {
		// let floorMesh = new Mesh(
		// 	new BoxGeometry(5, 1, 5),
		// 	new MeshStandardMaterial({ color: '#ff3399', envMap: resources.items.environmentMapTexture })
		// );
		// floorMesh.position.y = -1;
		// scene.add(floorMesh);
		// this.setGeometry();
		this.setTextures();
		this.setMaterial();
		this.setMesh();
	}
	// setGeometry() {
	// }
	setTextures() {
		// Color
		this.#textures.color = this.resources.items.grassColorTexture;
		this.#textures.color.colorSpace = SRGBColorSpace;
		this.#textures.color.repeat.setScalar(1.5);
		this.#textures.color.wrapS = RepeatWrapping;
		this.#textures.color.wrapT = RepeatWrapping;
		//  Normal
		this.#textures.normal = this.resources.items.grassColorTexture;
		this.#textures.normal.repeat.setScalar(1.5);
		this.#textures.normal.wrapS = RepeatWrapping;
		this.#textures.normal.wrapT = RepeatWrapping;
	}
	setMaterial() {
		this.#material.map = this.#textures.color;
		this.#material.normalMap = this.#textures.normal;
	}
	setMesh() {
		this.#mesh.geometry = this.#geometry;
		this.#mesh.material = this.#material;
		this.#mesh.rotation.x = -Math.PI * 0.5;
		this.#mesh.material.side = DoubleSide;
		this.#mesh.receiveShadow = true;
		this.scene.add(this.#mesh);
	}
}
