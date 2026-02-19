export function clamp(value: number, minimum: number, maximum: number): number {
  if (!Number.isFinite(value)) {
    return minimum;
  }

  return Math.min(maximum, Math.max(minimum, value));
}

export function normalizeColorString(value: string): string {
  let trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    return '#000000';
  }

  if (trimmedValue.startsWith('#')) {
    return trimmedValue;
  }

  let hexPattern = /^[0-9a-fA-F]{3,8}$/;
  if (hexPattern.test(trimmedValue)) {
    return `#${trimmedValue}`;
  }

  return trimmedValue;
}

export function toPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}
