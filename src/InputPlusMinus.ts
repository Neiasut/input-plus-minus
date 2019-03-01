import {
  checkNumber,
  checkStringOnFloat,
  createChanger,
  getMinBorderFromSteps,
  getNextValue,
  getNextValueByObjectStep,
  getPrevValue,
  getPrevValueByObjectStep,
  issetObject,
  occurrenceNumberInSection,
  parseStrToNumber,
  prepareInitElement,
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
  public mask: Inputmask.Instance;
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
      this.updateConfiguration(settings, false, true);
    } else {
      this.updateConfiguration({}, false, true);
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
    this.updateStatusChangers();
    this.addEventListeners();
    console.log(this);
  }

  protected addEventListeners(): void {
    this.self.addEventListener('input', this.handleInput);
    this.self.addEventListener('blur', this.handleBlur);
    this.elements.minus.addEventListener('click', this.handleMinusClick);
    this.elements.plus.addEventListener('click', this.handlePlusClick);
  }

  protected handleInput = (): void => {
    const value = this.self.value;
    if (this.validateValue(value)) {
      this.onChange(value);
    }
  };

  protected handleBlur = (): void => {
    const value = this.self.value;
    const validValue = this.getValidValue(value).toString(
      this.configuration.digits
    );
    if (value !== validValue) {
      this.self.value = validValue;
      this.generateEvent('input');
    }
  };

  protected handleMinusClick = () => {
    this.prev();
  };

  protected handlePlusClick = () => {
    this.next();
  };

  protected onChange(value: string): void {
    console.log('do something');
    this.lastValidValue = parseStrToNumber(value);
    this.updateStatusChangers();
  }

  public changeValue(value: number): void {
    const { min, max } = this.configuration;
    if (occurrenceNumberInSection(value, min, max)) {
      this.self.value = value.toString();
      this.generateEvent('input');
      return;
    }
    throw new Error(`Value "${value}" not allowed!`);
  }

  public updateConfiguration(
    settings: InputPlusMinusSettings,
    fireInput: boolean = false,
    start: boolean = false
  ): void {
    let value = this.self.value;
    this.configuration = Object.assign(
      {},
      InputPlusMinus.defaultSettings(),
      settings
    );
    const step = this.configuration.step;
    if (!checkNumber(step)) {
      this.configuration.min = getMinBorderFromSteps(step);
    }
    if (checkNumber(settings.start)) {
      value = settings.start.toString();
    }
    this.lastValidValue = this.getValidValue(value);
    this.self.value = this.lastValidValue.toString();
    this.updateMask({});
    if (!start) {
      this.updateStatusChangers();
    }
    if (fireInput) {
      this.generateEvent('input');
    }
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

  public validateValue(value: string): boolean {
    if (!this.mask.isValid()) {
      return false;
    }
    if (!checkStringOnFloat(value)) {
      return false;
    }
    const numb = parseStrToNumber(value);
    const { min, max } = this.configuration;
    return occurrenceNumberInSection(numb, min, max);
  }

  public getValidValue(value: string): number {
    const { min, max } = this.configuration;
    const valueNumber = parseStrToNumber(value);
    if (isNaN(valueNumber)) {
      return this.lastValidValue;
    }
    if (valueNumber < min) {
      return min;
    }
    if (valueNumber > max) {
      return max;
    }
    return valueNumber;
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

  protected updateMask(options: Inputmask.Options): void {
    if (this.mask instanceof Inputmask) {
      this.mask.remove();
    }
    const configMask = Object.assign(
      {},
      InputPlusMinus.defaultMaskSettings(),
      this.getMaskSettingsFromConfig(),
      options
    );
    this.mask = Inputmask('numeric', configMask).mask(this.self);
  }

  protected getMaskSettingsFromConfig(): Inputmask.Options {
    const { digits, max, min } = this.configuration;
    return {
      digits: digits.toString(),
      max: max.toString(),
      min: min.toString(),
      allowMinus: min < 0
    };
  }

  protected updateStatusChangers(): void {
    const value = parseStrToNumber(this.self.value);
    const { min, max } = this.configuration;
    const { minus, plus } = this.elements;
    (minus as HTMLButtonElement).disabled = value <= min;
    (plus as HTMLButtonElement).disabled = value >= max;
  }

  protected generateEvent(type: string): void {
    switch (type) {
      case 'input': {
        const event = new Event('input');
        this.self.dispatchEvent(event);
        break;
      }
    }
  }

  public static defaultMaskSettings(): Inputmask.Options {
    return {
      radixPoint: '.',
      digits: '2',
      integerDigits: '13',
      groupSeparator: ' ',
      autoGroup: true,
      rightAlign: false,
      autoUnmask: true
    };
  }

  public static defaultSettings(): InputPlusMinusSettings {
    return {
      minusText: '−',
      plusText: '+',
      step: 1,
      min: Number.MIN_SAFE_INTEGER,
      max: Number.MAX_SAFE_INTEGER,
      digits: 2
    };
  }
}

export default InputPlusMinus;
