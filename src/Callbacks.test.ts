import Callbacks from './Callbacks';
import { InputPlusMinusEventDataBeforeChange } from './interfaces';
import InputPlusMinus from './InputPlusMinus';
import { createObjectEventBeforeChange } from './events';

const createExample = (): Callbacks => new Callbacks();
const addToExample = (instance: Callbacks): void => {
  instance.add('test', 'beforeChange', () => {});
};

beforeEach(() => {
  const element = document.createElement('input');
  element.setAttribute('type', 'text');
  element.value = '0';
  element.id = 'test';
  document.body.appendChild(element);
});

afterEach(() => {
  document.body.innerHTML = '';
});

test('add', () => {
  const instance = createExample();
  addToExample(instance);
  const size = instance.getList().size;
  expect(size).toEqual(1);
});

test('add existent key', () => {
  const instance = createExample();
  addToExample(instance);
  expect(() => {
    addToExample(instance);
  }).toThrow();
});

test('remove', () => {
  const instance = createExample();
  addToExample(instance);
  const result = instance.remove('test');
  const size = instance.getList().size;
  expect(size).toEqual(0);
  expect(result).toEqual(true);
});

test('remove nonexistent', () => {
  const instance = createExample();
  expect(instance.remove('test')).toEqual(false);
});

test('fireCallbacksByType', () => {
  const instance = createExample();
  let counter = 0;
  instance.add(
    'test',
    'beforeChange',
    (data: InputPlusMinusEventDataBeforeChange) => {
      counter += data.next;
    }
  );
  const dataEvent = createObjectEventBeforeChange(
    new InputPlusMinus('#test'),
    1,
    2
  );
  instance.fireCallbacksByType('beforeChange', dataEvent);
  expect(counter).toEqual(2);
});
