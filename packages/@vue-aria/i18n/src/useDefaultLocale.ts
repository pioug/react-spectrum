import {isRTL} from './utils';

export type Direction = 'ltr' | 'rtl';

export interface Locale {
  direction: Direction,
  locale: string
}

const localeSymbol = Symbol.for('react-aria.i18n.locale');

export function getDefaultLocale(): Locale {
  let localeFromWindow = typeof window !== 'undefined'
    ? (window as unknown as {[key: symbol]: string | undefined})[localeSymbol]
    : undefined;
  let locale = localeFromWindow
    // @ts-ignore
    || (typeof navigator !== 'undefined' && (navigator.language || navigator.userLanguage))
    || 'en-US';

  try {
    Intl.DateTimeFormat.supportedLocalesOf([locale]);
  } catch {
    locale = 'en-US';
  }

  return {
    locale,
    direction: isRTL(locale) ? 'rtl' : 'ltr'
  };
}

let currentLocale = getDefaultLocale();
let hasLanguageChangeListener = false;

function updateLocale(): void {
  currentLocale = getDefaultLocale();
}

function ensureLanguageListener(): void {
  if (hasLanguageChangeListener || typeof window === 'undefined') {
    return;
  }

  hasLanguageChangeListener = true;
  window.addEventListener('languagechange', updateLocale);
}

export function useDefaultLocale(): Locale {
  ensureLanguageListener();
  return currentLocale;
}
