import '@adobe/spectrum-css-temp/components/page/vars.css';
import '@adobe/spectrum-css-temp/components/typography/index.css';
import {theme as defaultTheme} from '@vue-spectrum/theme-default';
import type {
  Breakpoints,
  ProviderContext as ReactProviderContext,
  ProviderProps as ReactProviderProps
} from '@vue-types/provider';
import type {ValidationState} from '@vue-types/shared';
import {BreakpointProvider, useMatchedBreakpoints} from '@vue-spectrum/utils';
import {computed, type ComputedRef, defineComponent, getCurrentInstance, h, inject, type InjectionKey, nextTick, onBeforeUnmount, onMounted, type PropType, provide, ref, watch} from 'vue';
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

function supportsColorScheme(theme: ThemeLike | undefined, colorScheme: SpectrumContextValue['colorScheme']): boolean {
  if (!theme) {
    return false;
  }

  return colorScheme === 'dark'
    ? Boolean(theme.dark)
    : Boolean(theme.light);
}

function resolveAutoColorScheme(
  theme: ThemeLike | undefined,
  defaultColorScheme: SpectrumContextValue['colorScheme'],
  matchesDark: boolean,
  matchesLight: boolean
): SpectrumContextValue['colorScheme'] {
  // Keep parity with React Provider: OS preference > defaultColorScheme > available theme section.
  if (supportsColorScheme(theme, 'dark') && matchesDark) {
    return 'dark';
  }

  if (supportsColorScheme(theme, 'light') && matchesLight) {
    return 'light';
  }

  if (supportsColorScheme(theme, 'dark') && defaultColorScheme === 'dark') {
    return 'dark';
  }

  if (supportsColorScheme(theme, 'light') && defaultColorScheme === 'light') {
    return 'light';
  }

  if (!supportsColorScheme(theme, 'dark')) {
    return 'light';
  }

  if (!supportsColorScheme(theme, 'light')) {
    return 'dark';
  }

  return 'light';
}

function useMediaQueryMatch(query: string) {
  let matches = ref(false);
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return matches;
  }

  let mediaQueryList = window.matchMedia(query);
  let update = () => {
    matches.value = mediaQueryList.matches;
  };

  update();
  if (typeof mediaQueryList.addEventListener === 'function') {
    mediaQueryList.addEventListener('change', update);
    onBeforeUnmount(() => mediaQueryList.removeEventListener('change', update));
  } else {
    mediaQueryList.addListener?.(update);
    onBeforeUnmount(() => mediaQueryList.removeListener?.(update));
  }

  return matches;
}

function resolveHTMLElementRef(value: unknown): HTMLElement | null {
  if (value instanceof HTMLElement) {
    return value;
  }

  if (value && typeof value === 'object') {
    let element = (value as {$el?: unknown}).$el;
    if (element instanceof HTMLElement) {
      return element;
    }
  }

  return null;
}

