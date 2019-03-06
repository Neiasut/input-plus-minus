import InputPlusMinusThemes from './InputPlusMinusThemes';

const createInstance = (): InputPlusMinusThemes => new InputPlusMinusThemes();

test('add', () => {
  const instance = createInstance();
  expect(() => {
    instance.add('test', {
      digits: 2
    });
  }).not.toThrow();
});

test('add existent key', () => {
  const instance = createInstance();
  instance.add('test', {
    digits: 2
  });
  expect(() => {
    instance.add('test', {
      digits: 4
    });
  }).toThrow();
});

test('get', () => {
  const instance = createInstance();
  instance.add('test', {
    digits: 2
  });
  const test = instance.get('test');
  expect(test.digits).toEqual(2);
});

test('remove', () => {
  const instance = createInstance();
  instance.add('test', {
    digits: 2
  });
  const result = instance.remove('test');
  expect(result).toEqual(true);
});

test('remove nonexistent', () => {
  const instance = createInstance();
  const result = instance.remove('test');
  expect(result).toEqual(false);
});

test('getThemesObject', () => {
  const instance = createInstance();
  instance.add('test', {
    digits: 2
  });
  instance.add('test2', {
    gridSuffix: 'suffix'
  });
  const result = instance.getThemesObject(['test', 'test2']);
  expect(result.digits).toEqual(2);
  expect(result.gridSuffix).toEqual('suffix');
  expect(result.min).toBeUndefined();
});
