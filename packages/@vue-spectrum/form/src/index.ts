import '@adobe/spectrum-css-temp/components/fieldlabel/vars.css';
import {Provider, useProviderProps} from '@vue-spectrum/provider';
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
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isEmphasized: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isQuiet: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isReadOnly: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
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
    let providerProps = useProviderProps(props);
    let resolvedProps = computed(() => Object.assign({}, props, providerProps));
    let parentContext = inject(
      formContextKey,
      computed<FormContextValue>(() => ({}))
    );

    let context = computed<FormContextValue>(() => ({
      ...parentContext.value,
      labelPosition: resolvedProps.value.labelPosition ?? parentContext.value.labelPosition,
      labelAlign: resolvedProps.value.labelAlign ?? parentContext.value.labelAlign,
      necessityIndicator: resolvedProps.value.necessityIndicator ?? parentContext.value.necessityIndicator,
      validationBehavior: resolvedProps.value.validationBehavior ?? parentContext.value.validationBehavior
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
              'spectrum-Form--positionSide': resolvedProps.value.labelPosition === 'side',
              'spectrum-Form--positionTop': resolvedProps.value.labelPosition !== 'side'
            }
          ),
          domClassName,
          domClass
        ],
        style: domStyle,
        noValidate: resolvedProps.value.validationBehavior !== 'native'
      }, [
        h(Provider, {
          isQuiet: resolvedProps.value.isQuiet,
          isEmphasized: resolvedProps.value.isEmphasized,
          isDisabled: resolvedProps.value.isDisabled,
          isReadOnly: resolvedProps.value.isReadOnly,
          isRequired: resolvedProps.value.isRequired,
          validationState: resolvedProps.value.validationState
        }, {
          default: () => slots.default ? slots.default() : []
        })
      ]);
    };
  }
});

export const VueForm = Form;
export type {SpectrumFormProps};
