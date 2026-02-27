import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';
import type {MaybeRef} from './types';

type Orientation = 'horizontal' | 'vertical';

export interface AriaRadioGroupOptions {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  description?: MaybeRef<string | undefined>,
  errorMessage?: MaybeRef<string | undefined>,
  id?: MaybeRef<string | undefined>,
  isDisabled?: MaybeRef<boolean>,
  isInvalid?: MaybeRef<boolean>,
  isReadOnly?: MaybeRef<boolean>,
  isRequired?: MaybeRef<boolean>,
  label?: MaybeRef<string | undefined>,
  name?: MaybeRef<string | undefined>,
  onChange?: (value: string) => void,
  orientation?: MaybeRef<Orientation>,
  selectedValue?: Ref<string | null>
}

export interface RadioGroupAria {
  descriptionId: ComputedRef<string | undefined>,
  descriptionProps: ComputedRef<{
    id?: string
  }>,
  errorMessageId: ComputedRef<string | undefined>,
  errorMessageProps: ComputedRef<{
    id?: string
  }>,
  getFirstEnabledValue: () => string | null,
  getNextValue: (currentValue: string, direction: 'next' | 'prev') => string | null,
  groupName: ComputedRef<string>,
  isDisabled: ComputedRef<boolean>,
  isInvalid: ComputedRef<boolean>,
  isReadOnly: ComputedRef<boolean>,
  isRequired: ComputedRef<boolean>,
  labelProps: ComputedRef<{
    id?: string
  }>,
  orientation: ComputedRef<Orientation>,
  radioGroupProps: ComputedRef<{
    'aria-disabled'?: true,
    'aria-invalid'?: true,
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-orientation': Orientation,
    'aria-readonly'?: true,
    'aria-required'?: true,
    id: string,
    name: string,
    onKeyDown: (event: KeyboardEvent) => void,
    role: 'radiogroup'
  }>,
  registerOption: (value: string, isDisabled: boolean) => void,
  selectedValue: Ref<string | null>,
  setSelectedValue: (value: string) => void,
  unregisterOption: (value: string) => void
}

let radioGroupCounter = 0;

