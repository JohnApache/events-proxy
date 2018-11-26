const createProxyPool = require('./proxy');
const createEvent = require('./event');
const {PROXY_LOOP_SPLIT} = require('./definition');
const {isObject, isString, isInt} = require('./utlils')
class EventsProxy {
    constructor() {
        this._proxy = createProxyPool();
        this._proxy_loop_split = PROXY_LOOP_SPLIT;
    }
    _addProxys(event, callback, waitCount = 1) {
        event = [].concat(event);
        this._proxy.assignProxys(event, createEvent(event, callback, waitCount));
    }
    _addProxysLoops(events) {
        for(let ev in events) {
            this.register(ev.split(this._proxy_loop_split), events[ev]);
        }
    }
    _removeProxys(event, callback, waitCount = 1) {
        event = [].concat(event);
        this._proxy.fireProxys(event, createEvent(event, callback, waitCount));
    }
    _removeProxysLoops(events, waitCount) {
        for(let ev in events) {
            this.unregister(ev.split(this._proxy_loop_split), events[ev], waitCount);
        }
    }
    _beforeLoops(event) {
        for(let ev in event) {
            this.before(ev.split(this._proxy_loop_split), event[ev])
        }
    }
    _afterLoops(event) {
        for(let ev in event) {
            this.after(ev.split(this._proxy_loop_split), event[ev])
        }
    }
    _onceLoops(event) {
        for(let ev in event) {
            this.once(ev.split(this._proxy_loop_split), event[ev])
        }
    }
    _waitLoops(event, waitCount = 1) {
        for(let ev in event) {
            this.wait(ev.split(this._proxy_loop_split), event[ev], waitCount)
        }
    }
    _bindNTimesLoops(event, times = 1) {
        for(let ev in event) {
            this.bindNTimes(ev.split(this._proxy_loop_split), event[ev], times)
        }
    }
    /**
     * 设置对象监听复合事件对象key的分割线
     * @param {*} splitValue
     * @memberof EventsProxy
     */
    setProxyLoopSplit(splitValue) {
        this._proxy_loop_split = splitValue;
    }
  
    /**
     * 执行某监听事件回调之前执行
     * @param {string|array|object} event
     * @param {function} callback
     * @memberof EventsProxy
     */
    before(event, callback) {
        if(isObject(event)) {
            return this._beforeLoops(event)
        }
        event = [].concat(event);
        this._proxy.beforeExecute(event, createEvent(event, callback));
    }
 
    /**
     * 执行某监听事件回调之后执行
     * @param {string|array|object} event
     * @param {function} callback
     * @memberof EventsProxy
     */
    after(event, callback) {
        if(isObject(event)) {
            return this._afterLoops(event);
        }
        event = [].concat(event);
        this._proxy.afterExecute(event, createEvent(event, callback));
    }
    /**
     * 自定义注册事件
     * @param {string|array|object} event  string 单事件 array 复合事件 object 批量事件
     * @param {function} callback 
     */
    register(event, callback) {
        if(isObject(event)) {
            return this._addProxysLoops(event);
        }
        this._addProxys(event, callback);
        return this.unregister.bind(this, event, callback)
    }
    subscribe(event, callback) {
        return this.register(event, callback);
    }
    bind(event, callback) {
        return this.register(event, callback);
    }
    on(event, callback) {
        return this.register(event, callback);
    }

    /**
     * 监听一个事件但只执行一次
     * @param {string|array|object} event
     * @param {function} callback
     * @memberof EventsProxy
     */
    once(event, callback) {
        if(isObject(event)) {
            return this._onceLoops(event);
        }
        const unregister = this.register(event, (...data) => {
            callback && callback(...data);
            unregister && unregister();
        });
        return unregister; //可以随时提前中断
    }

    
    /**
     * 绑定指定次数的事件 达到指定次数即卸载
     * @param {string|array|object} event
     * @param {function} callback
     * @param {callback} times
     * @returns
     * @memberof EventsProxy
     */
    bindNTimes(event, callback, times = 1) {
        if(isObject(event)) {
            if(isInt(callback)) {
                return this._bindNTimesLoops(event, callback);
            }else {
                return this._bindNTimesLoops(event, times);
            }
        }
        times = times < 1 ? 1 : times;
        const unregister = this.register(event, (...data) => {
            callback && callback(...data);
            times--;
            if(times === 0) {
                unregister && unregister();
            }
        });
        return unregister; //可以随时提前中断
    }
    
    
    /**
     * 事件触发 waitCount 次数 后 执行
     * @param {string|array|object} event
     * @param {function} callback // 如果event 为对象批量绑定事件时 可以代替为 waitCount 第三个参数可以舍去
     * @param {int} waitCount
     * @memberof EventsProxy
     */
    wait(event, callback, waitCount) {
        if(isObject(event)) {
            if(isInt(callback)) {
                return this._waitLoops(event, callback);
            }else {
                return this._waitLoops(event, waitCount);
            }
        }
        this._addProxys(event, callback, waitCount);
        return this.unregister.bind(this, event, callback, waitCount);
    }
    
    /**
     * 解除绑定事件
     * @param {string|array|object} event string 单事件 array 复合事件 object 批量事件
     * @param {function} callback 
     * @param {int} waitCount 等待深度 默认为1层 
     */
    unregister(event, callback, waitCount) { 
        if(isObject(event)) {
            return this._removeProxysLoops(event, waitCount);
        }
        this._removeProxys(event, callback, waitCount)
    }
    unsubscribe(event, callback) {
        this.unregister(event, callback);
    }
    unbind(event, callback) {
        this.unregister(event, callback);
    }
    off(event, callback) {
        this.unregister(event, callback);
    }

    /**
     * 主动触发事件
     * @param {string} event //触发事件 只能指向 单事件
     * @param {any} data  //传递给回调函数的data
     */
    emit(event, data) {
        if(isString(event)) {
            this._proxy.emitProxy(event, data);
        }
    }

    done(event, data) {
        this.emit(event, data);
    }
}

/**
 * 初始化 创建 EventsProxy 函数
 * @param {string|array|object} event  //初始化事件 参数 支持单事件 复合事件 及其 批量事件
 * @param {function} callback  //回调函数
 * @returns {EventsProxy}
 */
const createEventsProxy = (event, callback) => {
    const ep =  new EventsProxy();
    if(event && callback) {
        ep.register(event, callback);
    }
    return ep;
}

module.exports = createEventsProxy;