import {type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface LabelProps {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>
}

export interface Labels {
  'aria-label'?: string,
  'aria-labelledby'?: string
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

export function useLabels(...props: LabelProps[]): Labels {
  let ariaLabel: string | undefined;
  let labelledBy = new Set<string>();

  for (let prop of props) {
    let nextAriaLabel = resolveOptionalString(prop['aria-label']);
    if (!ariaLabel && nextAriaLabel) {
      ariaLabel = nextAriaLabel;
    }

    let ariaLabelledby = resolveOptionalString(prop['aria-labelledby']);
    if (ariaLabelledby) {
      for (let id of ariaLabelledby.split(/\s+/g)) {
        if (id) {
          labelledBy.add(id);
        }
      }
    }
  }

  return {
    'aria-label': ariaLabel,
    'aria-labelledby': labelledBy.size ? Array.from(labelledBy).join(' ') : undefined
  };
}
