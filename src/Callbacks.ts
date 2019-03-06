import {
  callbackFn,
  InputPlusMinusEventData,
  InputPlusMinusEvents,
  listCallbacks
} from './interfaces';
import { filterListCallbacksByType } from './functions';

class Callbacks {
  protected list: listCallbacks;
  public constructor() {
    this.list = new Map();
  }

  public add(
    key: string,
    eventName: InputPlusMinusEvents,
    cb: callbackFn
  ): void {
    if (this.checkIssetKey(key)) {
      throw new Error(`This key = "${key}" isset in list!`);
    }
    this.list.set(key, {
      eventName,
      cb
    });
  }

  public remove(key: string): boolean {
    return this.list.delete(key);
  }

  public fireCallbacksByType(
    type: InputPlusMinusEvents,
    data: InputPlusMinusEventData
  ): void {
    const elements = filterListCallbacksByType(this.list, type);
    elements.forEach(element => {
      const { cb } = element;
      cb(data);
    });
  }

  protected checkIssetKey(key: string): boolean {
    return this.list.has(key);
  }

  public getList(): listCallbacks {
    return this.list;
  }

  public destructor(): void {
    this.list.clear();
  }
}

export default Callbacks;
