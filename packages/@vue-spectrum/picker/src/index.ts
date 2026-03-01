import '@adobe/spectrum-css-temp/components/dropdown/vars.css';
import {FieldButton} from '@vue-spectrum/button';
import {Field} from '@vue-spectrum/label';
import {ListBox} from '@vue-spectrum/listbox';
import {Popover} from '@vue-spectrum/overlays';
import {ProgressCircle} from '@vue-spectrum/progress';
import {classNames, dimensionValue} from '@vue-spectrum/utils';
import {Item, Section} from '@vue-stately/collections';
import {computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, type CSSProperties, type PropType} from 'vue';
const styles: {[key: string]: string} = {};

type PickerKey = number | string;
type ValidationState = 'invalid' | 'valid';
type Direction = 'bottom' | 'end' | 'left' | 'right' | 'start' | 'top';
type Align = 'end' | 'start';
type LabelAlign = 'end' | 'start';
type LabelPosition = 'side' | 'top';
type NecessityIndicator = 'icon' | 'label';
type AutoFocusMode = 'first' | 'last' | true;

type PickerLeafInput = PickerKey | {
  description?: string,
  disabled?: boolean,
  id?: PickerKey,
  isDisabled?: boolean,
  key?: PickerKey,
  label?: string,
  name?: string,
  textValue?: string
};

type PickerSectionInput = {
  children?: PickerLeafInput[],
  id?: PickerKey,
  items?: PickerLeafInput[],
  key?: PickerKey,
  label?: string,
  name?: string,
  textValue?: string,
  title?: string
};

type PickerItemInput = PickerLeafInput | PickerSectionInput;

type NormalizedOption = {
  description?: string,
  disabled: boolean,
  key: PickerKey,
  label: string
};

type NormalizedSection = {
  id: string,
  items: NormalizedOption[],
  title: string
};

const ALERT_ICON_PATH = 'M8.564 1.289.2 16.256A.5.5 0 0 0 .636 17h16.728a.5.5 0 0 0 .436-.744L9.436 1.289a.5.5 0 0 0-.872 0zM10 14.75a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25zm0-3a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-6a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25z';
const CHEVRON_ICON_PATH = 'M5.5 8.5a.5.5 0 0 1-.354-.146l-3-3a.5.5 0 0 1 .708-.708L5.5 7.293l2.646-2.647a.5.5 0 1 1 .708.708l-3 3A.5.5 0 0 1 5.5 8.5z';

let pickerId = 0;

function renderIcon(path: string, className: string, viewBox = '0 0 18 18') {
  return h('svg', {
    class: className,
    focusable: 'false',
    'aria-hidden': 'true',
    role: 'img',
    viewBox
  }, [h('path', {d: path})]);
}

function isSectionItem(item: PickerItemInput): item is PickerSectionInput {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return false;
  }

  return Array.isArray(item.items) || Array.isArray(item.children);
}

function getSectionItems(section: PickerSectionInput): PickerLeafInput[] {
  if (Array.isArray(section.items)) {
    return section.items;
  }

  if (Array.isArray(section.children)) {
    return section.children;
  }

  return [];
}

function normalizeOption(item: PickerLeafInput, index: number): NormalizedOption {
  if (typeof item === 'string' || typeof item === 'number') {
    return {
      disabled: false,
      key: item,
      label: String(item)
    };
  }

  let fallback = item.label ?? item.name ?? item.textValue ?? String(index + 1);
  let key = item.id ?? item.key ?? fallback;

  return {
    description: item.description,
    disabled: Boolean(item.disabled || item.isDisabled),
    key,
    label: item.textValue ?? item.label ?? item.name ?? String(key)
  };
}

function stringifyKey(key: PickerKey | null | undefined): string {
  if (key == null) {
    return '';
  }

  return String(key);
}

function firstSelectionKey(value: unknown): string | null {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  if (value == null || typeof value !== 'object') {
    return null;
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return null;
  }

  for (let entry of value as Iterable<unknown>) {
    if (typeof entry === 'string' || typeof entry === 'number') {
      return String(entry);
    }
  }

  return null;
}

function getPlacement(direction: Direction): 'bottom' | 'left' | 'right' | 'top' {
  if (direction === 'top') {
    return 'top';
  }

  if (direction === 'left' || direction === 'start') {
    return 'left';
  }

  if (direction === 'right' || direction === 'end') {
    return 'right';
  }

  return 'bottom';
}

