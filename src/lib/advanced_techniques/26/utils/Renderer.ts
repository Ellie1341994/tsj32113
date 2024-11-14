import {
	CineonToneMapping,
	PCFSoftShadowMap,
	PerspectiveCamera,
	WebGLRenderer,
	type Scene
} from 'three';
import type Sizes from './Sizes';
import type { TCamera } from './Camera';

export default class Renderer {
	constructor(
		private canvas: HTMLCanvasElement,
		private scene: Scene,
		private sizes: Sizes,
		private camera: TCamera,
		public instance = new WebGLRenderer({ canvas, antialias: true, alpha: true })
	) {
		instance.toneMapping = CineonToneMapping;
		instance.toneMappingExposure = 1;
		instance.shadowMap.enabled = true;
		instance.shadowMap.type = PCFSoftShadowMap;
		instance.setClearColor('#333333');
		this.resize();
		this.update();
		console.log('renderer', this);
	}
	resize() {
		this.instance.setSize(this.sizes.width, this.sizes.height);
		this.instance.setPixelRatio(this.sizes.pixelRatio);
	}

	update() {
		this.instance.render(this.scene, this.camera!);
	}
}
