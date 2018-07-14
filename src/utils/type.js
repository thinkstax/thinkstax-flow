function isString(value) {
  return typeof value === 'string';
}

function isFunction(value) {
  return typeof value === 'function';
}

function isObject(value) {
  return typeof value === 'object';
}

function isNotString(value) {
  return !isString(value);
}

function isNotFunction(value) {
  return !isFunction(value);
}

function isNotObject(value) {
  return !isObject(value);
}

function isArray(value) {
  return Array.isArray(value);
}

function isNotArray(value) {
  return !isArray(value);
}

export {
  isString,
  isFunction,
  isObject,
  isNotString,
  isNotFunction,
  isNotObject,
  isArray,
  isNotArray
};

export default {
  isString,
  isFunction,
  isObject,
  isNotString,
  isNotFunction,
  isNotObject,
  isArray,
  isNotArray
};

