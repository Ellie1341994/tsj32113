import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type { TSources } from '../sources';
import EventEmitter from './EventEmitter';
import { CubeTextureLoader, TextureLoader } from 'three';

export default class Resources extends EventEmitter {
	#gltfLoader = new GLTFLoader();
	#textureLoader = new TextureLoader();
	#cubeTextureLoader = new CubeTextureLoader();
	constructor(
		public sources: TSources,
		public items: any = {},
		public remaininLoads = sources.length,
		public loaded = 0
	) {
		super();
		this.load();
	}

	load() {
		for (const source of this.sources) {
			console.log(source);
		}
	}
}
