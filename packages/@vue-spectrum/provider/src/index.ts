import {VueSpectrumProvider, type SpectrumContextValue} from '@vue-spectrum/components';
import {computed, defineComponent, h, inject, provide, type ComputedRef, type InjectionKey, type PropType} from 'vue';
import type {Breakpoints, ProviderContext, ProviderProps, Theme} from '@react-types/provider';

type ProviderContextCompat = ProviderContext & {
  locale: string,
  dir: SpectrumContextValue['dir']
};

const defaultProviderContext: ProviderContextCompat = {
  version: '0.1.0',
  theme: {} as Theme,
  colorScheme: 'light',
  scale: 'medium',
  breakpoints: {} as Breakpoints,
  locale: 'en-US',
  dir: 'ltr'
};

const providerContextKey: InjectionKey<ComputedRef<ProviderContextCompat>> = Symbol('vue-spectrum-provider-context');

export const Provider = defineComponent({
  name: 'VueProvider',
  inheritAttrs: false,
  props: {
    theme: {
      type: Object as PropType<ProviderContextCompat['theme'] | undefined>,
      default: undefined
    },
    scale: {
      type: String as PropType<SpectrumContextValue['scale'] | undefined>,
      default: undefined
    },
    colorScheme: {
      type: String as PropType<SpectrumContextValue['colorScheme'] | undefined>,
      default: undefined
    },
    locale: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    dir: {
      type: String as PropType<SpectrumContextValue['dir'] | undefined>,
      default: undefined
    }
  },
  setup(props, {slots, attrs}) {
    let parentContext = inject(
      providerContextKey,
      computed(() => defaultProviderContext)
    );

    let context = computed<ProviderContextCompat>(() => {
      let parent = parentContext.value;
      let locale = props.locale ?? parent.locale;
      return {
        ...parent,
        theme: props.theme ?? parent.theme,
        colorScheme: props.colorScheme ?? parent.colorScheme,
        scale: props.scale ?? parent.scale,
        locale,
        dir: props.dir ?? parent.dir
      };
    });

    provide(providerContextKey, context);

    return () => h(VueSpectrumProvider, {
      ...attrs,
      theme: context.value.theme,
      scale: context.value.scale,
      colorScheme: context.value.colorScheme,
      locale: context.value.locale,
      dir: context.value.dir
    }, slots);
  }
});

export const VueProvider = Provider;

export function useProvider(): ProviderContextCompat {
  let context = inject(providerContextKey, null);
  return context?.value ?? defaultProviderContext;
}

export function useProviderProps<T>(props: T): T {
  let context = useProvider();
  return Object.assign({}, {
    isQuiet: context.isQuiet,
    isEmphasized: context.isEmphasized,
    isDisabled: context.isDisabled,
    isRequired: context.isRequired,
    isReadOnly: context.isReadOnly,
    validationState: context.validationState
  }, props);
}

export type {ProviderContext, ProviderProps, SpectrumContextValue};
