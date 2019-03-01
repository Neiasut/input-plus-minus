import {
  InputPlusMinusEventData,
  InputPlusMinusEventDataAfterChange,
  InputPlusMinusEventDataBeforeChange
} from './interfaces';
import InputPlusMinus from './InputPlusMinus';

export const createCustomEvent = (
  name: string,
  info: InputPlusMinusEventData
): CustomEvent => {
  return new CustomEvent(name + '_InputPlusMinus', {
    detail: info
  });
};

export const typicalObjectOnEvent = (
  inputPM: InputPlusMinus
): InputPlusMinusEventData => {
  return {
    instance: inputPM
  };
};

export const createObjectEventBeforeChange = (
  inputPM: InputPlusMinus,
  current: number,
  next: number
): InputPlusMinusEventDataBeforeChange => {
  return Object.assign({}, typicalObjectOnEvent(inputPM), {
    current,
    next
  });
};

export const createObjectEventAfterChange = (
  inputPM: InputPlusMinus,
  current: number
): InputPlusMinusEventDataAfterChange => {
  return Object.assign({}, typicalObjectOnEvent(inputPM), {
    current
  });
};
