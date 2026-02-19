import {VueForm} from '@vue-spectrum/components';
import {computed, defineComponent, h, inject, provide, type ComputedRef, type InjectionKey, type PropType} from 'vue';
import type {SpectrumFormProps} from '@react-types/form';
import type {Alignment, LabelPosition, SpectrumLabelableProps} from '@react-types/shared';

type FormContextValue = Pick<SpectrumLabelableProps, 'labelAlign' | 'labelPosition' | 'necessityIndicator'> & {
  validationBehavior?: 'aria' | 'native'
};

const formContextKey: InjectionKey<ComputedRef<FormContextValue>> = Symbol('vue-spectrum-form-context');

export function useFormProps<T extends Record<string, unknown>>(props: T): T {
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
      default: undefined
    },
    necessityIndicator: {
      type: String as PropType<SpectrumLabelableProps['necessityIndicator'] | undefined>,
      default: undefined
    },
    validationBehavior: {
      type: String as PropType<'aria' | 'native' | undefined>,
      default: undefined
    }
  },
  setup(props, {attrs, slots}) {
    let parentContext = inject(
      formContextKey,
      computed(() => ({}))
    );

    let context = computed<FormContextValue>(() => ({
      ...parentContext.value,
      labelPosition: props.labelPosition ?? parentContext.value.labelPosition,
      labelAlign: props.labelAlign ?? parentContext.value.labelAlign,
      necessityIndicator: props.necessityIndicator ?? parentContext.value.necessityIndicator,
      validationBehavior: props.validationBehavior ?? parentContext.value.validationBehavior
    }));

    provide(formContextKey, context);

    return () => h(VueForm, {
      ...attrs
    }, slots);
  }
});

export {VueForm};
export type {SpectrumFormProps};
