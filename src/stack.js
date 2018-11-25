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
    queryStack(key) {
        this.initStack(key);
        return this._stack[key]
    }
    setStack(key, values) {
        this._stack[key] = [].concat(values);
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
    checkKey(key, minLen = 1) {
        minLen = minLen < 1 ? 1 : minLen;
        return isArray(this._stack[key]) && (this._stack[key].length >= minLen);
    }
    checkKeys(keys, minLen) {
        keys = [].concat(keys);
        return keys.every(key => this.checkKey(key, minLen));
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