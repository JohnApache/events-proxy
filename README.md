#Javascript 自定义事件代理插件

*****
+ 插件主要特点：
    - 深层嵌套回调函数，以事件模式完全解除了嵌套的问题, 解耦复杂业务逻辑
    - 在不同场景里多个异步同时完成时即执行某个函数，且多个异步执行并行执行 不会堵塞
    - 全局监听事件，订阅模式
    - 兼容node端 浏览器端
*****

##测试用例测试结果

![mocha](./mocha.gif "测试结果")

##示例

### 单事件绑定
```javascript
    var tmp = 0;
    setTimeout(() => {
        tmp = 1;
        events.emit('Test1');
    }, 1000);
    events.register('Test1', () => {
        expect(tmp).to.be.equal(1);
        done();
    })
    expect(tmp).to.be.equal(0);

```

### 合成事件绑定
```javascript
    // 传统模式
    const events = new EventsProxy();
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
    const events = new EventsProxy();
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        events.emit('Task1', data);
    })
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        events.emit('Task2', data);
    })
    fetch(url, options).then(function(response) {
        {`... 复杂业务 ...`}
        events.emit('Task3', data);
    })
    events.register(['Task1', 'Task1', 'Task3'], (...data) => {
        console.log('finshied', ...data);
    })
```

### 多事件绑定
```javascript
    const events = new EventsProxy();
    var tmp = 0;
    setTimeout(() => {
        tmp++;
        events.emit('Test1');
        setTimeout(() => {
            tmp++
            events.emit('Test2');
            setTimeout(() => {
                tmp++
                events.emit('Test3');
                done();
            }, 1000)
        }, 1000)
    }, 1000);
    events.register({
        'Test1': () => {
            expect(tmp).to.be.equal(1);
        },
        'Test2': () => {
            expect(tmp).to.be.equal(2);
        },
        'Test3': () => {
            expect(tmp).to.be.equal(3);
        }
    })
    expect(tmp).to.be.equal(0);
```