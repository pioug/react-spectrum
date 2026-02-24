import '@adobe/spectrum-css-temp/components/page/vars.css';
import '@adobe/spectrum-css-temp/components/typography/index.css';
import {theme as defaultTheme} from '@vue-spectrum/theme-default';
import type {
  Breakpoints,
  ProviderContext as ReactProviderContext,
  ProviderProps as ReactProviderProps
} from '@vue-types/provider';
import {computed, type ComputedRef, defineComponent, h, inject, type InjectionKey, type PropType, provide} from 'vue';
import {type SpectrumContextValue, VueSpectrumProvider} from 'vue-aria-components';

type ThemeSectionLike = {
  className?: string,
  express?: string
};

type ThemeLike = {
  dark?: ThemeSectionLike,
  global?: ThemeSectionLike,
  large?: ThemeSectionLike,
  light?: ThemeSectionLike,
  medium?: ThemeSectionLike
};

type ProviderContextCompat = Omit<ReactProviderContext, 'theme'> & {
  theme: ThemeLike,
  locale: string,
  dir: SpectrumContextValue['dir']
};

type ProviderPropsCompat = Omit<ReactProviderProps, 'children' | 'theme'> & {
  theme?: ThemeLike
};

const defaultProviderContext: ProviderContextCompat = {
  version: '0.1.0',
  theme: defaultTheme as unknown as ThemeLike,
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
      type: Object as PropType<ProviderPropsCompat['theme']>,
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
        theme: props.theme ?? parent.theme ?? (defaultTheme as unknown as ThemeLike),
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

export type {
  ProviderContextCompat as ProviderContext,
  ProviderPropsCompat as ProviderProps,
  SpectrumContextValue
};
