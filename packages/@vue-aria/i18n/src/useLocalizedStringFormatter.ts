import {useLocale} from './context';

export type LocalizedString = string | ((variables?: {[key: string]: unknown}) => string);
export type LocalizedStringDictionary = {[key: string]: LocalizedString};
export type LocalizedStrings = {[locale: string]: LocalizedStringDictionary};

export interface LocalizedStringFormatter {
  format: (key: string, variables?: {[key: string]: unknown}) => string
}

function interpolate(message: string, variables: {[key: string]: unknown} = {}): string {
  return message.replace(/\{([^}]+)\}/g, (_, key) => String(variables[key] ?? ''));
}

function resolveDictionary(strings: LocalizedStrings, locale: string): LocalizedStringDictionary {
  let exact = strings[locale];
  if (exact) {
    return exact;
  }

  let language = locale.split('-')[0];
  let byLanguage = Object.entries(strings).find(([candidateLocale]) => candidateLocale.split('-')[0] === language);
  if (byLanguage) {
    return byLanguage[1];
  }

  return strings['en-US'] ?? Object.values(strings)[0] ?? {};
}

export function useLocalizedStringDictionary(
  strings: LocalizedStrings,
  packageName?: string
): LocalizedStringDictionary {
  void packageName;
  let {locale} = useLocale();
  return resolveDictionary(strings, locale);
}

export function useLocalizedStringFormatter(
  strings: LocalizedStrings,
  packageName?: string
): LocalizedStringFormatter {
  let dictionary = useLocalizedStringDictionary(strings, packageName);

  return {
    format: (key: string, variables?: {[key: string]: unknown}) => {
      let value = dictionary[key];
      if (typeof value === 'function') {
        return value(variables);
      }

      if (typeof value === 'string') {
        return interpolate(value, variables);
      }

      return key;
    }
  };
}
