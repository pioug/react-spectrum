export interface PointerKey {
  name: string,
  pointerType: 'mouse' | 'touch',
  button?: 'auxiliary' | 'primary' | 'secondary',
  height?: number,
  pressure?: number,
  width?: number
}

type pointerKey = PointerKey;

export let pointerMap: pointerKey[] = [
  {name: 'MouseLeft', pointerType: 'mouse', button: 'primary', height: 1, width: 1, pressure: 0.5},
  {name: 'MouseRight', pointerType: 'mouse', button: 'secondary'},
  {name: 'MouseMiddle', pointerType: 'mouse', button: 'auxiliary'},
  {name: 'TouchA', pointerType: 'touch', height: 1, width: 1},
  {name: 'TouchB', pointerType: 'touch'},
  {name: 'TouchC', pointerType: 'touch'}
] as unknown as pointerKey[];
