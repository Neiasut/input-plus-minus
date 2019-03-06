# input-plus-minus

input-plus-minus is a ts library creates stylized input.

Library depends on https://github.com/RobinHerbots/Inputmask

# Setup

<h3>Classic web with `<script>` tag</h3>
`<script src="public/InputPlusMinusWindow.js"></script>`

<h3>ES6 import</h3>
`import InputPlusMinus from 'InputPlusMinus';`

# Usage

`InputPlusMinus('#id')`

# Settings

`interface InputPlusMinusSettings {
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
}`

# Fields

<h3>elements: InputPlusMinusElements</h3>
<h3>saveValidValue: number</h3>
last valid number
<h3>self: HTMLInputElement</h3>
<h3>callbacks: Callbacks</h3>

# Methods

<h3>constructor</h3>
`constructor(initElement: Element | string, settings?: InputPlusMinusSettings, themes?: string[])`
<h3>changeValue</h3>
`changeValue(value: number): void`
<h3>updateConfiguration</h3>
`updateConfiguration(
    settings: InputPlusMinusSettings,
    themes?: string[],
    fireInput: boolean = false,
    start: boolean = false
): void`
<h3>next</h3>
`next(): void`
<h3>prev</h3>
`prev(): void`
<h3>destructor</h3>
`destructor(): void`
