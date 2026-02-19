import {useLocale} from './context';

export function useListFormatter(options: Intl.ListFormatOptions = {}): Intl.ListFormat {
  let {locale} = useLocale();
  return new Intl.ListFormat(locale, options);
}
