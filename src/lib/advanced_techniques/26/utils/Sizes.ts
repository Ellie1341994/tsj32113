import EventEmitter from './EventEmitter';

export default class Sizes extends EventEmitter {
	constructor(
		public width = innerWidth * 0.75,
		public height = innerHeight * 0.75,
		public pixelRatio = Math.min(devicePixelRatio, 2),
		public aspectRatio = width / height
	) {
		super();
		addEventListener('resize', () => {
			this.updateAll();
			this.trigger('resize');
		});
	}
	updateAll() {
		this.width = innerWidth * 0.75;
		this.height = innerHeight * 0.75;
		this.pixelRatio = Math.min(devicePixelRatio, 2);
		this.aspectRatio = this.width / this.height;
	}
}
