import { AnimationMixer, Mesh, type Scene } from 'three';
import type Resources from '../utils/Resources';
import type Time from '../utils/Time';

export default class Wolf {
	constructor(
		public scene: Scene,
		private resources: Resources,
		private resource = resources.items.wolfModel,
		private model = resources.items.wolfModel.scene,
		private animation = { mixer: new AnimationMixer(model) }
	) {
		model.traverse((node: any) => {
			if (node instanceof Mesh) {
				node.castShadow = true;
			}
		});
		animation.mixer.clipAction(resource.animations[0]).play();
		// animation.action.play();
		scene.add(resources.items.wolfModel.scene);
		// console.log(animation.action);
	}
	// setAnimation() {
	// }
	update(delta: number) {
		// this.animation.mixer?.update(this.time.delta * 0.001);
		this.animation.mixer?.update(delta * 0.001);
	}
}
