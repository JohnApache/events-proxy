const createProxyPool = require('./proxy');
const createEvent = require('./event');
const {isObject, isString} = require('./utlils');
class EventsProxy {
    constructor() {
        this._proxy = createProxyPool();
        this._proxy_loop_split = '~';
    }
    _addProxys(event, callback) {
        event = [].concat(event);
        this._proxy.assignProxys(event, createEvent(event, callback));
    }
    _addProxysLoop(events) {
        for(let ev in events) {
            this.register(ev.split(this._proxy_loop_split), events[ev]);
        }
    }
    setProxyLoopSplit(splitValue) {
        this._proxy_loop_split = splitValue;
    }
    register(event, callback) {
        if(isObject(event)) {
            return this._addProxysLoop(event);
        }
        this._addProxys(event, callback);
    }
    emit(event, data) {
        if(isString(event)) {
            this._proxy.emitProxy(event, data);
        }
    }
}

const createEventsProxy = () => {
    return new EventsProxy();
}

module.exports = createEventsProxy;