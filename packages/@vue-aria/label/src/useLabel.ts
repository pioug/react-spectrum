import {computed, type ComputedRef, type Ref, unref} from 'vue';
import {useLabels} from '@vue-aria/utils';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface LabelAriaProps {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  id?: MaybeRef<string | undefined>,
  label?: MaybeRef<string | undefined>,
  labelElementType?: MaybeRef<'label' | 'span' | string>
}

export interface LabelDOMProps {
  htmlFor?: string,
  id?: string
}

export interface FieldLabelDOMProps {
  'aria-label'?: string,
  'aria-labelledby'?: string,
  id: string
}

export interface LabelAria {
  fieldProps: ComputedRef<FieldLabelDOMProps>,
  labelProps: ComputedRef<LabelDOMProps>
}

let labelIdCounter = 0;

function createId(prefix: string): string {
  labelIdCounter += 1;
  return `${prefix}-${labelIdCounter}`;
}

function resolveOptionalValue(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

function resolveAriaLabel(props: LabelAriaProps): string | undefined {
  return resolveOptionalValue(props.ariaLabel) ?? resolveOptionalValue(props['aria-label']);
}

function resolveAriaLabelledby(props: LabelAriaProps): string | undefined {
  return resolveOptionalValue(props.ariaLabelledby) ?? resolveOptionalValue(props['aria-labelledby']);
}

export function useLabel(props: LabelAriaProps = {}): LabelAria {
  let fallbackFieldId = createId('vue-label-field');
  let fallbackLabelId = createId('vue-label');

  let fieldId = computed(() => resolveOptionalValue(props.id) ?? fallbackFieldId);

  let labelProps = computed<LabelDOMProps>(() => {
    let label = resolveOptionalValue(props.label);
    if (!label) {
      return {};
    }

    let labelElementType = resolveOptionalValue(props.labelElementType) ?? 'label';
    return {
      id: fallbackLabelId,
      htmlFor: labelElementType === 'label' ? fieldId.value : undefined
    };
  });

  let fieldProps = computed<FieldLabelDOMProps>(() => {
    let label = resolveOptionalValue(props.label);
    let ariaLabel = resolveAriaLabel(props);
    let ariaLabelledby = resolveAriaLabelledby(props);

    if (label) {
      ariaLabelledby = ariaLabelledby ? `${fallbackLabelId} ${ariaLabelledby}` : fallbackLabelId;
    } else if (!ariaLabel && !ariaLabelledby && process.env.NODE_ENV !== 'production') {
      console.warn('If you do not provide a visible label, you must specify an aria-label or aria-labelledby attribute for accessibility');
    }

    let mergedLabelProps = useLabels({
      id: fieldId.value,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby
    });

    return {
      id: mergedLabelProps.id as string,
      'aria-label': mergedLabelProps['aria-label'],
      'aria-labelledby': mergedLabelProps['aria-labelledby']
    };
  });

  return {
    fieldProps,
    labelProps
  };
}
