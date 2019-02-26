import {
  checkNotEndedNumber,
  checkNumber,
  checkValidKey,
  createChanger,
  issetObject,
  parseStrToNumber,
  prepareInitElement,
  validateStringOnNumber,
  wrapInput
} from './functions';
import './style/InputPlusMinus.scss';
import { InputPlusMinusElements, InputPlusMinusSettings } from './interfaces';

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
    this.addEventListeners();

    let value = this.self.value;
    if (issetSettings) {
      this.configuration = Object.assign(
        {},
        InputPlusMinus.defaultSettings(),
        settings
      );
      if (checkNumber(settings.start)) {
        value = settings.start.toString();
      }
    } else {
      this.configuration = InputPlusMinus.defaultSettings();
    }

    this.lastValidValue = this.getValidValue(value);
    this.self.value = this.lastValidValue.toString();

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
    console.log(this);
  }

  protected addEventListeners(): void {
    this.self.addEventListener('input', this.handleInput);
    this.self.addEventListener('keydown', this.handleKeydown);
    this.self.addEventListener('blur', this.handleBlur);
    this.self.addEventListener('focus', this.handleFocus);
    this.self.addEventListener('paste', this.handlePaste);
  }

  protected handleInput = (): void => {
    if (InputPlusMinus.checkValidValue(this.self.value)) {
      this.onChange(this.self.value);
    }
  };

  protected handlePaste = (e: ClipboardEvent): void => {
    const data = e.clipboardData.getData('text');
    if (!validateStringOnNumber(data)) {
      e.clipboardData.setData('text', parseStrToNumber(data).toString());
    }
    console.log(e);
  };

  protected handleKeydown = (e: KeyboardEvent): void => {
    if (!checkValidKey(e)) {
      e.preventDefault();
    }
  };

  protected handleFocus = () => {
    this.self.value = parseFloat(this.self.value).toString();
    console.log('focus');
  };

  protected handleBlur = () => {
    this.self.value = this.lastValidValue.toString();
  };

  protected onChange(value: string, enteredByHand: boolean = true): void {
    const validValue = this.getValidValue(value);
    let viewValue = validValue.toString();
    if (!checkNotEndedNumber(value)) {
      if (validValue !== this.lastValidValue) {
        console.log('something do');
      }
      this.self.value = viewValue;
      this.lastValidValue = validValue;
    }
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

  protected getStepForValue(current: number): number {
    return 2;
  }

  protected static checkValidValue(value: string): boolean {
    return !(value === '');
  }

  public static defaultSettings(): InputPlusMinusSettings {
    return {
      minusText: '−',
      plusText: '+',
      min: 0,
      max: 100,
      start: 50,
      step: 1
    };
  }
}

export default InputPlusMinus;
