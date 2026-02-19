import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type ExampleThemeColorScheme = 'dark' | 'light' | 'system';

export const EXAMPLE_THEME_CLASS = 'vue-aria-example-theme';

export interface AriaExampleThemeOptions {
  colorScheme?: MaybeRef<ExampleThemeColorScheme>,
  rootClassName?: MaybeRef<string | undefined>
}

export interface ExampleThemeAria {
  colorScheme: ComputedRef<ExampleThemeColorScheme>,
  rootProps: ComputedRef<{
    class: string,
    'data-theme': ExampleThemeColorScheme
  }>
}

export function useExampleTheme(options: AriaExampleThemeOptions = {}): ExampleThemeAria {
  let colorScheme = computed<ExampleThemeColorScheme>(() => {
    let scheme = unref(options.colorScheme) ?? 'system';
    if (scheme === 'light' || scheme === 'dark') {
      return scheme;
    }

    return 'system';
  });

  let rootClassName = computed(() => {
    let customClassName = unref(options.rootClassName);
    if (!customClassName || customClassName.trim().length === 0) {
      return EXAMPLE_THEME_CLASS;
    }

    return `${EXAMPLE_THEME_CLASS} ${customClassName}`;
  });

  let rootProps = computed(() => ({
    class: rootClassName.value,
    'data-theme': colorScheme.value
  }));

  return {
    colorScheme,
    rootProps
  };
}
