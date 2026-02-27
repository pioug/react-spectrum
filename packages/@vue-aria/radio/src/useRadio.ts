import {computed, type ComputedRef, ref, unref, watch} from 'vue';
import type {MaybeRef} from './types';
import type {RadioGroupAria} from './useRadioGroup';

export interface AriaRadioOptions {
  'aria-describedby'?: MaybeRef<string | undefined>,
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  isDisabled?: MaybeRef<boolean>,
  onChange?: (value: string) => void,
  value: MaybeRef<string>
}

export interface RadioAria {
  dispose: () => void,
  inputProps: ComputedRef<{
    'aria-describedby'?: string,
    'aria-label'?: string,
    'aria-labelledby'?: string,
    checked: boolean,
    disabled: boolean,
    name: string,
    onBlur: () => void,
    onChange: () => void,
    onKeyDown: (event: KeyboardEvent) => void,
    onMouseDown: () => void,
    onMouseUp: () => void,
    required: boolean,
    tabIndex?: number,
    type: 'radio',
    value: string
  }>,
  isDisabled: ComputedRef<boolean>,
  isPressed: ComputedRef<boolean>,
  isSelected: ComputedRef<boolean>,
  labelProps: ComputedRef<{
    onClick: () => void,
    onMouseDown: (event: MouseEvent) => void
  }>,
  select: () => void
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

export function useRadio(options: AriaRadioOptions, group: RadioGroupAria): RadioAria {
  let value = computed(() => unref(options.value));
  let localDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isDisabled = computed(() => group.isDisabled.value || localDisabled.value);
  let isSelected = computed(() => group.selectedValue.value === value.value);
  let isPressed = ref(false);

  let stopWatch = watch(
    [value, isDisabled],
    ([nextValue, nextDisabled], _, onCleanup) => {
      group.registerOption(nextValue, nextDisabled);
      onCleanup(() => {
        group.unregisterOption(nextValue);
      });
    },
    {
      immediate: true,
      flush: 'sync'
    }
  );

  let select = () => {
    if (isDisabled.value) {
      return;
    }

    group.setSelectedValue(value.value);
    options.onChange?.(value.value);
  };

  let onKeyDown = (event: KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      select();
    }
  };

  let tabIndex = computed(() => {
    if (isDisabled.value) {
      return undefined;
    }

    if (isSelected.value) {
      return 0;
    }

    if (group.selectedValue.value == null && group.getFirstEnabledValue() === value.value) {
      return 0;
    }

    return -1;
  });

  let ariaDescribedBy = computed(() => {
    let ids: string[] = [];
    let describedBy = resolveOptionalString(options['aria-describedby']);
    if (describedBy) {
      ids.push(describedBy);
    }

    if (group.isInvalid.value && group.errorMessageId.value) {
      ids.push(group.errorMessageId.value);
    }

    if (group.descriptionId.value) {
      ids.push(group.descriptionId.value);
    }

    if (ids.length === 0) {
      return undefined;
    }

    return ids.join(' ');
  });

  return {
    dispose: () => {
      stopWatch();
      group.unregisterOption(value.value);
    },
    inputProps: computed(() => ({
      type: 'radio' as const,
      name: group.groupName.value,
      value: value.value,
      checked: isSelected.value,
      disabled: isDisabled.value,
      required: group.isRequired.value,
      tabIndex: tabIndex.value,
      'aria-label': resolveOptionalString(options['aria-label']),
      'aria-labelledby': resolveOptionalString(options['aria-labelledby']),
      'aria-describedby': ariaDescribedBy.value,
      onChange: select,
      onMouseDown: () => {
        if (!isDisabled.value) {
          isPressed.value = true;
        }
      },
      onMouseUp: () => {
        isPressed.value = false;
      },
      onBlur: () => {
        isPressed.value = false;
      },
      onKeyDown
    })),
    isDisabled,
    isPressed: computed(() => isPressed.value),
    isSelected,
    labelProps: computed(() => ({
      onClick: select,
      onMouseDown: (event: MouseEvent) => {
        event.preventDefault();
      }
    })),
    select
  };
}
