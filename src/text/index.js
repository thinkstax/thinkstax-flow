import overrides from './overrides';
import defaults from './default';
import { EMPTY_STRING } from '../constants';
import { isFunction, isString, isNotString, isNotObject, isArray, getType } from '../utils/type';
import merge from '../utils/mergeDeep';
import React from 'react';

function getRawTextDict({ override } = {}) {
  return Object.freeze(merge(defaults || {}, overrides[override] || {}));
}

function getTextDict(query) {
  return ensurePropValuesAreFunctions(getRawTextDict(query));
}

function ensurePropValuesAreFunctions(textDict) {
  if (isNotObject(textDict)) return ensureValueIsFunction(textDict);

  const newTextDict = {};
  Object.keys(textDict).forEach((prop) => {
    newTextDict[prop] = ensureValueIsFunction(textDict[prop]);
  });

  return Object.freeze(newTextDict);
}

function ensureValueIsFunction(value) {
  switch (getType(value)) {
    case 'function':
      return value;
    case 'object':
      return ensurePropValuesAreFunctions(value);
    default:
      return () => value;
  }
}


function renderText(query) {
  const text = getText(query);
  /* eslint-disable-next-line */
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
}

function getText({ override, prop, data }) {
  const textDict = getTextDict({ override });
  return getTextFrom({ prop, data, textDict });
}

function getTextFrom({ prop, data, textDict }) {
  const text = getPropValue(textDict, prop);
  return evaluateText({ text, data });
}
function evaluateText({ text, data }) {
  if (isFunction(text)) return text(data);
  if (isArray(text)) text.map(evaluateText);
  if (isNotString(text)) return EMPTY_STRING;
  return text;
}

function getPropValue(obj, prop) {
  return getPropHierarchyArray(prop).reduce((a, c) => {
    if (a) return a[c];
    return a;
  }, obj);
}

function getPropHierarchyArray(prop) {
  if (Array.isArray(prop)) return prop;
  if (isString(prop)) {
    return prop.trim().split('.').map(p => p.trim());
  }
  return [];
}


export { ensureValueIsFunction, ensurePropValuesAreFunctions, renderText, getText, getTextFrom, getRawTextDict, getTextDict };

export default getTextDict;

