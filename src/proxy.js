const createStackPool = require('./stack');
const {isObject} = require('./utlils');
const {PROXY_EVENT_KEY, PROXY_EVENT_BEFORE_EXECUTE, PROXY_EVENT_AFTER_EXECUTE} = require('./definition');
class ProxyPool {
    constructor() {
        this._pp = {};
    }

    _initProxy(proxy) {
        if(!this._pp[proxy]) {
            this._pp[proxy] = createStackPool();
        }
    }
    _executeBefore(proxy, data) {
        this._pp[proxy].forEachByKey(PROXY_EVENT_BEFORE_EXECUTE, (event) => {
            event && event.done && event.done(proxy, data);
        })
    }
    _execute(proxy, data) {
        this._pp[proxy].forEachByKey(PROXY_EVENT_KEY, (event) => {
            event && event.done && event.done(proxy, data);
        })
    }
    _executeAfter(proxy, data) {
        this._pp[proxy].forEachByKey(PROXY_EVENT_AFTER_EXECUTE, (event) => {
            event && event.done && event.done(proxy, data);
        })
    }
    _beforeExecute(proxy, event) {
        this._initProxy(proxy);
        this._pp[proxy].pushStack(PROXY_EVENT_BEFORE_EXECUTE, event);
    }
    beforeExecute(proxys, event) {
        proxys = [].concat(proxys);
        proxys.forEach(proxy => {
            this._beforeExecute(proxy, event);
        })
    }
    _afterExecute(proxy, event) {
        this._initProxy(proxy);
        this._pp[proxy].pushStack(PROXY_EVENT_AFTER_EXECUTE, event);
    }
    afterExecute(proxys, event) {
        proxys = [].concat(proxys);
        proxys.forEach(proxy => {
            this._afterExecute(proxy, event);
        })
    }

    assignProxy(proxy, event) {
        this._initProxy(proxy);
        this._pp[proxy].pushStack(PROXY_EVENT_KEY, event);
    }   

    assignProxys(proxys, event) {
        proxys = [].concat(proxys);
        proxys.forEach(proxy => {
            this.assignProxy(proxy, event);
        })
    }
    fireProxy(proxy, event) {
        if(!event || !proxy) return;
        let events = this._pp[proxy].queryStack(PROXY_EVENT_KEY);
        this._pp[proxy].setStack(PROXY_EVENT_KEY, events.filter(ev => !ev.isDeepEqualEvent(event)))
    }

    fireProxys(proxys, event) {
        proxys = [].concat(proxys);
        proxys.forEach(proxy => {
            this.fireProxy(proxy, event);
        })
    }

    emitProxy(proxy, data) {
        if(!this._pp[proxy]) return;
        this._executeBefore(proxy, data)
        this._execute(proxy, data);
        this._executeAfter(proxy, data);
    }
}

const createProxyPool = () => {
    return new ProxyPool();
}

module.exports = createProxyPool;