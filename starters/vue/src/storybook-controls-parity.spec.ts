import {describe, expect, it} from 'vitest';
import avatarMeta from '../../../packages/@vue-spectrum/avatar/stories/Avatar.stories';
import badgeMeta from '../../../packages/@vue-spectrum/badge/stories/Badge.stories';
import actionButtonMeta from '../../../packages/@vue-spectrum/button/stories/ActionButton.stories';
import buttonMeta from '../../../packages/@vue-spectrum/button/stories/Button.stories';
import dividerMeta from '../../../packages/@vue-spectrum/divider/stories/Divider.stories';
import imageMeta from '../../../packages/@vue-spectrum/image/stories/Image.stories';
import logicButtonMeta from '../../../packages/@vue-spectrum/button/stories/LogicButton.stories';
import toggleButtonMeta from '../../../packages/@vue-spectrum/button/stories/ToggleButton.stories';

describe('Vue Storybook controls parity', () => {
  it('matches top-level Avatar controls contract with React stories', () => {
    let args = (avatarMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (avatarMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes)).toEqual([]);
    expect(argTypes).not.toHaveProperty('label');
    expect(argTypes).not.toHaveProperty('shape');
  });

  it('matches top-level Badge controls contract with React stories', () => {
    let args = (badgeMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (badgeMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes)).toEqual(['variant']);
    expect((argTypes.variant.control as {type?: string}).type).toBe('select');
    expect((argTypes.variant.control as {options?: string[]}).options).toEqual([
      'positive',
      'negative',
      'neutral',
      'info',
      'indigo',
      'yellow',
      'magenta',
      'fuchsia',
      'purple',
      'seafoam'
    ]);
  });

  it('matches top-level Image controls contract with React stories', () => {
    let args = (imageMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (imageMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes)).toEqual([]);
  });

  it('matches top-level Divider controls contract with React stories', () => {
    let args = (dividerMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (dividerMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes)).toEqual([]);
  });

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

  it('matches top-level ToggleButton controls contract with React stories', () => {
    let args = (toggleButtonMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (toggleButtonMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual([
      'onPress',
      'onPressEnd',
      'onPressStart',
      'variant'
    ]);

    expect(Object.keys(argTypes).sort()).toEqual([
      'autoFocus',
      'isDisabled',
      'isEmphasized',
      'isQuiet',
      'onPress',
      'onPressEnd',
      'onPressStart',
      'staticColor',
      'variant'
    ]);

    let disabledControls = ['onPress', 'onPressStart', 'onPressEnd', 'staticColor'];
    for (let key of disabledControls) {
      expect((argTypes[key].table as {disable?: boolean})?.disable).toBe(true);
    }

    expect((argTypes.autoFocus.control as string)).toBe('boolean');
    expect((argTypes.isQuiet.control as string)).toBe('boolean');
    expect((argTypes.isEmphasized.control as string)).toBe('boolean');
    expect((argTypes.isDisabled.control as string)).toBe('boolean');
    expect((argTypes.variant.control as string)).toBe('text');

    expect(argTypes).not.toHaveProperty('onClick');
    expect(args).not.toHaveProperty('onClick');
  });
});
