# input-plus-minus

input-plus-minus is a ts library creates stylized input.

Library depends on [Inputmask](https://github.com/RobinHerbots/Inputmask).

## Setup

### add with:
#### npm
```cmd
npm install input-plus-minus --save
```
#### yarn
```cmd
yarn add input-plus-minus
```

### Classic web with script tag
```js
<script src="public/InputPlusMinusWindow.js"></script>
```

### ES6 import
```typescript
import InputPlusMinus from 'InputPlusMinus';
```

## Usage
```typescript
InputPlusMinus('#id', InputPlusMinusSettings, ['themes']);
```

## Settings

```typescript
interface InputPlusMinusSettings {
  plusText?: string;
  minusText?: string;
  min?: number;
  max?: number;
  start?: number;
  step?: number | InputPlusMinusSteps;
  digits?: number;
  grid?: boolean;
  gridSuffix?: string;
  gridCompression?: boolean;
  gridCompressionValues?: InputPlusMinusGridCompression[];
  thumb?: string;
  thumbCreator?: (thumb: string, input: HTMLInputElement) => Element;
}
```

## Fields

### elements
```typescript
elements: InputPlusMinusElements
```
### saveValidValue
last valid number
```typescript
saveValidValue: number
```
### self
```typescript
self: HTMLInputElement
```
### callbacks
```typescript
callbacks: Callbacks
```

## Methods

### constructor
```typescript
constructor(initElement: Element | string, settings?: InputPlusMinusSettings, themes?: string[])
```
### changeValue
```typescript
changeValue(value: number): void
```
### updateConfiguration
```typescript
updateConfiguration(
    settings: InputPlusMinusSettings,
    themes?: string[],
    fireInput: boolean = false,
    start: boolean = false
): void
```
### next
```typescript
next(): void
```
### prev
```typescript
prev(): void
```
### destructor
```typescript
destructor(): void
```

## Interfaces and types

### InputPlusMinusElements
```typescript
interface InputPlusMinusElements {
  wrapper: Element;
  minus: Element;
  plus: Element;
  grid: Element;
  gridMin: Element;
  gridMax: Element;
}
```

### InputPlusMinusEvents
```typescript
type InputPlusMinusEvents = 'input' | 'beforeChange' | 'afterChange'
```

### InputPlusMinusSteps
```typescript
interface InputPlusMinusSteps {
  [key: string]: number;
}
```

### InputPlusMinusGridCompression
```typescript
interface InputPlusMinusGridCompression {
  text: string;
  compression: number;
  digits: number;
}
```

## Events
* beforeChange
* afterChange
```typescript
const second = new InputPlusMinus('#second');
const secondInput = document.getElementById('#second');
secondInput.addEventListener(
  'beforeChange_InputPlusMinus',
  (e: InputPlusMinusEventBeforeChange) => {
    const detail = e.detail;
    const current = detail.current;
    console.log('before change', current, detail.next);
  }
);
```

## Callbacks
* beforeChange
* afterChange

add
```typescript
const example = new InputPlusMinus('#example');
example.callbacks.add(
  'test',
  'beforeChange',
  (data: InputPlusMinusEventDataBeforeChange) => {
    console.log(data);
  }
);
```

remove
```typescript
const example = new InputPlusMinus('#example');
example.callbacks.remove(
  'test'
);
```

## Static callbacks

### getInstance
```typescript
InputPlusMinus.getInstance(info: Element | string): InputPlusMinus;
```

### checkInstance
```typescript
InputPlusMinus.checkInstance(info: HTMLInputElement): boolean;
```

## Compatibility with ie11
Include to your project packages classlist-polyfill and custom-event-polyfill
