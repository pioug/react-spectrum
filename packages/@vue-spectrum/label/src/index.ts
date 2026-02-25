import '@adobe/spectrum-css-temp/components/fieldlabel/vars.css';
import '@adobe/spectrum-css-temp/components/helptext/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType} from 'vue';
const fieldLabelStyles: {[key: string]: string} = {};
const helpTextStyles: {[key: string]: string} = {};


type LabelAlign = 'end' | 'start' | null;
type LabelPosition = 'side' | 'top';
type NecessityIndicator = 'icon' | 'label' | null;
let fieldId = 0;

export const Label = defineComponent({
  name: 'VueLabel',
  inheritAttrs: false,
  props: {
    elementType: {
      type: String,
      default: 'label'
    },
    for: {
      type: String,
      default: undefined
    },
    forId: {
      type: String,
      default: ''
    },
    htmlFor: {
      type: String,
      default: undefined
    },
    includeNecessityIndicatorInAccessibilityName: {
      type: Boolean,
      default: false
    },
    isRequired: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    labelAlign: {
      type: String as PropType<LabelAlign>,
      default: null
    },
    labelPosition: {
      type: String as PropType<LabelPosition>,
      default: 'top'
    },
    necessityIndicator: {
      type: String as PropType<NecessityIndicator>,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    width: {
      type: String as PropType<string | undefined>,
      default: undefined
    }
  },
  setup(props, {slots, attrs}) {
    let resolvedIsRequired = computed(() => props.isRequired ?? props.required);
    let resolvedNecessityIndicator = computed<NecessityIndicator>(() => {
      if (props.necessityIndicator !== null) {
        return props.necessityIndicator;
      }

      return resolvedIsRequired.value ? 'icon' : null;
    });

    let className = computed(() => classNames(
      fieldLabelStyles,
      'spectrum-FieldLabel',
      {
        'spectrum-FieldLabel--positionSide': props.labelPosition === 'side',
        'spectrum-FieldLabel--alignEnd': props.labelAlign === 'end'
      }
    ));

    return () => {
      let tag = props.elementType || 'label';
      let htmlFor = props.for || props.htmlFor || props.forId || undefined;
      let necessityLabel = resolvedIsRequired.value ? '(required)' : '(optional)';
      let showNecessityLabel = resolvedNecessityIndicator.value === 'label';
      let showNecessityIcon = resolvedNecessityIndicator.value === 'icon' && resolvedIsRequired.value;

      return h(tag, {
        ...attrs,
        class: [className.value, 'vs-label', resolvedIsRequired.value ? 'is-required' : null, attrs.class],
        for: tag === 'label' ? htmlFor : undefined,
        style: [{width: props.width}, attrs.style],
        'data-vac': ''
      }, [
        slots.default ? slots.default() : 'Label',
        h('span', {
          class: 'vs-label__necessity-label',
          hidden: !showNecessityLabel,
          'aria-hidden': (!props.includeNecessityIndicatorInAccessibilityName && resolvedIsRequired.value) ? 'true' : undefined
        }, necessityLabel),
        h('span', {
          class: [classNames(fieldLabelStyles, 'spectrum-FieldLabel-requiredIcon'), 'vs-label__required'],
          hidden: !showNecessityIcon,
          'aria-hidden': showNecessityIcon ? 'true' : undefined
        }, '*')
      ]);
    };
  }
});

export const VueLabel = Label;

export const HelpText = defineComponent({
  name: 'VueHelpText',
  inheritAttrs: false,
  props: {
    description: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    errorMessage: {
      type: [String, Number, Object, Function, Array] as PropType<unknown>,
      default: undefined
    },
    validationState: {
      type: String as PropType<'valid' | 'invalid' | undefined>,
      default: undefined
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {attrs}) {
    return () => {
      let isErrorMessage = props.isInvalid || props.validationState === 'invalid';
      let content = isErrorMessage ? props.errorMessage : props.description;

      if (content == null || content === '') {
        return null;
      }

      return h('div', {
        ...attrs,
        class: [classNames(
          helpTextStyles,
          'spectrum-HelpText',
          `spectrum-HelpText--${isErrorMessage ? 'negative' : 'neutral'}`,
          {
            'is-disabled': props.isDisabled
          }
        ), 'vs-help-text', isErrorMessage ? 'is-invalid' : null, attrs.class],
        'data-vac': ''
      }, [
        isErrorMessage
          ? h('span', {
            class: classNames(helpTextStyles, 'spectrum-HelpText-validationIcon'),
            'aria-hidden': 'true'
          }, '!')
          : null,
        h('div', {
          class: classNames(helpTextStyles, 'spectrum-HelpText-text')
        }, content as never)
      ]);
    };
  }
});

export const Field = defineComponent({
  name: 'VueField',
  inheritAttrs: false,
  props: {
    label: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    description: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    errorMessage: {
      type: [String, Number, Object, Function, Array] as PropType<unknown>,
      default: undefined
    },
    validationState: {
      type: String as PropType<'valid' | 'invalid' | undefined>,
      default: undefined
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {attrs, slots}) {
    let generatedId = `vs-field-${++fieldId}`;
    let labelId = computed(() => props.label ? `${generatedId}-label` : undefined);
    let helpTextId = computed(() => (props.description || props.errorMessage) ? `${generatedId}-helptext` : undefined);

    return () => h('div', {
      ...attrs,
      class: [classNames(
        fieldLabelStyles,
        'spectrum-Field',
        {
          'spectrum-Field--positionTop': true
        }
      ), 'vs-field', attrs.class],
      'aria-labelledby': labelId.value,
      'data-vac': ''
    }, [
      props.label
        ? h(Label, {
          id: labelId.value,
          'data-vac': ''
        }, () => props.label)
        : null,
      slots.default ? slots.default() : null,
      h(HelpText, {
        id: helpTextId.value,
        description: props.description,
        errorMessage: props.errorMessage,
        validationState: props.validationState,
        isInvalid: props.isInvalid,
        isDisabled: props.isDisabled
      })
    ]);
  }
});
