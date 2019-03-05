import InputPlusMinus from '../src/InputPlusMinus';
import {
  InputPlusMinusEventAfterChange,
  InputPlusMinusEventBeforeChange
} from '../src/interfaces';

new InputPlusMinus('#first', {
  start: 50,
  step: {
    '-2': 1,
    '10': 2,
    '50': 5,
    '100': 200
  },
  max: 20000,
  grid: true
});

const second = new InputPlusMinus('#second', {
  start: 50,
  step: {
    '-2': 1,
    '10': 2,
    '50': 5
  },
  max: 20000,
  digits: 0
});

const secondInput = document.getElementById('second');

secondInput.addEventListener(
  'beforeChange_InputPlusMinus',
  (e: InputPlusMinusEventBeforeChange) => {
    const detail = e.detail;
    const current = detail.current;
    console.log('before change', current, detail.next);
  }
);

secondInput.addEventListener(
  'afterChange_InputPlusMinus',
  (e: InputPlusMinusEventAfterChange) => {
    const detail = e.detail;
    console.log('after change', detail);
  }
);

setTimeout(() => {
  second.updateConfiguration(
    {
      start: 25,
      min: 30,
      grid: true,
      gridSuffix: ' Р'
    },
    true
  );
}, 2000);

new InputPlusMinus('#third', {
  start: 50000,
  grid: true,
  gridCompression: false,
  step: {
    '-2000': 1,
    '10': 2,
    '50': 5
  },
  max: 21000000,
  digits: 1,
  gridSuffix: 'Р'
});

const el4 = new InputPlusMinus('#el4');

setTimeout(() => {
  el4.destructor();
}, 3000);
