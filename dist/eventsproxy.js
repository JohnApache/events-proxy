(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
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

  var createProxyPool = require('./proxy');

  var createEvent = require('./event');

  var _require = require('./definition'),
      PROXY_LOOP_SPLIT = _require.PROXY_LOOP_SPLIT;

  var _require2 = require('./utils'),
      isObject = _require2.isObject,
      isString = _require2.isString,
      isInt = _require2.isInt;

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

  module.exports = createEventsProxy;

})));
