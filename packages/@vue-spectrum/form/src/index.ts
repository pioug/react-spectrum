import '@adobe/spectrum-css-temp/components/fieldlabel/vars.css';
import type {Alignment, LabelPosition, SpectrumLabelableProps} from '@vue-types/shared';
import {classNames, filterDOMProps} from '@vue-spectrum/utils';
import {computed, type ComputedRef, defineComponent, h, inject, type InjectionKey, type PropType, provide} from 'vue';
import type {SpectrumFormProps} from '@vue-types/form';
const styles: {[key: string]: string} = {};

type FormContextValue = Partial<Pick<SpectrumLabelableProps, 'labelAlign' | 'labelPosition' | 'necessityIndicator'>> & {
  validationBehavior?: 'aria' | 'native'
};

const formContextKey: InjectionKey<ComputedRef<FormContextValue>> = Symbol('vue-spectrum-form-context');
const formPropNames = new Set([
  'action',
  'autoComplete',
  'encType',
  'method',
  'target',
  'onSubmit',
  'onReset',
  'onInvalid'
]);

export function useFormProps<T extends SpectrumLabelableProps>(props: T): T {
  let context = inject(formContextKey, null);
  if (!context) {
    return props;
  }

  return Object.assign({}, context.value, props);
}

export const Form = defineComponent({
  name: 'VueSpectrumForm',
  inheritAttrs: false,
  props: {
    labelPosition: {
      type: String as PropType<LabelPosition | undefined>,
      default: undefined
    },
    labelAlign: {
      type: String as PropType<Alignment | undefined>,
      default: 'start'
    },
    necessityIndicator: {
      type: String as PropType<SpectrumLabelableProps['necessityIndicator'] | undefined>,
      default: undefined
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isEmphasized: {
      type: Boolean,
      default: false
    },
    isQuiet: {
      type: Boolean,
      default: false
    },
    isReadOnly: {
      type: Boolean,
      default: false
    },
    isRequired: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    validationState: {
      type: String as PropType<'invalid' | 'valid' | undefined>,
      default: undefined
    },
    validationBehavior: {
      type: String as PropType<'aria' | 'native' | undefined>,
      default: undefined
    },
    validationErrors: {
      type: Object as PropType<Record<string, string[] | string> | undefined>,
      default: undefined
    }
  },
  setup(props, {attrs, slots}) {
    let parentContext = inject(
      formContextKey,
      computed<FormContextValue>(() => ({}))
    );

    let context = computed<FormContextValue>(() => ({
      ...parentContext.value,
      labelPosition: props.labelPosition ?? parentContext.value.labelPosition,
      labelAlign: props.labelAlign ?? parentContext.value.labelAlign,
      necessityIndicator: props.necessityIndicator ?? parentContext.value.necessityIndicator,
      validationBehavior: props.validationBehavior ?? parentContext.value.validationBehavior
    }));

    provide(formContextKey, context);

    return () => {
      let domProps = filterDOMProps(attrs as Record<string, unknown>, {labelable: true, propNames: formPropNames}) as Record<string, unknown>;
      let {class: domClass, className: domClassName, style: domStyle, ...restDomProps} = domProps;

      return h('form', {
        ...restDomProps,
        class: [
          classNames(
            styles,
            'spectrum-Form',
            {
              'spectrum-Form--positionSide': props.labelPosition === 'side',
              'spectrum-Form--positionTop': props.labelPosition !== 'side'
            }
          ),
          domClassName,
          domClass
        ],
        style: domStyle,
        noValidate: props.validationBehavior !== 'native'
      }, slots.default ? slots.default() : []);
    };
  }
});

export const VueForm = Form;
export type {SpectrumFormProps};
