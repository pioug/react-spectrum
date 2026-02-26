import {describe, expect, it} from 'vitest';
import avatarMeta from '../../../packages/@vue-spectrum/avatar/stories/Avatar.stories';
import badgeMeta from '../../../packages/@vue-spectrum/badge/stories/Badge.stories';
import actionButtonMeta from '../../../packages/@vue-spectrum/button/stories/ActionButton.stories';
import actionMenuMeta from '../../../packages/@vue-spectrum/menu/stories/ActionMenu.stories';
import buttonMeta from '../../../packages/@vue-spectrum/button/stories/Button.stories';
import checkboxMeta from '../../../packages/@vue-spectrum/checkbox/stories/Checkbox.stories';
import checkboxGroupMeta from '../../../packages/@vue-spectrum/checkbox/stories/CheckboxGroup.stories';
import colorFieldMeta from '../../../packages/@vue-spectrum/color/stories/ColorField.stories';
import colorPickerMeta from '../../../packages/@vue-spectrum/color/stories/ColorPicker.stories';
import colorSliderMeta from '../../../packages/@vue-spectrum/color/stories/ColorSlider.stories';
import colorSwatchPickerMeta from '../../../packages/@vue-spectrum/color/stories/ColorSwatchPicker.stories';
import comboBoxMeta from '../../../packages/@vue-spectrum/combobox/stories/ComboBox.stories';
import contextualHelpMeta from '../../../packages/@vue-spectrum/contextualhelp/stories/ContextualHelp.stories';
import dateFieldMeta from '../../../packages/@vue-spectrum/datepicker/stories/DateField.stories';
import datePickerMeta from '../../../packages/@vue-spectrum/datepicker/stories/DatePicker.stories';
import dateRangePickerMeta from '../../../packages/@vue-spectrum/datepicker/stories/DateRangePicker.stories';
import dialogMeta from '../../../packages/@vue-spectrum/dialog/stories/Dialog.stories';
import dialogContainerMeta from '../../../packages/@vue-spectrum/dialog/stories/DialogContainer.stories';
import timeFieldMeta from '../../../packages/@vue-spectrum/datepicker/stories/TimeField.stories';
import dividerMeta from '../../../packages/@vue-spectrum/divider/stories/Divider.stories';
import dialogTriggerMeta from '../../../packages/@vue-spectrum/dialog/stories/DialogTrigger.stories';
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
import modalMeta from '../../../packages/@vue-spectrum/overlays/stories/Modal.stories';
import numberFieldMeta from '../../../packages/@vue-spectrum/numberfield/stories/NumberField.stories';
import pickerMeta from '../../../packages/@vue-spectrum/picker/stories/Picker.stories';
import progressBarMeta from '../../../packages/@vue-spectrum/progress/stories/ProgressBar.stories';
import progressCircleMeta from '../../../packages/@vue-spectrum/progress/stories/ProgressCircle.stories';
import radioGroupMeta from '../../../packages/@vue-spectrum/radio/stories/Radio.stories';
import rangeSliderMeta from '../../../packages/@vue-spectrum/slider/stories/RangeSlider.stories';
import searchFieldMeta from '../../../packages/@vue-spectrum/searchfield/stories/SearchField.stories';
import searchAutocompleteMeta from '../../../packages/@vue-spectrum/autocomplete/stories/SearchAutocomplete.stories';
import sliderMeta from '../../../packages/@vue-spectrum/slider/stories/Slider.stories';
import stepListMeta from '../../../packages/@vue-spectrum/steplist/stories/StepList.stories';
import statusLightMeta from '../../../packages/@vue-spectrum/statuslight/stories/StatusLight.stories';
import switchMeta from '../../../packages/@vue-spectrum/switch/stories/Switch.stories';
import tagGroupMeta from '../../../packages/@vue-spectrum/tag/stories/TagGroup.stories';
import textAreaMeta from '../../../packages/@vue-spectrum/textfield/stories/TextArea.stories';
import textFieldMeta from '../../../packages/@vue-spectrum/textfield/stories/TextField.stories';
import toggleButtonMeta from '../../../packages/@vue-spectrum/button/stories/ToggleButton.stories';
import tooltipTriggerMeta from '../../../packages/@vue-spectrum/tooltip/stories/TooltipTrigger.stories';
import viewMeta from '../../../packages/@vue-spectrum/view/stories/View.stories';
import wellMeta from '../../../packages/@vue-spectrum/well/stories/Well.stories';

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

  it('matches top-level Checkbox controls contract with React stories', () => {
    let args = (checkboxMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (checkboxMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual(['onChange']);
    expect(typeof args.onChange).toBe('function');

    expect(Object.keys(argTypes).sort()).toEqual([
      'autoFocus',
      'defaultSelected',
      'isDisabled',
      'isEmphasized',
      'isIndeterminate',
      'isInvalid',
      'isReadOnly',
      'isSelected',
      'onChange'
    ]);
    expect((argTypes.onChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.defaultSelected.control as string)).toBe('boolean');
    expect((argTypes.isSelected.control as string)).toBe('boolean');
    expect((argTypes.isIndeterminate.control as string)).toBe('boolean');
    expect((argTypes.isEmphasized.control as string)).toBe('boolean');
    expect((argTypes.isDisabled.control as string)).toBe('boolean');
    expect((argTypes.isReadOnly.control as string)).toBe('boolean');
    expect((argTypes.autoFocus.control as string)).toBe('boolean');
    expect((argTypes.isInvalid.control as string)).toBe('boolean');
  });

  it('matches top-level CheckboxGroup controls contract with React stories', () => {
    let args = (checkboxGroupMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (checkboxGroupMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual(['label', 'onChange']);
    expect(args.label).toBe('Pets');
    expect(typeof args.onChange).toBe('function');

    expect(Object.keys(argTypes).sort()).toEqual([
      'aria-label',
      'contextualHelp',
      'defaultValue',
      'description',
      'errorMessage',
      'isDisabled',
      'isEmphasized',
      'isInvalid',
      'isReadOnly',
      'isRequired',
      'labelAlign',
      'labelPosition',
      'name',
      'necessityIndicator',
      'onChange',
      'orientation',
      'showErrorIcon',
      'value'
    ]);

    expect((argTypes.onChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.contextualHelp.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.defaultValue.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.value.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.isEmphasized.control as string)).toBe('boolean');
    expect((argTypes.isDisabled.control as string)).toBe('boolean');
    expect((argTypes.isReadOnly.control as string)).toBe('boolean');
    expect((argTypes.isRequired.control as string)).toBe('boolean');
    expect((argTypes.necessityIndicator.control as string)).toBe('select');
    expect((argTypes.necessityIndicator.options as string[])).toEqual(['icon', 'label']);
    expect((argTypes.labelPosition.control as string)).toBe('select');
    expect((argTypes.labelPosition.options as string[])).toEqual(['top', 'side']);
    expect((argTypes.labelAlign.control as string)).toBe('select');
    expect((argTypes.labelAlign.options as string[])).toEqual(['start', 'end']);
    expect((argTypes.isInvalid.control as string)).toBe('boolean');
    expect((argTypes.description.control as string)).toBe('text');
    expect((argTypes.errorMessage.control as string)).toBe('text');
    expect((argTypes.showErrorIcon.control as string)).toBe('boolean');
    expect((argTypes.orientation.control as string)).toBe('select');
    expect((argTypes.orientation.options as string[])).toEqual(['horizontal', 'vertical']);
    expect((argTypes['aria-label'].control as string)).toBe('text');
    expect((argTypes.name.control as string)).toBe('text');
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

  it('matches top-level Well controls contract with React stories', () => {
    let args = (wellMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (wellMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes)).toEqual([]);
  });

  it('matches top-level Switch controls contract with React stories', () => {
    let args = (switchMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (switchMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual(['isEmphasized']);
    expect(args.isEmphasized).toBe(false);
    expect(Object.keys(argTypes).sort()).toEqual(['onBlur', 'onChange', 'onFocus']);
    expect(argTypes.onChange.action).toBe('change');
    expect(argTypes.onFocus.action).toBe('focus');
    expect(argTypes.onBlur.action).toBe('blur');
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

  it('matches top-level NumberField controls contract with React stories', () => {
    let args = (numberFieldMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (numberFieldMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes)).toEqual([]);
  });

  it('matches top-level ActionMenu controls contract with React stories', () => {
    let args = (actionMenuMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (actionMenuMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes)).toEqual([]);
  });

  it('matches top-level ColorSlider controls contract with React stories', () => {
    let args = (colorSliderMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (colorSliderMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual(['onChange', 'onChangeEnd']);
    expect(typeof args.onChange).toBe('function');
    expect(typeof args.onChangeEnd).toBe('function');
    expect(Object.keys(argTypes).sort()).toEqual([
      'aria-label',
      'channel',
      'contextualHelp',
      'height',
      'isDisabled',
      'label',
      'onChange',
      'onChangeEnd',
      'orientation',
      'showValueLabel',
      'width'
    ]);
    expect((argTypes.onChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onChangeEnd.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.contextualHelp.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.channel.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.label.control as string)).toBe('text');
    expect((argTypes['aria-label'].control as string)).toBe('text');
    expect((argTypes.isDisabled.control as string)).toBe('boolean');
    expect((argTypes.showValueLabel.control as string)).toBe('boolean');
    expect((argTypes.orientation.control as string)).toBe('select');
    expect((argTypes.orientation.options as unknown[])).toEqual(['horizontal', 'vertical']);
    expect((argTypes.width.control as string)).toBe('text');
    expect((argTypes.height.control as string)).toBe('text');
  });

  it('matches top-level ColorField controls contract with React stories', () => {
    let args = (colorFieldMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (colorFieldMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual(['label', 'onChange']);
    expect(args.label).toBe('Primary Color');
    expect(typeof args.onChange).toBe('function');
    expect(Object.keys(argTypes).sort()).toEqual([
      'aria-label',
      'autoFocus',
      'channel',
      'colorSpace',
      'contextualHelp',
      'description',
      'errorMessage',
      'isDisabled',
      'isInvalid',
      'isQuiet',
      'isReadOnly',
      'isRequired',
      'isWheelDisabled',
      'label',
      'labelAlign',
      'labelPosition',
      'necessityIndicator',
      'onChange',
      'width'
    ]);
    expect((argTypes.onChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.contextualHelp.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.label.control as string)).toBe('text');
    expect((argTypes['aria-label'].control as string)).toBe('text');
    expect((argTypes.isQuiet.control as string)).toBe('boolean');
    expect((argTypes.isReadOnly.control as string)).toBe('boolean');
    expect((argTypes.isDisabled.control as string)).toBe('boolean');
    expect((argTypes.autoFocus.control as string)).toBe('boolean');
    expect((argTypes.isRequired.control as string)).toBe('boolean');
    expect((argTypes.necessityIndicator.control as string)).toBe('select');
    expect((argTypes.necessityIndicator.options as unknown[])).toEqual(['icon', 'label']);
    expect((argTypes.labelAlign.control as string)).toBe('select');
    expect((argTypes.labelAlign.options as unknown[])).toEqual(['end', 'start']);
    expect((argTypes.labelPosition.control as string)).toBe('select');
    expect((argTypes.labelPosition.options as unknown[])).toEqual(['top', 'side']);
    expect((argTypes.isInvalid.control as string)).toBe('boolean');
    expect((argTypes.isWheelDisabled.control as string)).toBe('boolean');
    expect((argTypes.description.control as string)).toBe('text');
    expect((argTypes.errorMessage.control as string)).toBe('text');
    expect((argTypes.width.control as string)).toBe('text');
    expect((argTypes.colorSpace.control as string)).toBe('select');
    expect((argTypes.colorSpace.options as unknown[])).toEqual(['rgb', 'hsl', 'hsb']);
    expect((argTypes.channel.control as string)).toBe('select');
    expect((argTypes.channel.options as unknown[])).toEqual([null, 'red', 'green', 'blue', 'hue', 'saturation', 'lightness', 'brightness']);
  });

  it('matches top-level ColorPicker controls contract with React stories', () => {
    let args = (colorPickerMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (colorPickerMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes).sort()).toEqual(['label', 'rounding', 'size', 'value']);
    expect((argTypes.value.control as string)).toBe('color');
    expect((argTypes.label.control as string)).toBe('text');
    expect((argTypes.rounding.control as string)).toBe('radio');
    expect((argTypes.rounding.options as unknown[])).toEqual(['default', 'none', 'full']);
    expect((argTypes.size.control as string)).toBe('radio');
    expect((argTypes.size.options as unknown[])).toEqual(['XS', 'S', 'M', 'L']);
  });

  it('matches top-level ColorSwatchPicker controls contract with React stories', () => {
    let args = (colorSwatchPickerMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (colorSwatchPickerMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes).sort()).toEqual(['density', 'rounding', 'size', 'value']);
    expect((argTypes.value.control as string)).toBe('color');
    expect((argTypes.rounding.control as string)).toBe('radio');
    expect((argTypes.rounding.options as unknown[])).toEqual(['none', 'default', 'full']);
    expect((argTypes.size.control as string)).toBe('radio');
    expect((argTypes.size.options as unknown[])).toEqual(['XS', 'S', 'M', 'L']);
    expect((argTypes.density.control as string)).toBe('radio');
    expect((argTypes.density.options as unknown[])).toEqual(['compact', 'regular', 'spacious']);
  });

  it('matches top-level ContextualHelp controls contract with React stories', () => {
    let args = (contextualHelpMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (contextualHelpMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes).sort()).toEqual([
      'children',
      'containerPadding',
      'crossOffset',
      'offset',
      'onOpenChange',
      'placement',
      'shouldFlip',
      'variant'
    ]);
    expect(argTypes.onOpenChange.action).toBe('openChange');
    expect((argTypes.onOpenChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.placement.control as string)).toBe('select');
    expect((argTypes.placement.options as unknown[])).toEqual([
      'bottom',
      'bottom left',
      'bottom right',
      'bottom start',
      'bottom end',
      'top',
      'top left',
      'top right',
      'top start',
      'top end',
      'left',
      'left top',
      'left bottom',
      'start',
      'start top',
      'start bottom',
      'right',
      'right top',
      'right bottom',
      'end',
      'end top',
      'end bottom'
    ]);
    expect((argTypes.variant.control as string)).toBe('select');
    expect((argTypes.variant.defaultValue as string)).toBe('help');
    expect((argTypes.variant.options as unknown[])).toEqual(['help', 'info']);
    expect((argTypes.offset.control as string)).toBe('number');
    expect((argTypes.crossOffset.control as string)).toBe('number');
    expect((argTypes.containerPadding.control as string)).toBe('number');
    expect((argTypes.shouldFlip.control as string)).toBe('boolean');
    expect((argTypes.children.table as {disable?: boolean}).disable).toBe(true);
  });

  it('matches top-level TooltipTrigger controls contract with React stories', () => {
    let args = (tooltipTriggerMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (tooltipTriggerMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual(['children', 'onOpenChange', 'shouldCloseOnPress']);
    expect(Array.isArray(args.children)).toBe(true);
    expect(typeof args.onOpenChange).toBe('function');
    expect(args.shouldCloseOnPress).toBe(true);
    expect(Object.keys(argTypes).sort()).toEqual([
      'children',
      'closeDelay',
      'containerPadding',
      'crossOffset',
      'delay',
      'isDisabled',
      'offset',
      'placement',
      'shouldCloseOnPress',
      'shouldFlip',
      'trigger'
    ]);
    expect((argTypes.placement.control as string)).toBe('select');
    expect((argTypes.placement.options as unknown[])).toEqual([
      'bottom',
      'bottom left',
      'bottom right',
      'bottom start',
      'bottom end',
      'top',
      'top left',
      'top right',
      'top start',
      'top end',
      'left',
      'left top',
      'left bottom',
      'start',
      'start top',
      'start bottom',
      'right',
      'right top',
      'right bottom',
      'end',
      'end top',
      'end bottom'
    ]);
    expect((argTypes.delay.control as string)).toBe('number');
    expect((argTypes.closeDelay.control as string)).toBe('number');
    expect((argTypes.offset.control as string)).toBe('number');
    expect((argTypes.crossOffset.control as string)).toBe('number');
    expect((argTypes.containerPadding.control as string)).toBe('number');
    expect((argTypes.isDisabled.control as string)).toBe('boolean');
    expect((argTypes.shouldFlip.control as string)).toBe('boolean');
    expect((argTypes.trigger.control as string)).toBe('radio');
    expect((argTypes.trigger.options as unknown[])).toEqual([undefined, 'focus']);
    expect((argTypes.children.control as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.shouldCloseOnPress.control as string)).toBe('boolean');
  });

  it('matches top-level Picker controls contract with React stories', () => {
    let args = (pickerMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (pickerMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual(['label', 'onOpenChange', 'onSelectionChange']);
    expect(args.label).toBe('Test');
    expect(typeof args.onSelectionChange).toBe('function');
    expect(typeof args.onOpenChange).toBe('function');

    expect(Object.keys(argTypes).sort()).toEqual([
      'align',
      'autoFocus',
      'children',
      'defaultOpen',
      'description',
      'direction',
      'errorMessage',
      'isDisabled',
      'isInvalid',
      'isLoading',
      'isOpen',
      'isQuiet',
      'isRequired',
      'label',
      'labelAlign',
      'labelPosition',
      'layout',
      'menuWidth',
      'necessityIndicator',
      'onOpenChange',
      'onSelectionChange',
      'width'
    ]);
    expect((argTypes.layout.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.children.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onSelectionChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onOpenChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.label.control as string)).toBe('text');
    expect((argTypes.description.control as string)).toBe('text');
    expect((argTypes.errorMessage.control as string)).toBe('text');
    expect((argTypes.isDisabled.control as string)).toBe('boolean');
    expect((argTypes.isInvalid.control as string)).toBe('boolean');
    expect((argTypes.isQuiet.control as string)).toBe('boolean');
    expect((argTypes.isRequired.control as string)).toBe('boolean');
    expect((argTypes.labelAlign.control as string)).toBe('radio');
    expect((argTypes.labelAlign.options as unknown[])).toEqual(['end', 'start']);
    expect((argTypes.labelPosition.control as string)).toBe('radio');
    expect((argTypes.labelPosition.options as unknown[])).toEqual(['side', 'top']);
    expect((argTypes.necessityIndicator.control as string)).toBe('radio');
    expect((argTypes.necessityIndicator.options as unknown[])).toEqual(['icon', 'label']);
    expect((argTypes.direction.control as string)).toBe('radio');
    expect((argTypes.direction.options as unknown[])).toEqual(['top', 'bottom']);
    expect((argTypes.align.control as string)).toBe('radio');
    expect((argTypes.align.options as unknown[])).toEqual(['start', 'end']);
    expect((argTypes.width.control as {type?: string}).type).toBe('radio');
    expect((argTypes.width.control as {options?: unknown[]}).options).toEqual([null, '100px', '480px', 'size-4600']);
    expect((argTypes.menuWidth.control as {type?: string}).type).toBe('radio');
    expect((argTypes.menuWidth.control as {options?: unknown[]}).options).toEqual([null, '100px', '480px', 'size-4600']);
    expect((argTypes.isLoading.control as string)).toBe('boolean');
    expect((argTypes.autoFocus.control as string)).toBe('boolean');
    expect((argTypes.isOpen.control as string)).toBe('boolean');
    expect((argTypes.defaultOpen.control as string)).toBe('boolean');
  });

  it('matches top-level TagGroup controls contract with React stories', () => {
    let args = (tagGroupMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (tagGroupMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes).sort()).toEqual([
      'contextualHelp',
      'description',
      'errorMessage',
      'isInvalid',
      'isRequired',
      'items',
      'labelAlign',
      'labelPosition',
      'maxRows',
      'necessityIndicator',
      'onAction',
      'onRemove'
    ]);
    expect((argTypes.onRemove.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onAction.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.items.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.contextualHelp.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.maxRows.type as string)).toBe('number');
    expect((argTypes.isRequired.control as string)).toBe('boolean');
    expect((argTypes.necessityIndicator.control as string)).toBe('select');
    expect((argTypes.necessityIndicator.options as unknown[])).toEqual(['icon', 'label']);
    expect((argTypes.labelPosition.control as string)).toBe('select');
    expect((argTypes.labelPosition.options as unknown[])).toEqual(['top', 'side']);
    expect((argTypes.labelAlign.control as string)).toBe('select');
    expect((argTypes.labelAlign.options as unknown[])).toEqual(['start', 'end']);
    expect((argTypes.isInvalid.control as string)).toBe('boolean');
    expect((argTypes.description.control as string)).toBe('text');
    expect((argTypes.errorMessage.control as string)).toBe('text');
  });

  it('matches top-level StepList controls contract with React stories', () => {
    let args = (stepListMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (stepListMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual(['onLastCompletedStepChange', 'onSelectionChange']);
    expect(typeof args.onSelectionChange).toBe('function');
    expect(typeof args.onLastCompletedStepChange).toBe('function');
    expect(Object.keys(argTypes).sort()).toEqual([
      'children',
      'isEmphasized',
      'isReadOnly',
      'onLastCompletedStepChange',
      'onSelectionChange',
      'orientation',
      'size'
    ]);
    expect((argTypes.children.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.isEmphasized.control as string)).toBe('boolean');
    expect((argTypes.isReadOnly.control as string)).toBe('boolean');
    expect((argTypes.onSelectionChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onLastCompletedStepChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.orientation.control as {type?: string}).type).toBe('inline-radio');
    expect((argTypes.orientation.control as {options?: unknown[]}).options).toEqual(['horizontal', 'vertical']);
    expect((argTypes.size.control as {type?: string}).type).toBe('inline-radio');
    expect((argTypes.size.control as {options?: unknown[]}).options).toEqual(['S', 'M', 'L', 'XL']);
  });

  it('matches top-level DateField controls contract with React stories', () => {
    let args = (dateFieldMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (dateFieldMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual(['onChange']);
    expect(typeof args.onChange).toBe('function');
    expect(Object.keys(argTypes).sort()).toEqual([
      'aria-label',
      'autoFocus',
      'contextualHelp',
      'defaultValue',
      'description',
      'errorMessage',
      'granularity',
      'hideTimeZone',
      'hourCycle',
      'isDisabled',
      'isQuiet',
      'isReadOnly',
      'isRequired',
      'label',
      'labelAlign',
      'labelPosition',
      'maxValue',
      'minValue',
      'necessityIndicator',
      'onBlur',
      'onChange',
      'onFocus',
      'onFocusChange',
      'onKeyDown',
      'onKeyUp',
      'placeholderValue',
      'shouldForceLeadingZeros',
      'showFormatHelpText',
      'validationState',
      'value',
      'width'
    ]);
    expect((argTypes.onChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.defaultValue.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.value.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.minValue.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.maxValue.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.placeholderValue.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.contextualHelp.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onBlur.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onFocus.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onFocusChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onKeyDown.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onKeyUp.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.label.control as string)).toBe('text');
    expect((argTypes.granularity.control as string)).toBe('select');
    expect((argTypes.granularity.options as unknown[])).toEqual(['day', 'hour', 'minute', 'second']);
    expect((argTypes.hourCycle.control as string)).toBe('select');
    expect((argTypes.hourCycle.options as unknown[])).toEqual([12, 24]);
    expect((argTypes.hideTimeZone.control as string)).toBe('boolean');
    expect((argTypes.shouldForceLeadingZeros.control as string)).toBe('boolean');
    expect((argTypes.necessityIndicator.control as string)).toBe('select');
    expect((argTypes.necessityIndicator.options as unknown[])).toEqual(['icon', 'label']);
    expect((argTypes.validationState.control as string)).toBe('select');
    expect((argTypes.validationState.options as unknown[])).toEqual([null, 'valid', 'invalid']);
    expect((argTypes.labelAlign.control as string)).toBe('select');
    expect((argTypes.labelAlign.options as unknown[])).toEqual(['end', 'start']);
    expect((argTypes.labelPosition.control as string)).toBe('select');
    expect((argTypes.labelPosition.options as unknown[])).toEqual(['top', 'side']);
    expect((argTypes.autoFocus.control as string)).toBe('boolean');
    expect((argTypes.showFormatHelpText.control as string)).toBe('boolean');
    expect((argTypes['aria-label'].control as string)).toBe('text');
    expect((argTypes.width.control as string)).toBe('text');
  });

  it('matches top-level DatePicker controls contract with React stories', () => {
    let args = (datePickerMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (datePickerMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual(['onChange']);
    expect(typeof args.onChange).toBe('function');
    expect(Object.keys(argTypes).sort()).toEqual([
      'aria-label',
      'autoFocus',
      'contextualHelp',
      'defaultOpen',
      'defaultValue',
      'description',
      'errorMessage',
      'firstDayOfWeek',
      'granularity',
      'hideTimeZone',
      'hourCycle',
      'isDateUnavailable',
      'isDisabled',
      'isOpen',
      'isQuiet',
      'isReadOnly',
      'isRequired',
      'label',
      'labelAlign',
      'labelPosition',
      'maxValue',
      'maxVisibleMonths',
      'minValue',
      'necessityIndicator',
      'onBlur',
      'onChange',
      'onFocus',
      'onFocusChange',
      'onKeyDown',
      'onKeyUp',
      'onOpenChange',
      'placeholderValue',
      'shouldFlip',
      'shouldForceLeadingZeros',
      'showFormatHelpText',
      'validationState',
      'value',
      'width'
    ]);
    expect((argTypes.onChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.defaultValue.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.value.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.minValue.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.maxValue.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.placeholderValue.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.contextualHelp.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.isDateUnavailable.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onBlur.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onFocus.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onFocusChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onKeyDown.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onKeyUp.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onOpenChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.label.control as string)).toBe('text');
    expect((argTypes.granularity.control as string)).toBe('select');
    expect((argTypes.granularity.options as unknown[])).toEqual(['day', 'hour', 'minute', 'second']);
    expect((argTypes.hourCycle.control as string)).toBe('select');
    expect((argTypes.hourCycle.options as unknown[])).toEqual([12, 24]);
    expect((argTypes.hideTimeZone.control as string)).toBe('boolean');
    expect((argTypes.shouldForceLeadingZeros.control as string)).toBe('boolean');
    expect((argTypes.necessityIndicator.control as string)).toBe('select');
    expect((argTypes.necessityIndicator.options as unknown[])).toEqual(['icon', 'label']);
    expect((argTypes.validationState.control as string)).toBe('select');
    expect((argTypes.validationState.options as unknown[])).toEqual([null, 'valid', 'invalid']);
    expect((argTypes.labelAlign.control as string)).toBe('select');
    expect((argTypes.labelAlign.options as unknown[])).toEqual(['end', 'start']);
    expect((argTypes.labelPosition.control as string)).toBe('select');
    expect((argTypes.labelPosition.options as unknown[])).toEqual(['top', 'side']);
    expect((argTypes.autoFocus.control as string)).toBe('boolean');
    expect((argTypes.showFormatHelpText.control as string)).toBe('boolean');
    expect((argTypes['aria-label'].control as string)).toBe('text');
    expect((argTypes.width.control as string)).toBe('text');
    expect((argTypes.maxVisibleMonths.control as string)).toBe('number');
    expect((argTypes.shouldFlip.control as string)).toBe('boolean');
    expect((argTypes.defaultOpen.control as string)).toBe('boolean');
    expect((argTypes.isOpen.control as string)).toBe('boolean');
    expect((argTypes.firstDayOfWeek.control as string)).toBe('select');
    expect((argTypes.firstDayOfWeek.options as unknown[])).toEqual([undefined, 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']);
  });

  it('matches top-level TimeField controls contract with React stories', () => {
    let args = (timeFieldMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (timeFieldMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes)).toEqual([]);
  });

  it('matches top-level DateRangePicker controls contract with React stories', () => {
    let args = (dateRangePickerMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (dateRangePickerMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes)).toEqual([]);
  });

  it('matches top-level ComboBox controls contract with React stories', () => {
    let args = (comboBoxMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (comboBoxMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual([
      'label',
      'onBlur',
      'onFocus',
      'onInputChange',
      'onOpenChange',
      'onSelectionChange'
    ]);
    expect(args.label).toBe('Combobox');
    expect(typeof args.onOpenChange).toBe('function');
    expect(typeof args.onInputChange).toBe('function');
    expect(typeof args.onSelectionChange).toBe('function');
    expect(typeof args.onBlur).toBe('function');
    expect(typeof args.onFocus).toBe('function');

    expect(Object.keys(argTypes).sort()).toEqual([
      'align',
      'allowsCustomValue',
      'aria-label',
      'autoFocus',
      'contextualHelp',
      'defaultInputValue',
      'defaultItems',
      'defaultSelectedKey',
      'description',
      'direction',
      'disabledKeys',
      'errorMessage',
      'inputValue',
      'isDisabled',
      'isQuiet',
      'isReadOnly',
      'isRequired',
      'label',
      'labelAlign',
      'labelPosition',
      'menuTrigger',
      'menuWidth',
      'necessityIndicator',
      'onBlur',
      'onFocus',
      'onInputChange',
      'onOpenChange',
      'onSelectionChange',
      'selectedKey',
      'validationState',
      'width'
    ]);
    expect((argTypes.defaultItems.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.contextualHelp.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onOpenChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.disabledKeys.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.inputValue.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.defaultInputValue.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.defaultSelectedKey.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.selectedKey.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onInputChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onSelectionChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onBlur.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onFocus.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.label.control as string)).toBe('text');
    expect((argTypes['aria-label'].control as string)).toBe('text');
    expect((argTypes.isDisabled.control as string)).toBe('boolean');
    expect((argTypes.isQuiet.control as string)).toBe('boolean');
    expect((argTypes.isReadOnly.control as string)).toBe('boolean');
    expect((argTypes.autoFocus.control as string)).toBe('boolean');
    expect((argTypes.isRequired.control as string)).toBe('boolean');
    expect((argTypes.necessityIndicator.control as string)).toBe('select');
    expect((argTypes.necessityIndicator.options as string[])).toEqual(['icon', 'label']);
    expect((argTypes.labelAlign.control as string)).toBe('select');
    expect((argTypes.labelAlign.options as string[])).toEqual(['end', 'start']);
    expect((argTypes.labelPosition.control as string)).toBe('select');
    expect((argTypes.labelPosition.options as string[])).toEqual(['top', 'side']);
    expect((argTypes.validationState.control as string)).toBe('select');
    expect((argTypes.validationState.options as unknown[])).toEqual([null, 'valid', 'invalid']);
    expect((argTypes.description.control as string)).toBe('text');
    expect((argTypes.errorMessage.control as string)).toBe('text');
    expect((argTypes.menuTrigger.control as string)).toBe('select');
    expect((argTypes.menuTrigger.options as string[])).toEqual(['focus', 'manual']);
    expect((argTypes.direction.control as string)).toBe('radio');
    expect((argTypes.direction.options as string[])).toEqual(['top', 'bottom']);
    expect((argTypes.align.control as string)).toBe('radio');
    expect((argTypes.align.options as string[])).toEqual(['start', 'end']);
    expect((argTypes.allowsCustomValue.control as string)).toBe('boolean');
    expect((argTypes.width.control as {type?: string}).type).toBe('radio');
    expect((argTypes.width.control as {options?: unknown[]}).options).toEqual([null, '100px', '480px', 'size-4600']);
    expect((argTypes.menuWidth.control as {type?: string}).type).toBe('radio');
    expect((argTypes.menuWidth.control as {options?: unknown[]}).options).toEqual([null, '100px', '480px', 'size-4600']);
  });

  it('matches top-level DialogTrigger controls contract with React stories', () => {
    let args = (dialogTriggerMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (dialogTriggerMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes).sort()).toEqual([
      'buttonHeight',
      'buttonWidth',
      'containerPadding',
      'crossOffset',
      'isKeyboardDismissDisabled',
      'offset',
      'placement',
      'shouldFlip'
    ]);
    expect((argTypes.crossOffset.control as {type?: string}).type).toBe('number');
    expect((argTypes.offset.control as {type?: string}).type).toBe('number');
    expect((argTypes.placement.control as {type?: string}).type).toBe('select');
    expect((argTypes.placement.options as unknown[])).toEqual([
      'bottom',
      'bottom left',
      'bottom right',
      'bottom start',
      'bottom end',
      'top',
      'top left',
      'top right',
      'top start',
      'top end',
      'left',
      'left top',
      'left bottom',
      'start',
      'start top',
      'start bottom',
      'right',
      'right top',
      'right bottom',
      'end',
      'end top',
      'end bottom'
    ]);
    expect((argTypes.buttonHeight.control as {type?: string}).type).toBe('number');
    expect((argTypes.buttonWidth.control as {type?: string}).type).toBe('number');
    expect((argTypes.shouldFlip.control as {type?: string}).type).toBe('boolean');
    expect((argTypes.isKeyboardDismissDisabled.control as {type?: string}).type).toBe('boolean');
    expect((argTypes.containerPadding.control as {type?: string}).type).toBe('number');
  });

  it('matches top-level Dialog controls contract with React stories', () => {
    let args = (dialogMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (dialogMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes)).toEqual([]);
  });

  it('matches top-level DialogContainer controls contract with React stories', () => {
    let args = (dialogContainerMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (dialogContainerMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual([]);
    expect(Object.keys(argTypes)).toEqual([]);
  });

  it('matches top-level SearchAutocomplete controls contract with React stories', () => {
    let args = (searchAutocompleteMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (searchAutocompleteMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual([
      'label',
      'onBlur',
      'onClear',
      'onFocus',
      'onInputChange',
      'onOpenChange',
      'onSelectionChange',
      'onSubmit'
    ]);
    expect(args.label).toBe('Search with Autocomplete');
    expect(typeof args.onOpenChange).toBe('function');
    expect(typeof args.onInputChange).toBe('function');
    expect(typeof args.onSelectionChange).toBe('function');
    expect(typeof args.onBlur).toBe('function');
    expect(typeof args.onFocus).toBe('function');
    expect(typeof args.onSubmit).toBe('function');
    expect(typeof args.onClear).toBe('function');

    expect(Object.keys(argTypes).sort()).toEqual([
      'align',
      'aria-label',
      'autoFocus',
      'contextualHelp',
      'defaultInputValue',
      'defaultItems',
      'defaultSelectedKey',
      'description',
      'direction',
      'disabledKeys',
      'errorMessage',
      'inputValue',
      'isDisabled',
      'isQuiet',
      'isReadOnly',
      'isRequired',
      'label',
      'labelAlign',
      'labelPosition',
      'loadingState',
      'menuTrigger',
      'menuWidth',
      'necessityIndicator',
      'onBlur',
      'onFocus',
      'onInputChange',
      'onOpenChange',
      'onSelectionChange',
      'selectedKey',
      'validationState',
      'width'
    ]);

    expect((argTypes.defaultItems.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.contextualHelp.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onOpenChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.disabledKeys.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.inputValue.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.defaultInputValue.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.defaultSelectedKey.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.selectedKey.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onInputChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onSelectionChange.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onBlur.table as {disable?: boolean}).disable).toBe(true);
    expect((argTypes.onFocus.table as {disable?: boolean}).disable).toBe(true);

    expect((argTypes.label.control as string)).toBe('text');
    expect((argTypes['aria-label'].control as string)).toBe('text');
    expect((argTypes.isDisabled.control as string)).toBe('boolean');
    expect((argTypes.isQuiet.control as string)).toBe('boolean');
    expect((argTypes.isReadOnly.control as string)).toBe('boolean');
    expect((argTypes.autoFocus.control as string)).toBe('boolean');
    expect((argTypes.isRequired.control as string)).toBe('boolean');
    expect((argTypes.necessityIndicator.control as string)).toBe('select');
    expect((argTypes.necessityIndicator.options as string[])).toEqual(['icon', 'label']);
    expect((argTypes.labelAlign.control as string)).toBe('select');
    expect((argTypes.labelAlign.options as string[])).toEqual(['end', 'start']);
    expect((argTypes.labelPosition.control as string)).toBe('select');
    expect((argTypes.labelPosition.options as string[])).toEqual(['top', 'side']);
    expect((argTypes.loadingState.control as string)).toBe('select');
    expect((argTypes.loadingState.options as string[])).toEqual(['idle', 'loading', 'loadingMore', 'filtering']);
    expect((argTypes.validationState.control as string)).toBe('select');
    expect((argTypes.validationState.options as unknown[])).toEqual([null, 'valid', 'invalid']);
    expect((argTypes.description.control as string)).toBe('text');
    expect((argTypes.errorMessage.control as string)).toBe('text');
    expect((argTypes.menuTrigger.control as string)).toBe('select');
    expect((argTypes.menuTrigger.options as string[])).toEqual(['focus', 'manual']);
    expect((argTypes.direction.control as string)).toBe('radio');
    expect((argTypes.direction.options as string[])).toEqual(['top', 'bottom']);
    expect((argTypes.align.control as string)).toBe('radio');
    expect((argTypes.align.options as string[])).toEqual(['start', 'end']);
    expect((argTypes.width.control as {type?: string}).type).toBe('radio');
    expect((argTypes.width.control as {options?: unknown[]}).options).toEqual([null, '100px', '480px', 'size-4600']);
    expect((argTypes.menuWidth.control as {type?: string}).type).toBe('radio');
    expect((argTypes.menuWidth.control as {options?: unknown[]}).options).toEqual([null, '100px', '480px', 'size-4600']);
  });

  it('matches top-level Modal controls contract with React stories', () => {
    let args = (modalMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (modalMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

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

  it('matches top-level ProgressBar controls contract with React stories', () => {
    let args = (progressBarMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (progressBarMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual(['value']);
    expect(args.value).toBe(32);
    expect(Object.keys(argTypes)).toEqual(['value']);
    expect((argTypes.value.control as {type?: string}).type).toBe('range');
    expect((argTypes.value.control as {min?: number}).min).toBe(0);
    expect((argTypes.value.control as {max?: number}).max).toBe(100);
  });

  it('matches top-level ProgressCircle controls contract with React stories', () => {
    let args = (progressCircleMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (progressCircleMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args)).toEqual(['value']);
    expect(args.value).toBe(32);
    expect(Object.keys(argTypes)).toEqual(['value']);
    expect((argTypes.value.control as {type?: string}).type).toBe('range');
    expect((argTypes.value.control as {min?: number}).min).toBe(0);
    expect((argTypes.value.control as {max?: number}).max).toBe(100);
  });

  it('matches top-level SearchField controls contract with React stories', () => {
    let args = (searchFieldMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (searchFieldMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual([
      'isDisabled',
      'isQuiet',
      'isReadOnly',
      'isRequired',
      'label',
      'labelAlign',
      'labelPosition',
      'necessityIndicator',
      'validationState'
    ]);
    expect(args.label).toBe('Search');
    expect(args.isQuiet).toBe(false);
    expect(args.isDisabled).toBe(false);
    expect(args.isReadOnly).toBe(false);
    expect(args.isRequired).toBe(false);
    expect(args.necessityIndicator).toBe('icon');
    expect(args.labelPosition).toBe('top');
    expect(args.labelAlign).toBe('start');
    expect(args.validationState).toBeUndefined();

    expect(Object.keys(argTypes).sort()).toEqual([
      'labelAlign',
      'labelPosition',
      'necessityIndicator',
      'validationState'
    ]);
    expect((argTypes.labelPosition.control as {type?: string}).type).toBe('radio');
    expect((argTypes.labelPosition.control as {options?: unknown[]}).options).toEqual(['top', 'side']);
    expect((argTypes.necessityIndicator.control as {type?: string}).type).toBe('radio');
    expect((argTypes.necessityIndicator.control as {options?: unknown[]}).options).toEqual(['icon', 'label']);
    expect((argTypes.labelAlign.control as {type?: string}).type).toBe('radio');
    expect((argTypes.labelAlign.control as {options?: unknown[]}).options).toEqual(['start', 'end']);
    expect((argTypes.validationState.control as {type?: string}).type).toBe('radio');
    expect((argTypes.validationState.control as {options?: unknown[]}).options).toEqual([null, 'valid', 'invalid']);
  });

  it('matches top-level RadioGroup controls contract with React stories', () => {
    let args = (radioGroupMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (radioGroupMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual([
      'isDisabled',
      'isEmphasized',
      'isInvalid',
      'isReadOnly',
      'isRequired',
      'label',
      'labelAlign',
      'labelPosition',
      'necessityIndicator'
    ]);
    expect(args.label).toBe('Favorite pet');
    expect(args.isEmphasized).toBe(false);
    expect(args.isDisabled).toBe(false);
    expect(args.isReadOnly).toBe(false);
    expect(args.isRequired).toBe(false);
    expect(args.necessityIndicator).toBe('icon');
    expect(args.labelPosition).toBe('top');
    expect(args.labelAlign).toBe('start');
    expect(args.isInvalid).toBe(false);

    expect(Object.keys(argTypes).sort()).toEqual([
      'labelAlign',
      'labelPosition',
      'necessityIndicator',
      'orientation'
    ]);
    expect((argTypes.labelPosition.control as string)).toBe('radio');
    expect((argTypes.labelPosition.options as unknown[])).toEqual(['top', 'side']);
    expect((argTypes.necessityIndicator.control as string)).toBe('radio');
    expect((argTypes.necessityIndicator.options as unknown[])).toEqual(['icon', 'label']);
    expect((argTypes.labelAlign.control as string)).toBe('radio');
    expect((argTypes.labelAlign.options as unknown[])).toEqual(['start', 'end']);
    expect((argTypes.orientation.control as string)).toBe('radio');
    expect((argTypes.orientation.options as unknown[])).toEqual(['horizontal', 'vertical']);
  });

  it('matches top-level TextField controls contract with React stories', () => {
    let args = (textFieldMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (textFieldMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual([
      'isDisabled',
      'isQuiet',
      'isReadOnly',
      'isRequired',
      'label',
      'labelAlign',
      'labelPosition',
      'necessityIndicator',
      'validationState'
    ]);
    expect(args.label).toBe('Street address');
    expect(args.isQuiet).toBe(false);
    expect(args.isDisabled).toBe(false);
    expect(args.isReadOnly).toBe(false);
    expect(args.isRequired).toBe(false);
    expect(args.necessityIndicator).toBe('icon');
    expect(args.labelPosition).toBe('top');
    expect(args.labelAlign).toBe('start');
    expect(args.validationState).toBeUndefined();

    expect(Object.keys(argTypes).sort()).toEqual([
      'labelAlign',
      'labelPosition',
      'necessityIndicator',
      'validationState'
    ]);
    expect((argTypes.labelPosition.control as {type?: string}).type).toBe('radio');
    expect((argTypes.labelPosition.control as {options?: unknown[]}).options).toEqual(['top', 'side']);
    expect((argTypes.necessityIndicator.control as {type?: string}).type).toBe('radio');
    expect((argTypes.necessityIndicator.control as {options?: unknown[]}).options).toEqual(['icon', 'label']);
    expect((argTypes.labelAlign.control as {type?: string}).type).toBe('radio');
    expect((argTypes.labelAlign.control as {options?: unknown[]}).options).toEqual(['start', 'end']);
    expect((argTypes.validationState.control as {type?: string}).type).toBe('radio');
    expect((argTypes.validationState.options as unknown[])).toEqual([null, 'valid', 'invalid']);
  });

  it('matches top-level TextArea controls contract with React stories', () => {
    let args = (textAreaMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (textAreaMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual([
      'isDisabled',
      'isQuiet',
      'isReadOnly',
      'isRequired',
      'label',
      'labelAlign',
      'labelPosition',
      'necessityIndicator',
      'validationState'
    ]);
    expect(args.label).toBe('Comments');
    expect(args.isQuiet).toBe(false);
    expect(args.isDisabled).toBe(false);
    expect(args.isReadOnly).toBe(false);
    expect(args.isRequired).toBe(false);
    expect(args.necessityIndicator).toBe('icon');
    expect(args.labelPosition).toBe('top');
    expect(args.labelAlign).toBe('start');
    expect(args.validationState).toBeUndefined();

    expect(Object.keys(argTypes).sort()).toEqual([
      'labelAlign',
      'labelPosition',
      'necessityIndicator',
      'validationState'
    ]);
    expect((argTypes.labelPosition.control as {type?: string}).type).toBe('radio');
    expect((argTypes.labelPosition.control as {options?: unknown[]}).options).toEqual(['top', 'side']);
    expect((argTypes.necessityIndicator.control as {type?: string}).type).toBe('radio');
    expect((argTypes.necessityIndicator.control as {options?: unknown[]}).options).toEqual(['icon', 'label']);
    expect((argTypes.labelAlign.control as {type?: string}).type).toBe('radio');
    expect((argTypes.labelAlign.control as {options?: unknown[]}).options).toEqual(['start', 'end']);
    expect((argTypes.validationState.control as {type?: string}).type).toBe('radio');
    expect((argTypes.validationState.options as unknown[])).toEqual([null, 'valid', 'invalid']);
  });

  it('matches top-level Slider controls contract with React stories', () => {
    let args = (sliderMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (sliderMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual(['isDisabled', 'label', 'labelPosition']);
    expect(args.label).toBe('Label');
    expect(args.isDisabled).toBe(false);
    expect(args.labelPosition).toBe('top');

    expect(Object.keys(argTypes)).toEqual(['labelPosition']);
    expect((argTypes.labelPosition.control as {type?: string}).type).toBe('radio');
    expect((argTypes.labelPosition.control as {options?: unknown[]}).options).toEqual(['top', 'side']);
  });

  it('matches top-level RangeSlider controls contract with React stories', () => {
    let args = (rangeSliderMeta as {args?: Record<string, unknown>}).args ?? {};
    let argTypes = (rangeSliderMeta as {argTypes?: Record<string, Record<string, unknown>>}).argTypes ?? {};

    expect(Object.keys(args).sort()).toEqual(['isDisabled', 'label', 'labelPosition']);
    expect(args.label).toBe('Label');
    expect(args.isDisabled).toBe(false);
    expect(args.labelPosition).toBe('top');

    expect(Object.keys(argTypes)).toEqual(['labelPosition']);
    expect((argTypes.labelPosition.control as {type?: string}).type).toBe('radio');
    expect((argTypes.labelPosition.control as {options?: unknown[]}).options).toEqual(['top', 'side']);
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