function getEventTarget(event: Event): EventTarget | null {
  if (typeof event.composedPath === 'function') {
    let path = event.composedPath();
    if (path.length > 0) {
      return path[0] ?? null;
    }
  }

  let typedEvent = event as Event & {srcElement?: EventTarget | null};
  return typedEvent.srcElement ?? null;
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

export function useRadioGroup(options: AriaRadioGroupOptions = {}): RadioGroupAria {
  radioGroupCounter += 1;

  let groupId = computed(() => resolveOptionalString(options.id) ?? `vue-radio-group-${radioGroupCounter}`);
  let groupName = computed(() => unref(options.name) ?? `${groupId.value}-name`);
  let selectedValue = options.selectedValue ?? ref<string | null>(null);
  let orientation = computed(() => unref(options.orientation) ?? 'vertical');

  let optionOrder = ref<string[]>([]);
  let disabledOptions = ref(new Set<string>());

  let registerOption = (value: string, isDisabled: boolean) => {
    if (!optionOrder.value.includes(value)) {
      optionOrder.value = [...optionOrder.value, value];
    }

    let nextDisabledOptions = new Set(disabledOptions.value);
    if (isDisabled) {
      nextDisabledOptions.add(value);
    } else {
      nextDisabledOptions.delete(value);
    }
    disabledOptions.value = nextDisabledOptions;
  };

  let unregisterOption = (value: string) => {
    optionOrder.value = optionOrder.value.filter((item) => item !== value);
    let nextDisabledOptions = new Set(disabledOptions.value);
    nextDisabledOptions.delete(value);
    disabledOptions.value = nextDisabledOptions;
  };

  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isReadOnly = computed(() => Boolean(unref(options.isReadOnly)));
  let isRequired = computed(() => Boolean(unref(options.isRequired)));
  let isInvalid = computed(() => Boolean(unref(options.isInvalid)));

  let setSelectedValue = (value: string) => {
    if (isDisabled.value || isReadOnly.value || disabledOptions.value.has(value)) {
      return;
    }

    selectedValue.value = value;
    options.onChange?.(value);
  };

  let getFirstEnabledValue = (): string | null => {
    for (let value of optionOrder.value) {
      if (!disabledOptions.value.has(value)) {
        return value;
      }
    }

    return null;
  };

  let getNextValue = (currentValue: string, direction: 'next' | 'prev'): string | null => {
    if (optionOrder.value.length === 0) {
      return null;
    }

    let startIndex = optionOrder.value.indexOf(currentValue);
    if (startIndex === -1) {
      return getFirstEnabledValue();
    }

    let step = direction === 'next' ? 1 : -1;
    let index = startIndex;
    for (let count = 0; count < optionOrder.value.length; count += 1) {
      index = (index + step + optionOrder.value.length) % optionOrder.value.length;
      let value = optionOrder.value[index];
      if (value != null && !disabledOptions.value.has(value)) {
        return value;
      }
    }

    return null;
  };

  let label = computed(() => resolveOptionalString(options.label));
  let labelId = computed(() => label.value ? `${groupId.value}-label` : undefined);
  let description = computed(() => resolveOptionalString(options.description));
  let descriptionId = computed(() => description.value ? `${groupId.value}-description` : undefined);
  let errorMessage = computed(() => resolveOptionalString(options.errorMessage));
  let errorMessageId = computed(() => errorMessage.value ? `${groupId.value}-error` : undefined);

  let ariaLabel = computed(() => resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']));
  let ariaLabelledby = computed(() => resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby']));
  let combinedAriaLabelledBy = computed(() => {
    let ids = new Set<string>();
    if (labelId.value) {
      ids.add(labelId.value);
    }

    let labelledBy = ariaLabelledby.value;
    if (labelledBy) {
      for (let id of labelledBy.trim().split(/\s+/)) {
        if (id) {
          ids.add(id);
        }
      }
    }

    if (ariaLabel.value && ids.size > 0) {
      ids.add(groupId.value);
    }

    return ids.size > 0 ? Array.from(ids).join(' ') : undefined;
  });

  let onKeyDown = (event: KeyboardEvent) => {
    let currentTarget = getEventTarget(event);
    if (!(currentTarget instanceof HTMLInputElement)) {
      return;
    }

    let direction: 'next' | 'prev' | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      direction = 'next';
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      direction = 'prev';
    }

    if (direction == null) {
      return;
    }

    event.preventDefault();
    let nextValue = getNextValue(currentTarget.value, direction);
    if (nextValue != null) {
      setSelectedValue(nextValue);
    }
  };

  return {
    descriptionId,
    descriptionProps: computed(() => ({
      id: descriptionId.value
    })),
    errorMessageId,
    errorMessageProps: computed(() => ({
      id: errorMessageId.value
    })),
    getFirstEnabledValue,
    getNextValue,
    groupName,
    isDisabled,
    isInvalid,
    isReadOnly,
    isRequired,
    labelProps: computed(() => ({
      id: labelId.value
    })),
    orientation,
    radioGroupProps: computed(() => ({
      id: groupId.value,
      role: 'radiogroup' as const,
      name: groupName.value,
      'aria-label': ariaLabel.value,
      'aria-labelledby': combinedAriaLabelledBy.value,
      'aria-orientation': orientation.value,
      'aria-required': isRequired.value ? true : undefined,
      'aria-readonly': isReadOnly.value ? true : undefined,
      'aria-disabled': isDisabled.value ? true : undefined,
      'aria-invalid': isInvalid.value ? true : undefined,
      onKeyDown
    })),
    registerOption,
    selectedValue,
    setSelectedValue,
    unregisterOption
  };
}
