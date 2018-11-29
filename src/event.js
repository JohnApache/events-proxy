const createStackPool = require('./stack');
class _Event {
	constructor(event, callback, waitCount = 1) {
		this._ev = [].concat(event);
		this._cb = callback;
		this._sp = createStackPool();
		this._wc = Math.abs(waitCount);
	}
	isDeepEqualEvent(ev) {
		return (
			this._cb === ev._cb 
            && this._ev.join('') === ev._ev.join('') 
            && this._wc === ev._wc
		);
	}

	execute() {
		if (this._sp.checkKeys(this._ev, this._wc)) {
			let datas = [];
			for(let i = 0; i < this._wc; i++) {
				datas.push(this._sp.popStacks(this._ev));
			}
			if(datas.length === 1) {
				datas = datas[0];
			}
			this._cb && this._cb(...datas);
		}
	}

	done(event, data) {
		event = [].concat(event);
		this._sp.pushStacks(event, data);
		this.execute();
	}
}

const createEvent = (event, callback, waitCount = 1) => {
	waitCount = waitCount < 1 ? 1 : waitCount;
	return new _Event(event, callback, Math.ceil(waitCount));
};

module.exports = createEvent;