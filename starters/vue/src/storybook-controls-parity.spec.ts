import {describe, expect, it} from 'vitest';
import avatarMeta from '../../../packages/@vue-spectrum/avatar/stories/Avatar.stories';
import badgeMeta from '../../../packages/@vue-spectrum/badge/stories/Badge.stories';
import actionButtonMeta from '../../../packages/@vue-spectrum/button/stories/ActionButton.stories';
import buttonMeta from '../../../packages/@vue-spectrum/button/stories/Button.stories';
import dividerMeta from '../../../packages/@vue-spectrum/divider/stories/Divider.stories';
import fileTriggerMeta from '../../../packages/@vue-spectrum/filetrigger/stories/FileTrigger.stories';
import formMeta from '../../../packages/@vue-spectrum/form/stories/Form.stories';
import helpTextMeta from '../../../packages/@vue-spectrum/label/stories/HelpText.stories';
import iconMeta from '../../../packages/@vue-spectrum/icon/stories/Icon.stories';
import imageMeta from '../../../packages/@vue-spectrum/image/stories/Image.stories';
import illustratedMessageMeta from '../../../packages/@vue-spectrum/illustratedmessage/stories/IllustratedMessage.stories';
import inlineAlertMeta from '../../../packages/@vue-spectrum/inlinealert/stories/InlineAlert.stories';
import labeledValueMeta from '../../../packages/@vue-spectrum/labeledvalue/stories/LabeledValue.stories';
import linkMeta from '../../../packages/@vue-spectrum/link/stories/Link.stories';
import logicButtonMeta from '../../../packages/@vue-spectrum/button/stories/LogicButton.stories';
import meterMeta from '../../../packages/@vue-spectrum/meter/stories/Meter.stories';
import statusLightMeta from '../../../packages/@vue-spectrum/statuslight/stories/StatusLight.stories';
import toggleButtonMeta from '../../../packages/@vue-spectrum/button/stories/ToggleButton.stories';
import viewMeta from '../../../packages/@vue-spectrum/view/stories/View.stories';

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

  it('matches top-level Icon controls contract with React stories', () => {
    let args = (iconMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (iconMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes)).toEqual([]);
  });

  it('matches top-level IllustratedMessage controls contract with React stories', () => {
    let args = (illustratedMessageMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (illustratedMessageMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes)).toEqual([]);
  });

  it('matches top-level Divider controls contract with React stories', () => {
    let args = (dividerMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (dividerMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes)).toEqual([]);
  });

  it('matches top-level FileTrigger controls contract with React stories', () => {
    let args = (fileTriggerMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (fileTriggerMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes)).toEqual([]);
  });

  it('matches top-level View controls contract with React stories', () => {
    let args = (viewMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (viewMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual(['backgroundColor', 'colorVersion']);
    expect(Object.keys(argTypes)).toEqual([]);
  });

  it('matches top-level LabeledValue controls contract with React stories', () => {
    let args = (labeledValueMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (labeledValueMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes).sort()).toEqual([
      'labelAlign',
      'labelPosition',
      'width'
    ]);

    expect((argTypes.labelPosition.control as {type?: string}).type).toBe('radio');
    expect((argTypes.labelPosition.options as unknown[])).toEqual([null, 'top', 'side']);

    expect((argTypes.labelAlign.control as {type?: string}).type).toBe('radio');
    expect((argTypes.labelAlign.options as unknown[])).toEqual(['start', 'end']);

    expect((argTypes.width.control as {type?: string}).type).toBe('radio');
    expect((argTypes.width.options as unknown[])).toEqual([null, '300px', '600px']);
  });

  it('matches top-level Link controls contract with React stories', () => {
    let args = (linkMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (linkMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes).sort()).toEqual(['onPress', 'onPressEnd', 'onPressStart']);
    expect(argTypes.onPress.action).toBe('press');
    expect(argTypes.onPressStart.action).toBe('pressstart');
    expect(argTypes.onPressEnd.action).toBe('pressend');
  });

  it('matches top-level HelpText controls contract with React stories', () => {
    let args = (helpTextMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (helpTextMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual(['description', 'label']);
    expect(Object.keys(argTypes).sort()).toEqual([
      'description',
      'errorMessage',
      'isDisabled',
      'label',
      'labelAlign',
      'labelPosition',
      'validationState',
      'width'
    ]);
    expect((argTypes.validationState.control as string)).toBe('radio');
    expect((argTypes.validationState.options as unknown[])).toEqual(['invalid', 'valid']);
    expect((argTypes.labelAlign.options as unknown[])).toEqual(['end', 'start']);
    expect((argTypes.labelPosition.options as unknown[])).toEqual(['side', 'top']);
  });

  it('matches top-level Form controls contract with React stories', () => {
    let args = (formMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (formMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes)).toEqual([]);
  });

  it('matches top-level InlineAlert controls contract with React stories', () => {
    let args = (inlineAlertMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (inlineAlertMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual(['content', 'title']);
    expect(Object.keys(argTypes).sort()).toEqual(['content', 'title', 'variant']);
    expect((argTypes.variant.control as string)).toBe('select');
    expect((argTypes.variant.options as unknown[])).toEqual(['neutral', 'info', 'positive', 'notice', 'negative']);
    expect((argTypes.title.control as string)).toBe('text');
    expect((argTypes.content.control as string)).toBe('text');
  });

  it('matches top-level StatusLight controls contract with React stories', () => {
    let args = (statusLightMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (statusLightMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes).sort()).toEqual(['isDisabled', 'variant']);
    expect((argTypes.isDisabled.control as string)).toBe('boolean');
    expect((argTypes.variant.control as {type?: string}).type).toBe('select');
    expect((argTypes.variant.control as {options?: string[]}).options).toEqual([
      'positive',
      'negative',
      'notice',
      'info',
      'neutral',
      'celery',
      'chartreuse',
      'yellow',
      'magenta',
      'fuchsia',
      'purple',
      'indigo',
      'seafoam'
    ]);
  });

  it('matches top-level Meter controls contract with React stories', () => {
    let args = (meterMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (meterMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual(['variant']);
    expect(args.variant).toBe('informative');
    expect(Object.keys(argTypes).sort()).toEqual([
      'labelPosition',
      'showValueLabel',
      'size',
      'value',
      'variant'
    ]);
    expect((argTypes.value.control as {type?: string}).type).toBe('range');
    expect((argTypes.variant.control as {type?: string}).type).toBe('radio');
    expect((argTypes.variant.control as {options?: string[]}).options).toEqual(['informative', 'positive', 'warning', 'critical']);
    expect((argTypes.size.control as {type?: string}).type).toBe('radio');
    expect((argTypes.size.control as {options?: string[]}).options).toEqual(['S', 'L']);
    expect((argTypes.showValueLabel.control as string)).toBe('boolean');
    expect((argTypes.labelPosition.control as string)).toBe('radio');
    expect((argTypes.labelPosition.options as string[])).toEqual(['top', 'side']);
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
