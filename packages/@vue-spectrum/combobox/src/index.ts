import '@adobe/spectrum-css-temp/components/button/vars.css';
import '@adobe/spectrum-css-temp/components/fieldlabel/vars.css';
import '@adobe/spectrum-css-temp/components/inputgroup/vars.css';
import '@adobe/spectrum-css-temp/components/menu/vars.css';
import '@adobe/spectrum-css-temp/components/popover/vars.css';
import '@adobe/spectrum-css-temp/components/search/vars.css';
import '@adobe/spectrum-css-temp/components/textfield/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, type PropType, ref, watch} from 'vue';
import './combobox.css';
import './stateClassOverrides.css';
import {getEventTarget} from '@vue-aria/utils';

const buttonStyles: {[key: string]: string} = {};
const fieldStyles: {[key: string]: string} = {};
const inputGroupStyles: {[key: string]: string} = {};
const menuStyles: {[key: string]: string} = {};
const popoverStyles: {[key: string]: string} = {};
const textfieldStyles: {[key: string]: string} = {};

type OptionKey = string | number;
type FormValue = 'text' | 'key';
type SelectionMode = 'single' | 'multiple';
type ValidationState = 'invalid' | 'valid';
type PickerOptionInput = string | {
  actionOnly?: boolean,
  id?: OptionKey,
  inputValueOnSelect?: string,
  key?: OptionKey,
  label?: string,
  name?: string,
  onAction?: () => void,
  textValue?: string,
  value?: OptionKey
};

type SelectionChangeValue = OptionKey | OptionKey[] | null;

interface NormalizedOption {
  actionOnly: boolean,
  id: string,
  inputValueOnSelect?: string,
  onAction?: () => void,
  textValue: string
}

let comboboxId = 0;

function toOptionKey(value: OptionKey | null | undefined): string | null {
  if (value == null) {
    return null;
  }

  return String(value);
}

function normalizeOption(option: PickerOptionInput, index: number): NormalizedOption {
  if (typeof option === 'string') {
    return {
      actionOnly: false,
      id: option,
      textValue: option
    };
  }

  let keyCandidate = option.id
    ?? option.key
    ?? option.value
    ?? option.textValue
    ?? option.label
    ?? option.name
    ?? index;

  let textValue = option.textValue
    ?? option.label
    ?? option.name
    ?? String(keyCandidate);

  return {
    actionOnly: Boolean(option.actionOnly),
    id: String(keyCandidate),
    inputValueOnSelect: option.inputValueOnSelect,
    onAction: option.onAction,
    textValue
  };
}

