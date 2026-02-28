import {computed, type ComputedRef, ref, type Ref, unref, watch} from 'vue';

type MaybeRef<T> = T | ComputedRef<T> | Ref<T>;

export interface ValidityStateLike {
  badInput: boolean,
  customError: boolean,
  patternMismatch: boolean,
  rangeOverflow: boolean,
  rangeUnderflow: boolean,
  stepMismatch: boolean,
  tooLong: boolean,
  tooShort: boolean,
  typeMismatch: boolean,
  valid: boolean,
  valueMissing: boolean
}

export interface ValidationResult {
  isInvalid: boolean,
  validationDetails: ValidityStateLike,
  validationErrors: string[]
}

export type ValidationErrors = Record<string, string | string[] | undefined>;

export const VALID_VALIDITY_STATE: ValidityStateLike = {
  badInput: false,
  customError: false,
  patternMismatch: false,
  rangeOverflow: false,
  rangeUnderflow: false,
  stepMismatch: false,
  tooLong: false,
  tooShort: false,
  typeMismatch: false,
  valueMissing: false,
  valid: true
};

const CUSTOM_VALIDITY_STATE: ValidityStateLike = {
  ...VALID_VALIDITY_STATE,
  customError: true,
  valid: false
};

export const DEFAULT_VALIDATION_RESULT: ValidationResult = {
  isInvalid: false,
  validationDetails: VALID_VALIDITY_STATE,
  validationErrors: []
};

export const FormValidationContext = Symbol('VueFormValidationContext');

export const privateValidationStateProp: string = '__formValidationState' + Date.now();

export interface FormValidationProps<T> {
  builtinValidation?: ValidationResult,
  isInvalid?: MaybeRef<boolean>,
  name?: MaybeRef<string | string[] | undefined>,
  validate?: (value: T) => boolean | null | string | string[] | undefined,
  validationBehavior?: MaybeRef<'aria' | 'native'>,
  validationErrors?: MaybeRef<ValidationErrors>,
  value: MaybeRef<T | null>
}

export interface FormValidationState {
  displayValidation: ComputedRef<ValidationResult>,
  realtimeValidation: ComputedRef<ValidationResult>,
  commitValidation: () => void,
  resetValidation: () => void,
  updateValidation: (result: ValidationResult) => void
}

function asArray<T>(value: T | T[] | null | undefined): T[] {
  if (value == null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function getValidationResult(errors: string[]): ValidationResult | null {
  if (errors.length === 0) {
    return null;
  }

  return {
    isInvalid: true,
    validationErrors: errors,
    validationDetails: CUSTOM_VALIDITY_STATE
  };
}

function isEqualValidation(a: ValidationResult, b: ValidationResult): boolean {
  if (a.isInvalid !== b.isInvalid) {
    return false;
  }

  if (a.validationErrors.length !== b.validationErrors.length) {
    return false;
  }

  for (let i = 0; i < a.validationErrors.length; i++) {
    if (a.validationErrors[i] !== b.validationErrors[i]) {
      return false;
    }
  }

  return Object.keys(a.validationDetails).every((key) => {
    return a.validationDetails[key as keyof ValidityStateLike] === b.validationDetails[key as keyof ValidityStateLike];
  });
}

/**
 * Manages realtime and committed validation state for form controls.
 */
export function useFormValidationState<T>(props: FormValidationProps<T>): FormValidationState {
  let behavior = computed(() => unref(props.validationBehavior) ?? 'aria');

  let currentValidity = ref<ValidationResult>(DEFAULT_VALIDATION_RESULT);
  let nextValidation = ref<ValidationResult>(DEFAULT_VALIDATION_RESULT);
  let lastServerErrors = ref<ValidationErrors | undefined>(undefined);
  let isServerErrorCleared = ref(false);

  let controlledError = computed<ValidationResult | null>(() => {
    let isInvalid = props.isInvalid == null ? undefined : Boolean(unref(props.isInvalid));
    if (isInvalid === undefined) {
      return null;
    }

    return {
      isInvalid,
      validationErrors: [],
      validationDetails: isInvalid ? CUSTOM_VALIDITY_STATE : VALID_VALIDITY_STATE
    };
  });

  let clientError = computed<ValidationResult | null>(() => {
    if (!props.validate) {
      return null;
    }

    let value = unref(props.value);
    if (value == null) {
      return null;
    }

    let validationResult = props.validate(value);
    if (typeof validationResult === 'boolean' || validationResult == null) {
      return validationResult ? null : null;
    }

    return getValidationResult(asArray(validationResult));
  });

  let serverError = computed<ValidationResult | null>(() => {
    let errors = unref(props.validationErrors);
    let name = unref(props.name);
    if (!errors || !name) {
      return null;
    }

    let names = Array.isArray(name) ? name : [name];
    let messages = isServerErrorCleared.value
      ? []
      : names.flatMap((name) => asArray(errors[name]));
    return getValidationResult(messages.map((message) => String(message)));
  });

  let builtinValidation = computed<ValidationResult | null>(() => {
    if (!props.builtinValidation || props.builtinValidation.validationDetails.valid) {
      return null;
    }

    return props.builtinValidation;
  });

  let realtimeValidation = computed(() => {
    return controlledError.value
      ?? serverError.value
      ?? clientError.value
      ?? builtinValidation.value
      ?? currentValidity.value;
  });

  let displayValidation = computed(() => {
    if (behavior.value === 'native') {
      return controlledError.value
        ?? serverError.value
        ?? currentValidity.value;
    }

    return controlledError.value
      ?? serverError.value
      ?? clientError.value
      ?? builtinValidation.value
      ?? currentValidity.value;
  });

  let updateValidation = (result: ValidationResult): void => {
    if (behavior.value === 'aria') {
      if (!isEqualValidation(currentValidity.value, result)) {
        currentValidity.value = result;
      }
      return;
    }

    nextValidation.value = result;
  };

  let commitValidation = (): void => {
    if (behavior.value === 'native') {
      let next = clientError.value ?? builtinValidation.value ?? nextValidation.value;
      if (next && !isEqualValidation(currentValidity.value, next)) {
        currentValidity.value = next;
      }
    }

    isServerErrorCleared.value = true;
  };

  let resetValidation = (): void => {
    currentValidity.value = DEFAULT_VALIDATION_RESULT;
    if (behavior.value === 'native') {
      nextValidation.value = DEFAULT_VALIDATION_RESULT;
    }

    isServerErrorCleared.value = true;
  };

  watch(
    () => unref(props.validationErrors),
    (nextServerErrors) => {
      if (nextServerErrors !== lastServerErrors.value) {
        lastServerErrors.value = nextServerErrors ?? undefined;
        isServerErrorCleared.value = false;
      }
    },
    {immediate: true}
  );

  return {
    realtimeValidation,
    displayValidation,
    updateValidation,
    resetValidation,
    commitValidation
  };
}

export function mergeValidation(...results: ValidationResult[]): ValidationResult {
  let errors = new Set<string>();
  let isInvalid = false;
  let validationDetails: ValidityStateLike = {
    ...VALID_VALIDITY_STATE
  };

  for (let result of results) {
    for (let error of result.validationErrors) {
      errors.add(error);
    }

    isInvalid ||= result.isInvalid;
    for (let key in validationDetails) {
      validationDetails[key as keyof ValidityStateLike] ||= result.validationDetails[key as keyof ValidityStateLike];
    }
  }

  validationDetails.valid = !isInvalid;

  return {
    isInvalid,
    validationErrors: [...errors],
    validationDetails
  };
}
