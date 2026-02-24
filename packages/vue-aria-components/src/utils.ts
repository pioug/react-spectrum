const RTL_LANGUAGES = new Set([
  'ar',
  'fa',
  'he',
  'ps',
  'ur',
  'yi'
]);

export function isRtlLocale(locale: string): boolean {
  let language = locale.toLowerCase().split('-')[0];
  return RTL_LANGUAGES.has(language);
}
