import InputPlusMinus from './InputPlusMinus';

export interface InputPlusMinusElements {
  wrapper: Element;
  minus: Element;
  plus: Element;
  grid: Element;
  gridMin: Element;
  gridMax: Element;
}

export interface InputPlusMinusSteps {
  [key: string]: number;
}

export interface InputPlusMinusGridCompression {
  text: string;
  compression: number;
  digits: number;
}

export interface InputPlusMinusSettings {
  plusText?: string;
  minusText?: string;
  min?: number;
  max?: number;
  start?: number;
  step?: number | InputPlusMinusSteps;
  digits?: number;
  grid?: boolean;
  gridSuffix?: string;
  gridCompression?: boolean;
  gridCompressionValues?: InputPlusMinusGridCompression[];
}

export interface InputPlusMinusEventData {
  instance: InputPlusMinus;
}

export interface InputPlusMinusEventDataBeforeChange
  extends InputPlusMinusEventData {
  current: number;
  next: number;
}

export interface InputPlusMinusEventBeforeChange extends CustomEvent {
  detail: InputPlusMinusEventDataBeforeChange;
}

export interface InputPlusMinusEventDataAfterChange
  extends InputPlusMinusEventData {
  current: number;
}

export interface InputPlusMinusEventAfterChange extends CustomEvent {
  detail: InputPlusMinusEventDataAfterChange;
}
