const EMPTY_STRING = '';

export default function isValidStateChartObject(obj) {
  if (!obj) return false;
  if (typeof obj !== 'object') return true;

  return Object.keys(obj).reduce((isValid, key) =>
    isValid && validateKey(key) && isValidObject(obj[key]), true);

  function validateKey(key) {
    const invalidKeys = [`${null}`, `${{}.toString()}`, `${undefined}`];
    return invalidKeys.indexOf(key) === -1;
  }
}
