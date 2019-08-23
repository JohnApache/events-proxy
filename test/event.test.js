import {expect} from 'chai';
import createEvent from '../src/event';

describe('事件对象所有方法测试', function() {
	describe('事件对象初始化测试', function() {
		it('事件createEvent测试', function() {
			let a = () => {};
			const ev = createEvent('Test', a);
			expect(ev._cb).to.be.equal(a);
			expect(ev._ev).to.be.deep.equal(['Test']);
		});
	}); 

	describe('比较两个事件对象深度相同isDeepEqualEvent方法测试', function() {
		it('事件isDeepEqualEvent测试', function() {
			let a = () => {};
			let b = () => {};
			const ev = createEvent('Test', a);
			const ev2 = createEvent('Test', a);
			const ev3 = createEvent('Test2', a);
			const ev4 = createEvent('Test', b);
			const ev5 = createEvent(['Test1', 'Test2'], a);
			const ev6 = createEvent(['Test1', 'Test2'], a);
			const ev7 = createEvent(['Test1', 'Test2'], b);
			const ev8 = createEvent(['Test1', 'Test3'], b);
			expect(ev.isDeepEqualEvent(ev2)).to.be.equal(true);
			expect(ev.isDeepEqualEvent(ev3)).to.be.equal(false);
			expect(ev.isDeepEqualEvent(ev4)).to.be.equal(false);
			expect(ev.isDeepEqualEvent(ev4)).to.be.equal(false);
			expect(ev5.isDeepEqualEvent(ev6)).to.be.equal(true);
			expect(ev5.isDeepEqualEvent(ev7)).to.be.equal(false);
			expect(ev5.isDeepEqualEvent(ev8)).to.be.equal(false);
		});
	}); 
	describe('事件对象done方法测试', function() {
		it('单事件对象done会立即执行绑定的方法并传入data数组展开', function() {
			let a = (data) => {
				expect(data).to.be.equal(1);
			};
			const ev = createEvent('Test', a);
			ev.done('Test', 1);
		});
		it('复合事件对象done会先推对应key栈并传入data,复合事件的所有key栈都推栈后会执行绑定方法并传入data数组展开, 顺序按照绑定顺序返回', function() {
			let a = (v1, v2) => {
				expect(v1).to.be.deep.equal(1);
				expect(v2).to.be.deep.equal(2);
			};
			const ev = createEvent(['Test1', 'Test2'], a);
			ev.done('Test2', 2);
			ev.done('Test1', 1);
		});
	}); 

	describe('事件对象execute方法测试', function() {
		it('事件对象execute会检索是否有对应的key满足所有的key栈才会执行', function() {
			let a = (v1, v2) => {
				expect(v1).to.be.equal(1);
				expect(v2).to.be.equal(2);
			};
			const ev = createEvent(['Test1', 'Test2'], a);
			ev._sp.push('Test1', 1);
			ev.execute();
			ev._sp.push('Test2', 2);
			ev.execute();
		});

		it('当事件对象等待深度 大于 1 时会等待 返回的data会是每一层data 并数组形式返回', function() {
			let a = (v1, v2) => {
				expect(v1).to.be.deep.equal([1, 2]);
				expect(v2).to.be.deep.equal([3, 4]);
			};
			const ev = createEvent(['Test1', 'Test2'], a, 2);
			ev._sp.push('Test1', 1);
			ev.execute();
			ev._sp.push('Test2', 2);
			ev.execute();
			ev._sp.push('Test1', 3);
			ev.execute();
			ev._sp.push('Test2', 4);
			ev.execute();
		});
	}); 
}); 