export const ComboBox = defineComponent({
  name: 'VueComboBox',
  inheritAttrs: false,
  props: {
    allowsCustomValue: {
      type: Boolean,
      default: false
    },
    allowsEmptyCollection: {
      type: Boolean,
      default: false
    },
    autoFocus: {
      type: Boolean,
      default: false
    },
    disableLocalFilter: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    estimatedItemHeight: {
      type: Number,
      default: 25
    },
    form: {
      type: String,
      default: undefined
    },
    formValue: {
      type: String as PropType<FormValue>,
      default: 'text'
    },
    id: {
      type: String,
      default: undefined
    },
    invalid: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    isQuiet: {
      type: Boolean,
      default: false
    },
    isReadOnly: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    listBoxClassName: {
      type: String,
      default: ''
    },
    listBoxItemClassName: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: undefined
    },
    options: {
      type: Array as PropType<PickerOptionInput[]>,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    },
    selectedKey: {
      type: [String, Number] as PropType<OptionKey | undefined>,
      default: undefined
    },
    selectedKeys: {
      type: Array as PropType<OptionKey[] | undefined>,
      default: undefined
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      default: 'single'
    },
    validationState: {
      type: String as PropType<ValidationState | undefined>,
      default: undefined
    },
    virtualized: {
      type: Boolean,
      default: false
    },
    visibleItemCount: {
      type: Number,
      default: 20
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    change: (value: string) => typeof value === 'string',
    close: () => true,
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    loadMore: () => true,
    open: () => true,
    selectionChange: (_value: SelectionChangeValue) => true,
    'update:modelValue': (value: string) => typeof value === 'string',
    'update:selectedKey': (value: OptionKey | undefined | null) => value == null || typeof value === 'string' || typeof value === 'number',
    'update:selectedKeys': (value: OptionKey[]) => Array.isArray(value)
  },
  setup(props, {attrs, emit}) {
    let generatedId = `vs-combobox-${++comboboxId}`;
    let activeOptionKey = ref<string | null>(null);
    let hasEmittedLoadMore = ref(false);
    let isExpanded = ref(false);
    let isFocused = ref(false);
    let isFocusVisible = ref(false);
    let isHovered = ref(false);
    let isPressed = ref(false);
    let inputRef = ref<HTMLInputElement | null>(null);
    let listBoxRef = ref<HTMLElement | null>(null);
    let listBoxWidth = ref<string | null>(null);
    let listBoxScrollTop = ref(0);
    let triggerRef = ref<HTMLButtonElement | null>(null);
    let selectedKeysRef = ref<Set<string>>(new Set());

    let inputId = computed(() => props.id ?? generatedId);
    let buttonId = computed(() => `${inputId.value}-button`);
    let labelId = computed(() => props.label ? `${inputId.value}-label` : undefined);
    let listId = computed(() => `${inputId.value}-list`);
    let isDisabled = computed(() => props.isDisabled ?? props.disabled);
    let isInvalid = computed(() => (props.isInvalid || props.invalid || props.validationState === 'invalid') && !isDisabled.value);
    let isValid = computed(() => props.validationState === 'valid' && !isDisabled.value);
    let resolvedFormValue = computed<FormValue>(() => props.allowsCustomValue ? 'text' : props.formValue);
    let itemHeight = computed(() => Math.max(1, props.estimatedItemHeight));
    let maximumVisibleItems = computed(() => Math.max(1, props.visibleItemCount));
    let hasControlledSelection = computed(() => props.selectedKey !== undefined || props.selectedKeys !== undefined);

    let normalizedOptions = computed(() => props.options.map((option, index) => normalizeOption(option, index)));

    watch(() => [props.selectedKey, props.selectedKeys, props.selectionMode], () => {
      if (!hasControlledSelection.value) {
        return;
      }

      if (props.selectionMode === 'multiple') {
        if (Array.isArray(props.selectedKeys)) {
          selectedKeysRef.value = new Set(props.selectedKeys.map((key) => String(key)));
          return;
        }

        let key = toOptionKey(props.selectedKey);
        selectedKeysRef.value = key ? new Set([key]) : new Set();
        return;
      }

      let selectedKey = toOptionKey(props.selectedKey) ?? (Array.isArray(props.selectedKeys) ? toOptionKey(props.selectedKeys[0]) : null);
      selectedKeysRef.value = selectedKey ? new Set([selectedKey]) : new Set();
    }, {deep: true, immediate: true});

    let selectedItems = computed(() => normalizedOptions.value.filter((option) => selectedKeysRef.value.has(option.id)));

    let externalAriaLabelledBy = computed(() => {
      let value = attrs['aria-labelledby'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });

    let ariaLabelledBy = computed(() => {
      let parts = [externalAriaLabelledBy.value, labelId.value].filter((part): part is string => Boolean(part));
      return parts.length > 0 ? parts.join(' ') : undefined;
    });

    let ariaLabel = computed(() => {
      if (externalAriaLabelledBy.value) {
        return undefined;
      }

      let fromAttrs = attrs['aria-label'];
      if (typeof fromAttrs === 'string' && fromAttrs.length > 0) {
        return fromAttrs;
      }

      return undefined;
    });

    let rootClassName = computed(() => classNames(
      fieldStyles,
      'spectrum-Field',
      'spectrum-Field--positionTop'
    ));

    let controlClassName = computed(() => classNames(
      inputGroupStyles,
      'spectrum-InputGroup',
      'spectrum-FocusRing',
      'spectrum-FocusRing-ring',
      fieldStyles,
      'spectrum-Field-field',
      {
        'spectrum-InputGroup--quiet': props.isQuiet,
        'spectrum-InputGroup--invalid': isInvalid.value,
        'is-disabled': isDisabled.value,
        'is-focused': isFocused.value,
        'is-hovered': isHovered.value && !isDisabled.value,
        'focus-ring': isFocusVisible.value
      }
    ));

    let inputWrapperClassName = computed(() => classNames(
      fieldStyles,
      'spectrum-Field',
      'spectrum-Field--positionTop',
      inputGroupStyles,
      'spectrum-InputGroup-field',
      textfieldStyles,
      'spectrum-Textfield-wrapper',
      {
        'spectrum-Textfield-wrapper--quiet': props.isQuiet
      }
    ));

    let textfieldClassName = computed(() => classNames(
      textfieldStyles,
      'spectrum-Textfield',
      'spectrum-FocusRing',
      'spectrum-FocusRing-ring',
      fieldStyles,
      'spectrum-Field-field',
      {
        'spectrum-Textfield--invalid': isInvalid.value,
        'spectrum-Textfield--valid': isValid.value,
        'spectrum-Textfield--quiet': props.isQuiet
      }
    ));

    let inputClassName = computed(() => classNames(
      textfieldStyles,
      'spectrum-Textfield-input',
      'i18nFontFamily',
      {
        'is-disabled': isDisabled.value,
        'is-hovered': isHovered.value && !isDisabled.value
      },
      classNames(inputGroupStyles, 'spectrum-InputGroup-input')
    ));

    let triggerClassName = computed(() => classNames(
      buttonStyles,
      'spectrum-FieldButton',
      'spectrum-BaseButton',
      'i18nFontFamily',
      'spectrum-FocusRing',
      'spectrum-FocusRing-ring',
      {
        'spectrum-FieldButton--quiet': props.isQuiet,
        'spectrum-FieldButton--invalid': isInvalid.value,
        'is-active': isPressed.value || isExpanded.value,
        'is-disabled': isDisabled.value,
        'is-hovered': isHovered.value && !isDisabled.value
      },
      classNames(inputGroupStyles, 'spectrum-FieldButton')
    ));

    let filteredOptions = computed(() => {
      if (props.disableLocalFilter) {
        return normalizedOptions.value;
      }

      let query = props.modelValue.trim().toLocaleLowerCase();
      if (!query) {
        return normalizedOptions.value;
      }

      return normalizedOptions.value.filter((option) => option.textValue.toLocaleLowerCase().includes(query));
    });

    let virtualizationEnabled = computed(() => props.virtualized && filteredOptions.value.length > maximumVisibleItems.value);
    let startIndex = computed(() => {
      if (!virtualizationEnabled.value) {
        return 0;
      }

      return Math.max(0, Math.floor(listBoxScrollTop.value / itemHeight.value) - 1);
    });

    let endIndex = computed(() => {
      if (!virtualizationEnabled.value) {
        return filteredOptions.value.length;
      }

      return Math.min(filteredOptions.value.length, startIndex.value + maximumVisibleItems.value + 2);
    });

    let visibleOptions = computed(() => {
      if (!virtualizationEnabled.value) {
        return filteredOptions.value;
      }

      return filteredOptions.value.slice(startIndex.value, endIndex.value);
    });

    let maxListHeight = computed(() => `${itemHeight.value * maximumVisibleItems.value}px`);
    let totalListHeight = computed(() => `${filteredOptions.value.length * itemHeight.value}px`);
    let activeDescendant = computed(() => activeOptionKey.value ? `${inputId.value}-option-${activeOptionKey.value}` : undefined);
    let hiddenFormValues = computed(() => {
      if (!props.name || resolvedFormValue.value !== 'key') {
        return [];
      }

      let values = Array.from(selectedKeysRef.value);
      if (props.selectionMode === 'single') {
        return [values[0] ?? ''];
      }

      return values.length > 0 ? values : [''];
    });

    let emitValue = (value: string) => {
      emit('update:modelValue', value);
      emit('change', value);
    };

    let updateListBoxWidth = () => {
      let inputRect = inputRef.value?.getBoundingClientRect();
      if (!inputRect) {
        return;
      }

      let buttonRect = triggerRef.value?.getBoundingClientRect();
      let minX = buttonRect ? Math.min(buttonRect.left, inputRect.left) : inputRect.left;
      let maxX = buttonRect ? Math.max(buttonRect.right, inputRect.right) : inputRect.right;
      listBoxWidth.value = `${Math.max(0, maxX - minX)}px`;
    };

    onMounted(() => {
      updateListBoxWidth();
      window.addEventListener('resize', updateListBoxWidth);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateListBoxWidth);
    });

    let updateSelection = (nextSelection: Set<string>) => {
      selectedKeysRef.value = new Set(nextSelection);

      if (props.selectionMode === 'multiple') {
        let nextKeys = Array.from(nextSelection);
        emit('update:selectedKeys', nextKeys);
        emit('selectionChange', nextKeys);
        return;
      }

      let nextKey = Array.from(nextSelection)[0] ?? null;
      emit('update:selectedKey', nextKey);
      emit('selectionChange', nextKey);
    };

    let setActiveKey = (focus: 'first' | 'last' | 'manual' = 'first') => {
      if (filteredOptions.value.length === 0) {
        activeOptionKey.value = null;
        return;
      }

      if (focus === 'last') {
        activeOptionKey.value = filteredOptions.value[filteredOptions.value.length - 1].id;
        return;
      }

      if (focus === 'manual') {
        return;
      }

      activeOptionKey.value = filteredOptions.value[0].id;
    };

    let openMenu = (focus: 'first' | 'last' | 'manual' = 'first') => {
      if (isExpanded.value || isDisabled.value || props.isReadOnly) {
        return;
      }

      if (!props.allowsEmptyCollection && filteredOptions.value.length === 0) {
        return;
      }

      isExpanded.value = true;
      hasEmittedLoadMore.value = false;
      listBoxScrollTop.value = 0;
      setActiveKey(focus);
      void nextTick(() => {
        updateListBoxWidth();
      });
      emit('open');
    };

    let closeMenu = () => {
      if (!isExpanded.value) {
        return;
      }

      isExpanded.value = false;
      activeOptionKey.value = null;
      hasEmittedLoadMore.value = false;
      isHovered.value = false;
      emit('close');
    };

    let selectOption = (option: NormalizedOption) => {
      if (option.onAction) {
        option.onAction();
      }

      if (props.selectionMode === 'multiple') {
        if (option.actionOnly) {
          emitValue(option.inputValueOnSelect ?? '');
          closeMenu();
          return;
        }

        let next = new Set(selectedKeysRef.value);
        if (next.has(option.id)) {
          next.delete(option.id);
        } else {
          next.add(option.id);
        }

        updateSelection(next);
        emitValue('');
        activeOptionKey.value = option.id;
        if (!isExpanded.value) {
          openMenu('manual');
        }
        return;
      }

      if (option.actionOnly) {
        updateSelection(new Set());
        emitValue(option.inputValueOnSelect ?? '');
        closeMenu();
        return;
      }

      updateSelection(new Set([option.id]));
      emitValue(option.inputValueOnSelect ?? option.textValue);
      closeMenu();
    };

    let moveActiveOption = (step: -1 | 1) => {
      if (filteredOptions.value.length === 0) {
        activeOptionKey.value = null;
        return;
      }

      let currentIndex = filteredOptions.value.findIndex((option) => option.id === activeOptionKey.value);
      let nextIndex = currentIndex + step;

      if (currentIndex < 0) {
        nextIndex = step > 0 ? 0 : filteredOptions.value.length - 1;
      }

      nextIndex = Math.min(filteredOptions.value.length - 1, Math.max(0, nextIndex));
      activeOptionKey.value = filteredOptions.value[nextIndex].id;

      if (virtualizationEnabled.value && listBoxRef.value) {
        let nextTop = nextIndex * itemHeight.value;
        let nextBottom = nextTop + itemHeight.value;
        let scrollTop = listBoxRef.value.scrollTop;
        let viewportBottom = scrollTop + listBoxRef.value.clientHeight;
        if (nextTop < scrollTop) {
          listBoxRef.value.scrollTop = nextTop;
        } else if (nextBottom > viewportBottom) {
          listBoxRef.value.scrollTop = nextBottom - listBoxRef.value.clientHeight;
        }
      }
    };

    let onListScroll = (event: Event) => {
      let target = event.currentTarget as HTMLElement | null;
      if (!target) {
        return;
      }

      listBoxScrollTop.value = target.scrollTop;

      if (!virtualizationEnabled.value) {
        return;
      }

      let distanceFromBottom = target.scrollHeight - target.clientHeight - target.scrollTop;
      if (distanceFromBottom <= itemHeight.value) {
        if (!hasEmittedLoadMore.value) {
          hasEmittedLoadMore.value = true;
          emit('loadMore');
        }
      } else {
        hasEmittedLoadMore.value = false;
      }
    };

    let handleOptionMouseDown = (event: MouseEvent, option: NormalizedOption) => {
      event.preventDefault();
      selectOption(option);
    };

    let rootAttrs = computed(() => {
      let next: Record<string, unknown> = {};
      for (let [key, value] of Object.entries(attrs)) {
        if (
          key === 'aria-label' ||
          key === 'aria-labelledby' ||
          key === 'autofocus' ||
          key === 'class' ||
          key === 'onBlur' ||
          key === 'onFocus' ||
          key === 'onInputChange' ||
          key === 'onOpenChange' ||
          key === 'onSelectionChange' ||
          key === 'style'
        ) {
          continue;
        }

        next[key] = value;
      }
      return next;
    });

    let renderOption = (option: NormalizedOption, absoluteIndex: number) => {
      let labelTextId = `${inputId.value}-option-${option.id}-label`;
      return h('div', {
        id: `${inputId.value}-option-${option.id}`,
        key: option.id,
        role: 'option',
        'aria-labelledby': labelTextId,
        'aria-posinset': String(absoluteIndex + 1),
        'aria-selected': selectedKeysRef.value.has(option.id) ? 'true' : 'false',
        'aria-setsize': String(filteredOptions.value.length),
        'data-key': option.id,
        'data-react-aria-pressable': 'true',
        class: [
          classNames(
            menuStyles,
            'spectrum-Menu-item',
            {
              'is-focused': activeOptionKey.value === option.id,
              'is-selected': selectedKeysRef.value.has(option.id),
              'is-selectable': true
            }
          ),
          props.listBoxItemClassName
        ],
        style: virtualizationEnabled.value
          ? {
            boxSizing: 'border-box',
            height: `${itemHeight.value}px`,
            left: '0',
            lineHeight: `${itemHeight.value}px`,
            position: 'absolute',
            right: '0',
            top: `${absoluteIndex * itemHeight.value}px`
          }
          : undefined,
        onMouseenter: () => {
          activeOptionKey.value = option.id;
        },
        onMousedown: (event: MouseEvent) => {
          handleOptionMouseDown(event, option);
        }
      }, [
        h('div', {
          class: classNames(menuStyles, 'spectrum-Menu-itemGrid')
        }, [
          h('span', {
            id: labelTextId,
            role: 'none',
            class: classNames(menuStyles, 'spectrum-Menu-itemLabel')
          }, option.textValue)
        ])
      ]);
    };

    return () => h('div', {
      ...rootAttrs.value,
      class: [rootClassName.value, attrs.class]
    }, [
      props.label
        ? h('label', {
          id: labelId.value,
          for: inputId.value,
          class: classNames(fieldStyles, 'spectrum-FieldLabel')
        }, props.label)
        : null,
      h('div', {
        class: controlClassName.value,
        onMouseenter: () => {
          if (isDisabled.value) {
            return;
          }

          isHovered.value = true;
        },
        onMouseleave: () => {
          if (isExpanded.value) {
            return;
          }

          isHovered.value = false;
          isPressed.value = false;
        }
      }, [
        h('div', {
          class: inputWrapperClassName.value
        }, [
          h('div', {
            class: textfieldClassName.value
          }, [
            h('input', {
              ref: inputRef,
              id: inputId.value,
              class: inputClassName.value,
              type: 'text',
              value: props.modelValue,
              placeholder: props.placeholder || undefined,
              disabled: isDisabled.value,
              readonly: props.isReadOnly || undefined,
              name: resolvedFormValue.value === 'text' ? props.name : undefined,
              form: props.form || undefined,
              role: 'combobox',
              tabindex: 0,
              autocomplete: 'off',
              autocorrect: 'off',
              spellcheck: 'false',
              'aria-activedescendant': isExpanded.value ? activeDescendant.value : undefined,
              'aria-autocomplete': 'list',
              'aria-controls': isExpanded.value ? listId.value : undefined,
              'aria-expanded': isExpanded.value ? 'true' : 'false',
              'aria-invalid': isInvalid.value ? 'true' : undefined,
              'aria-label': ariaLabel.value,
              'aria-labelledby': ariaLabelledBy.value,
              autofocus: props.autoFocus || attrs.autofocus || undefined,
              onInput: (event: Event) => {
                let target = event.currentTarget as HTMLInputElement | null;
                emitValue(target?.value ?? '');
                openMenu('first');
                setActiveKey('first');
              },
              onFocus: (event: FocusEvent) => {
                isFocused.value = true;
                let target = getEventTarget(event);
                if (target instanceof HTMLElement && target.matches(':focus-visible')) {
                  isFocusVisible.value = true;
                } else {
                  isFocusVisible.value = true;
                }
                emit('focus', event);
              },
              onBlur: (event: FocusEvent) => {
                isFocused.value = false;
                isFocusVisible.value = false;
                closeMenu();
                emit('blur', event);
              },
              onKeydown: (event: KeyboardEvent) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  if (!isExpanded.value) {
                    openMenu('first');
                  } else {
                    moveActiveOption(1);
                  }
                  return;
                }

                if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  if (!isExpanded.value) {
                    openMenu('last');
                  } else {
                    moveActiveOption(-1);
                  }
                  return;
                }

                if (event.key === 'Enter' && isExpanded.value && activeOptionKey.value) {
                  let activeOption = filteredOptions.value.find((option) => option.id === activeOptionKey.value);
                  if (activeOption) {
                    event.preventDefault();
                    selectOption(activeOption);
                  }
                  return;
                }

                if (event.key === 'Escape') {
                  closeMenu();
                }
              }
            }),
            isInvalid.value
              ? h('span', {
                class: classNames(textfieldStyles, 'spectrum-Textfield-validationIcon'),
                'aria-hidden': 'true'
              }, '!')
              : null
          ])
        ]),
        h('button', {
          ref: triggerRef,
          id: buttonId.value,
          class: triggerClassName.value,
          type: 'button',
          tabindex: -1,
          disabled: isDisabled.value,
          'data-react-aria-pressable': 'true',
          'aria-controls': isExpanded.value ? listId.value : undefined,
          'aria-expanded': isExpanded.value ? 'true' : 'false',
          'aria-haspopup': 'listbox',
          'aria-label': 'Show suggestions',
          'aria-labelledby': [buttonId.value, labelId.value].filter((part): part is string => Boolean(part)).join(' ') || undefined,
          onMousedown: (event: MouseEvent) => {
            event.preventDefault();
            if (isDisabled.value || props.isReadOnly) {
              return;
            }

            isPressed.value = true;
            isFocusVisible.value = false;
            inputRef.value?.focus();
          },
          onMouseup: () => {
            isPressed.value = false;
          },
          onMouseleave: () => {
            isPressed.value = false;
          },
          onClick: () => {
            if (isDisabled.value || props.isReadOnly) {
              return;
            }

            if (isExpanded.value) {
              closeMenu();
            } else {
              openMenu('first');
            }
          }
        }, [
          h('svg', {
            class: [
              classNames(inputGroupStyles, 'spectrum-Icon'),
              classNames(inputGroupStyles, 'spectrum-Dropdown-chevron'),
              'spectrum-UIIcon-ChevronDownMedium'
            ],
            viewBox: '0 0 10 6',
            focusable: 'false',
            'aria-hidden': 'true',
            role: 'img'
          }, [
            h('path', {
              d: 'M9.99 1.01A1 1 0 0 0 8.283.303L5 3.586 1.717.303A1 1 0 1 0 .303 1.717l3.99 3.98a1 1 0 0 0 1.414 0l3.99-3.98a.997.997 0 0 0 .293-.707z'
            })
          ])
        ])
      ]),
      isExpanded.value
        ? h('div', {
          class: [
            classNames(popoverStyles, 'spectrum-Popover'),
            'spectrum-overlay',
            'spectrum-Popover--bottom',
            'is-open',
            'spectrum-overlay--open',
            'is-open--bottom',
            'spectrum-overlay--bottom--open',
            classNames(inputGroupStyles, 'spectrum-InputGroup-popover')
          ],
          role: 'presentation',
          style: {
            maxHeight: '410px',
            minWidth: listBoxWidth.value ?? undefined,
            width: listBoxWidth.value ?? undefined
          }
        }, [
          h('div', {
            id: listId.value,
            ref: listBoxRef,
            role: 'listbox',
            class: [classNames(menuStyles, 'spectrum-Menu'), props.listBoxClassName],
            'aria-label': 'Suggestions',
            'aria-labelledby': [listId.value, labelId.value].filter((part): part is string => Boolean(part)).join(' ') || undefined,
            'aria-multiselectable': props.selectionMode === 'multiple' ? 'true' : undefined,
            style: {
              maxHeight: maxListHeight.value,
              overflow: 'hidden auto',
              padding: '0px',
              position: 'relative',
              width: listBoxWidth.value ?? undefined
            },
            onScroll: onListScroll
          }, virtualizationEnabled.value
            ? [
              h('div', {
                style: {
                  height: totalListHeight.value,
                  position: 'relative'
                }
              }, visibleOptions.value.map((option, index) => renderOption(option, startIndex.value + index)))
            ]
            : visibleOptions.value.map((option, index) => renderOption(option, index)))
        ])
        : null,
      hiddenFormValues.value.map((value, index) => h('input', {
        key: `${props.name ?? 'combobox'}-hidden-${index}`,
        type: 'hidden',
        hidden: true,
        name: props.name,
        form: props.form || undefined,
        value
      })),
      props.selectionMode === 'multiple' && selectedItems.value.length > 0
        ? h('div', {
          class: 'vs-combobox__selection',
          'aria-hidden': 'true'
        }, selectedItems.value.map((item) => h('span', {
          key: item.id,
          class: 'vs-combobox__selection-item'
        }, item.textValue)))
        : null
    ]);
  }
});

export const VueComboBox = ComboBox;

export {Item, Section} from '@vue-stately/collections';
export type {SpectrumComboBoxProps} from '@vue-types/combobox';
