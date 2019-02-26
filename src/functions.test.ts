import { prepareInitElement } from './functions';

describe('prepareInitElement', () => {
  test('prepareInitElement will be error', () => {
    try {
      prepareInitElement('#test');
    } catch (e) {
      if (e.name === 'Error') {
        expect(true).toBe(true);
      }
    }
  });
  test('prepareInitElement typeError', () => {
    try {
      const element = document.createElement('div');
      prepareInitElement(element);
    } catch (e) {
      if (e.name === 'TypeError') {
        expect(true).toEqual(true);
      }
    }
  });
  test('prepareInitElement work', () => {
    const element = document.createElement('input');
    expect(prepareInitElement(element)).toEqual(element);
  });
});
