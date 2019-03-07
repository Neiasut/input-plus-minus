import {
  changeTextContentGridElement,
  checkElementIsset,
  checkNumber,
  checkStringOnFloat,
  createChanger,
  createGridElement,
  createGridWrapper,
  formatGridElementText,
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
import {
  InputPlusMinusElements,
  InputPlusMinusEventData,
  InputPlusMinusEvents,
  InputPlusMinusSettings
} from './interfaces';
import {
  createCustomEvent,
  createObjectEventAfterChange,
  createObjectEventBeforeChange
} from './events';
import Inputmask from 'inputmask';
import Callbacks from './Callbacks';
import InputPlusMinusThemes from './InputPlusMinusThemes';

const CLASSES = {
  wrapper: 'InputPlusMinus',
  element: 'InputPlusMinus-Element',
  changer: 'InputPlusMinus-Changer',
  minus: 'InputPlusMinus-Minus',
  plus: 'InputPlusMinus-Plus',
  grid: 'InputPlusMinus-Grid',
  gridElement: 'InputPlusMinus-GridElement',
  gridElementMin: 'InputPlusMinus-GridElement_min',
  gridElementMax: 'InputPlusMinus-GridElement_max'
};
const MAX_NUMBER = Number.MAX_SAFE_INTEGER;
const MIN_NUMBER = Number.MIN_SAFE_INTEGER;

class InputPlusMinus {
  public self: HTMLInputElement;
  public saveValidValue: number;
  protected lastInputValue: string;
  protected configuration: InputPlusMinusSettings;
  protected usedChanges: InputPlusMinusSettings;
  protected mask: Inputmask.Instance;
  public callbacks: Callbacks;
  protected themes: string[] = [];
  public static themes: InputPlusMinusThemes = new InputPlusMinusThemes();
  public elements: InputPlusMinusElements = {
    wrapper: null,
    minus: null,
    plus: null,
    grid: null,
    gridMin: null,
    gridMax: null
  };

  public constructor(
    initElement: Element | string,
    settings?: InputPlusMinusSettings,
    themes?: string[]
  ) {
    const issetSettings = issetObject(settings);
    this.self = prepareInitElement(initElement) as HTMLInputElement;
    this.self.classList.add(CLASSES.element);
    this.elements.wrapper = wrapInput(this.self, CLASSES.wrapper);
    this.callbacks = new Callbacks();

    if (issetSettings) {
      this.updateConfiguration(settings, themes, false, true);
    } else {
      this.updateConfiguration({}, themes, false, true);
    }

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
  }

  protected addEventListeners(): void {
    this.self.addEventListener('input', this.handleInput);
    this.self.addEventListener('blur', this.handleBlur);
    this.elements.minus.addEventListener('click', this.handleMinusClick);
    this.elements.plus.addEventListener('click', this.handlePlusClick);
  }

  protected removeEventListeners(): void {
    this.self.removeEventListener('input', this.handleInput);
    this.self.removeEventListener('blur', this.handleBlur);
    this.elements.minus.addEventListener('click', this.handleMinusClick);
    this.elements.plus.addEventListener('click', this.handlePlusClick);
  }

  protected handleInput = (): void => {
    const value = this.self.value;
    this.lastInputValue = value;
    if (this.validateValue(value)) {
      this.onChange(value);
    }
  };

  protected handleBlur = (): void => {
    const value = this.lastInputValue;
    const validValue = this.getValidValue(value).toString();
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
    this.generateEvent(
      'beforeChange',
      createObjectEventBeforeChange(
        this,
        this.saveValidValue,
        parseStrToNumber(value)
      )
    );

    this.saveValidValue = parseStrToNumber(value);
    this.updateStatusChangers();

    this.generateEvent(
      'afterChange',
      createObjectEventAfterChange(this, this.saveValidValue)
    );
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
    themes?: string[],
    fireInput: boolean = false,
    start: boolean = false
  ): void {
    let value = this.self.value;
    this.usedChanges = Object.assign(
      {},
      InputPlusMinus.themes.getThemesObject(themes),
      settings
    );
    this.configuration = Object.assign(
      {},
      InputPlusMinus.defaultSettings(),
      this.usedChanges
    );
    this.themes = Array.isArray(themes) ? themes : [];
    const step = this.configuration.step;
    if (!checkNumber(step)) {
      const minFromSteps = getMinBorderFromSteps(step);
      const min = this.usedChanges.min;
      if (checkNumber(min) && minFromSteps > min) {
        this.configuration.min = getMinBorderFromSteps(step);
      }
    }
    if (checkNumber(settings.start)) {
      value = settings.start.toString();
    }
    if (!checkStringOnFloat(value)) {
      value = '0';
    }
    this.saveValidValue = this.getValidValue(value);
    this.self.value = this.saveValidValue.toString();
    this.updateMask({});
    this.createGrid();
    if (!start) {
      this.updateStatusChangers();
    }
    if (fireInput) {
      this.generateEvent('input');
    }
  }

  public next(): void {
    const value = this.saveValidValue;
    const toValue = this.getStepNextValue(value);
    this.changeValue(toValue);
  }

  public prev(): void {
    const value = this.saveValidValue;
    const toValue = this.getStepPrevValue(value);
    this.changeValue(toValue);
  }

  protected validateValue(value: string): boolean {
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

  protected getValidValue(value: string): number {
    const { min, max } = this.configuration;
    const valueNumber = parseStrToNumber(value);
    if (isNaN(valueNumber)) {
      return this.saveValidValue;
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
    if (issetObject(this.mask) && this.mask instanceof Inputmask) {
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

  protected generateEvent(
    type: InputPlusMinusEvents,
    data?: InputPlusMinusEventData
  ): void {
    let event;
    const self = this.self;
    switch (type) {
      case 'input':
        event = new Event('input');
        self.dispatchEvent(event);
        break;
      case 'beforeChange':
      case 'afterChange':
        this.callbacks.fireCallbacksByType(type, data);
        event = createCustomEvent(type, data);
        self.dispatchEvent(event);
        break;
      default:
        throw new Error(`Event with name: "${type}" can't generate`);
    }
  }

  protected getBorderValuesFromChanges(): { min: number; max: number } {
    const { min, max } = this.configuration;
    let minUse;
    let maxUse;
    if (min !== InputPlusMinus.defaultSettings().min) {
      minUse = min;
    }
    if (max !== InputPlusMinus.defaultSettings().max) {
      maxUse = max;
    }
    return {
      min: minUse,
      max: maxUse
    };
  }

  protected createGrid(): void {
    this.removeGrid();
    const { grid, gridSuffix } = this.configuration;
    const { min, max } = this.getBorderValuesFromChanges();
    const issetMin = checkNumber(min);
    const issetMax = checkNumber(max);
    if (grid && (issetMax || issetMin)) {
      let gridWrapper = this.elements.grid;
      if (!checkElementIsset(gridWrapper)) {
        gridWrapper = createGridWrapper(this.elements.wrapper, [CLASSES.grid]);
        this.elements.grid = gridWrapper;
      }
      if (issetMin) {
        let gridMin = this.elements.gridMin;
        if (!checkElementIsset(gridMin)) {
          gridMin = createGridElement(gridWrapper, [
            CLASSES.gridElement,
            CLASSES.gridElementMin
          ]);
          this.elements.gridMin = gridMin;
        }
        let minText = formatGridElementText(
          min,
          this.configuration.gridCompression,
          this.configuration.gridCompressionValues
        );
        changeTextContentGridElement(gridMin, minText, gridSuffix);
      }
      if (issetMax) {
        let gridMax = this.elements.gridMax;
        if (!checkElementIsset(gridMax)) {
          gridMax = createGridElement(gridWrapper, [
            CLASSES.gridElement,
            CLASSES.gridElementMax
          ]);
          this.elements.gridMax = gridMax;
        }
        let maxText = formatGridElementText(
          max,
          this.configuration.gridCompression,
          this.configuration.gridCompressionValues
        );
        changeTextContentGridElement(gridMax, maxText, gridSuffix);
      }
    }
  }

  protected removeGrid(): void {
    const grid = this.elements.grid;
    if (checkElementIsset(grid)) {
      grid.parentNode.removeChild(grid);
    }
  }

  public destructor(): void {
    const self = this.self;
    const parent = this.elements.wrapper.parentNode;
    this.callbacks.destructor();
    self.classList.remove(CLASSES.element);
    this.removeEventListeners();
    parent.appendChild(self);
    parent.removeChild(this.elements.wrapper);
    this.mask.remove();
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
      min: MIN_NUMBER,
      max: MAX_NUMBER,
      digits: 2,
      grid: false,
      gridSuffix: '',
      gridCompression: true,
      gridCompressionValues: [
        { text: '', compression: 0, digits: 0 },
        { text: 'тыс.', compression: 3, digits: 0 },
        { text: 'млн.', compression: 6, digits: 1 },
        { text: 'млрд.', compression: 9, digits: 1 }
      ]
    };
  }
}

export default InputPlusMinus;
