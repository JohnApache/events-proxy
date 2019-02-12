# Javascript 自定义事件代理
[![Build Status](https://www.travis-ci.org/JohnApache/events-proxy.svg?branch=master)](https://www.travis-ci.org/JohnApache/events-proxy)
[![codecov](https://codecov.io/gh/JohnApache/events-proxy/branch/master/graph/badge.svg)](https://codecov.io/gh/JohnApache/events-proxy)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

[![NPM](https://nodei.co/npm/eventsproxy.png)](https://nodei.co/npm/eventsproxy/)
*****
+ 插件主要特点：
    - 深层嵌套回调函数，以事件模式完全解除了嵌套的问题, 解耦复杂业务逻辑
    - 在不同场景里多个异步同时完成时即执行某个函数，且多个异步执行并行执行 不会堵塞
    - 提供了before after wait等 特殊场景api ，应用场景更丰富 
    - 全局监听事件，订阅模式
    - 兼容node端 浏览器端
    - 遵循umd规范
*****

## 安装方法
```javascript
    npm install eventsproxy
```

## 示例

### 单事件绑定
```javascript
    const createEventsProxy = require('eventsproxy');
    const ep = createEventsProxy();
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        ep.emit('Test1', response);
    })
    ep.register('Test1', (data) => {
        {`... 处理data ...`}
    })

```

### 合成事件绑定
```javascript
    // 传统模式
    fetch(url, options).then(function(response) { 
        {`... 复杂业务 ...`}
        fetch(url, options).then(function(response) { 
            {`... 复杂业务 ...`}
            fetch(url, options).then(function(response) { 
                {`... 复杂业务 ...`}
                console.log('finshied');
            })
        })
    })
    
    // EventsProxy 模式
    const createEventsProxy = require('eventsproxy');
    const ep = createEventsProxy();
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        ep.emit('Task1', data);
    })
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        ep.emit('Task2', data);
    })
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        ep.emit('Task3', data);
    })
    ep.register(['Task1', 'Task1', 'Task3'], (data1, data2, data3) => {
        console.log('finshied', data1, data2, data3);
    })
```

### 多事件绑定 
```javascript
    const createEventsProxy = require('eventsproxy');
    const ep = createEventsProxy();
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        ep.emit('Test1', data);
    })
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        ep.emit('Test2', data);
    })
    ep.register({
        'Test1': (data) => {
            {`... 处理data ...`}
        },
        'Test2': (data) => {
            {`... 处理data ...`}
        },
        'Test1~Test2': (data1, data2) => {
            {`... 处理data ...`}
        }
    })
```

### （* New Api）async 事件 监听， 支持 await then 等待返回结果， 返回结果是一次性的
```javascript
    const createEventsProxy = require('eventsproxy');
    const ep = createEventsProxy();
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        ep.emit('Test', 10)
    });
    const data1 = await ep.await('Test'); // 为了兼容合成事件 resolve返回值 为一个数组
    console.log(data); // data = [ 10 ]
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        ep.emit('Test1', 10)
    });

    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        ep.emit('Test2', 20)
    });
    const data2 = await ep.await(['Test1', 'Test2']); // 为了兼容合成事件 resolve返回值 为一个数组
    console.log(data); // data = [ 10, 20 ]
```

### before绑定事件栈触发之前，该事件栈总是先于绑定该事件的方法之前执行 after绑定事件栈触发之后，该事件栈总是先于绑定该事件的方法之后执行
```javascript
    const createEventsProxy = require('eventsproxy');
    const ep = createEventsProxy();
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        ep.emit('Test1', data);
    })
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        ep.emit('Test2', data);
    })
    ep.after(['Test1', 'Test2'], (v1, v2) => {
        {`... 最后执行的业务 ... `}
    })
    ep.bind(['Test1', 'Test2'], (v1, v2) => {
        {`... 再执行的业务 ... `}
    })
    ep.before(['Test1', 'Test2'], (v1, v2) => {
        {`... 先执行的业务 ... `}
    })
```
### once只监视一次的绑定方式
```javascript
    const createEventsProxy = require('eventsproxy');
    const ep = createEventsProxy();
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        ep.done('Test1', data);
    })
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        ep.done('Test2', data);
    })
    ep.once(['Test1', 'Test2'], (v1, v2) => {
        {`... 只执行一次的业务 ... `}
    })
```

### wait绑定的事件触发的次数达到预先设置的waitcount 才会触发回调
```javascript
    const createEventsProxy = require('eventsproxy');
    const ep = createEventsProxy();
    const fetch1 = () => {
        fetch(url, options).then(function(response) {
            {`... 复杂业务 ...`}
            ep.emit('Test1', data1);
        })
    }
     const fetch2 = () => {
        fetch(url, options).then(function(response) {
            {`... 复杂业务 ...`}
            ep.emit('Test2', data2);
        })
    }
    fetch1();
    fetch2(); //第一次满足条件不会触发
    fetch1();
    fetch2(); //第二次满足条件才会触发
  
    ep.wait(['Test1', 'Test2'], (v1, v2) => {
        {`... 执行的业务 ... `}
        {v1 == [data1, data2]} //等于每一层深度的所有data数组
    }, 2 /* 等待的深度 */)
```

### 取消监视某事件
```javascript
    const createEventsProxy = require('eventsproxy');
    const ep = createEventsProxy();
    const fn = (v1, v2) => {
        {`... 执行的业务 ... `}
    }
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        ep.done('Test1', data);
    })
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        ep.done('Test2', data);
    })
    ep.register(['Test1', 'Test2'], fn);
    ep.unregister(['Test1', 'Test2'], fn); // 取消解绑事件 函数必须指向同一个函数

    const unregister = ep.register(['Test1', 'Test2'], fn); //register的返回值也返回了卸载函数
    unregister(); // 也可以取消解绑事件
    /* ⚠️ ： 当event为对象模式  批量绑定 因为存在无限递归情况 不返回卸载函数  卸载需要通过 ep.unregister ep.unbind 等主动卸载方式卸载 */
```


## API文档
``` javascript
    // 引入方式
    const createEventsProxy = require('eventsproxy');
    const ep2 = createEventsProxy(['Task1', 'Task2'], () => {}); // 快捷方式注册事件

    const ep = createEventsProxy();
    // 注册事件 三种方式
    ep.register('Task', (data) => {
        // 字符串单事件注册
    }); 
    ep.bind('Task', () => {}); // register alias
    ep.on('Task', () => {}); // register alias
    ep.subscribe('Task', () => {}); // register alias

    ep.register(['Task1', 'Task2'], (v1, v2) => {
        // 数组复合事件 回调函数 参数 v1 v2分别是自Task1 Task2传递来的data
    }) ;
    ep.register({
        'Task1': (data) => {},
        'Task2': (data) => {},
        'Task1,Task2': (v1, v2) => {
            // 对象批量注册事件 对象事件注册复合事件key的分割线，默认是 ‘,’  
        }
    });

    // 卸载事件
    const fn = (v1, v2) => {}
    const unregister = ep.register(['Test1', 'Test2'], fn) ;
    unregister();// 注册返回值是一个卸载函数
    ep.unregister(['Test1', 'Test2'], fn); // 也可以主动卸载事件
    ep.unbind(['Test1', 'Test2'], fn);
    ep.unsubscribe(['Test1', 'Test2'], fn);
    ep.off(['Test1', 'Test2'], fn); // unregister alias


    // 设置对象事件注册复合事件key的分割线，默认是 ‘,’  该注册复合事件的方式只在对象注册事件有效
    ep.setProxyLoopSplit('~');
    ep.register({
        'Task1~Task2': (v1, v2) => {
            // 对象批量注册事件 对象事件注册复合事件key的分割线，默认是 ‘,’  
        }
    })
    
    ep.async('Test1') // 异步监听 事件
    ep.async(['Test1', 'Test2']) // 异步监听 合成事件

    // 总是执行事件之前 以及 之后的钩子
    ep.before(['Test1', 'Test2'], () => {});
    ep.after(['Test1', 'Test2'], () => {});

    // 触发次数执行
    ep.after(['Test1', 'Test2'], () => {}, 3 /* waitcount */); // 需要触发3次才会执行回调函数
   
    // 触发事件
    ep.emit('Task', data);
    ep.done('Task', data); // emit alias
```