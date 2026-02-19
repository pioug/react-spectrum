export type Direction = 'ltr' | 'rtl';
export type Orientation = 'horizontal' | 'vertical';

export interface SimulatedUser {
  click: (element: Element) => Promise<void>,
  keyboard: (keys: string) => Promise<void>,
  pointer: (opts: {keys: string, target: Element, coords?: {pressure?: number}}) => Promise<void>,
  tab: (opts?: {shift?: boolean}) => Promise<void>
}

export interface UserOpts {
  advanceTimer?: (time: number) => unknown | Promise<unknown>,
  interactionType?: 'keyboard' | 'mouse' | 'touch',
  user?: SimulatedUser
}

export interface BaseTesterOpts extends UserOpts {
  root: HTMLElement,
  user?: SimulatedUser
}

export interface CheckboxGroupTesterOpts extends BaseTesterOpts {}

export interface ComboBoxTesterOpts extends BaseTesterOpts {
  trigger?: HTMLElement
}

export interface DialogTesterOpts extends BaseTesterOpts {
  overlayType?: 'modal' | 'popover'
}

export interface GridListTesterOpts extends BaseTesterOpts {}

export interface ListBoxTesterOpts extends BaseTesterOpts {}

export interface MenuTesterOpts extends BaseTesterOpts {
  isSubmenu?: boolean,
  rootMenu?: HTMLElement
}

export interface RadioGroupTesterOpts extends BaseTesterOpts {
  direction?: Direction
}

export interface SelectTesterOpts extends BaseTesterOpts {
  trigger?: HTMLElement
}

export interface TableTesterOpts extends BaseTesterOpts {}

export interface TabsTesterOpts extends BaseTesterOpts {
  direction?: Direction
}

export interface TreeTesterOpts extends BaseTesterOpts {}
