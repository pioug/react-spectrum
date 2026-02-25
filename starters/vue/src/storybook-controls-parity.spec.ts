import {describe, expect, it} from 'vitest';
import buttonMeta from '../../../packages/@vue-spectrum/button/stories/Button.stories';

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
});
