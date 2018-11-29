const isArray = (value) => {
	return Array.isArray(value);
};

const isObject = (value) => {
	return Object.prototype.toString.call(value) === '[object Object]';
};

const isString = (value) => {
	return typeof value === 'string';
};

const isFunction = (value) => {
	return Object.prototype.toString.call(value) === '[object Function]';
};

const isInt = (value) => {
	return typeof value === 'number';
};

module.exports = {
	isArray,
	isObject,
	isString,
	isFunction,
	isInt
};