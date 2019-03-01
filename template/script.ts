import InputPlusMinus from '../src/InputPlusMinus';

new InputPlusMinus('#first', {
  start: 50,
  step: {
    '-2': 1,
    '10': 2,
    '50': 5,
    '100': 200
  },
  max: 20000
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
/*
document.getElementById('second').addEventListener('input', () => {
  console.log('input');
});*/

setTimeout(() => {
  second.updateConfiguration(
    {
      start: 25,
      min: 30
    },
    true
  );
  console.log(second);
}, 2000);
