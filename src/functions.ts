export const prepareInitElement = (initElement: Element | string): Element => {
  if (typeof initElement === 'string') {
    const findElement = document.querySelector(initElement);
    if (findElement === null) {
      throw new Error('This element not find on page');
    }
    return findElement;
  }
  if (
    initElement instanceof HTMLInputElement &&
    initElement.tagName === 'INPUT'
  ) {
    return initElement;
  }
  throw new TypeError('Bad type initElement');
};

export const wrapInput = (el: Element, classWrapper: string): Element => {
  const wrapper = document.createElement('div');
  wrapper.classList.add(classWrapper);
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
  return wrapper;
};

export const createChanger = (
  symbol: string,
  classesChanger: string[]
): Element => {
  const changer = document.createElement('button');
  changer.classList.add(...classesChanger);
  changer.textContent = symbol;
  return changer;
};

export const issetObject = (object: any): object is object =>
  typeof object === 'object' && object !== null;

export const checkNumber = (x: any): x is number => typeof x === 'number';

const codeIsKey = (code: string): boolean => code.indexOf('Key') !== -1;
const codeIsPeriod = (code: string): boolean => code === 'Period';
const codeIsBackSpace = (code: string): boolean => code === 'Backspace';
const codeIsMinus = (code: string): boolean => code === 'Minus';
const codeIsDigit = (code: string): boolean => code.indexOf('Digit') !== -1;
const codeIsValidArrow = (code: string): boolean =>
  code === 'ArrowLeft' || code === 'ArrowRight';

export const checkValidKey = (e: KeyboardEvent): boolean => {
  const code = e.code;
  const ctrlKey = e.ctrlKey;
  const key = e.key.toLowerCase();
  if (
    codeIsPeriod(code) ||
    codeIsBackSpace(code) ||
    codeIsDigit(code) ||
    codeIsMinus(code) ||
    codeIsValidArrow(code)
  ) {
    return true;
  }
  if (codeIsKey(code) && ctrlKey && (key === 'c' || key === 'v')) {
    return true;
  }
  return false;
};

export const parseStrToNumber = (str: string): number => parseFloat(str);

export const validateStringOnNumber = (str: string): boolean =>
  parseStrToNumber(str).toString() === str;

export const checkNotEndedNumber = (str: string): boolean => {
  return parseStrToNumber(str).toString() + '.' === str;
};

export const getNextValue = (
  current: number,
  step: number,
  max: number,
  start: number = 0
): number => {
  const diff = max - current;
  if (diff <= step) {
    return current + diff;
  }
  const steps = (current + step - start) / step;
  return start + Math.floor(steps) * step;
};

export const getPrevValue = (
  current: number,
  step: number,
  min: number,
  start: number = 0
): number => {
  const diff = Math.abs(min - current);
  if (diff <= step) {
    return current - diff;
  }
  let steps = (current - step - start) / step;
  return start + Math.ceil(steps) * step;
};

const getSectionFromObjectSteps = (
  current: number,
  steps: { [key: number]: number }
): [string, number] => {
  const arrInfo = Object.entries(steps).reverse();
  const result = arrInfo
    .filter(info => {
      const [border] = info;
      const borderValue = parseFloat(border);
      return current >= borderValue;
    })
    .shift();
  if (typeof result === 'undefined') {
    throw new Error("Object step hasn't field for value = " + current);
  }
  return result;
};

export const getNextValueByObjectStep = (
  current: number,
  step: { [key: number]: number },
  max: number
): number => {
  const info = getSectionFromObjectSteps(current, step);
  const [border, stepValue] = info;
  const keys = Object.keys(step);
  const indexKey = keys.indexOf(border);
  let maxBorder;
  if (indexKey < keys.length - 1) {
    maxBorder = keys[indexKey + 1];
  } else {
    maxBorder = Number.MAX_SAFE_INTEGER;
  }
  const maxOf = Math.min(maxBorder, max);
  return getNextValue(current, stepValue, maxOf, parseFloat(border));
};

export const getPrevValueByObjectStep = (
  current: number,
  step: { [key: number]: number },
  min: number
): number => {
  const info = getSectionFromObjectSteps(current, step);
  const [border, stepValue] = info;
  const borderVal = parseFloat(border);
  const maxOf = Math.max(min, borderVal);
  if (current === borderVal) {
    const keys = Object.keys(step);
    const firstKey = parseFloat(keys[0]);
    if (firstKey === current) {
      return firstKey;
    }
    return getPrevValueByObjectStep(current - 0.0000000001, step, min);
  }
  return getPrevValue(current, stepValue, maxOf, borderVal);
};

export const occurrenceNumberInSection = (
  numb: number,
  min: number,
  max: number
): boolean => !(numb < min || numb > max);

export const checkNegativeDigitString = (str: string): boolean =>
  str.length > 0 && str[0] === '-';
