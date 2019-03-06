import { InputPlusMinusSettings } from './interfaces';

class InputPlusMinusThemes {
  protected listThemes: Map<string, InputPlusMinusSettings>;

  public constructor() {
    this.listThemes = new Map();
  }

  public add(key: string, settings: InputPlusMinusSettings): void {
    if (this.checkIssetKey(key)) {
      throw new Error(`Theme with such key("${key}") exists`);
    }
    this.listThemes.set(key, settings);
  }

  public remove(key: string): boolean {
    return this.listThemes.delete(key);
  }

  public get(key: string): InputPlusMinusSettings {
    if (this.checkIssetKey(key)) {
      return this.listThemes.get(key);
    }
    throw new Error(`Theme with such key("${key}") does not exists`);
  }

  public getThemesObject(
    arrThemeNames: string[] | undefined
  ): InputPlusMinusSettings {
    if (!Array.isArray(arrThemeNames)) {
      return {};
    }
    const arrSettings = arrThemeNames.map(nameTheme => this.get(nameTheme));
    return Object.assign({}, ...arrSettings);
  }

  public checkIssetKey(key: string): boolean {
    return this.listThemes.has(key);
  }
}

export default InputPlusMinusThemes;
