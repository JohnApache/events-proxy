const expect = require("chai").expect;
const createEventsProxy = require('../src/events-proxy');
const createProxyPool = require('../src/proxy')

describe('事件代理EventsProxy对外方法测试', function() {
    describe('事件代理EventsProxy初始化测试', function() {
        it('初始化EventsProxy应该包含一个proxypool对象', function () {
            const ep = createEventsProxy();
            expect(ep._proxy).to.be.deep.equal(createProxyPool());
        }) 
        it('初始化createEventsProxy可以快捷注册初始化事件 参数支持 string ', function () {
            const ep1 = createEventsProxy('Test1', (v) => {
                expect(v).to.be.equal(1);
            });
            ep1.register(['Test1', 'Test2'], (v1, v2) => {
                expect(v1).to.be.equal(1);
                expect(v2).to.be.equal(2);
            })
            ep1.emit('Test1', 1);
            ep1.emit('Test2', 2);
            
        }) 
        it('初始化createEventsProxy可以快捷注册初始化事件 参数支持  array ', function () {
            const ep2 = createEventsProxy(['Test1', 'Test2'], (v1, v2) => {
                expect(v1).to.be.equal(1);
                expect(v2).to.be.equal(2);
            });
            ep2.emit('Test1', 1);
            ep2.emit('Test2', 2);
        }) 
        it('初始化createEventsProxy可以快捷注册初始化事件 参数支持  object', function () {
            const ep3 = createEventsProxy({
                'Test1': (v1) => {
                    expect(v1).to.be.equal(1);
                },
                'Test1,Test2': (v1, v2) => {
                    expect(v1).to.be.equal(1);
                    expect(v2).to.be.equal(2);
                }
            });
            ep3.emit('Test1', 1);
            ep3.emit('Test2', 2);
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
        it('支持对象递归添加单事件proxy,且支持复合事件，复合事件的key默认以,下划线分割每个key,且仅在批量注册前提下有效', function () {
            const ep = createEventsProxy();
            ep._addProxysLoops({
                'Test1': (v) => {
                    expect(v).to.be.equal(1);
                },
                'Test2': (v) => {
                    expect(v).to.be.equal(2);
                },
                'Test1,Test2': (v1, v2) => {
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
            ep._addProxysLoops({
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
        it('事件代理register注册事件别名注册方式', function () {
            const ep = createEventsProxy();
            ep.bind('Test1', (v) => {
                expect(v).to.be.equal(1);
            })
            ep.on(['Test1', 'Test2'], (v1, v2) => {
                expect(v1).to.be.equal(1);
                expect(v2).to.be.equal(2);
            })
            ep.subscribe({
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
            ep.done('Test2', 2);
        }) 
        it('事件代理register注册事件返回值是卸载函数卸载更便捷', function () {
            const ep = createEventsProxy();
            let tmp = 0;
            const unregister = ep.register(['Test1', 'Test2'], (v1, v2) => {
                tmp ++;
            })
            ep.emit('Test1', 1);
            ep.emit('Test2', 2);
            expect(tmp).to.be.equal(1);
            unregister();
            tmp = 0;
            ep.emit('Test1', 1);
            ep.emit('Test2', 2);
            expect(tmp).to.be.equal(0);
        }) 
    })

    describe('事件代理before after测试', function() {
        it('事件代理before after执行顺序以及参数string array object都支持', function () {
            const ep = createEventsProxy();
            let tmp = '';
            ep.after({
                'Test1': (v) => {
                    tmp += 3;
                },
                'Test2': (v) => {
                    tmp += 8
                },
                'Test1,Test2': (v1, v2) => {
                    tmp += 9
                }
            })
            ep.register('Test1', () => {
                tmp += 2;
            })
            ep.register('Test2', () => {
                tmp += 6;
            })
            ep.register(['Test1', 'Test2'], () => {
                tmp += 7;
            })
            ep.before('Test1', () => {
                tmp += 1;
            })

            ep.before('Test2', () => {
                tmp += 4;
            })
            ep.before(['Test1', 'Test2'], () => {
                tmp += 5;
            })
            ep.emit('Test1', 1);
            ep.emit('Test2', 2);
            expect(tmp).to.be.equal('123456789');
        }) 
    })
    describe('事件代理once注册事件代理测试', function() {
        it('once注册事件效果和register一样但是只会执行一次, 参数也是支持string array object', function () {
            const ep = createEventsProxy();
            let tmp = 0;
            let fn = () => {
                tmp++;
            }
            ep.once('Test1', fn);
            ep.emit('Test1');
            expect(tmp).to.be.equal(1);
            ep.emit('Test1');
            expect(tmp).to.be.equal(1);
            ep.once(['Test1', 'Test2'], fn);
            ep.emit('Test1');
            ep.emit('Test2');
            expect(tmp).to.be.equal(2);
            ep.emit('Test1');
            ep.emit('Test2');
            expect(tmp).to.be.equal(2);
            ep.once({
                'Test1': fn,
                'Test1,Test2': fn
            })
            ep.emit('Test1', 1);
            expect(tmp).to.be.equal(3);
            ep.emit('Test2', 2);
            expect(tmp).to.be.equal(4);
            ep.emit('Test1', 1);
            expect(tmp).to.be.equal(4);
            ep.emit('Test2', 2);
            expect(tmp).to.be.equal(4);
        }) 
    })

    describe('事件代理wait注册事件代理测试', function() {
        it('wait注册事件效果和register一样但是触发需要根据深度的变化而变化, 参数支持string', function () {
            const ep = createEventsProxy();
            let tmp = 0;
            ep.wait('Test1', (v1, v2, v3) => {
                tmp++;
                expect(v1).to.be.deep.equal([1]);
                expect(v2).to.be.deep.equal([2]);
                expect(v3).to.be.deep.equal([3]);
            }, 3);
            ep.emit('Test1', 1);
            expect(tmp).to.be.deep.equal(0);
            ep.emit('Test1', 2);
            expect(tmp).to.be.deep.equal(0);
            ep.emit('Test1', 3);
            expect(tmp).to.be.deep.equal(1);
        }) 
        it('wait注册事件效果和register一样但是触发需要根据深度的变化而变化, 参数支持 array 复合事件', function () {
            const ep = createEventsProxy();
            let tmp = 0;
            ep.wait(['Test1', 'Test2'], (v1, v2, v3) => {
                tmp++;
                expect(v1).to.be.deep.equal([1, 1]);
                expect(v2).to.be.deep.equal([2, 2]);
                expect(v3).to.be.deep.equal([3, 3]);
            }, 3);
            ep.emit('Test1', 1);ep.emit('Test2', 1);
            expect(tmp).to.be.deep.equal(0);
            ep.emit('Test1', 2);ep.emit('Test2', 2);
            expect(tmp).to.be.deep.equal(0);
            ep.emit('Test1', 3);ep.emit('Test2', 3);
            expect(tmp).to.be.deep.equal(1);
        }) 
        it('wait注册事件效果和register一样但是触发需要根据深度的变化而变化, 参数支持 object 批量绑定事件，且每个事件的等待深度一致', function () {
            const ep = createEventsProxy();
            let tmp = 0;
            ep.wait({
                'Test1': (v1, v2) => {
                    tmp++;
                    expect(v1).to.be.deep.equal([1]);
                    expect(v2).to.be.deep.equal([2]);
                },
                'Test2': (v1, v2) => {
                    tmp++;
                    expect(v1).to.be.deep.equal([4]);
                    expect(v2).to.be.deep.equal([5]);
                },
                'Test1,Test2': (v1, v2) => {
                    tmp++;
                    expect(v1).to.be.deep.equal([1, 4]);
                    expect(v2).to.be.deep.equal([2, 5]);
                }
            }, 2)
            ep.emit('Test1', 1);ep.emit('Test2', 4);
            expect(tmp).to.be.deep.equal(0);
            ep.emit('Test1', 2);ep.emit('Test2', 5);
            expect(tmp).to.be.deep.equal(3);
            ep.emit('Test1', 3);ep.emit('Test2', 6);
            expect(tmp).to.be.deep.equal(3);
        }) 
    })

    describe('事件代理unregister alias 方法 unbind unsubscribe off解除事件代理测试', function() {
        it('事件代理unregister解除事件代理支持单事件复合事件以及对象批量事件', function () {
            const ep = createEventsProxy();
            let tmp = 0;
            let subscribeConfig = {
                'Test1': () => {
                    tmp++;
                },
                'Test2': () => {
                    tmp++;
                },
                'Test1,Test2': () => {
                    tmp++;
                }
            }
            ep.register(subscribeConfig)
            ep.emit('Test1', 1);
            ep.emit('Test2', 2);
            expect(tmp).to.be.equal(3);
            tmp = 0;
            ep.unsubscribe('Test1', subscribeConfig.Test1);
            ep.emit('Test1', 1);
            ep.emit('Test2', 2);
            expect(tmp).to.be.equal(2);
            tmp = 0;
            ep.unsubscribe('Test2', subscribeConfig.Test2);
            ep.emit('Test1', 1);
            ep.emit('Test2', 2);
            expect(tmp).to.be.equal(1);
            tmp = 0;
            ep.off(['Test1','Test2'], subscribeConfig["Test1,Test2"]);
            ep.emit('Test1', 1);
            ep.emit('Test2', 2);
            expect(tmp).to.be.equal(0);
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
                'Test1,Test2': (v1, v2) => {
                    expect(v1).to.be.equal(1);
                    expect(v2).to.be.equal(2);
                }
            })
            ep.emit('Test1', 1);
            ep.emit('Test2', 2);
        }) 
    })
})