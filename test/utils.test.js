import {expect} from 'chai';
import {
	isArray,
	isObject,
	isString,
	isFunction,
	isInt
} from '../src/utils';

const isEqual = (v1, v2, isDeep = false) => {
	if(!isDeep) {
		expect(v1).to.be.equal(v2);
		return;
	}
	expect(v1).to.be.deep.equal(v2);
};

describe('utils工具方法测试', function() {
	describe('isArray方法测试', function() {
		it('isArray(3) expect false', function() {
			isEqual(isArray(3), false);
		});
		it('isArray([1,2]) expect true', function() {
			isEqual(isArray([1, 2]), true);
		});
	});
	describe('isObject方法测试', function() {
		it('isObject([1,2]) expect false', function() {
			isEqual(isObject([1, 2]), false);
		});
		it('isObject({a:3}) expect true', function() {
			isEqual(isObject({a:3}), true);
		});
	});
	describe('isString方法测试', function() {
		it('isString(3) expect false', function() {
			isEqual(isString(3), false);
		});
		it('isString("3") expect true', function() {
			isEqual(isString('3'), true);
		});
	});
	describe('isFunction方法测试', function() {
		it('isFunction([3]) expect false', function() {
			isEqual(isFunction([3]), false);
		});
		it('isFunction(()=>{}) expect true', function() {
			isEqual(isFunction(()=>{}), true);
		});
	});
	describe('isInt方法测试', function() {
		it('isInt("0") expect false', function() {
			isEqual(isInt('0'), false);
		});
		it('isInt(3) expect true', function() {
			isEqual(isInt(3), true);
		});
	});
});