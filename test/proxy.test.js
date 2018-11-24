const expect = require("chai").expect;
const createProxyPool = require('../src/proxy');
const createEvent = require('../src/event');
describe('事件代理池proxypool所有方法测试', function() {
    describe('事件代理池对象初始化测试', function() {
        it('事件createProxyPool测试', function() {
            const pp = createProxyPool();
            expect(pp._pp).to.be.deep.equal({})
        })
    })

    describe('事件代理池initProxy测试', function() {
        it('事件代理池没有的proxy会初始化一个事件代理栈stackpool', function() {
            const pp = createProxyPool();
            pp.initProxy('Test');
            expect(pp._pp['Test']._stack).to.be.deep.equal({})
        })
    })

    describe('事件代理池assignProxy分配代理event测试', function() {
        it('事件代理池没有的事件代理proxy会先初始化一个事件代理栈stackpool，再推栈对应的event', function() {
            const pp = createProxyPool();
            const ev = createEvent('Test', (data) => {
                console.log(data);
            });
            const ev2 = createEvent('Test', (data) => {
                console.log(data);
            });
            pp.assignProxy('Test', ev);
            pp.assignProxy('Test', ev2);
            expect(pp._pp['Test']._stack['__EVENT__']).to.be.deep.equal([ev, ev2])
        })
    })

    describe('事件代理池assignProxys分配代理复合事件event测试', function() {
        it('事件代理池推复合事件event会分发至每个单事件，每个单事件绑定的又是同一个复合事件event', function() {
            const pp = createProxyPool();
            const ev = createEvent(['Test1', 'Test2'], (data) => {
                console.log(data);
            });
            pp.assignProxys(['Test1', 'Test2'], ev)
            expect(pp._pp['Test1']._stack['__EVENT__']).to.be.deep.equal([ev]);
            expect(pp._pp['Test2']._stack['__EVENT__']).to.be.deep.equal([ev]);
        })
    })

    describe('事件代理池assignProxy alias方法 register分配代理event测试', function() {
        it('事件代理池没有的事件代理proxy会先初始化一个事件代理栈stackpool，再推栈对应的event', function() {
            const pp = createProxyPool();
            const ev = createEvent('Test', (data) => {
                console.log(data);
            });
            const ev2 = createEvent('Test', (data) => {
                console.log(data);
            });
            pp.register('Test', ev);
            pp.register('Test', ev2);
            expect(pp._pp['Test']._stack['__EVENT__']).to.be.deep.equal([ev, ev2])
        })
    })

    describe('事件代理池assignProxy alias registerAll方法分配代理复合事件event测试', function() {
        it('事件代理池推复合事件event会分发至每个单事件，每个单事件绑定的又是同一个复合事件event', function() {
            const pp = createProxyPool();
            const ev = createEvent(['Test1', 'Test2'], (data) => {
                console.log(data);
            });
            pp.registerAll(['Test1', 'Test2'], ev)
            expect(pp._pp['Test1']._stack['__EVENT__']).to.be.deep.equal([ev]);
            expect(pp._pp['Test2']._stack['__EVENT__']).to.be.deep.equal([ev]);
        })
    })

    describe('事件代理池emitProxy方法调度执行代理事件', function() {
        it('事件代理池推emitProxy会触发对应代理事件栈的所有事件的done方法，并传递data', function() {
            const pp = createProxyPool();
            const ev = createEvent(['Test1', 'Test2'], (v1, v2) => {
                expect(v1).to.be.equal(1);
                expect(v2).to.be.equal(2);
            });
            const ev1 = createEvent('Test1', (data) => {
                expect(data).to.be.equal(1);
            });
            const ev2 = createEvent('Test2', (data) => {
                expect(data).to.be.equal(2);
            });
            pp.registerAll(['Test1', 'Test2'], ev);
            pp.emitProxy('Test1', 1);
            pp.emitProxy('Test2', 2);
        })
    })

})