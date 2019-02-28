import {
  checkNumber,
  checkValidKey,
  createChanger,
  getNextValue,
  getNextValueByObjectStep,
  getPrevValue,
  getPrevValueByObjectStep,
  issetObject,
  parseStrToNumber,
  prepareInitElement,
  validateStringOnNumber,
  wrapInput
} from './functions';
import './style/InputPlusMinus.scss';
import { InputPlusMinusElements, InputPlusMinusSettings } from './interfaces';
import * as Inputmask from 'inputmask';

const CLASSES = {
  wrapper: 'InputPlusMinus',
  element: 'InputPlusMinus-Element',
  changer: 'InputPlusMinus-Changer',
  minus: 'InputPlusMinus-Minus',
  plus: 'InputPlusMinus-Plus'
};

class InputPlusMinus {
  public self: HTMLInputElement;
  public lastValidValue: number;
  public configuration: InputPlusMinusSettings;
  public elements: InputPlusMinusElements = {
    wrapper: null,
    minus: null,
    plus: null
  };

  public constructor(
    initElement: Element | string,
    settings?: InputPlusMinusSettings
  ) {
    const issetSettings = issetObject(settings);
    this.self = prepareInitElement(initElement) as HTMLInputElement;

    if (issetSettings) {
      this.updateConfiguration(settings);
    } else {
      this.updateConfiguration({});
    }

    this.self.classList.add(CLASSES.element);
    this.elements.wrapper = wrapInput(this.self, CLASSES.wrapper);
    this.elements.minus = createChanger(this.configuration.minusText, [
      CLASSES.changer,
      CLASSES.minus
    ]);
    this.self.parentNode.insertBefore(this.elements.minus, this.self);
    this.elements.plus = createChanger(this.configuration.plusText, [
      CLASSES.changer,
      CLASSES.plus
    ]);
    this.elements.wrapper.appendChild(this.elements.plus);
    this.addEventListeners();

    Inputmask('numeric', {
      radixPoint: '.',
      digits: '2',
      integerDigits: '13',
      allowMinus: this.configuration.min < 0,
      groupSeparator: ' ',
      autoGroup: true,
      rightAlign: false,
      max: '' + this.configuration.max,
      min: '' + this.configuration.min
    }).mask(this.self);
    console.log(this);
  }

  protected addEventListeners(): void {
    this.self.addEventListener('input', this.handleInput);
    this.self.addEventListener('keydown', this.handleKeydown);
    this.self.addEventListener('blur', this.handleBlur);
    this.self.addEventListener('focus', this.handleFocus);
    this.self.addEventListener('paste', this.handlePaste);
    this.elements.minus.addEventListener('click', this.handleMinusClick);
    this.elements.plus.addEventListener('click', this.handlePlusClick);
  }

  protected handleInput = (e: Event): void => {
    const value = this.self.value;
    if (value === '') {
      return;
    }
    if (
      typeof e['detail'] === 'object' &&
      e['detail'] !== null &&
      e['detail']['type'] === 'notHand'
    ) {
      this.onChange(this.self.value, false);
    }
    {
      this.onChange(this.self.value, true);
    }
  };

  protected handlePaste = (e: ClipboardEvent): void => {
    const data = e.clipboardData.getData('text');
    if (!validateStringOnNumber(data)) {
      e.clipboardData.setData('text', parseStrToNumber(data).toString());
    }
  };

  protected handleKeydown = (e: KeyboardEvent): void => {
    if (!checkValidKey(e)) {
      e.preventDefault();
      return;
    }
  };

  protected handleFocus = () => {
    this.self.value = parseFloat(this.self.value).toString();
  };

  protected handleBlur = () => {
    this.self.value = this.lastValidValue.toString();
  };

  protected handleMinusClick = () => {
    this.prev();
  };

  protected handlePlusClick = () => {
    this.next();
  };

  protected onChange(value: string, enteredByHand: boolean = false): void {
    const validValue = this.getValidValue(value);
    //console.log(value, validValue);
    if (validValue !== this.lastValidValue) {
      //console.log('something do');
    }
    this.self.value = validValue.toString();
    this.lastValidValue = validValue;
  }

  public updateConfiguration(settings: InputPlusMinusSettings): void {
    let value = this.self.value;
    this.configuration = Object.assign(
      {},
      InputPlusMinus.defaultSettings(),
      settings
    );
    if (!checkNumber(this.configuration.step)) {
      this.configuration.min = parseFloat(
        Object.keys(this.configuration.step).shift()
      );
    }
    if (checkNumber(settings.start)) {
      value = settings.start.toString();
    }
    this.lastValidValue = this.getValidValue(value);
    this.self.value = this.lastValidValue.toString();
  }

  public next(): void {
    const value = this.lastValidValue;
    const toValue = this.getStepNextValue(value);
    this.changeValue(toValue);
  }

  public prev(): void {
    const value = this.lastValidValue;
    const toValue = this.getStepPrevValue(value);
    this.changeValue(toValue);
  }

  public changeValue(value: number): void {
    this.self.value = value.toString();
    const event = new Event('input');
    event['detail'] = {
      type: 'notHand'
    };
    this.self.dispatchEvent(event);
  }

  public getValidValue(value: number | string): number {
    const { min, max } = this.configuration;
    if (typeof value === 'string') {
      if (value.length < 1) {
        value = '0';
      }
      value = parseStrToNumber(value);
    }
    if (value < min) {
      return min;
    }
    if (value > max) {
      return max;
    }
    return value;
  }

  protected getStepNextValue(current: number): number {
    const step = this.configuration.step;
    const max = this.configuration.max;
    if (checkNumber(step)) {
      return getNextValue(current, step, max);
    }
    return getNextValueByObjectStep(current, step, max);
  }

  protected getStepPrevValue(current: number): number {
    const step = this.configuration.step;
    const min = this.configuration.min;
    if (checkNumber(step)) {
      return getPrevValue(current, step, min);
    }
    return getPrevValueByObjectStep(current, step, min);
  }

  public static defaultSettings(): InputPlusMinusSettings {
    return {
      minusText: '−',
      plusText: '+',
      step: 1,
      min: Number.MIN_SAFE_INTEGER,
      max: Number.MAX_SAFE_INTEGER,
      fractions: 2
    };
  }
}

export default InputPlusMinus;
