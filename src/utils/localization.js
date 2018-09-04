import React from 'react';
import { isFunction, isString } from '../type';
import { EMPTY_STRING } from '../../constants';

// function ensurePropValuesAreFunctions(textDict) {
//   if (isNotObject(textDict)) return ensureValueIsFunction(textDict);

//   const newTextDict = {};
//   Object.keys(textDict).forEach((prop) => {
//     newTextDict[prop] = ensureValueIsFunction(textDict[prop]);
//   });

//   return Object.freeze(newTextDict);
// }

// function ensureValueIsFunction(value) {
//   switch (getType(value)) {
//     case 'function':
//       return value;
//     case 'object':
//       return ensurePropValuesAreFunctions(value);
//     default:
//       return () => value;
//   }
// }

function renderText(textDict, query) {
  const text = getText(textDict, query);
  /* eslint-disable-next-line */
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
}

function getText(textDict, { key, data, defaultText, logError }) { // eslint-disable-line object-curly-newline
  const text = getPropValue(textDict, key);
  return evaluateText({ text, data, defaultText, logError }); // eslint-disable-line object-curly-newline
}

function evaluateText({ text, data, defaultText = EMPTY_STRING, logError = () => {} }) { // eslint-disable-line object-curly-newline
  let evalText = defaultText;
  try {
    evalText = (isFunction(text) ? text(data) : text) || defaultText;
  } catch (e) {
    const error = new Error('Failed evaluating localized text');
    error.inner = e;
    logError(error);
  }
  return evalText;
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


export { renderText, getText };

