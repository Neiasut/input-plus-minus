import InputPlusMinus from '../src/InputPlusMinus';
import * as Inputmask from 'inputmask';

new InputPlusMinus('#first', {
  start: 50,
  step: {
    0: 1,
    10: 2,
    50: 5
  },
  max: 40
});

Inputmask('numeric', {
  radixPoint: '.',
  digits: '2',
  integerDigits: '13',
  allowMinus: true,
  groupSeparator: ' ',
  autoGroup: true,
  rightAlign: false
}).mask(document.getElementById('second'));
