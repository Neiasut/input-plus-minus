import {
  createCustomEvent,
  createObjectEventAfterChange,
  createObjectEventBeforeChange,
  typicalObjectOnEvent
} from './events';
import InputPlusMinus from './InputPlusMinus';

let instance: InputPlusMinus;

beforeAll(() => {
  const element = document.createElement('input');
  element.setAttribute('type', 'text');
  element.id = 'test';
  document.body.appendChild(element);
  instance = new InputPlusMinus('#test');
}, 0);

test('typicalObjectOnEvent', () => {
  const obj = typicalObjectOnEvent(instance);
  expect(obj.instance).toBeInstanceOf(InputPlusMinus);
});

test('createCustomEvent', () => {
  const event = createCustomEvent('test', typicalObjectOnEvent(instance));
  expect(event).toBeInstanceOf(CustomEvent);
});

test('createObjectEventBeforeChange', () => {
  const event = createObjectEventBeforeChange(instance, 0, 1);
  expect(event.current).toEqual(0);
  expect(event.next).toEqual(1);
});

test('createObjectEventAfterChange', () => {
  const event = createObjectEventAfterChange(instance, 1);
  expect(event.current).toEqual(1);
});
