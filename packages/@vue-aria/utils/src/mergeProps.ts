import {chain} from './chain';

type PropRecord = Record<string, unknown>;
type TupleTypes<T extends unknown[]> = T[number];
type UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => void : never
) extends ((arg: infer I) => void) ? I : never;
type PropsArg = PropRecord | undefined;

function isEventHandler(key: string, value: unknown): value is (...args: unknown[]) => void {
  if (typeof value !== 'function') {
    return false;
  }

  return key.length > 2 && key.startsWith('on') && key[2] === key[2].toUpperCase();
}

function mergeClassNames(left: unknown, right: unknown): string | undefined {
  let leftValue = typeof left === 'string' ? left.trim() : '';
  let rightValue = typeof right === 'string' ? right.trim() : '';

  if (!leftValue && !rightValue) {
    return undefined;
  }

  if (!leftValue) {
    return rightValue;
  }

  if (!rightValue) {
    return leftValue;
  }

  return `${leftValue} ${rightValue}`;
}

function mergeStyles(left: unknown, right: unknown): Record<string, unknown> | undefined {
  let leftStyle = left && typeof left === 'object' ? left as Record<string, unknown> : {};
  let rightStyle = right && typeof right === 'object' ? right as Record<string, unknown> : {};
  let mergedStyle = {
    ...leftStyle,
    ...rightStyle
  };

  if (!Object.keys(mergedStyle).length) {
    return undefined;
  }

  return mergedStyle;
}

export function mergeProps<T extends PropsArg[]>(...args: T): UnionToIntersection<TupleTypes<T>> {
  let merged: PropRecord = {};

  for (let prop of args) {
    if (!prop) {
      continue;
    }

    for (let [key, value] of Object.entries(prop)) {
      let previousValue = merged[key];

      if (isEventHandler(key, previousValue) && isEventHandler(key, value)) {
        merged[key] = chain(previousValue, value);
        continue;
      }

      if (key === 'class' || key === 'className') {
        merged[key] = mergeClassNames(previousValue, value);
        continue;
      }

      if (key === 'style') {
        merged[key] = mergeStyles(previousValue, value);
        continue;
      }

      if (key === 'id' && typeof previousValue === 'string' && typeof value === 'string' && previousValue !== value) {
        merged[key] = `${previousValue} ${value}`;
        continue;
      }

      merged[key] = value;
    }
  }

  return merged as UnionToIntersection<TupleTypes<T>>;
}
