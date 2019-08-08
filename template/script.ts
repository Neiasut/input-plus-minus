import './themes';
import InputPlusMinus from '../src/InputPlusMinus';
import {
  InputPlusMinusEventAfterChange,
  InputPlusMinusEventBeforeChange,
  InputPlusMinusEventDataBeforeChange
} from '../src/interfaces';

console.dir(InputPlusMinus.themes);

new InputPlusMinus('#first', {
  start: 50,
  step: {
    '-2': 1,
    '10': 2,
    '50': 5,
    '100': 200
  },
  min: 10,
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
  digits: 0,
  thumb: 'test'
});

second.callbacks.add(
  'test',
  'beforeChange',
  (data: InputPlusMinusEventDataBeforeChange) => {
    console.log(data);
  }
);

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
      grid: false,
      step: {
        40: 1
      },
      gridSuffix: ' Р'
    },
    [],
    true
  );
  setTimeout(() => {
    second.updateConfiguration(
      {
        start: 25,
        min: 30,
        grid: false,
        step: {
          40: 1
        },
        gridSuffix: ' Р',
        thumb: '<b>some</b>'
      },
      [],
      true
    );
    console.log(second);
  }, 200);
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

const el4 = new InputPlusMinus('#el4', {
  thumb: 'test'
});

setTimeout(() => {
  el4.destructor();
}, 3000);

new InputPlusMinus('#el5', {}, ['test']);

console.log(InputPlusMinus.getInstance('#el4'));
console.log(InputPlusMinus.getInstance(secondInput));

const el6 = new InputPlusMinus('#el6', {
  min: 5000,
  max: 30000000,
  start: 5000,
  grid: false,
  step: {
    0: 5000,
    200000: 50000,
    1000000: 500000
  }
});

document.getElementById('el_6_RU').addEventListener('click', () => {
  el6.updateConfiguration({
    min: 5000,
    max: 30000000,
    start: 5000,
    grid: false,
    step: {
      0: 5000,
      200000: 50000,
      1000000: 500000
    }
  });
});

document.getElementById('el_6_USD').addEventListener('click', () => {
  el6.updateConfiguration({
    min: 75,
    max: 100000,
    start: 75,
    grid: false,
    step: {
      0: 5000,
      200000: 50000,
      1000000: 500000
    }
  });
});

document.getElementById('el_6_EUR').addEventListener('click', () => {
  el6.updateConfiguration({
    min: 75,
    max: 100000,
    start: 75,
    grid: false,
    step: {
      0: 5000,
      200000: 50000,
      1000000: 500000
    }
  });
});
