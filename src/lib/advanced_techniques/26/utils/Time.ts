import EventEmitter from './EventEmitter';

export default class Time extends EventEmitter {
	constructor(
		public start = Date.now(),
		public current = start,
		public elapsed = 0,
		public delta = 16
	) {
		super();
		this.tick = this.tick.bind(this);
		this.tick();
	}

	tick() {
		this.delta = Date.now() - this.current;
		this.current = this.delta + this.current;
		this.elapsed = this.current - this.start;

		this.trigger('tick');
		requestAnimationFrame(this.tick);
	}
}