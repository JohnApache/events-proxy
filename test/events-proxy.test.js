const expect = require("chai").expect;
const createEventsProxy = require('../src/events-proxy');
const createProxyPool = require('../src/proxy')

describe('事件代理EventsProxy对外方法测试', function() {
    describe('事件代理EventsProxy初始化测试', function() {
        it('初始化EventsProxy应该包含一个proxypool对象', function () {
            const ep = createEventsProxy();
            expect(ep._proxy).to.be.deep.equal(createProxyPool());
        }) 
    })
    describe('事件代理addProxys添加proxy测试', function() {
        it('添加proxy支持单事件proxy也支持数组复合事件注册, 并创建回调函数的event对象', function () {
            const ep = createEventsProxy();
            ep._addProxys('Test', (data) => {
                expect(data).to.be.equal(1);
            })
            ep.emit('Test', 1)
        }) 
    })
    describe('事件代理addProxysLoop对象遍历添加proxy测试', function() {
        it('支持对象递归添加单事件proxy,且支持复合事件，复合事件的key默认以~下划线分割每个key,且仅在批量注册前提下有效', function () {
            const ep = createEventsProxy();
            ep._addProxysLoop({
                'Test1': (v) => {
                    expect(v).to.be.equal(1);
                },
                'Test2': (v) => {
                    expect(v).to.be.equal(2);
                },
                'Test1~Test2': (v1, v2) => {
                    expect(v1).to.be.equal(1);
                    expect(v2).to.be.equal(2);
                }
            })
            ep.emit('Test1', 1);
            ep.emit('Test2', 2);
        }) 
    })
    describe('事件代理setProxyLoopSplit设置对象遍历分割线测试', function() {
        it('修改对象批量注册事件对象键默认分割线, 依旧仅在批量注册前提下有效', function () {
            const ep = createEventsProxy();
            ep.setProxyLoopSplit('_');
            ep._addProxysLoop({
                'Test1': (v) => {
                    expect(v).to.be.equal(1);
                },
                'Test2': (v) => {
                    expect(v).to.be.equal(2);
                },
                'Test1_Test2': (v1, v2) => {
                    expect(v1).to.be.equal(1);
                    expect(v2).to.be.equal(2);
                }
            })
            ep.emit('Test1', 1);
            ep.emit('Test2', 2);
        }) 
    })

    describe('事件代理register注册事件代理测试', function() {
        it('事件代理register注册事件代理支持单事件复合事件以及对象批量事件', function () {
            const ep = createEventsProxy();
            ep.register('Test1', (v) => {
                expect(v).to.be.equal(1);
            })
            ep.register(['Test1', 'Test2'], (v1, v2) => {
                expect(v1).to.be.equal(1);
                expect(v2).to.be.equal(2);
            })
            ep.register({
                'Test1': (v) => {
                    expect(v).to.be.equal(1);
                },
                'Test2': (v) => {
                    expect(v).to.be.equal(2);
                },
                'Test1~Test2': (v1, v2) => {
                    expect(v1).to.be.equal(1);
                    expect(v2).to.be.equal(2);
                }
            })
            ep.emit('Test1', 1);
            ep.emit('Test2', 2);
        }) 
    })

    describe('事件代理emit触发代理事件测试', function() {
        it('事件代理emit触发某个事件代理事件测试', function () {
            const ep = createEventsProxy();
            ep.register('Test1', (v) => {
                expect(v).to.be.equal(1);
            })
            ep.register(['Test1', 'Test2'], (v1, v2) => {
                expect(v1).to.be.equal(1);
                expect(v2).to.be.equal(2);
            })
            ep.register({
                'Test1': (v) => {
                    expect(v).to.be.equal(1);
                },
                'Test2': (v) => {
                    expect(v).to.be.equal(2);
                },
                'Test1~Test2': (v1, v2) => {
                    expect(v1).to.be.equal(1);
                    expect(v2).to.be.equal(2);
                }
            })
            ep.emit('Test1', 1);
            ep.emit('Test2', 2);
        }) 
    })
})