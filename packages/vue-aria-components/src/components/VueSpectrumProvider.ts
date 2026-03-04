import {computed, defineComponent, h, type PropType, provide} from '@vue/runtime-core';
import {isRtlLocale} from '../utils';
import {spectrumContextKey, type SpectrumContextValue} from '../context';

interface SpectrumThemeSectionLike {
  className?: string,
  express?: string
}

interface SpectrumThemeLike {
  dark?: SpectrumThemeSectionLike,
  global?: SpectrumThemeSectionLike,
  large?: SpectrumThemeSectionLike,
  light?: SpectrumThemeSectionLike,
  medium?: SpectrumThemeSectionLike
}

type ThemeVariant = 'dark' | 'default' | 'express' | 'light';

function resolveThemeVariant(theme: SpectrumThemeLike | undefined): ThemeVariant {
  if (!theme) {
    return 'default';
  }

  if (theme.global?.express) {
    return 'express';
  }

  let lightClassName = theme.light?.className ?? '';
  if (lightClassName.includes('spectrum--dark')) {
    return 'dark';
  }

  if (lightClassName.includes('spectrum--lightest')) {
    return 'light';
  }

  return 'default';
}

function resolveThemeClasses(theme: SpectrumThemeLike | undefined, colorScheme: SpectrumContextValue['colorScheme'], scale: SpectrumContextValue['scale']): string[] {
  if (!theme) {
    return [];
  }

  let classes = new Set<string>();
  let global = theme.global;
  let scheme = colorScheme === 'dark' ? theme.dark : theme.light;
  let scaleSection = scale === 'large' ? theme.large : theme.medium;

  if (global?.className) {
    classes.add(global.className);
  }

  if (global?.express) {
    classes.add(global.express);
  }

  if (scheme?.className) {
    classes.add(scheme.className);
  }

  if (scaleSection?.className) {
    classes.add(scaleSection.className);
  }

  if (scaleSection?.express) {
    classes.add(scaleSection.express);
  }

  return [...classes];
}

export const VueSpectrumProvider = defineComponent({
  name: 'VueSpectrumProvider',
  props: {
    scale: {
      type: String as PropType<SpectrumContextValue['scale']>,
      default: 'medium'
    },
    colorScheme: {
      type: String as PropType<SpectrumContextValue['colorScheme']>,
      default: 'light'
    },
    locale: {
      type: String,
      default: 'en-US'
    },
    dir: {
      type: String as PropType<SpectrumContextValue['dir'] | undefined>,
      default: undefined
    },
    theme: {
      type: Object as PropType<SpectrumThemeLike | undefined>,
      default: undefined
    }
  },
  setup(props, {slots, attrs}) {
    let direction = computed(() => props.dir ?? (isRtlLocale(props.locale) ? 'rtl' : 'ltr'));
    let themeVariant = computed(() => resolveThemeVariant(props.theme));
    let themeClasses = computed(() => resolveThemeClasses(props.theme, props.colorScheme, props.scale));

    let context = computed<SpectrumContextValue>(() => ({
      scale: props.scale,
      colorScheme: props.colorScheme,
      locale: props.locale,
      dir: direction.value
    }));

    provide(spectrumContextKey, context);

    return function render() {
      return h('div', {
        ...attrs,
        class: ['vs-provider', 'spectrum', 'i18nFontFamily', ...themeClasses.value, attrs.class],
        lang: props.locale,
        dir: direction.value,
        'data-vac': '',
        'data-scale': props.scale,
        'data-color-scheme': props.colorScheme,
        'data-theme': themeVariant.value
      }, slots.default ? slots.default() : []);
    };
  }
});
