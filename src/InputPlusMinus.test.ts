import InputPlusMinus from './InputPlusMinus';

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

describe('InputPlusMinus', () => {
  test('init', () => {
    const testElement = new InputPlusMinus('#test');
    expect(testElement).toBeInstanceOf(InputPlusMinus);
  });
  test('next', () => {
    const testElement = new InputPlusMinus('#test');
    testElement.next();
    expect(testElement.saveValidValue).toEqual(1);
  });
  test('prev', () => {
    const testElement = new InputPlusMinus('#test');
    testElement.prev();
    expect(testElement.saveValidValue).toEqual(-1);
  });
  test('destructor', () => {
    const testElement = new InputPlusMinus('#test');
    testElement.destructor();
    const element = document.querySelector('#test');
    const parent = element.parentNode;
    const nameTag = (parent as Element).tagName.toLowerCase();
    expect(nameTag === 'body').toEqual(true);
    expect(element.classList.contains('InputPlusMinus-Element')).toEqual(false);
  });
});
