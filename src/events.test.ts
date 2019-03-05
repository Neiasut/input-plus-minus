import { createCustomEvent, typicalObjectOnEvent } from './events';
import InputPlusMinus from './InputPlusMinus';

beforeAll(() => {
  const element = document.createElement('input');
  element.setAttribute('type', 'text');
  element.id = 'test';
  document.body.appendChild(element);
}, 0);

describe('typicalObjectOnEvent', () => {
  test('typicalObjectOnEvent', () => {
    const instance = new InputPlusMinus('#test');
    const obj = typicalObjectOnEvent(instance);
    expect(obj.instance).toBeInstanceOf(InputPlusMinus);
  });
});

describe('createCustomEvent', () => {
  test('createCustomEvent1', () => {
    const instance = new InputPlusMinus('#test');
    const event = createCustomEvent('test', typicalObjectOnEvent(instance));
    expect(event).toBeInstanceOf(CustomEvent);
  });
});
