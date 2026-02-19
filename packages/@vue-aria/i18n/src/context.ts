import {type Direction, type Locale, useDefaultLocale} from './useDefaultLocale';
import {isRTL} from './utils';

export interface I18nProviderProps {
  locale?: string
}

export interface I18nProviderAria {
  clear: () => void,
  locale: Locale,
  setLocale: (locale: string) => void
}

let providedLocale: string | null = null;

function toLocale(locale: string): Locale {
  let direction: Direction = isRTL(locale) ? 'rtl' : 'ltr';
  return {
    locale,
    direction
  };
}

export function I18nProvider(props: I18nProviderProps = {}): I18nProviderAria {
  if (props.locale) {
    providedLocale = props.locale;
  }

  let setLocale = (locale: string) => {
    providedLocale = locale;
  };

  let clear = () => {
    providedLocale = null;
  };

  return {
    clear,
    locale: useLocale(),
    setLocale
  };
}

export function useLocale(): Locale {
  let defaultLocale = useDefaultLocale();
  if (providedLocale) {
    return toLocale(providedLocale);
  }

  return defaultLocale;
}
