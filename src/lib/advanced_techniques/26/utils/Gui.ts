import GUI from 'lil-gui';

let singletonGuiInstance: Gui | null = null;
export default class Gui {
	constructor(
		public guiContainer?: HTMLElement,
		public instance: GUI | null = null
	) {
		if (singletonGuiInstance) {
			return singletonGuiInstance;
		}
		this.instance = new GUI({ title: 'Tweaks panel', width: 300, container: guiContainer });
		singletonGuiInstance = this;
	}
}
