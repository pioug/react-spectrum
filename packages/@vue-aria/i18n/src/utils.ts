const RTL_SCRIPTS = new Set(['Arab', 'Syrc', 'Samr', 'Mand', 'Thaa', 'Mend', 'Nkoo', 'Adlm', 'Rohg', 'Hebr']);
const RTL_LANGS = new Set(['ae', 'ar', 'arc', 'bcc', 'bqi', 'ckb', 'dv', 'fa', 'glk', 'he', 'ku', 'mzn', 'nqo', 'pnb', 'ps', 'sd', 'ug', 'ur', 'yi']);

export function isRTL(localeString: string): boolean {
  if (typeof Intl !== 'undefined' && typeof Intl.Locale !== 'undefined') {
    let locale = new Intl.Locale(localeString).maximize();
    // @ts-ignore
    let textInfo = typeof locale.getTextInfo === 'function' ? locale.getTextInfo() : locale.textInfo;
    if (textInfo) {
      return textInfo.direction === 'rtl';
    }

    if (locale.script) {
      return RTL_SCRIPTS.has(locale.script);
    }
  }

  let lang = localeString.split('-')[0];
  return RTL_LANGS.has(lang);
}
