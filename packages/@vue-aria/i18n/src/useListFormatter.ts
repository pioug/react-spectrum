import {useLocale} from './context';

export interface ListFormat {
  format: (items: Iterable<string>) => string
}

export interface ListFormatOptions {
  localeMatcher?: 'best fit' | 'lookup',
  style?: 'long' | 'narrow' | 'short',
  type?: 'conjunction' | 'disjunction' | 'unit'
}

export function useListFormatter(options: ListFormatOptions = {}): ListFormat {
  let {locale} = useLocale();
  let ListFormatConstructor = (Intl as unknown as {ListFormat?: new (locale: string, options: ListFormatOptions) => ListFormat}).ListFormat;
  if (ListFormatConstructor) {
    return new ListFormatConstructor(locale, options);
  }

  return {
    format: (items: Iterable<string>) => Array.from(items).join(', ')
  };
}
