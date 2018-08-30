function isArray(value) {
  return Array.isArray(value);
}

function isNotArray(value) {
  return !isArray(value);
}

function isEmptyArray(value) {
  return isArray(value) && value.length === 0;
}

function isNotEmptyArray(value) {
  return !isEmptyArray(value);
}

function isFunction(value) {
  return typeof value === 'function';
}

function isString(value) {
  return typeof value === 'string';
}

function isNotString(value) {
  return !isString(value);
}

function isNull(value) {
  return value === null;
}

function isNotNull(value) {
  return !isNull(value);
}

function isUndefined(value) {
  return typeof value === 'undefined';
}

function isObject(value) {
  return (typeof value === 'object' && isNotNull(value) && isNotArray(value));
}

function isNotObject(value) {
  return !isObject(value);
}
function isEmptyString(value) {
  return isString(value) && value.trim() === '';
}

function isNotEmptyString(value) {
  return !isEmptyString(value);
}

function isNullOrUndefined(value) {
  return isNull(value) || isUndefined(value);
}

function isNotNullOrUndefined(value) {
  return !isNullOrUndefined(value);
}

function isBoolean(value) {
  return typeof value === 'boolean';
}

function getType(value) {
  if (isNull(value)) return 'null';
  if (isArray(value)) return 'array';

  return typeof value;
}

export {
  isArray,
  isNotArray,
  isEmptyArray,
  isNotEmptyArray,
  isFunction,
  isString,
  isNotString,
  isNull,
  isNotNull,
  isUndefined,
  isObject,
  isNotObject,
  isEmptyString,
  isNotEmptyString,
  isNullOrUndefined,
  isNotNullOrUndefined,
  isBoolean,
  getType
};

export default {
  isArray,
  isNotArray,
  isEmptyArray,
  isNotEmptyArray,
  isFunction,
  isString,
  isNotString,
  isNull,
  isNotNull,
  isUndefined,
  isObject,
  isNotObject,
  isEmptyString,
  isNotEmptyString,
  isNullOrUndefined,
  isNotNullOrUndefined,
  isBoolean,
  getType
};