function resolveHTMLElementRef(value: unknown): HTMLElement | null {
  if (value instanceof HTMLElement) {
    return value;
  }

  if (value && typeof value === 'object' && '$el' in value) {
    let element = (value as {$el?: unknown}).$el;
    if (element instanceof HTMLElement) {
      return element;
    }
  }

  return null;
}

export const Picker = defineComponent({
  name: 'VuePicker',
  inheritAttrs: false,
  props: {
    align: {
      type: String as PropType<Align>,
      default: 'start'
    },
    autoFocus: {
      type: Boolean,
      default: false
    },
    contextualHelp: {
      type: [String, Number, Object, Function, Array] as PropType<unknown>,
      default: undefined
    },
    description: {
      type: String,
      default: ''
    },
    direction: {
      type: String as PropType<Direction>,
      default: 'bottom'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disabledKeys: {
      type: [Array, Set] as PropType<Iterable<PickerKey>>,
      default: () => []
    },
    errorMessage: {
      type: [String, Number, Object, Function, Array] as PropType<unknown>,
      default: undefined
    },
    id: {
      type: String,
      default: undefined
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isQuiet: {
      type: Boolean,
      default: false
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array as PropType<PickerItemInput[]>,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    labelAlign: {
      type: String as PropType<LabelAlign | undefined>,
      default: undefined
    },
    labelPosition: {
      type: String as PropType<LabelPosition>,
      default: 'top'
    },
    menuWidth: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined
    },
    modelValue: {
      type: [String, Number] as PropType<PickerKey | undefined>,
      default: undefined
    },
    necessityIndicator: {
      type: String as PropType<NecessityIndicator | undefined>,
      default: undefined
    },
    placeholder: {
      type: String,
      default: 'Select…'
    },
    selectedKey: {
      type: [String, Number] as PropType<PickerKey | undefined>,
      default: undefined
    },
    defaultSelectedKey: {
      type: [String, Number] as PropType<PickerKey | undefined>,
      default: undefined
    },
    validationState: {
      type: String as PropType<ValidationState | undefined>,
      default: undefined
    },
    width: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined
    }
  },
  emits: {
    change: (value: PickerKey) => typeof value === 'string' || typeof value === 'number',
    close: () => true,
    open: () => true,
    openChange: (value: boolean) => typeof value === 'boolean',
    selectionChange: (value: PickerKey | null) => value == null || typeof value === 'string' || typeof value === 'number',
    'update:modelValue': (value: PickerKey) => typeof value === 'string' || typeof value === 'number',
    'update:selectedKey': (value: PickerKey | null) => value == null || typeof value === 'string' || typeof value === 'number'
  },
  setup(props, {attrs, emit}) {
    let generatedId = `vs-picker-${++pickerId}`;
    let triggerRef = ref<HTMLElement | null>(null);
    let isHovered = ref(false);
    let isOpen = ref(false);
    let popoverStyle = ref<CSSProperties>({});
    let listBoxAutoFocus = ref<AutoFocusMode | undefined>(undefined);
    let uncontrolledSelectedKey = ref<PickerKey | null>(props.defaultSelectedKey ?? null);

    let pickerIdValue = computed(() => props.id ?? generatedId);
    let labelId = computed(() => props.label ? `${pickerIdValue.value}-label` : undefined);
    let valueId = computed(() => `${pickerIdValue.value}-value`);

    let isDisabled = computed(() => {
      if (props.isDisabled !== undefined) {
        return props.isDisabled;
      }

      return props.disabled;
    });

    let isInvalid = computed(() => {
      if (isDisabled.value) {
        return false;
      }

      return props.isInvalid || props.validationState === 'invalid';
    });

    let externalAriaLabelledBy = computed(() => {
      let value = attrs['aria-labelledby'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });

    let triggerAriaLabelledBy = computed(() => {
      let ids = [valueId.value, labelId.value, externalAriaLabelledBy.value].filter((id): id is string => Boolean(id));
      return ids.length > 0 ? ids.join(' ') : undefined;
    });

    let triggerAriaLabel = computed(() => {
      if (triggerAriaLabelledBy.value) {
        return undefined;
      }

      let attrAriaLabel = attrs['aria-label'];
      if (typeof attrAriaLabel === 'string' && attrAriaLabel.length > 0) {
        return attrAriaLabel;
      }

      return undefined;
    });

    let disabledKeySet = computed(() => {
      let next = new Set<string>();
      for (let key of props.disabledKeys) {
        if (typeof key === 'string' || typeof key === 'number') {
          next.add(String(key));
        }
      }
      return next;
    });

    let normalizedItems = computed(() => {
      let sectionIndex = 0;
      return props.items.map((item, index) => {
        if (!isSectionItem(item)) {
          let option = normalizeOption(item as PickerLeafInput, index);
          return {
            ...option,
            disabled: option.disabled || disabledKeySet.value.has(String(option.key))
          };
        }

        let normalizedOptions = getSectionItems(item)
          .map((child, childIndex) => normalizeOption(child, childIndex))
          .map((option) => ({
            ...option,
            disabled: option.disabled || disabledKeySet.value.has(String(option.key))
          }));

        sectionIndex += 1;
        return {
          id: stringifyKey(item.id ?? item.key ?? `section-${sectionIndex}`),
          items: normalizedOptions,
          title: item.title ?? item.label ?? item.textValue ?? item.name ?? `Section ${sectionIndex}`
        } satisfies NormalizedSection;
      });
    });

    let flattenedOptions = computed(() => {
      let options: NormalizedOption[] = [];
      for (let item of normalizedItems.value) {
        if ('items' in item) {
          options.push(...item.items);
        } else {
          options.push(item);
        }
      }
      return options;
    });

    let optionsByStringKey = computed(() => {
      let map = new Map<string, NormalizedOption>();
      for (let option of flattenedOptions.value) {
        map.set(String(option.key), option);
      }
      return map;
    });

    let controlledSelectedKey = computed(() => {
      if (props.selectedKey !== undefined) {
        return props.selectedKey;
      }

      if (props.modelValue !== undefined) {
        return props.modelValue;
      }

      return null;
    });

    let selectedKey = computed<PickerKey | null>(() => {
      if (controlledSelectedKey.value !== null) {
        return controlledSelectedKey.value;
      }

      return uncontrolledSelectedKey.value;
    });

    let selectedOption = computed(() => {
      return optionsByStringKey.value.get(stringifyKey(selectedKey.value));
    });

    let isPlaceholder = computed(() => !selectedOption.value);

    let dropdownClassName = computed(() => classNames(
      styles,
      'spectrum-Dropdown',
      {
        'is-disabled': isDisabled.value,
        'is-invalid': isInvalid.value,
        'spectrum-Dropdown--quiet': props.isQuiet
      }
    ));

    let triggerClassName = computed(() => classNames(
      styles,
      'spectrum-Dropdown-trigger',
      {
        'is-hovered': isHovered.value && !isDisabled.value
      }
    ));

    let valueClassName = computed(() => classNames(
      styles,
      'spectrum-Dropdown-label',
      {
        'is-placeholder': isPlaceholder.value
      }
    ));

    let wrapperClassName = computed(() => classNames(
      styles,
      'spectrum-Field',
      {
        'spectrum-Dropdown-fieldWrapper--positionSide': props.labelPosition === 'side',
        'spectrum-Dropdown-fieldWrapper--quiet': props.isQuiet
      }
    ));

    let listBoxItems = computed(() => {
      return normalizedItems.value.map((item) => {
        if ('items' in item) {
          return {
            id: item.id,
            items: item.items.map((option) => ({
              description: option.description,
              id: option.key,
              isDisabled: option.disabled,
              label: option.label
            })),
            title: item.title
          };
        }

        return {
          description: item.description,
          id: item.key,
          isDisabled: item.disabled,
          label: item.label
        };
      });
    });

    let popoverPlacement = computed(() => getPlacement(props.direction));

    let popoverClassName = computed(() => classNames(
      styles,
      'spectrum-Dropdown-popover',
      {
        'spectrum-Dropdown-popover--quiet': props.isQuiet
      }
    ));

    let hiddenSelectOptions = computed(() => {
      return flattenedOptions.value.map((option) => ({
        disabled: option.disabled,
        key: option.key,
        textValue: option.label
      }));
    });

    let fieldStyle = computed(() => {
      let width = dimensionValue(props.width);
      if (!width) {
        return attrs.style;
      }

      return [{width}, attrs.style as CSSProperties | undefined];
    });

    let resolveMenuSurfaceStyle = () => {
      let triggerRect = triggerRef.value?.getBoundingClientRect();
      if (!triggerRect) {
        popoverStyle.value = {
          position: 'absolute',
          zIndex: '1'
        };
        return;
      }

      let nextStyle: CSSProperties = {
        left: `${triggerRect.left}px`,
        minWidth: `${triggerRect.width}px`,
        position: 'fixed',
        top: `${triggerRect.bottom + 4}px`,
        transform: 'translateX(0) translateY(0)',
        zIndex: '1'
      };

      if (props.direction === 'top') {
        nextStyle.top = `${triggerRect.top - 4}px`;
        nextStyle.transform = props.align === 'end'
          ? 'translateX(-100%) translateY(-100%)'
          : 'translateX(0) translateY(-100%)';
        if (props.align === 'end') {
          nextStyle.left = `${triggerRect.right}px`;
        }
      } else if (props.direction === 'left' || props.direction === 'start') {
        nextStyle.left = `${triggerRect.left - 4}px`;
        nextStyle.top = props.align === 'end' ? `${triggerRect.bottom}px` : `${triggerRect.top}px`;
        nextStyle.transform = props.align === 'end'
          ? 'translateX(-100%) translateY(-100%)'
          : 'translateX(-100%) translateY(0)';
      } else if (props.direction === 'right' || props.direction === 'end') {
        nextStyle.left = `${triggerRect.right + 4}px`;
        nextStyle.top = props.align === 'end' ? `${triggerRect.bottom}px` : `${triggerRect.top}px`;
        nextStyle.transform = props.align === 'end'
          ? 'translateX(0) translateY(-100%)'
          : 'translateX(0) translateY(0)';
      } else if (props.align === 'end') {
        nextStyle.left = `${triggerRect.right}px`;
        nextStyle.transform = 'translateX(-100%) translateY(0)';
      }

      let menuWidth = dimensionValue(props.menuWidth);
      if (menuWidth) {
        nextStyle.width = menuWidth;
      } else if (!props.isQuiet) {
        nextStyle.width = `${triggerRect.width}px`;
      }

      popoverStyle.value = nextStyle;
    };

    let openMenu = (focusMode: AutoFocusMode | undefined = undefined) => {
      if (isDisabled.value || isOpen.value || flattenedOptions.value.length === 0) {
        return;
      }

      listBoxAutoFocus.value = focusMode;
      isOpen.value = true;
      resolveMenuSurfaceStyle();
      emit('open');
      emit('openChange', true);
      nextTick(() => {
        resolveMenuSurfaceStyle();
      });
    };

    let closeMenu = () => {
      if (!isOpen.value) {
        return;
      }

      isOpen.value = false;
      isHovered.value = false;
      emit('close');
      emit('openChange', false);
    };

    let updateSelection = (nextKeyString: string | null) => {
      if (nextKeyString == null) {
        return;
      }

      let nextOption = optionsByStringKey.value.get(nextKeyString);
      if (!nextOption || nextOption.disabled) {
        return;
      }

      let nextKey = nextOption.key;
      if (controlledSelectedKey.value === null) {
        uncontrolledSelectedKey.value = nextKey;
      }

      emit('update:modelValue', nextKey);
      emit('update:selectedKey', nextKey);
      emit('change', nextKey);
      emit('selectionChange', nextKey);
      closeMenu();
    };

    let onTriggerClick = () => {
      if (isOpen.value) {
        closeMenu();
        return;
      }

      openMenu(true);
    };

    let onTriggerKeydown = (event: KeyboardEvent) => {
      if (isDisabled.value) {
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'Down') {
        event.preventDefault();
        openMenu('first');
        return;
      }

      if (event.key === 'ArrowUp' || event.key === 'Up') {
        event.preventDefault();
        openMenu('last');
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onTriggerClick();
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
      }
    };

    let onListBoxSelectionChange = (value: unknown) => {
      updateSelection(firstSelectionKey(value));
    };

    let onWindowResizeOrScroll = () => {
      if (!isOpen.value) {
        return;
      }

      resolveMenuSurfaceStyle();
    };

    onMounted(() => {
      window.addEventListener('resize', onWindowResizeOrScroll);
      window.addEventListener('scroll', onWindowResizeOrScroll, true);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', onWindowResizeOrScroll);
      window.removeEventListener('scroll', onWindowResizeOrScroll, true);
    });

    let rootAttrs = computed(() => {
      let next: Record<string, unknown> = {};
      for (let [key, value] of Object.entries(attrs)) {
        if (key === 'aria-label' || key === 'aria-labelledby' || key === 'class' || key === 'style') {
          continue;
        }

        next[key] = value;
      }

      return next;
    });

    return () => h(Field, {
      ...rootAttrs.value,
      class: attrs.class,
      style: fieldStyle.value,
      contextualHelp: props.contextualHelp,
      description: props.description,
      elementType: 'span',
      errorMessage: props.errorMessage,
      includeNecessityIndicatorInAccessibilityName: true,
      isDisabled: isDisabled.value,
      isInvalid: isInvalid.value,
      isRequired: props.isRequired,
      label: props.label,
      labelAlign: props.labelAlign,
      labelPosition: props.labelPosition,
      labelProps: labelId.value ? {id: labelId.value} : undefined,
      necessityIndicator: props.necessityIndicator,
      showErrorIcon: false,
      validationState: props.validationState,
      wrapperClassName: wrapperClassName.value
    }, {
      default: () => [
        h('div', {
          class: dropdownClassName.value
        }, [
          h('div', {
            'aria-hidden': true,
            style: {
              clip: 'rect(0px, 0px, 0px, 0px)',
              clipPath: 'inset(50%)',
              height: '1px',
              left: '0px',
              margin: '-1px',
              overflow: 'hidden',
              padding: '0px',
              position: 'fixed',
              top: '0px',
              whiteSpace: 'nowrap',
              width: '1px'
            }
          }, [
            h('select', {
              disabled: isDisabled.value,
              tabIndex: -1,
              value: stringifyKey(selectedKey.value),
              'aria-hidden': 'true'
            }, hiddenSelectOptions.value.map((option) => h('option', {
              key: stringifyKey(option.key),
              disabled: option.disabled,
              value: stringifyKey(option.key)
            }, option.textValue)))
          ]),
          h(FieldButton, {
            id: pickerIdValue.value,
            ref: (element: unknown) => {
              triggerRef.value = resolveHTMLElementRef(element);
            },
            'aria-controls': isOpen.value ? `${pickerIdValue.value}-listbox` : undefined,
            'aria-expanded': isOpen.value,
            'aria-haspopup': 'listbox',
            'aria-invalid': isInvalid.value ? true : undefined,
            'aria-label': triggerAriaLabel.value,
            'aria-labelledby': triggerAriaLabelledBy.value,
            autoFocus: props.autoFocus,
            class: triggerClassName.value,
            isActive: isOpen.value,
            isDisabled: isDisabled.value,
            isInvalid: isInvalid.value,
            isQuiet: props.isQuiet,
            onBlur: () => {
              isHovered.value = false;
            },
            onClick: onTriggerClick,
            onKeydown: onTriggerKeydown,
            onMouseenter: () => {
              isHovered.value = true;
            },
            onMouseleave: () => {
              isHovered.value = false;
            }
          }, {
            default: () => [
              h('span', {
                id: valueId.value,
                class: valueClassName.value
              }, selectedOption.value?.label ?? props.placeholder),
              props.isLoading && flattenedOptions.value.length === 0
                ? h(ProgressCircle, {
                  ariaLabel: 'Loading',
                  class: classNames(styles, 'spectrum-Dropdown-progressCircle'),
                  isIndeterminate: true,
                  size: 'S'
                })
                : null,
              isInvalid.value && !isDisabled.value && !(props.isLoading && flattenedOptions.value.length === 0)
                ? renderIcon(ALERT_ICON_PATH, classNames(styles, 'spectrum-Icon', 'spectrum-UIIcon-AlertMedium', 'spectrum-Dropdown-invalidIcon'))
                : null,
              renderIcon(CHEVRON_ICON_PATH, classNames(styles, 'spectrum-Icon', 'spectrum-UIIcon-ChevronDownMedium', 'spectrum-Dropdown-chevron'), '0 0 11 9')
            ]
          }),
          isOpen.value && flattenedOptions.value.length > 0
            ? h(Popover, {
              isDismissable: true,
              isNonModal: true,
              isOpen: true,
              hideArrow: true,
              placement: popoverPlacement.value,
              class: popoverClassName.value,
              style: popoverStyle.value,
              onClose: closeMenu
            }, {
              default: () => [
                h(ListBox, {
                  id: `${pickerIdValue.value}-listbox`,
                  ariaLabel: triggerAriaLabel.value,
                  ariaLabelledby: triggerAriaLabelledBy.value,
                  autoFocus: listBoxAutoFocus.value,
                  items: listBoxItems.value,
                  modelValue: selectedKey.value ?? undefined,
                  selectionMode: 'single',
                  shouldFocusWrap: true,
                  onSelectionChange: onListBoxSelectionChange,
                  'onUpdate:modelValue': onListBoxSelectionChange
                })
              ]
            })
            : null
        ])
      ]
    });
  }
});

export const VuePicker = Picker;
export {Item, Section};
export type {SpectrumPickerProps} from '@vue-types/select';