const defaultProviderContext: ProviderContextCompat = {
  version: '0.1.0',
  theme: defaultTheme as unknown as ThemeLike,
  colorScheme: 'light',
  scale: 'medium',
  breakpoints: {
    S: 640,
    M: 768,
    L: 1024,
    XL: 1280,
    XXL: 1536
  },
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
    defaultColorScheme: {
      type: String as PropType<SpectrumContextValue['colorScheme'] | undefined>,
      default: undefined
    },
    locale: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    breakpoints: {
      type: Object as PropType<Breakpoints | undefined>,
      default: undefined
    },
    dir: {
      type: String as PropType<SpectrumContextValue['dir'] | undefined>,
      default: undefined
    },
    isQuiet: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isEmphasized: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isRequired: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isReadOnly: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    validationState: {
      type: String as PropType<ValidationState | undefined>,
      default: undefined
    }
  },
  setup(props, {slots, attrs}) {
    let instance = getCurrentInstance();
    let providerRoot = ref<HTMLElement | null>(null);
    let hasWarnedNestedDirection = ref(false);
    let inheritedContext = inject(providerContextKey, null);
    let hasParentProvider = inheritedContext !== null;

    let parentContext = computed(() => inheritedContext?.value ?? defaultProviderContext);
    let matchesDark = useMediaQueryMatch('(prefers-color-scheme: dark)');
    let matchesLight = useMediaQueryMatch('(prefers-color-scheme: light)');

    let context = computed<ProviderContextCompat>(() => {
      let parent = parentContext.value;
      let locale = props.locale ?? parent.locale;
      let resolvedTheme = props.theme ?? parent.theme ?? (defaultTheme as unknown as ThemeLike);
      let prevColorScheme = hasParentProvider ? parent.colorScheme : undefined;
      let usePrevColorScheme = prevColorScheme ? supportsColorScheme(resolvedTheme, prevColorScheme) : false;
      let autoColorScheme = resolveAutoColorScheme(
        resolvedTheme,
        props.defaultColorScheme ?? 'light',
        matchesDark.value,
        matchesLight.value
      );
      return {
        ...parent,
        theme: resolvedTheme,
        colorScheme: props.colorScheme ?? (usePrevColorScheme ? prevColorScheme : autoColorScheme),
        scale: props.scale ?? parent.scale,
        breakpoints: props.breakpoints ?? parent.breakpoints,
        locale,
        dir: props.dir ?? parent.dir,
        isQuiet: props.isQuiet ?? parent.isQuiet,
        isEmphasized: props.isEmphasized ?? parent.isEmphasized,
        isDisabled: props.isDisabled ?? parent.isDisabled,
        isRequired: props.isRequired ?? parent.isRequired,
        isReadOnly: props.isReadOnly ?? parent.isReadOnly,
        validationState: props.validationState ?? parent.validationState
      };
    });

    let shouldRenderWrapper = computed(() => {
      if (!hasParentProvider) {
        return true;
      }

      let parent = parentContext.value;
      let hasDomAttrs = Object.keys(attrs).length > 0;
      return (
        props.locale !== undefined ||
        props.dir !== undefined ||
        context.value.theme !== parent.theme ||
        context.value.scale !== parent.scale ||
        context.value.colorScheme !== parent.colorScheme ||
        context.value.locale !== parent.locale ||
        context.value.dir !== parent.dir ||
        hasDomAttrs
      );
    });

    let matchedBreakpoints = computed(() => useMatchedBreakpoints(context.value.breakpoints ?? defaultProviderContext.breakpoints));

    provide(providerContextKey, context);

    let warnOnNestedDirection = () => {
      if (hasWarnedNestedDirection.value || process.env.NODE_ENV === 'production') {
        return;
      }

      if (!shouldRenderWrapper.value) {
        return;
      }

      let root = providerRoot.value ?? resolveHTMLElementRef(instance?.proxy?.$el);
      if (!(root instanceof HTMLElement) || !context.value.dir) {
        return;
      }

      let closestDirection = root.parentElement?.closest('[dir]')?.getAttribute('dir');
      if (closestDirection && closestDirection !== context.value.dir) {
        console.warn(`Language directions cannot be nested. ${context.value.dir} inside ${closestDirection}.`);
        hasWarnedNestedDirection.value = true;
      }
    };

    onMounted(() => {
      nextTick().then(warnOnNestedDirection);
    });

    watch(() => context.value.dir, () => {
      nextTick().then(warnOnNestedDirection);
    });

    return () => {
      let content = !shouldRenderWrapper.value
        ? (slots.default ? slots.default() : [])
        : [
          h(VueSpectrumProvider, {
            ...attrs,
            ref: (value: unknown) => {
              providerRoot.value = resolveHTMLElementRef(value);
            },
            theme: context.value.theme,
            scale: context.value.scale,
            colorScheme: context.value.colorScheme,
            locale: context.value.locale,
            dir: context.value.dir,
            isQuiet: context.value.isQuiet,
            isEmphasized: context.value.isEmphasized,
            isDisabled: context.value.isDisabled,
            isRequired: context.value.isRequired,
            isReadOnly: context.value.isReadOnly,
            validationState: context.value.validationState
          }, slots)
        ];

      return h(BreakpointProvider, {
        matchedBreakpoints: matchedBreakpoints.value
      }, {
        default: () => content
      });
    };
  }
});

export const VueProvider = Provider;

export function useProvider(): ProviderContextCompat {
  let context = inject(providerContextKey, null);
  return context?.value ?? defaultProviderContext;
}

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

export function useProviderProps<T>(props: T): T {
  let instance = getCurrentInstance();
  let vnodeProps = (instance?.vnode.props ?? {}) as Record<string, unknown>;
  let providerContext = inject(providerContextKey, null);
  let providerPropNames = [
    'isQuiet',
    'isEmphasized',
    'isDisabled',
    'isRequired',
    'isReadOnly',
    'validationState'
  ] as const;

  let resolveValue = (key: PropertyKey) => {
    if (typeof key === 'string' && providerPropNames.includes(key as typeof providerPropNames[number])) {
      let kebabName = toKebabCase(key);
      let isProvided = Object.prototype.hasOwnProperty.call(vnodeProps, key) ||
        Object.prototype.hasOwnProperty.call(vnodeProps, kebabName);

      if (!isProvided) {
        return (providerContext?.value ?? defaultProviderContext)[key as keyof ProviderContextCompat];
      }
    }

    return (props as Record<PropertyKey, unknown>)[key];
  };

  return new Proxy(props as Record<PropertyKey, unknown>, {
    get(target, key, receiver) {
      let resolved = resolveValue(key);
      if (resolved !== undefined || !(key in target)) {
        return resolved;
      }

      return Reflect.get(target, key, receiver);
    },
    getOwnPropertyDescriptor(target, key) {
      let descriptor = Reflect.getOwnPropertyDescriptor(target, key);
      if (descriptor) {
        return descriptor;
      }

      if (typeof key === 'string' && providerPropNames.includes(key as typeof providerPropNames[number])) {
        return {
          configurable: true,
          enumerable: true,
          writable: true,
          value: resolveValue(key)
        };
      }

      return undefined;
    },
    ownKeys(target) {
      return Array.from(new Set([
        ...Reflect.ownKeys(target),
        ...providerPropNames
      ]));
    }
  }) as T;
}

export type {
  ProviderContextCompat as ProviderContext,
  ProviderPropsCompat as ProviderProps,
  SpectrumContextValue
};
