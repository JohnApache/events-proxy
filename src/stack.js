const {isArray, isString} = require('./utlils');
class StackPool {
    constructor() {
        this._stack = {};
    }
    initStack(key) {
        if(!isString(key)) return;
        if(!this._stack[key]) {
            this._stack[key] = []
        }
    }
    initStacks(keys) {
        keys = [].concat(keys);
        keys.forEach(key => {
            this.initStack(key);
        })
    }
    pushStack(key, value) {
        this.initStack(key);
        return this._stack[key].push(value);
    }
    push(key, value) {
        return this.pushStack(key, value);
    }
    pushStacks(keys, value) {
        keys = [].concat(keys);
        this.initStacks(keys);
        keys.forEach(key => {
            this.pushStack(key, value)
        })
    }
    popStack(key) {
        this.initStack(key);
        return this._stack[key].shift();
    }
    pop(key) {
        return this.popStack(key);
    }
    popStacks(keys) {
        keys = [].concat(keys);
        let res = [];
        this.initStacks(keys);
        keys.forEach(key => {
            res.push(this.popStack(key));
        })
        return res;
    }
    checkKey(key) {
        return isArray(this._stack[key]) && (this._stack[key].length > 0);
    }
    checkKeys(keys) {
        keys = [].concat(keys);
        return keys.every(key => this.checkKey(key));
    }
    forEachByKey(key, cb) {
        if(this.checkKey(key)) {
            this._stack[key].forEach((v, i) => {
                cb && cb(v, i, this._stack[key])
            })
        }
    } 
    clear() {
        this._stack = {};
    }
}

const createStackPool = () => {
    return new StackPool();
}

module.exports = createStackPool;