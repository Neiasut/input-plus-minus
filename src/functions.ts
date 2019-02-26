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

export const issetObject = (object: object): boolean =>
  typeof object === 'object' && object !== null;

export const checkNumber = (x: any) => typeof x === 'number';

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
