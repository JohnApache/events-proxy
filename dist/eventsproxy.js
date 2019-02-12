(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.eventsproxy = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var isArray = function isArray(value) {
    return Array.isArray(value);
  };

  var isObject = function isObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
  };

  var isString = function isString(value) {
    return typeof value === 'string';
  };

  var isFunction = function isFunction(value) {
    return Object.prototype.toString.call(value) === '[object Function]';
  };

  var isInt = function isInt(value) {
    return typeof value === 'number';
  };

  var utils = {
    isArray: isArray,
    isObject: isObject,
    isString: isString,
    isFunction: isFunction,
    isInt: isInt
  };

  var isArray$1 = utils.isArray,
      isString$1 = utils.isString;

  var StackPool =
  /*#__PURE__*/
  function () {
    function StackPool() {
      _classCallCheck(this, StackPool);

      this._stack = {};
    }

    _createClass(StackPool, [{
      key: "initStack",
      value: function initStack(key) {
        if (!isString$1(key)) return;

        if (!this._stack[key]) {
          this._stack[key] = [];
        }
      }
    }, {
      key: "initStacks",
      value: function initStacks(keys) {
        var _this = this;

        keys = [].concat(keys);
        keys.forEach(function (key) {
          _this.initStack(key);
        });
      }
    }, {
      key: "queryStack",
      value: function queryStack(key) {
        this.initStack(key);
        return this._stack[key];
      }
    }, {
      key: "setStack",
      value: function setStack(key, values) {
        this._stack[key] = [].concat(values);
      }
    }, {
      key: "pushStack",
      value: function pushStack(key, value) {
        this.initStack(key);
        return this._stack[key].push(value);
      }
    }, {
      key: "push",
      value: function push(key, value) {
        return this.pushStack(key, value);
      }
    }, {
      key: "pushStacks",
      value: function pushStacks(keys, value) {
        var _this2 = this;

        keys = [].concat(keys);
        this.initStacks(keys);
        keys.forEach(function (key) {
          _this2.pushStack(key, value);
        });
      }
    }, {
      key: "popStack",
      value: function popStack(key) {
        this.initStack(key);
        return this._stack[key].shift();
      }
    }, {
      key: "pop",
      value: function pop(key) {
        return this.popStack(key);
      }
    }, {
      key: "popStacks",
      value: function popStacks(keys) {
        var _this3 = this;

        keys = [].concat(keys);
        var res = [];
        this.initStacks(keys);
        keys.forEach(function (key) {
          res.push(_this3.popStack(key));
        });
        return res;
      }
    }, {
      key: "checkKey",
      value: function checkKey(key) {
        var minLen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        minLen = minLen < 1 ? 1 : minLen;
        return isArray$1(this._stack[key]) && this._stack[key].length >= minLen;
      }
    }, {
      key: "checkKeys",
      value: function checkKeys(keys, minLen) {
        var _this4 = this;

        keys = [].concat(keys);
        return keys.every(function (key) {
          return _this4.checkKey(key, minLen);
        });
      }
    }, {
      key: "forEachByKey",
      value: function forEachByKey(key, cb) {
        var _this5 = this;

        if (this.checkKey(key)) {
          this._stack[key].forEach(function (v, i) {
            cb && cb(v, i, _this5._stack[key]);
          });
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        this._stack = {};
      }
    }]);

    return StackPool;
  }();

  var createStackPool = function createStackPool() {
    return new StackPool();
  };

  var stack = createStackPool;

  var definition = {
    PROXY_EVENT_KEY: '__EVENT__',
    PROXY_EVENT_BEFORE_EXECUTE: '__EVENT__BEFORE__EXECUTE__',
    PROXY_EVENT_AFTER_EXECUTE: '__EVENT__AFTER_EXECUTE__',
    PROXY_LOOP_SPLIT: ','
  };

  var PROXY_EVENT_KEY = definition.PROXY_EVENT_KEY,
      PROXY_EVENT_BEFORE_EXECUTE = definition.PROXY_EVENT_BEFORE_EXECUTE,
      PROXY_EVENT_AFTER_EXECUTE = definition.PROXY_EVENT_AFTER_EXECUTE;

  var ProxyPool =
  /*#__PURE__*/
  function () {
    function ProxyPool() {
      _classCallCheck(this, ProxyPool);

      this._pp = {};
    }

    _createClass(ProxyPool, [{
      key: "_initProxy",
      value: function _initProxy(proxy) {
        if (!this._pp[proxy]) {
          this._pp[proxy] = stack();
        }
      }
    }, {
      key: "_executeBefore",
      value: function _executeBefore(proxy, data) {
        this._pp[proxy].forEachByKey(PROXY_EVENT_BEFORE_EXECUTE, function (event) {
          event && event.done && event.done(proxy, data);
        });
      }
    }, {
      key: "_execute",
      value: function _execute(proxy, data) {
        this._pp[proxy].forEachByKey(PROXY_EVENT_KEY, function (event) {
          event && event.done && event.done(proxy, data);
        });
      }
    }, {
      key: "_executeAfter",
      value: function _executeAfter(proxy, data) {
        this._pp[proxy].forEachByKey(PROXY_EVENT_AFTER_EXECUTE, function (event) {
          event && event.done && event.done(proxy, data);
        });
      }
    }, {
      key: "_beforeExecute",
      value: function _beforeExecute(proxy, event) {
        this._initProxy(proxy);

        this._pp[proxy].pushStack(PROXY_EVENT_BEFORE_EXECUTE, event);
      }
    }, {
      key: "beforeExecute",
      value: function beforeExecute(proxys, event) {
        var _this = this;

        proxys = [].concat(proxys);
        proxys.forEach(function (proxy) {
          _this._beforeExecute(proxy, event);
        });
      }
    }, {
      key: "_afterExecute",
      value: function _afterExecute(proxy, event) {
        this._initProxy(proxy);

        this._pp[proxy].pushStack(PROXY_EVENT_AFTER_EXECUTE, event);
      }
    }, {
      key: "afterExecute",
      value: function afterExecute(proxys, event) {
        var _this2 = this;

        proxys = [].concat(proxys);
        proxys.forEach(function (proxy) {
          _this2._afterExecute(proxy, event);
        });
      }
    }, {
      key: "assignProxy",
      value: function assignProxy(proxy, event) {
        this._initProxy(proxy);

        this._pp[proxy].pushStack(PROXY_EVENT_KEY, event);
      }
    }, {
      key: "assignProxys",
      value: function assignProxys(proxys, event) {
        var _this3 = this;

        proxys = [].concat(proxys);
        proxys.forEach(function (proxy) {
          _this3.assignProxy(proxy, event);
        });
      }
    }, {
      key: "fireProxy",
      value: function fireProxy(proxy, event) {
        if (!event || !proxy) return;

        var events = this._pp[proxy].queryStack(PROXY_EVENT_KEY);

        this._pp[proxy].setStack(PROXY_EVENT_KEY, events.filter(function (ev) {
          return !ev.isDeepEqualEvent(event);
        }));
      }
    }, {
      key: "fireProxys",
      value: function fireProxys(proxys, event) {
        var _this4 = this;

        proxys = [].concat(proxys);
        proxys.forEach(function (proxy) {
          _this4.fireProxy(proxy, event);
        });
      }
    }, {
      key: "emitProxy",
      value: function emitProxy(proxy, data) {
        if (!this._pp[proxy]) return;

        this._executeBefore(proxy, data);

        this._execute(proxy, data);

        this._executeAfter(proxy, data);
      }
    }]);

    return ProxyPool;
  }();

  var createProxyPool = function createProxyPool() {
    return new ProxyPool();
  };

  var proxy = createProxyPool;

  var _Event =
  /*#__PURE__*/
  function () {
    function _Event(event, callback) {
      var waitCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      _classCallCheck(this, _Event);

      this._ev = [].concat(event);
      this._cb = callback;
      this._sp = stack();
      this._wc = Math.abs(waitCount);
    }

    _createClass(_Event, [{
      key: "isDeepEqualEvent",
      value: function isDeepEqualEvent(ev) {
        return this._cb === ev._cb && this._ev.join('') === ev._ev.join('') && this._wc === ev._wc;
      }
    }, {
      key: "execute",
      value: function execute() {
        if (this._sp.checkKeys(this._ev, this._wc)) {
          var datas = [];

          for (var i = 0; i < this._wc; i++) {
            datas.push(this._sp.popStacks(this._ev));
          }

          if (datas.length === 1) {
            datas = datas[0];
          }

          this._cb && this._cb.apply(this, _toConsumableArray(datas));
        }
      }
    }, {
      key: "done",
      value: function done(event, data) {
        event = [].concat(event);

        this._sp.pushStacks(event, data);

        this.execute();
      }
    }]);

    return _Event;
  }();

  var createEvent = function createEvent(event, callback) {
    var waitCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    waitCount = waitCount < 1 ? 1 : waitCount;
    return new _Event(event, callback, Math.ceil(waitCount));
  };

  var event = createEvent;

  var PROXY_LOOP_SPLIT = definition.PROXY_LOOP_SPLIT;
  var isObject$1 = utils.isObject,
      isString$2 = utils.isString,
      isInt$1 = utils.isInt;

  var EventsProxy =
  /*#__PURE__*/
  function () {
    function EventsProxy() {
      _classCallCheck(this, EventsProxy);

      this._proxy = proxy();
      this._proxy_loop_split = PROXY_LOOP_SPLIT;
    }

    _createClass(EventsProxy, [{
      key: "_addProxys",
      value: function _addProxys(event$$1, callback) {
        var waitCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        event$$1 = [].concat(event$$1);

        this._proxy.assignProxys(event$$1, event(event$$1, callback, waitCount));
      }
    }, {
      key: "_addProxysLoops",
      value: function _addProxysLoops(events) {
        for (var ev in events) {
          this.register(ev.split(this._proxy_loop_split), events[ev]);
        }
      }
    }, {
      key: "_removeProxys",
      value: function _removeProxys(event$$1, callback) {
        var waitCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        event$$1 = [].concat(event$$1);

        this._proxy.fireProxys(event$$1, event(event$$1, callback, waitCount));
      }
    }, {
      key: "_removeProxysLoops",
      value: function _removeProxysLoops(events, waitCount) {
        for (var ev in events) {
          this.unregister(ev.split(this._proxy_loop_split), events[ev], waitCount);
        }
      }
    }, {
      key: "_beforeLoops",
      value: function _beforeLoops(event$$1) {
        for (var ev in event$$1) {
          this.before(ev.split(this._proxy_loop_split), event$$1[ev]);
        }
      }
    }, {
      key: "_afterLoops",
      value: function _afterLoops(event$$1) {
        for (var ev in event$$1) {
          this.after(ev.split(this._proxy_loop_split), event$$1[ev]);
        }
      }
    }, {
      key: "_onceLoops",
      value: function _onceLoops(event$$1) {
        for (var ev in event$$1) {
          this.once(ev.split(this._proxy_loop_split), event$$1[ev]);
        }
      }
    }, {
      key: "_waitLoops",
      value: function _waitLoops(event$$1) {
        var waitCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        for (var ev in event$$1) {
          this.wait(ev.split(this._proxy_loop_split), event$$1[ev], waitCount);
        }
      }
    }, {
      key: "_bindNTimesLoops",
      value: function _bindNTimesLoops(event$$1) {
        var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        for (var ev in event$$1) {
          this.bindNTimes(ev.split(this._proxy_loop_split), event$$1[ev], times);
        }
      }
      /**
       * 设置对象监听复合事件对象key的分割线
       * @param {*} splitValue
       * @memberof EventsProxy
       */

    }, {
      key: "setProxyLoopSplit",
      value: function setProxyLoopSplit(splitValue) {
        this._proxy_loop_split = splitValue;
      }
      /**
       * 执行某监听事件回调之前执行
       * @param {string|array|object} event
       * @param {function} callback
       * @memberof EventsProxy
       */

    }, {
      key: "before",
      value: function before(event$$1, callback) {
        if (isObject$1(event$$1)) {
          return this._beforeLoops(event$$1);
        }

        event$$1 = [].concat(event$$1);

        this._proxy.beforeExecute(event$$1, event(event$$1, callback));
      }
      /**
       * 执行某监听事件回调之后执行
       * @param {string|array|object} event
       * @param {function} callback
       * @memberof EventsProxy
       */

    }, {
      key: "after",
      value: function after(event$$1, callback) {
        if (isObject$1(event$$1)) {
          return this._afterLoops(event$$1);
        }

        event$$1 = [].concat(event$$1);

        this._proxy.afterExecute(event$$1, event(event$$1, callback));
      }
      /**
       * 自定义注册事件
       * @param {string|array|object} event  string 单事件 array 复合事件 object 批量事件
       * @param {function} callback 
       */

    }, {
      key: "register",
      value: function register(event$$1, callback) {
        if (isObject$1(event$$1)) {
          return this._addProxysLoops(event$$1);
        }

        this._addProxys(event$$1, callback);

        return this.unregister.bind(this, event$$1, callback);
      }
    }, {
      key: "subscribe",
      value: function subscribe(event$$1, callback) {
        return this.register(event$$1, callback);
      }
    }, {
      key: "bind",
      value: function bind(event$$1, callback) {
        return this.register(event$$1, callback);
      }
    }, {
      key: "on",
      value: function on(event$$1, callback) {
        return this.register(event$$1, callback);
      }
      /**
       * 监听一个事件但只执行一次
       * @param {string|array|object} event
       * @param {function} callback
       * @memberof EventsProxy
       */

    }, {
      key: "once",
      value: function once(event$$1, callback) {
        if (isObject$1(event$$1)) {
          return this._onceLoops(event$$1);
        }

        var unregister = this.register(event$$1, function () {
          callback && callback.apply(void 0, arguments);
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

    }, {
      key: "bindNTimes",
      value: function bindNTimes(event$$1, callback) {
        var times = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

        if (isObject$1(event$$1)) {
          if (isInt$1(callback)) {
            return this._bindNTimesLoops(event$$1, callback);
          }

          return this._bindNTimesLoops(event$$1, times);
        }

        times = times < 1 ? 1 : times;
        var unregister = this.register(event$$1, function () {
          callback && callback.apply(void 0, arguments);
          times--;

          if (times === 0) {
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

    }, {
      key: "wait",
      value: function wait(event$$1, callback, waitCount) {
        if (isObject$1(event$$1)) {
          if (isInt$1(callback)) {
            return this._waitLoops(event$$1, callback);
          }

          return this._waitLoops(event$$1, waitCount);
        }

        this._addProxys(event$$1, callback, waitCount);

        return this.unregister.bind(this, event$$1, callback, waitCount);
      }
      /**
       * 解除绑定事件
       * @param {string|array|object} event string 单事件 array 复合事件 object 批量事件
       * @param {function} callback 
       * @param {int} waitCount 等待深度 默认为1层 
       */

    }, {
      key: "unregister",
      value: function unregister(event$$1, callback, waitCount) {
        if (isObject$1(event$$1)) {
          return this._removeProxysLoops(event$$1, waitCount);
        }

        this._removeProxys(event$$1, callback, waitCount);
      }
    }, {
      key: "unsubscribe",
      value: function unsubscribe(event$$1, callback, waitCount) {
        this.unregister(event$$1, callback, waitCount);
      }
    }, {
      key: "unbind",
      value: function unbind(event$$1, callback, waitCount) {
        this.unregister(event$$1, callback, waitCount);
      }
    }, {
      key: "off",
      value: function off(event$$1, callback, waitCount) {
        this.unregister(event$$1, callback, waitCount);
      }
      /**
       * 主动触发事件
       * @param {string} event //触发事件 只能指向 单事件
       * @param {any} data  //传递给回调函数的data
       */

    }, {
      key: "emit",
      value: function emit(event$$1, data) {
        if (isString$2(event$$1)) {
          this._proxy.emitProxy(event$$1, data);
        }
      }
    }, {
      key: "done",
      value: function done(event$$1, data) {
        this.emit(event$$1, data);
      }
    }, {
      key: "async",
      value: function async(event$$1) {
        var success;
        var prom = new Promise(function (resolve) {
          success = resolve;
        });
        this.once(event$$1, function () {
          for (var _len = arguments.length, data = new Array(_len), _key = 0; _key < _len; _key++) {
            data[_key] = arguments[_key];
          }

          success(data);
        });
        return prom;
      }
    }]);

    return EventsProxy;
  }();
  /**
   * 初始化 创建 EventsProxy 函数
   * @param {string|array|object} event  //初始化事件 参数 支持单事件 复合事件 及其 批量事件
   * @param {function} callback  //回调函数
   * @returns {EventsProxy}
   */


  var createEventsProxy = function createEventsProxy(event$$1, callback) {
    var ep = new EventsProxy();

    if (event$$1 && callback) {
      ep.register(event$$1, callback);
    }

    return ep;
  };

  var eventsProxy = createEventsProxy;

  return eventsProxy;

})));
