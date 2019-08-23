export const isArray = (value) => {
	return Array.isArray(value);
};

export const isObject = (value) => {
	return Object.prototype.toString.call(value) === '[object Object]';
};

export const isString = (value) => {
	return typeof value === 'string';
};

export const isFunction = (value) => {
	return Object.prototype.toString.call(value) === '[object Function]';
};

export const isInt = (value) => {
	return typeof value === 'number';
};
