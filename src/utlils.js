const isArray = (value) => {
    return Array.isArray(value);
}

const isObject = (value) => {
    return Object.prototype.toString.call(value) === '[object Object]';
}

const isString = (value) => {
    return typeof value === 'string';
}

const isFunction = (value) => {
    return Object.prototype.toString.call(value) === '[object Function]';
}

module.exports = {
    isArray,
    isObject,
    isString,
    isFunction
}