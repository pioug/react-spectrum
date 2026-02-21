export interface ClassNameRecord {
  [className: string]: boolean | null | undefined
}

type ClassMap = {[key: string]: string};
type ClassNameInput = string | ClassNameRecord | undefined;
export type ClassNameValue = ClassNameInput;

export let shouldKeepSpectrumClassNames = false;

export function keepSpectrumClassNames(): void {
  shouldKeepSpectrumClassNames = true;
}

function normalizeClassValue(
  cssModule: ClassMap,
  value: ClassNameInput
): Array<string | ClassNameRecord | undefined> {
  if (typeof value === 'string') {
    let mapped: string[] = [];
    if (cssModule[value]) {
      mapped.push(cssModule[value]);
    }
    if (shouldKeepSpectrumClassNames || !cssModule[value]) {
      mapped.push(value);
    }
    return mapped;
  }

  if (value && typeof value === 'object') {
    let mapped: ClassNameRecord = {};
    for (let key in value) {
      if (cssModule[key]) {
        mapped[cssModule[key]] = value[key];
      }
      if (shouldKeepSpectrumClassNames || !cssModule[key]) {
        mapped[key] = value[key];
      }
    }
    return [mapped];
  }

  return [value];
}

function stringifyClassValue(value: string | ClassNameRecord | undefined): string[] {
  if (typeof value === 'string') {
    return value.split(/\s+/).filter(Boolean);
  }

  if (value && typeof value === 'object') {
    let classes: string[] = [];
    for (let [key, enabled] of Object.entries(value)) {
      if (enabled) {
        classes.push(key);
      }
    }
    return classes;
  }

  return [];
}

export function classNames(cssModule: {[key: string]: string}, ...values: Array<string | Object | undefined>): string {
  let normalized: Array<string | ClassNameRecord | undefined> = [];
  for (let value of values) {
    normalized.push(...normalizeClassValue(cssModule, value as ClassNameInput));
  }

  return normalized
    .flatMap((value) => stringifyClassValue(value))
    .join(' ');
}
