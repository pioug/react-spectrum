import {describe, expect, it} from 'vitest';
import actionButtonMeta from '../../../packages/@vue-spectrum/button/stories/ActionButton.stories';
import buttonMeta from '../../../packages/@vue-spectrum/button/stories/Button.stories';
import logicButtonMeta from '../../../packages/@vue-spectrum/button/stories/LogicButton.stories';

describe('Vue Storybook controls parity', () => {
  it('matches top-level Button controls contract with React stories', () => {
    let args = (buttonMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (buttonMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual([
      'onBlur',
      'onFocus',
      'onKeyUp',
      'onPress',
      'onPressChange',
      'onPressEnd',
      'onPressStart',
      'onPressUp',
      'variant'
    ]);

    expect(Object.keys(argTypes).sort()).toEqual([
      'autoFocus',
      'isPending',
      'onBlur',
      'onFocus',
      'onKeyUp',
      'onPress',
      'onPressChange',
      'onPressEnd',
      'onPressStart',
      'onPressUp',
      'staticColor',
      'style',
      'variant'
    ]);

    let disabledControls = ['onPress', 'onPressStart', 'onPressEnd', 'onPressUp'];
    for (let key of disabledControls) {
      expect((argTypes[key].table as {disable?: boolean})?.disable).toBe(true);
    }

    expect((argTypes.variant.options as unknown[])).toEqual([
      'accent',
      'primary',
      'secondary',
      'negative',
      'cta',
      'overBackground'
    ]);
    expect((argTypes.style.options as unknown[])).toEqual([undefined, 'fill', 'outline']);
    expect((argTypes.staticColor.options as unknown[])).toEqual([undefined, 'white', 'black']);
    expect((argTypes.autoFocus.control as string)).toBe('boolean');
    expect((argTypes.isPending.control as string)).toBe('boolean');

    expect(argTypes).not.toHaveProperty('onClick');
    expect(args).not.toHaveProperty('onClick');
  });

  it('matches top-level ActionButton controls contract with React stories', () => {
    let args = (actionButtonMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (actionButtonMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual([
      'onPress',
      'onPressEnd',
      'onPressStart'
    ]);

    expect(Object.keys(argTypes).sort()).toEqual([
      'autoFocus',
      'isQuiet',
      'onPress',
      'onPressEnd',
      'onPressStart',
      'staticColor'
    ]);

    let disabledControls = ['onPress', 'onPressStart', 'onPressEnd', 'staticColor'];
    for (let key of disabledControls) {
      expect((argTypes[key].table as {disable?: boolean})?.disable).toBe(true);
    }

    expect((argTypes.staticColor.control as string | undefined)).toBeUndefined();
    expect((argTypes.autoFocus.control as string)).toBe('boolean');
    expect((argTypes.isQuiet.control as string)).toBe('boolean');

    expect(argTypes).not.toHaveProperty('onClick');
    expect(args).not.toHaveProperty('onClick');
  });

  it('matches top-level LogicButton controls contract with React stories', () => {
    let args = (logicButtonMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (logicButtonMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual([
      'onPress',
      'onPressEnd',
      'onPressStart'
    ]);

    expect(Object.keys(argTypes).sort()).toEqual([
      'autoFocus',
      'onPress',
      'onPressEnd',
      'onPressStart',
      'variant'
    ]);

    let disabledControls = ['onPress', 'onPressStart', 'onPressEnd'];
    for (let key of disabledControls) {
      expect((argTypes[key].table as {disable?: boolean})?.disable).toBe(true);
    }

    expect((argTypes.autoFocus.control as string)).toBe('boolean');
    expect((argTypes.variant.control as string)).toBe('select');
    expect((argTypes.variant.options as unknown[])).toEqual(['and', 'or']);

    expect(argTypes).not.toHaveProperty('onClick');
    expect(args).not.toHaveProperty('onClick');
  });
});
