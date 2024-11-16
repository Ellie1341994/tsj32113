import { PerspectiveCamera, type Scene } from 'three';
import type Sizes from './Sizes';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export type TCamera<C = PerspectiveCamera> = C | undefined;

export default class Camera {
	#controls: OrbitControls | null = null;
	constructor(
		private sizes: Sizes,
		private canvas: HTMLCanvasElement,
		private scene?: Scene,
		public instance: TCamera = undefined
	) {
		this.setPerspectiveCamera();
		this.setOrbitControls();
	}
	setPerspectiveCamera() {
		this.instance = new PerspectiveCamera(75, this.sizes.aspectRatio, 1, 100);
		this.instance.position.set(0, 5, 9);
	}
	setOrbitControls() {
		this.#controls = new OrbitControls(this.instance!, this.canvas);
		this.#controls.enableDamping = true;
	}
	resize() {
		this.instance!.aspect = this.sizes.aspectRatio;
		this.instance?.updateProjectionMatrix();
	}
	update() {
		this.#controls?.update();
	}
	destroy() {
		this.#controls?.dispose();
	}
}
