import {useCollator} from './useCollator';

export interface Filter {
  contains: (string: string, substring: string) => boolean,
  endsWith: (string: string, substring: string) => boolean,
  startsWith: (string: string, substring: string) => boolean
}

export function useFilter(options: Intl.CollatorOptions = {}): Filter {
  let collator = useCollator({
    sensitivity: 'base',
    usage: 'search',
    ...options
  });

  let startsWith = (string: string, substring: string) => {
    if (substring.length === 0) {
      return true;
    }

    string = string.normalize('NFC');
    substring = substring.normalize('NFC');
    return collator.compare(string.slice(0, substring.length), substring) === 0;
  };

  let endsWith = (string: string, substring: string) => {
    if (substring.length === 0) {
      return true;
    }

    string = string.normalize('NFC');
    substring = substring.normalize('NFC');
    return collator.compare(string.slice(-substring.length), substring) === 0;
  };

  let contains = (string: string, substring: string) => {
    if (substring.length === 0) {
      return true;
    }

    string = string.normalize('NFC');
    substring = substring.normalize('NFC');

    let scan = 0;
    let sliceLen = substring.length;
    for (; scan + sliceLen <= string.length; scan++) {
      let slice = string.slice(scan, scan + sliceLen);
      if (collator.compare(substring, slice) === 0) {
        return true;
      }
    }

    return false;
  };

  return {
    contains,
    endsWith,
    startsWith
  };
}
