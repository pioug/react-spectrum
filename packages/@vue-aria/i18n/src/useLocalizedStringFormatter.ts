import {useLocale} from './context';

export type LocalizedString = string | ((variables?: {[key: string]: unknown}) => string);
export type LocalizedStrings<K extends string = string, T extends LocalizedString = string> = {
  [locale: string]: {
    [key in K]?: T
  }
};

function interpolate(message: string, variables: {[key: string]: unknown} = {}): string {
  return message.replace(/\{([^}]+)\}/g, (_, key) => String(variables[key] ?? ''));
}

function resolveDictionary<K extends string, T extends LocalizedString>(
  strings: LocalizedStrings<K, T>,
  locale: string
): Record<string, T | undefined> {
  let exact = strings[locale];
  if (exact) {
    return exact;
  }

  let language = locale.split('-')[0];
  let byLanguage = Object.entries(strings).find(([candidateLocale]) => candidateLocale.split('-')[0] === language);
  if (byLanguage) {
    return byLanguage[1] as Record<string, T | undefined>;
  }

  return (strings['en-US'] as Record<string, T | undefined>) ?? (Object.values(strings)[0] as Record<string, T | undefined>) ?? {};
}

export class LocalizedStringDictionary<K extends string = string, T extends LocalizedString = string> {
  private strings: LocalizedStrings<K, T>;

  constructor(strings: LocalizedStrings<K, T>) {
    this.strings = strings;
  }

  getStringsForLocale(locale: string): Record<string, T | undefined> {
    return resolveDictionary(this.strings, locale);
  }
}

export class LocalizedStringFormatter<K extends string = string, T extends LocalizedString = string> {
  private locale: string;
  private dictionary: LocalizedStringDictionary<K, T>;

  constructor(locale: string, dictionary: LocalizedStringDictionary<K, T>) {
    this.locale = locale;
    this.dictionary = dictionary;
  }

  format(key: K, variables?: {[key: string]: unknown}): string {
    let value = this.dictionary.getStringsForLocale(this.locale)[key];
    if (typeof value === 'function') {
      return value(variables);
    }

    if (typeof value === 'string') {
      return interpolate(value, variables);
    }

    return key;
  }
}

export function useLocalizedStringDictionary<K extends string = string, T extends LocalizedString = string>(
  strings: LocalizedStrings<K, T>,
  packageName?: string
): LocalizedStringDictionary<K, T> {
  void packageName;
  return new LocalizedStringDictionary(strings);
}

export function useLocalizedStringFormatter<K extends string = string, T extends LocalizedString = string>(
  strings: LocalizedStrings<K, T>,
  packageName?: string
): LocalizedStringFormatter<K, T> {
  let {locale} = useLocale();
  let dictionary = useLocalizedStringDictionary(strings, packageName);
  return new LocalizedStringFormatter(locale, dictionary);
}
