import {type ComputedRef, type Ref, unref} from 'vue';
import {useId} from './useId';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

type DOMProps = {
  id?: MaybeRef<string | undefined>
};

type AriaLabelingProps = {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>
};

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

export function useLabels(props: DOMProps & AriaLabelingProps, defaultLabel?: string): DOMProps & AriaLabelingProps;
export function useLabels(...props: Array<DOMProps & AriaLabelingProps>): DOMProps & AriaLabelingProps;
export function useLabels(
  ...args: [DOMProps & AriaLabelingProps, string?] | Array<DOMProps & AriaLabelingProps>
): DOMProps & AriaLabelingProps {
  let defaultLabel = typeof args[1] === 'string' ? args[1] : undefined;
  let propsList = (defaultLabel ? [args[0]] : args) as Array<DOMProps & AriaLabelingProps>;

  let firstProps = propsList[0] ?? {};
  let id = useId(resolveOptionalString(firstProps.id));
  let label = resolveOptionalString(firstProps['aria-label']);
  let labelledBy = new Set<string>();

  for (let props of propsList) {
    let labelled = resolveOptionalString(props['aria-labelledby']);
    if (labelled) {
      for (let nextId of labelled.trim().split(/\s+/)) {
        if (nextId) {
          labelledBy.add(nextId);
        }
      }
    }

    let nextLabel = resolveOptionalString(props['aria-label']);
    if (!label && nextLabel) {
      label = nextLabel;
    }
  }

  let labelledByValue = labelledBy.size > 0 ? Array.from(labelledBy).join(' ') : undefined;
  if (labelledByValue) {
    labelledByValue = labelledByValue.trim().split(/\s+/).join(' ');
  } else if (!label && defaultLabel) {
    label = defaultLabel;
  }

  return {
    id,
    'aria-label': label,
    'aria-labelledby': labelledByValue
  };
}
