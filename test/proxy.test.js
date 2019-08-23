import {expect} from 'chai';
import createProxyPool from '../src/proxy';
import createEvent from '../src/event';
import {PROXY_EVENT_KEY} from '../src/definition';


describe('事件代理池proxypool所有方法测试', function() {
	describe('事件代理池对象初始化测试', function() {
		it('事件createProxyPool测试', function() {
			const pp = createProxyPool();
			expect(pp._pp).to.be.deep.equal({});
		});
	});

	describe('事件代理池_initProxy测试', function() {
		it('事件代理池没有的proxy会初始化一个事件代理栈stackpool', function() {
			const pp = createProxyPool();
			pp._initProxy('Test');
			expect(pp._pp['Test']._stack).to.be.deep.equal({});
		});
	});

	describe('事件代理池beforeExecute afterExecute测试', function() {
		it('事件代理池beforeExecute注册的方法 总会在注册执行栈之前', function() {
			const pp = createProxyPool();
			let tmp = '';
			const ev = createEvent('Test', () => {
				tmp += 1;
			});
			const ev2 = createEvent('Test', () => {
				tmp += 2;
			});
			const ev3 = createEvent('Test', () => {
				tmp += 3;
			});
			const ev4 = createEvent(['Test', 'Test2'], () => {
				tmp += 4;
			});
			const ev5 = createEvent(['Test', 'Test2'], () => {
				tmp += 5;
			});
			const ev6 = createEvent(['Test', 'Test2'], () => {
				tmp += 6;
			});
			pp.beforeExecute('Test', ev);
			pp.assignProxy('Test', ev2);
			pp.afterExecute('Test', ev3);
			pp.beforeExecute(['Test', 'Test2'], ev4);
			pp.assignProxys(['Test', 'Test2'], ev5);
			pp.afterExecute(['Test', 'Test2'], ev6);
			pp.emitProxy('Test');
			pp.emitProxy('Test2');
			expect(tmp).to.be.equal('123456');
		});
	});

	describe('事件代理池assignProxy分配代理event测试', function() {
		it('事件代理池没有的事件代理proxy会先初始化一个事件代理栈stackpool，再推栈对应的event', function() {
			const pp = createProxyPool();
			const ev = createEvent('Test', () => {});
			const ev2 = createEvent('Test', () => {});
			pp.assignProxy('Test', ev);
			pp.assignProxy('Test', ev2);
			expect(
				pp
					._pp['Test']
					.queryStack(PROXY_EVENT_KEY))
				.to.be.deep.equal([ev, ev2]);
		});
	});

	describe('事件代理池assignProxys分配代理复合事件event测试', function() {
		it('事件代理池推复合事件event会分发至每个单事件，每个单事件绑定的又是同一个复合事件event', function() {
			const pp = createProxyPool();
			const ev = createEvent(['Test1', 'Test2'], () => {});
			pp.assignProxys(['Test1', 'Test2'], ev);
			expect(pp
				._pp['Test1']
				.queryStack(PROXY_EVENT_KEY))
				.to.be.deep.equal([ev]);
			expect(pp
				._pp['Test2']
				.queryStack(PROXY_EVENT_KEY))
				.to.be.deep.equal([ev]);
		});
	});

	describe('事件代理池fireProxy解除绑定的单个event代理事件测试', function() {
		it('解除绑定的同一个函数同一个事件名代理事件', function() {
			let tmp = 0;
			const cb = () => { tmp ++;};
			const pp = createProxyPool();
			const ev = createEvent('Test', cb);
			const ev2 = createEvent('Test', cb);
			const ev3 = createEvent('Test2', cb);
			pp.assignProxy('Test', ev2);
			pp.assignProxy('Test2', ev3);
			pp.emitProxy('Test');
			pp.emitProxy('Test2');
			expect(tmp).to.be.equal(2);
			pp.fireProxy('Test', ev);
			tmp = 0;
			pp.emitProxy('Test');
			pp.emitProxy('Test2');
			expect(tmp).to.be.equal(1);
		});
		it('没有指定解除事件代理proxy或者没有指定event都是无效的', function() {
			let tmp = 0;
			const cb = () => { tmp ++;};
			const pp = createProxyPool();
			const ev = createEvent('Test', cb);
			pp.assignProxy('Test', ev);
			pp.emitProxy('Test');
			expect(tmp).to.be.equal(1);
			pp.fireProxy('Test');
			pp.emitProxy('Test');
			expect(tmp).to.be.equal(2);
			pp.fireProxy('', ev);
			pp.emitProxy('Test');
			expect(tmp).to.be.equal(3);
			pp.fireProxy('Test', ev);
			pp.emitProxy('Test');
			expect(tmp).to.be.equal(3);
		});
	});

	describe('事件代理池fireProxys解除绑定的复合事件event代理事件测试', function() {
		it('解除绑定的同一个函数同一个事件名代理事件', function() {
			let tmp = 0;
			const cb = () => { tmp ++;};
			const pp = createProxyPool();
			const ev = createEvent(['Test1', 'Test2'], cb);
			const ev2 = createEvent(['Test1', 'Test2'], cb);
			pp.assignProxys(['Test1', 'Test2'], ev);
			pp.emitProxy('Test1');
			pp.emitProxy('Test2');
			expect(tmp).to.be.equal(1);
			pp.fireProxys(['Test1', 'Test2'], ev2);
			tmp = 0;
			pp.emitProxy('Test');
			pp.emitProxy('Test2');
			expect(tmp).to.be.equal(0);
		});
	});

	describe('事件代理池emitProxy方法调度执行代理事件', function() {
		it('事件代理池推emitProxy会触发对应代理事件栈的所有事件的done方法，并传递data', function() {
			const pp = createProxyPool();
			const ev = createEvent(['Test1', 'Test2'], (v1, v2) => {
				expect(v1).to.be.equal(1);
				expect(v2).to.be.equal(2);
			});
			pp.assignProxys(['Test1', 'Test2'], ev);
			pp.emitProxy('Test1', 1);
			pp.emitProxy('Test2', 2);
		});
	});

});