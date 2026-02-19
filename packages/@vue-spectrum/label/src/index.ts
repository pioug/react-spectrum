import {VueLabel} from '@vue-spectrum/components';
import {defineComponent, h, type PropType} from 'vue';

export const Label = VueLabel;
export {VueLabel};

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
        class: [
          'vs-help-text',
          {
            'is-disabled': props.isDisabled,
            'is-invalid': isErrorMessage
          },
          attrs.class
        ],
        'data-vac': ''
      }, content as never);
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
    return () => h('div', {
      ...attrs,
      class: ['vs-field', attrs.class],
      'data-vac': ''
    }, [
      props.label
        ? h(Label, {'data-vac': ''}, () => props.label)
        : null,
      slots.default ? slots.default() : null,
      h(HelpText, {
        description: props.description,
        errorMessage: props.errorMessage,
        validationState: props.validationState,
        isInvalid: props.isInvalid,
        isDisabled: props.isDisabled
      })
    ]);
  }
});
