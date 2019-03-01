export interface InputPlusMinusElements {
  wrapper: Element;
  minus: Element;
  plus: Element;
}

export interface InputPlusMinusSteps {
  [key: string]: number;
}

export interface InputPlusMinusSettings {
  plusText?: string;
  minusText?: string;
  min?: number;
  max?: number;
  start?: number;
  step?: number | InputPlusMinusSteps;
  digits?: number;
}
