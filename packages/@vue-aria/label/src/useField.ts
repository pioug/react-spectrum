import {computed, type ComputedRef, type Ref, unref} from 'vue';
import {type FieldLabelDOMProps, type LabelAria, type LabelAriaProps, useLabel} from './useLabel';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaFieldProps extends LabelAriaProps {
  'aria-describedby'?: MaybeRef<string | undefined>,
  ariaDescribedby?: MaybeRef<string | undefined>,
  description?: MaybeRef<string | undefined>,
  errorMessage?: MaybeRef<string | undefined>,
  isInvalid?: MaybeRef<boolean>,
  validationState?: MaybeRef<'invalid' | 'valid' | undefined>
}

export interface FieldDOMProps extends FieldLabelDOMProps {
  'aria-describedby'?: string
}

export interface FieldAria extends LabelAria {
  descriptionProps: ComputedRef<{id: string}>,
  errorMessageProps: ComputedRef<{id: string}>,
  fieldProps: ComputedRef<FieldDOMProps>
}

let fieldDescriptionCounter = 0;

function createId(prefix: string): string {
  fieldDescriptionCounter += 1;
  return `${prefix}-${fieldDescriptionCounter}`;
}

function resolveOptionalValue(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

function joinIds(values: Array<string | undefined>): string | undefined {
  let ids = values.filter(Boolean) as string[];
  return ids.length > 0 ? ids.join(' ') : undefined;
}

export function useField(props: AriaFieldProps = {}): FieldAria {
  let {fieldProps: labelFieldProps, labelProps} = useLabel(props);
  let descriptionId = createId('vue-field-description');
  let errorMessageId = createId('vue-field-error');

  let fieldProps = computed<FieldDOMProps>(() => {
    let hasDescription = Boolean(resolveOptionalValue(props.description));
    let hasErrorMessage = Boolean(resolveOptionalValue(props.errorMessage));
    let isInvalid = Boolean(unref(props.isInvalid)) || unref(props.validationState) === 'invalid';
    let ariaDescribedby = resolveOptionalValue(props.ariaDescribedby) ?? resolveOptionalValue(props['aria-describedby']);

    return {
      ...labelFieldProps.value,
      'aria-describedby': joinIds([
        hasDescription ? descriptionId : undefined,
        hasErrorMessage && isInvalid ? errorMessageId : undefined,
        ariaDescribedby
      ])
    };
  });

  return {
    fieldProps,
    labelProps,
    descriptionProps: computed(() => ({
      id: descriptionId
    })),
    errorMessageProps: computed(() => ({
      id: errorMessageId
    }))
  };
}
