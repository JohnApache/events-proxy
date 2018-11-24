const createStackPool = require('./stack')
class _Event {
    constructor(event, callback) {
        this._ev = [].concat(event);
        this._cb = callback;
        this._sp = createStackPool();
    }
    execute() {
        if(this._sp.checkKeys(this._ev)) {
            let datas = this._sp.popStacks(this._ev);
            this._cb && this._cb(...datas);
        }
    }
    done(event, data) {
        event = [].concat(event)
        this._sp.pushStacks(event, data);
        this.execute();
    }
}

const createEvent = (event, callback) => {
    return new _Event(event, callback);
}

module.exports = createEvent;