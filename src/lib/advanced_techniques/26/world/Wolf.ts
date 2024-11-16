import { AnimationMixer, Mesh, type Scene } from 'three';
import type Resources from '../utils/Resources';
import Gui from '../utils/Gui';

export default class Wolf {
	constructor(
		public scene: Scene,
		private resources: Resources,
		private resource = resources.items.wolfModel,
		private model = resources.items.wolfModel.scene,
		private animationSetup = { mixer: new AnimationMixer(model) }
	) {
		model.traverse((node: any) => {
			if (node instanceof Mesh) {
				node.castShadow = true;
			}
		});

		scene.add(resources.items.wolfModel.scene);
		// Gui handlers
		let currentAction: any = null;
		if (location.hash === '#devMode') {
			const gui = new Gui().instance;
			const wolfGuiFolder = gui!.addFolder('Wolf');
			wolfGuiFolder.add(
				{
					stop: () => {
						animationSetup.mixer.stopAllAction();
					}
				},
				'stop'
			);
			for (const animation of resource.animations) {
				wolfGuiFolder.add(
					{
						[animation.name]: () => {
							const record = animation;
							const nextAction = animationSetup.mixer.clipAction(record);
							if (currentAction) {
								nextAction.reset();
								nextAction.play();
								nextAction.crossFadeFrom(currentAction, 2, true);
							} else {
								nextAction.play();
							}
							currentAction = nextAction;
						}
					},
					animation.name
				);
			}
		} else {
			let index = 0;
			const loopAnimateWolf = () => {
				animationSetup.mixer.stopAllAction();
				const record = resource.animations[index];
				const nextAction = animationSetup.mixer.clipAction(record);
				if (currentAction) {
					currentAction.reset();
					nextAction.play();
					nextAction.crossFadeFrom(currentAction, 0.5, false);
				} else {
					nextAction.play();
				}
				currentAction = nextAction;

				const lastAction = index + 1 === resource.animations.length;
				index = lastAction ? 0 : index + 1;
			};
			loopAnimateWolf();
			setInterval(loopAnimateWolf, 2500);
		}
	}
	update(delta: number) {
		this.animationSetup.mixer?.update(delta * 0.001);
	}
	destroy() {
		const meshes = this.model.getObjectsByProperty('isMesh', true);
		meshes.forEach((mesh: any) => {
			mesh.geometry.dispose();
			mesh.material.dispose();
			console.log(mesh.material);
		});
	}
}
