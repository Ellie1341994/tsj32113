import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type { TSource } from '../sources';
import EventEmitter from './EventEmitter';
import { CubeTextureLoader, TextureLoader } from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
export default class Resources extends EventEmitter {
	constructor(
		public sources: TSource[],
		public items: any = {},
		public loaded = 0,
		private loaders = {
			gltfLoader: new GLTFLoader(),
			textureLoader: new TextureLoader(),
			cubeTextureLoader: new CubeTextureLoader(),
			dracoLoader: new DRACOLoader()
		}
	) {
		super();
		loaders.dracoLoader.setDecoderPath('/assets/draco/');
		loaders.gltfLoader.setDRACOLoader(loaders.dracoLoader);
		this.load();
	}

	load() {
		for (const { path, type, name } of this.sources) {
			this.loaders[type].load(path as any, (file) => {
				this.items[name] = file;
				this.loaded++;
				const allSourcesLoaded = this.loaded === this.sources.length;
				if (allSourcesLoaded) {
					this.trigger('assetsReady');
				}
			});
		}
	}
}
