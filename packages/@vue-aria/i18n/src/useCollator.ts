import {useLocale} from './context';

let collatorCache = new Map<string, Intl.Collator>();

export function useCollator(options: Intl.CollatorOptions = {}): Intl.Collator {
  let {locale} = useLocale();
  let cacheKey = locale + Object.entries(options).sort((a, b) => a[0].localeCompare(b[0])).join('|');

  let cached = collatorCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  let collator = new Intl.Collator(locale, options);
  collatorCache.set(cacheKey, collator);
  return collator;
}
