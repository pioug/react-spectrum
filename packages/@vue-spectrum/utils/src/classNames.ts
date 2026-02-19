export interface ClassNameRecord {
  [className: string]: boolean | null | undefined
}

export type ClassNameValue = ClassNameRecord | ClassNameValue[] | number | string | false | null | undefined;

function appendClassNames(bucket: string[], value: ClassNameValue): void {
  if (!value && value !== 0) {
    return;
  }

  if (Array.isArray(value)) {
    for (let nestedValue of value) {
      appendClassNames(bucket, nestedValue);
    }
    return;
  }

  if (typeof value === 'object') {
    for (let [className, enabled] of Object.entries(value)) {
      if (enabled) {
        bucket.push(className);
      }
    }
    return;
  }

  bucket.push(String(value));
}

export function classNames(...values: ClassNameValue[]): string {
  let bucket: string[] = [];

  for (let value of values) {
    appendClassNames(bucket, value);
  }

  return bucket.join(' ');
}

export function shouldKeepSpectrumClassNames(className: string): boolean {
  return className.startsWith('spectrum-');
}

export function keepSpectrumClassNames(className: string | undefined): string {
  if (!className) {
    return '';
  }

  return className
    .split(/\s+/)
    .filter((entry) => entry.length > 0)
    .filter((entry) => shouldKeepSpectrumClassNames(entry))
    .join(' ');
}
