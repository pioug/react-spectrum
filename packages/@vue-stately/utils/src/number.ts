/**
 * Takes a value and forces it to the closest min/max if it's outside.
 */
export function clamp(value: number, min: number = -Infinity, max: number = Infinity): number {
  return Math.min(Math.max(value, min), max);
}

export function roundToStepPrecision(value: number, step: number): number {
  let roundedValue = value;
  let precision = 0;
  let stepString = step.toString();
  let exponentIndex = stepString.toLowerCase().indexOf('e-');

  if (exponentIndex > 0) {
    precision = Math.abs(Math.floor(Math.log10(Math.abs(step)))) + exponentIndex;
  } else {
    let pointIndex = stepString.indexOf('.');
    if (pointIndex >= 0) {
      precision = stepString.length - pointIndex;
    }
  }

  if (precision > 0) {
    let power = Math.pow(10, precision);
    roundedValue = Math.round(roundedValue * power) / power;
  }

  return roundedValue;
}

export function snapValueToStep(value: number, min: number | undefined, max: number | undefined, step: number): number {
  min = Number(min);
  max = Number(max);
  let remainder = ((value - (isNaN(min) ? 0 : min)) % step);
  let snappedValue = roundToStepPrecision(Math.abs(remainder) * 2 >= step
    ? value + Math.sign(remainder) * (step - Math.abs(remainder))
    : value - remainder, step);

  if (!isNaN(min)) {
    if (snappedValue < min) {
      snappedValue = min;
    } else if (!isNaN(max) && snappedValue > max) {
      snappedValue = min + Math.floor(roundToStepPrecision((max - min) / step, step)) * step;
    }
  } else if (!isNaN(max) && snappedValue > max) {
    snappedValue = Math.floor(roundToStepPrecision(max / step, step)) * step;
  }

  return roundToStepPrecision(snappedValue, step);
}

/**
 * Takes a value and rounds to a fixed number of digits.
 */
export function toFixedNumber(value: number, digits: number, base: number = 10): number {
  let power = Math.pow(base, digits);
  return Math.round(value * power) / power;
}
