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
  var isInt = function isInt(value) {
    return typeof value === 'number';
  };

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
        if (!isString(key)) return;

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
        return isArray(this._stack[key]) && this._stack[key].length >= minLen;
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

  var PROXY_EVENT_KEY = '__EVENT__';
  var PROXY_EVENT_BEFORE_EXECUTE = '__EVENT__BEFORE__EXECUTE__';
  var PROXY_EVENT_AFTER_EXECUTE = '__EVENT__AFTER_EXECUTE__';
  var PROXY_LOOP_SPLIT = ',';

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
          this._pp[proxy] = createStackPool();
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

  var _Event =
  /*#__PURE__*/
  function () {
    function _Event(event, callback) {
      var waitCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      _classCallCheck(this, _Event);

      this._ev = [].concat(event);
      this._cb = callback;
      this._sp = createStackPool();
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

  var EventsProxy =
  /*#__PURE__*/
  function () {
    function EventsProxy() {
      _classCallCheck(this, EventsProxy);

      this._proxy = createProxyPool();
      this._proxy_loop_split = PROXY_LOOP_SPLIT;
    }

    _createClass(EventsProxy, [{
      key: "_addProxys",
      value: function _addProxys(event, callback) {
        var waitCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        event = [].concat(event);

        this._proxy.assignProxys(event, createEvent(event, callback, waitCount));
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
      value: function _removeProxys(event, callback) {
        var waitCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        event = [].concat(event);

        this._proxy.fireProxys(event, createEvent(event, callback, waitCount));
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
      value: function _beforeLoops(event) {
        for (var ev in event) {
          this.before(ev.split(this._proxy_loop_split), event[ev]);
        }
      }
    }, {
      key: "_afterLoops",
      value: function _afterLoops(event) {
        for (var ev in event) {
          this.after(ev.split(this._proxy_loop_split), event[ev]);
        }
      }
    }, {
      key: "_onceLoops",
      value: function _onceLoops(event) {
        for (var ev in event) {
          this.once(ev.split(this._proxy_loop_split), event[ev]);
        }
      }
    }, {
      key: "_waitLoops",
      value: function _waitLoops(event) {
        var waitCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        for (var ev in event) {
          this.wait(ev.split(this._proxy_loop_split), event[ev], waitCount);
        }
      }
    }, {
      key: "_bindNTimesLoops",
      value: function _bindNTimesLoops(event) {
        var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        for (var ev in event) {
          this.bindNTimes(ev.split(this._proxy_loop_split), event[ev], times);
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
      value: function before(event, callback) {
        if (isObject(event)) {
          return this._beforeLoops(event);
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

    }, {
      key: "after",
      value: function after(event, callback) {
        if (isObject(event)) {
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

    }, {
      key: "register",
      value: function register(event, callback) {
        if (isObject(event)) {
          return this._addProxysLoops(event);
        }

        this._addProxys(event, callback);

        return this.unregister.bind(this, event, callback);
      }
    }, {
      key: "subscribe",
      value: function subscribe(event, callback) {
        return this.register(event, callback);
      }
    }, {
      key: "bind",
      value: function bind(event, callback) {
        return this.register(event, callback);
      }
    }, {
      key: "on",
      value: function on(event, callback) {
        return this.register(event, callback);
      }
      /**
       * 监听一个事件但只执行一次
       * @param {string|array|object} event
       * @param {function} callback
       * @memberof EventsProxy
       */

    }, {
      key: "once",
      value: function once(event, callback) {
        if (isObject(event)) {
          return this._onceLoops(event);
        }

        var unregister = this.register(event, function () {
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
      value: function bindNTimes(event, callback) {
        var times = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

        if (isObject(event)) {
          if (isInt(callback)) {
            return this._bindNTimesLoops(event, callback);
          } else {
            return this._bindNTimesLoops(event, times);
          }
        }

        times = times < 1 ? 1 : times;
        var unregister = this.register(event, function () {
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
      value: function wait(event, callback, waitCount) {
        if (isObject(event)) {
          if (isInt(callback)) {
            return this._waitLoops(event, callback);
          } else {
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

    }, {
      key: "unregister",
      value: function unregister(event, callback, waitCount) {
        if (isObject(event)) {
          return this._removeProxysLoops(event, waitCount);
        }

        this._removeProxys(event, callback, waitCount);
      }
    }, {
      key: "unsubscribe",
      value: function unsubscribe(event, callback) {
        this.unregister(event, callback);
      }
    }, {
      key: "unbind",
      value: function unbind(event, callback) {
        this.unregister(event, callback);
      }
    }, {
      key: "off",
      value: function off(event, callback) {
        this.unregister(event, callback);
      }
      /**
       * 主动触发事件
       * @param {string} event //触发事件 只能指向 单事件
       * @param {any} data  //传递给回调函数的data
       */

    }, {
      key: "emit",
      value: function emit(event, data) {
        if (isString(event)) {
          this._proxy.emitProxy(event, data);
        }
      }
    }, {
      key: "done",
      value: function done(event, data) {
        this.emit(event, data);
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


  var createEventsProxy = function createEventsProxy(event, callback) {
    var ep = new EventsProxy();

    if (event && callback) {
      ep.register(event, callback);
    }

    return ep;
  };
   // module.exports = createEventsProxy;

  return createEventsProxy;

})));