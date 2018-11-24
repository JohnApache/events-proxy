const createStackPool = require('./stack');
const PROXY_KEY = {
    event: '__EVENT__',
}
class ProxyPool {
    constructor() {
        this._pp = {};
    }
    initProxy(proxy) {
        if(!this._pp[proxy]) {
            this._pp[proxy] = createStackPool();
        }
    }
    
    assignProxy(proxy, event) {
        this.initProxy(proxy);
        this._pp[proxy].pushStack(PROXY_KEY.event, event);
    }   

    assignProxys(proxys, event) {
        proxys = [].concat(proxys);
        proxys.forEach(proxy => {
            this.initProxy(proxy);
            this._pp[proxy].pushStack(PROXY_KEY.event, event);
        })
    }

    register(proxy, event) {
        this.assignProxy(proxy, event);
    }

    registerAll(proxys, event) {
        this.assignProxys(proxys, event)
    }


    emitProxy(proxy, data) {
        if(!this._pp[proxy]) return;
        this._pp[proxy].forEachByKey(PROXY_KEY.event, (event) => {
            event && event.done && event.done(proxy, data);
        })
    }
}

const createProxyPool = () => {
    return new ProxyPool();
}

module.exports = createProxyPool;