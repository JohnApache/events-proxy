const expect = require("chai").expect;
const createStackPool = require('../src/stack')
describe('栈池所有方法测试', function() {
    describe('栈池initStack测试', function () {
        it('initStack正常初始化', function () {
            const stack = createStackPool();
            stack.initStack('Test');
            expect(stack._stack['Test']).to.be.deep.equal([])
        })
        it('initStack已创建不初始化', function () {
            const stack = createStackPool();
            stack._stack['Test'] = [1];
            stack.initStack('Test');
            expect(stack._stack['Test']).to.be.deep.equal([1])
        })
        it('initStack异常键初始化无效果', function () {
            const stack = createStackPool();
            stack.initStack(['Test']);
            expect(typeof stack._stack['Test']).to.be.deep.equal('undefined');
        })
    })
    
    
    describe('栈池批量initStacks测试', function () {
        it('initStacks批量正常初始化', function () {
            const stack = createStackPool();
            stack.initStacks(['Test1', 'Test2']);
            expect(stack._stack['Test1']).to.be.deep.equal([]);
            expect(stack._stack['Test2']).to.be.deep.equal([]);
        })
        it('initStacks已创建不初始化', function () {
            const stack = createStackPool();
            stack._stack['Test1'] = [1];
            stack.initStacks(['Test1', 'Test2']);
            expect(stack._stack['Test1']).to.be.deep.equal([1]);
            expect(stack._stack['Test2']).to.be.deep.equal([]);;
        })
    })
    
    
    
    describe('栈池pushStack测试', function () {
        it('已经初始化的stack直接推栈', function () {
            const stack = createStackPool();
            stack._stack['Test'] = [1];
            stack.pushStack('Test', 2)
            expect(stack._stack['Test']).to.be.deep.equal([1,2]);
        })
        it('未初始化的stack先初始化再推栈', function () {
            const stack = createStackPool();
            stack.pushStack('Test', 1)
            expect(stack._stack['Test']).to.be.deep.equal([1]);
        })
    })
    
    describe('栈池pushStack的 alias push方法测试', function () {
        it('已经初始化的stack直接推栈', function () {
            const stack = createStackPool();
            stack._stack['Test'] = [1];
            stack.push('Test', 2)
            expect(stack._stack['Test']).to.be.deep.equal([1,2]);
        })
        it('未初始化的stack先初始化再推栈', function () {
            const stack = createStackPool();
            stack.push('Test', 1)
            expect(stack._stack['Test']).to.be.deep.equal([1]);
        })
    })
    
    describe('栈池pushStacks的批量推栈测试', function () {
        it('已经初始化的stack直接推栈', function () {
            const stack = createStackPool();
            stack._stack['Test1'] = [1];
            stack._stack['Test2'] = [2];
            stack.pushStacks(['Test1', 'Test2'], 2)
            expect(stack._stack['Test1']).to.be.deep.equal([1,2]);
            expect(stack._stack['Test2']).to.be.deep.equal([2,2]);
        })
        it('未初始化的stack先初始化再推栈', function () {
            const stack = createStackPool();
            stack._stack['Test1'] = [1];
            stack.pushStacks(['Test1', 'Test2'], 2)
            expect(stack._stack['Test1']).to.be.deep.equal([1,2]);
            expect(stack._stack['Test2']).to.be.deep.equal([2]);
        })
    })
    
    
    describe('栈池popStack的栈推出测试', function () {
        it('已经初始化的stack直接栈推出，并返回栈顶变量', function () {
            const stack = createStackPool();
            stack.pushStack('Test1', 1);
            stack.pushStacks(['Test1', 'Test2'], 2);
            let t1 = stack.popStack('Test1');
            let t2 = stack.popStack('Test2');
            expect(t1).to.be.deep.equal(1);
            expect(t2).to.be.deep.equal(2);
            expect(stack._stack['Test1']).to.be.deep.equal([2]);
            expect(stack._stack['Test2']).to.be.deep.equal([]);
        })
    })
    
    describe('栈池popStack的 alias pop方法栈推出测试', function () {
        it('已经初始化的stack直接栈推出，并返回栈顶变量', function () {
            const stack = createStackPool();
            stack.pushStack('Test1', 1);
            stack.pushStacks(['Test1', 'Test2'], 2);
            let t1 = stack.pop('Test1');
            let t2 = stack.pop('Test2');
            expect(t1).to.be.deep.equal(1);
            expect(t2).to.be.deep.equal(2);
            expect(stack._stack['Test1']).to.be.deep.equal([2]);
            expect(stack._stack['Test2']).to.be.deep.equal([]);
        })
    })
    
    describe('栈池popStacks栈批量推出测试', function () {
        it('未初始化stack会初始化，已经初始化的stack直接栈推出, 返回所有栈顶变量数组', function () {
            const stack = createStackPool();
            stack.pushStack('Test1', 1);
            stack.pushStacks(['Test1', 'Test2'], 2);
            let t = stack.popStacks(['Test1', 'Test2', 'Test3']);
            expect(t).to.be.deep.equal([1,2,undefined]);
            expect(stack._stack['Test1']).to.be.deep.equal([2]);
            expect(stack._stack['Test2']).to.be.deep.equal([]);
            expect(stack._stack['Test3']).to.be.deep.equal([]);
        })
    })
    
    
    
    describe('栈池checkKey检索某栈是否有值测试', function () {
        it('未初始化或者已经初始化的stack但栈无值都返回false, 如果有值则返回true', function () {
            const stack = createStackPool();
            stack.initStack('Test1');
            stack.pushStack('Test2', 1);
            expect(stack.checkKey('Test1')).to.be.equal(false);
            expect(stack.checkKey('Test2')).to.be.equal(true);
            expect(stack.checkKey('Test3')).to.be.equal(false);
        })
    })
    
    describe('栈池checkKeys 批量检索某所有栈是否都有值测试', function () {
        it('未初始化或者已经初始化的stack但栈无值都返回false, 如果有值则返回true', function () {
            const stack = createStackPool();
            stack.pushStack('Test1', 1);
            stack.pushStack('Test2', 2);
            stack.initStack('Test3');
            expect(stack.checkKeys(['Test1', 'Test2'])).to.be.equal(true);
            expect(stack.checkKeys(['Test1', 'Test2', 'Test3'])).to.be.equal(false);
        })
    })
    
    describe('栈池forEachByKey遍历某栈通过key测试', function () {
        it('遍历会返回对应key栈的value 和 index 以及 栈arr', function () {
            const stack = createStackPool();
            stack.pushStack('Test1', 1);
            stack.pushStack('Test1', 2);
            stack.pushStack('Test1', 3);
            stack.pushStack('Test1', 4);
            stack.forEachByKey('Test1', (v, i, arr) => {
                expect(v).to.be.equal(i+1);
                expect(arr).to.be.deep.equal([1,2,3,4]);
            })
        })
    })
    
    
    describe('栈池clear清栈测试', function () {
        it('清栈会清楚所有绑定的key', function () {
            const stack = createStackPool();
            stack.pushStack('Test1', 1);
            stack.pushStack('Test2', 2);
            expect(stack.checkKey('Test1')).to.be.equal(true);
            expect(stack.checkKey('Test2')).to.be.equal(true);
            stack.clear();
            expect(stack.checkKey('Test1')).to.be.equal(false);
            expect(stack.checkKey('Test2')).to.be.equal(false);
            expect(stack._stack).to.be.deep.equal({});
        })
    })
})