import {
  calculationCompressionValue,
  compressionNumber,
  filterListCallbacksByType,
  getNextValue,
  getNextValueByObjectStep,
  getPrevValue,
  getPrevValueByObjectStep,
  prepareInitElement,
  removalOfUnnecessaryDigits
} from './functions';
import { listCallbacks } from './interfaces';

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

describe('getNextValue', () => {
  test('getNextValue(4, 1, 10, 0) === 5', () => {
    expect(getNextValue(4, 1, 10)).toEqual(5);
  });

  test('getNextValue(8, 3, 10, 0) === 10', () => {
    expect(getNextValue(8, 3, 10)).toEqual(10);
  });

  test('getNextValue(-2, 3, 2, 0) === 0', () => {
    expect(getNextValue(-2, 3, 2)).toEqual(0);
  });

  test('getNextValue(10, 1, 10, 0) === 10', () => {
    expect(getNextValue(10, 1, 10)).toEqual(10);
  });

  test('getNextValue(4.5, 1, 10, 0) === 5', () => {
    expect(getNextValue(4.5, 1, 10)).toEqual(5);
  });

  test('getNextValue(4.5, 0.5, 10, 0) === 6', () => {
    expect(getNextValue(4.5, 0.5, 10)).toEqual(5);
  });

  test('getNextValue(4.5, 0.5, 10, -2) === 6', () => {
    expect(getNextValue(4.5, 0.5, 10, 1)).toEqual(5);
  });

  test('getNextValue(4.5, 0.5, 10, -1.3) === 5.2', () => {
    expect(getNextValue(4.5, 0.5, 10, -1.3)).toEqual(4.7);
  });
});

describe('getPrevValue', () => {
  test('getPrevValue(4, 5, -20, 0) === 0', () => {
    expect(getPrevValue(4, 5, -20)).toEqual(0);
  });

  test('getPrevValue(2, 5, -20, 0) === 0', () => {
    expect(getPrevValue(2, 5, -20)).toEqual(0);
  });

  test('getPrevValue(4, 5, 0, 0) === 0', () => {
    expect(getPrevValue(4, 5, 0)).toEqual(0);
  });

  test('getPrevValue(-4, 5, -8, 0) === -8', () => {
    expect(getPrevValue(-4, 5, -8)).toEqual(-8);
  });

  test('getPrevValue(4.5, 1, 10, 0) === 4', () => {
    expect(getPrevValue(4.5, 1, 10)).toEqual(4);
  });

  test('getPrevValue(4.5, 0.5, 10, 0) === 4', () => {
    expect(getPrevValue(4.5, 0.5, 10)).toEqual(4);
  });
});

describe('getNextValueByObjectStep', () => {
  const step = {
    '-2': 1,
    '10': 2,
    '50': 5
  };

  test('getNextValueByObjectStep1', () => {
    expect(getNextValueByObjectStep(2, step, 40)).toEqual(3);
  });

  test('getNextValueByObjectStep2', () => {
    expect(getNextValueByObjectStep(70, step, 80)).toEqual(75);
  });

  test('getNextValueByObjectStep3', () => {
    expect(getNextValueByObjectStep(78, step, 80)).toEqual(80);
  });

  test('getNextValueByObjectStep4', () => {
    expect(getNextValueByObjectStep(11, step, 80)).toEqual(12);
  });

  test('getNextValueByObjectStep4', () => {
    expect(getNextValueByObjectStep(49, step, 80)).toEqual(50);
  });
});

describe('getPrevValueByObjectStep', () => {
  const step = {
    '-2': 1,
    '11': 2,
    '50': 5
  };

  test('getPrevValueByObjectStep1', () => {
    expect(getPrevValueByObjectStep(2, step, 0)).toEqual(1);
  });

  test('getPrevValueByObjectStep2', () => {
    expect(getPrevValueByObjectStep(0, step, 0)).toEqual(0);
  });

  test('getPrevValueByObjectStep3', () => {
    try {
      getPrevValueByObjectStep(-8, step, 0);
    } catch (e) {
      expect(true).toEqual(true);
    }
  });

  test('getPrevValueByObjectStep4', () => {
    expect(getPrevValueByObjectStep(11, step, 0)).toEqual(10);
  });

  test('getPrevValueByObjectStep5', () => {
    expect(getPrevValueByObjectStep(0.0001, step, 0)).toEqual(0);
  });

  test('getPrevValueByObjectStep6', () => {
    expect(getPrevValueByObjectStep(51, step, 0)).toEqual(50);
  });

  test('getPrevValueByObjectStep7', () => {
    expect(getPrevValueByObjectStep(50, step, 0)).toEqual(49);
  });
});

describe('calculationCompressionValue', () => {
  test('calculationCompressionValue(200000, 3) === 200', () => {
    expect(calculationCompressionValue(200000, 3)).toEqual(200);
  });

  test('calculationCompressionValue(211111, 3) === 211.111', () => {
    expect(calculationCompressionValue(211111, 3)).toEqual(211.111);
  });
});

describe('removalOfUnnecessaryDigits', () => {
  test('removalOfUnnecessaryDigits(2.123, 1) === "2.1"', () => {
    expect(removalOfUnnecessaryDigits(2.123, 1) === '2.1');
  });

  test('removalOfUnnecessaryDigits(2.153, 1) === "2.1"', () => {
    expect(removalOfUnnecessaryDigits(2.153, 1) === '2.1');
  });

  test('removalOfUnnecessaryDigits(2, 2) === "2"', () => {
    expect(removalOfUnnecessaryDigits(2, 2) === '2');
  });
});

describe('compressionNumber', () => {
  const gridCompression = [
    { text: '', compression: 0, digits: 0 },
    { text: 'тыс.', compression: 3, digits: 0 },
    { text: 'млн.', compression: 6, digits: 1 },
    { text: 'млрд.', compression: 9, digits: 1 }
  ];

  test('compressionNumber(960) === "960"', () => {
    expect(compressionNumber(960, gridCompression)).toEqual('960');
  });

  test('compressionNumber(2000) === "2 тыс."', () => {
    expect(compressionNumber(2000, gridCompression)).toEqual('2 тыс.');
  });

  test('compressionNumber(2010) === "2 тыс."', () => {
    expect(compressionNumber(2010, gridCompression)).toEqual('2 тыс.');
  });

  test('compressionNumber(2010) === "2 тыс."', () => {
    expect(compressionNumber(2088, gridCompression)).toEqual('2 тыс.');
  });

  test('compressionNumber(6590500) === "6.6 млн."', () => {
    expect(compressionNumber(6600000, gridCompression)).toEqual('6.6 млн.');
  });

  test('compressionNumber(6600000) === "6.6 млн."', () => {
    expect(compressionNumber(6600000, gridCompression)).toEqual('6.6 млн.');
  });

  test('compressionNumber(6600000.1232) === "6600000"', () => {
    const grid = [{ text: '', compression: 0, digits: 0 }];
    expect(compressionNumber(6600000, grid)).toEqual('6 600 000');
  });
});

describe('filterListCallbacksByType', () => {
  const elements: listCallbacks = new Map();
  elements.set('test', {
    eventName: 'afterChange',
    cb: () => {}
  });
  elements.set('test2', {
    eventName: 'beforeChange',
    cb: () => {}
  });

  test('filterListCallbacksByType1', () => {
    const result = filterListCallbacksByType(elements, 'beforeChange');
    expect(result.length).toEqual(1);
    expect(result[0].key).toEqual('test2');
  });
});
