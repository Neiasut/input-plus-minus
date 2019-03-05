import {
  CallbackSaveElementExtend,
  InputPlusMinusEvents,
  InputPlusMinusGridCompression,
  InputPlusMinusSteps,
  listCallbacks
} from './interfaces';
import * as Inputmask from 'inputmask';

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

export const parseStrToNumber = (str: string): number => parseFloat(str);

export const checkStringOnFloat = (str: string): boolean =>
  parseFloat(str).toString() === str;

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
  steps: [string, number][]
): [string, number] => {
  const arrInfo = Array.from(steps).reverse();
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

const sortFnSteps = (a: [string, number], b: [string, number]): number => {
  return parseStrToNumber(a[0]) - parseStrToNumber(b[0]);
};

export const sortObjectSteps = (
  steps: InputPlusMinusSteps
): [string, number][] => {
  return Object.entries(steps).sort(sortFnSteps);
};

const getKeysFromSortedSteps = (arr: [string, number][]): string[] => {
  return arr.map(el => el[0]);
};

export const getNextValueByObjectStep = (
  current: number,
  step: InputPlusMinusSteps,
  max: number
): number => {
  const list = sortObjectSteps(step);
  const info = getSectionFromObjectSteps(current, list);
  const [border, stepValue] = info;
  const keys = getKeysFromSortedSteps(list);
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
  step: InputPlusMinusSteps,
  min: number
): number => {
  const list = sortObjectSteps(step);
  const info = getSectionFromObjectSteps(current, list);
  const [border, stepValue] = info;
  const borderVal = parseFloat(border);
  const maxOf = Math.max(min, borderVal);
  if (current === borderVal) {
    const keys = getKeysFromSortedSteps(list);
    const firstKey = parseFloat(keys[0]);
    if (firstKey === current) {
      return firstKey;
    }
    return getPrevValueByObjectStep(current - 0.0000000001, step, min);
  }
  return getPrevValue(current, stepValue, maxOf, borderVal);
};

export const getMinBorderFromSteps = (step: InputPlusMinusSteps): number => {
  const list = sortObjectSteps(step);
  const min = list[0];
  return parseStrToNumber(min[0]);
};

export const occurrenceNumberInSection = (
  numb: number,
  min: number,
  max: number
): boolean => !(numb < min || numb > max);

export const createGridWrapper = (root: Element, classes = []): Element => {
  const gridWrapper = document.createElement('div');
  gridWrapper.classList.add(...classes);
  root.appendChild(gridWrapper);
  return gridWrapper;
};

export const createGridElement = (root: Element, classes = []): Element => {
  const gridElement = document.createElement('span');
  gridElement.classList.add(...classes);
  root.appendChild(gridElement);
  return gridElement;
};

export const checkElementIsset = (element: any): boolean =>
  element instanceof Element;

export const changeTextContentGridElement = (
  element: Element,
  value: string,
  suffix: string
): void => {
  const arr = [value];
  if (suffix !== '') {
    arr.push(suffix);
  }
  element.textContent = arr.join(' ');
};

export const calculationCompressionValue = (
  numb: number,
  compression: number
): number => {
  const del = Math.pow(10, compression);
  return numb / del;
};

export const removalOfUnnecessaryDigits = (x: number, digits: number): string =>
  x.toFixed(digits);

export const maskedValue = (
  str: string,
  customConfig: Inputmask.Options
): string => {
  const BASE = {
    alias: 'numeric',
    radixPoint: '.',
    digits: '2',
    integerDigits: '13',
    groupSeparator: ' ',
    autoGroup: true
  };
  return Inputmask.format(str, Object.assign({}, BASE, customConfig));
};

export const compressionNumber = (
  numb: number,
  config: InputPlusMinusGridCompression[]
): string => {
  const absNumb = Math.abs(numb);
  const findObject = Array.from(config)
    .reverse()
    .find(value => {
      return calculationCompressionValue(absNumb, value.compression) >= 1;
    });
  const resultNumb = calculationCompressionValue(numb, findObject.compression);
  const resultNumbString = maskedValue(
    removalOfUnnecessaryDigits(resultNumb, findObject.digits),
    {
      digits: findObject.digits.toString()
    }
  );
  if (findObject.text) {
    return resultNumbString + ' ' + findObject.text;
  }
  return resultNumbString;
};

export const formatGridElementText = (
  numb: number,
  compression: boolean,
  compressionConfig: InputPlusMinusGridCompression[]
): string => {
  if (compression) {
    return compressionNumber(numb, compressionConfig);
  }
  return maskedValue(numb.toString(), {});
};

export const filterListCallbacksByType = (
  list: listCallbacks,
  type: InputPlusMinusEvents
): CallbackSaveElementExtend[] => {
  return Array.from(list.entries())
    .filter(element => {
      const list = element[1];
      return type === list.eventName;
    })
    .map(element => {
      return {
        key: element[0],
        ...element[1]
      };
    });
};
