import { BoxGeometry, Mesh, MeshStandardMaterial, Scene } from 'three';

export default class World {
	constructor(public scene: Scene) {
		const geometry = new BoxGeometry(1, 1, 1);
		const material = new MeshStandardMaterial({ color: 0x996699 });
		const mesh = new Mesh(geometry, material);
		this.scene.add(mesh);
	}
}
