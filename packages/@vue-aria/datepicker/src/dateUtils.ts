export function clampComparableValue(value: string, minValue?: string, maxValue?: string): string {
  let nextValue = value;

  if (minValue != null && nextValue < minValue) {
    nextValue = minValue;
  }

  if (maxValue != null && nextValue > maxValue) {
    nextValue = maxValue;
  }

  return nextValue;
}

export function isValueOutOfRange(value: string, minValue?: string, maxValue?: string): boolean {
  if (minValue != null && value < minValue) {
    return true;
  }

  if (maxValue != null && value > maxValue) {
    return true;
  }

  return false;
}
