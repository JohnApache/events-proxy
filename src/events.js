const lifeCycle = {
  finished: 'FINISHED',
  start: 'START'
}
class EventsProxy {
  constructor() {
    this._init();
  }
  _init() {
    this._events_pool_ = {};
    this._execs_pool_ = {};
    this._life_cycle_ = {
      [lifeCycle.start]: {},
      [lifeCycle.finished]: {}
    };
    this._events_data_pool_ = {};
  }
  isAny(source, dist) {
    return this.isType(source) === this.isType(dist);
  }
  isType(value) {
    return Object.prototype.toString.call(value);
  }
  realase(fnArr, data) {
    if (!fnArr) return;
    fnArr.forEach(v => v(data));
  }
  // 事件任务栈添加任务
  _addEvent(event, cb) {
    if (!this.isAny(event, [])) {
      this._pushEvent(event, cb);
      return;
    }
    event.forEach(v => {
      this._addEvent(v, cb);
    });
  }
  _pushEvent(event, cb) {
    if (!this._events_pool_[event]) {
      this._events_pool_[event] = [];
    }
    this._events_pool_[event].push(cb);
  }
  _removeEvent(event, cb) {
    if(this._events_pool_[event] && this.isAny(this._events_pool_[event], [])) {
      let index = this._events_pool_[event].indexOf(cb);
      this._events_pool_[event].splice(index, 1);
    }
  }
  // 初始化已执行任务栈
  _addExecs(key, execKey) {
    if (!this._execs_pool_[key]) {
      this._execs_pool_[key] = {};
    }
    this._execs_pool_[key][execKey] = [];
  }
  // 已执行任务栈添加任务
  _pushExec(key, execKey) {
    this._execs_pool_[key][execKey].push(null);
  }
  // 已执行任务栈推出
  _popExec(key, execKey) {
    this._execs_pool_[key][execKey].shift();
  }
  // 是否满足推出已执行任务栈条件
  _isReachExec(sourceEvents, eventType) {
    return sourceEvents.every(
      key =>
      this._execs_pool_[eventType][key] &&
      this._execs_pool_[eventType][key].length > 0
    );
  }
  // 合成事件拆分子事件再反向代理到合成事件
  _reverseProxyEvent(sourceEvents, proxyEvent) {
    sourceEvents.forEach(key => {
      this._addExecs(proxyEvent, key); // 初始化已执行栈
      this._addEventsData(proxyEvent, key); // 初始化数据栈
      this.setFinished(key, (data) => {
        this._pushExec(proxyEvent, key);
        this._pushEventsData(proxyEvent, key, data);
        this.emit(proxyEvent);
      }); //反向绑定事件 每次 反向触发组合事件并推栈
    });
  }
  // 设置合成事件finished任务
  _setMultyEventFinished(sourceEvents, eventType) {
    this.setFinished(eventType, () => {
      if (this._isReachExec(sourceEvents, eventType)) {
        sourceEvents.forEach(key => {
          this._popExec(eventType, key);
          this._popEventsData(eventType, key);
        });
      }
    });
  }
  // 绑定合成事件
  _addMultyEvent(sourceEvents, eventType, cb) {
    this._addEvent(eventType, () => {
      if (this._isReachExec(sourceEvents, eventType)) {
        cb && cb(...this._getEventsData(sourceEvents, eventType));
      } else {}
    });
    this._setMultyEventFinished(sourceEvents, eventType);
  }
  // 初始化 合成事件数据池栈
  _addEventsData(event, key) {
    if (!this._events_data_pool_[event]) {
      this._events_data_pool_[event] = {};
    }
    this._events_data_pool_[event][key] = [];
  }
  // 添加 合成事件数据池数据
  _pushEventsData(event, key, data) {
    this._events_data_pool_[event][key].push(data);
  }
  // 获取 合成事件数据池
  _getEventsData(sourceEvents, eventType) {
    if (!sourceEvents) return [];
    return sourceEvents.map(v => this._events_data_pool_[eventType][v][0])
  }
  // 推出数据池栈最顶层的数据
  _popEventsData(proxyEvent, event) {
    return this._events_data_pool_[proxyEvent][event].shift();
  }
  // 注册单事件
  _listenSingleEvent(key, cb) {
    this._addEvent(key, cb);
  }
  _removeSingleEvent(key, cb) {
    this._removeEvent(key, cb);
  }
  // 注册合成事件
  _listenMultyEvents(events, cb) {
    let eventType = events.join("_");
    this._reverseProxyEvent(events, eventType);
    this._addMultyEvent(events, eventType, cb);
  }
  // 注册批量单事件
  _listenAllSingleEvent(keysMap) {
    for (let key in keysMap) {
      this.register(key, keysMap[key]);
    }
  }
  /**
   * 绑定单事件 ，单事件 在执行栈生命周期中最先执行
   * @param {string} event 事件名称
   * @param {function} cb 回调函数
   */
  setStart(event, cb) {
    this._life_cycle_[lifeCycle.start][event] = cb;
  }

  /**
   * 绑定单事件 ，单事件 在执行栈生命周期中最后执行
   * @param {string} event 事件名称
   * @param {function} cb 回调函数
   */
  setFinished(event, cb) {
    this._life_cycle_[lifeCycle.finished][event] = cb;
  }
  /**
   * 主动触发事件
   * @param {string} key  事件名称
   */
  emit(key, data) {
    this._life_cycle_[lifeCycle.start][key] && this._life_cycle_[lifeCycle.start][key](data);
    if (this._events_pool_[key]) {
      this.realase.call(null, this._events_pool_[key], data);
    }
    this._life_cycle_[lifeCycle.finished][key] && this._life_cycle_[lifeCycle.finished][key](data);
  }
  /**
   * 注册事件
   * @param {string | array | object} keys 事件名称
   * @param {function} cb 回调函数 仅适用于 数组 和 字符串模式
   */
  register(keys, cb) {
    if (!keys) return;
    if (this.isAny(keys, "")) {
      this._listenSingleEvent(keys, cb); //单事件绑定
    } else if (this.isAny(keys, [])) {
      this._listenMultyEvents(keys, cb); // 数组合成事件绑定
    } else if (this.isAny(keys, {})) {
      this._listenAllSingleEvent(keys); // 对象多事件绑定
    } else {}
  }
  on(keys, cb) {
    this.register(keys, cb);
  }
  bind(keys, cb) {
    this.register(keys, cb);
  }
  /**
   * 卸载事件
   * @param {stirng | array | object} keys
   * @param {function} fn
   * @returns
   * @memberof EventsProxy
   */
  unregister(keys, fn) {
    if (!keys) return;
    if (this.isAny(keys, "")) {
      this._removeSingleEvent(keys, cb); //单事件绑定
    } else if (this.isAny(keys, [])) {
      this._removeMultyEvents(keys, cb); // 数组合成事件绑定
    } else if (this.isAny(keys, {})) {
      this._removeAllSingleEvent(keys); // 对象多事件绑定
    } else {}
  }
}

module.exports = EventsProxy;