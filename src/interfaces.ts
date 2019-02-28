export interface InputPlusMinusElements {
  wrapper: Element;
  minus: Element;
  plus: Element;
}

export interface InputPlusMinusSettings {
  plusText?: string;
  minusText?: string;
  min?: number;
  max?: number;
  start?: number;
  step?: number | { [key: number]: number };
  fractions?: number;
}
