import '@adobe/spectrum-css-temp/components/button/vars.css';
import '@adobe/spectrum-css-temp/components/fieldlabel/vars.css';
import '@adobe/spectrum-css-temp/components/inputgroup/vars.css';
import '@adobe/spectrum-css-temp/components/menu/vars.css';
import '@adobe/spectrum-css-temp/components/search/vars.css';
import '@adobe/spectrum-css-temp/components/textfield/vars.css';
import {Avatar} from '@vue-spectrum/avatar';
import {Popover} from '@vue-spectrum/overlays';
import {ProgressCircle} from '@vue-spectrum/progress';
import {classNames, dimensionValue} from '@vue-spectrum/utils';
import {computed, defineComponent, getCurrentInstance, h, nextTick, onBeforeUnmount, onMounted, type CSSProperties, type PropType, ref, watch} from 'vue';
import './searchautocomplete.css';
import {getEventTarget} from '@vue-aria/utils';
import {Item, Section} from '@vue-stately/collections';
const buttonStyles: {[key: string]: string} = {};
const fieldStyles: {[key: string]: string} = {};
const inputGroupStyles: {[key: string]: string} = {};
const menuStyles: {[key: string]: string} = {};
const searchStyles: {[key: string]: string} = {};
const textfieldStyles: {[key: string]: string} = {};

type Align = 'end' | 'start';
type Direction = 'bottom' | 'top';
type LoadingState = 'filtering' | 'idle' | 'loading' | 'loadingMore';
type MenuTrigger = 'focus' | 'input' | 'manual';
type SearchOptionKey = string | number;
type ValidationState = 'invalid' | 'valid';
type SearchOptionInput = string | {
  avatarSrc?: string,
  disabled?: boolean,
  id?: SearchOptionKey,
  inputValueOnSelect?: string,
  isDisabled?: boolean,
  key?: SearchOptionKey,
  label?: string,
  name?: string,
  textValue?: string,
  value?: SearchOptionKey
};

type NormalizedOption = {
  avatarSrc?: string,
  disabled: boolean,
  domId: string,
  inputValueOnSelect?: string,
  key: SearchOptionKey,
  textValue: string
};

const SEARCH_AUTOCOMPLETE_PLACEHOLDER_WARNING = 'Placeholders are deprecated due to accessibility issues. Please use help text instead.';
const MAGNIFIER_PATH = 'M15.77 14.71l-4.534-4.535a6.014 6.014 0 1 0-1.06 1.06l4.533 4.535a.75.75 0 1 0 1.061-1.06zM6.5 11A4.5 4.5 0 1 1 11 6.5 4.505 4.505 0 0 1 6.5 11z';
const FILTER_PATH = 'M30.946,2H3.054a1,1,0,0,0-.787,1.617L14,18.589V33.9a.992.992,0,0,0,1.68.824l3.981-4.153A1.219,1.219,0,0,0,20,29.728V18.589L31.733,3.617A1,1,0,0,0,30.946,2Z';
const CLEAR_PATH = 'M7.317 6.433L4.884 4l2.433-2.433a.625.625 0 1 0-.884-.884L4 3.116 1.567.683a.625.625 0 1 0-.884.884L3.116 4 .683 6.433a.625.625 0 1 0 .884.884L4 4.884l2.433 2.433a.625.625 0 0 0 .884-.884z';
const ALERT_PATH = 'M8.564 1.289L.2 16.256A.5.5 0 0 0 .636 17h16.728a.5.5 0 0 0 .436-.744L9.436 1.289a.5.5 0 0 0-.872 0zM10 14.75a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25zm0-3a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-6a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25z';
const DEFAULT_MENU_OFFSET = 4;

function renderIconPath(
  className: string,
  path: string,
  attrs: Record<string, unknown> = {},
  viewBox?: string
) {
  return h('svg', {
    class: className,
    focusable: 'false',
    'aria-hidden': 'true',
    role: 'img',
    viewBox,
    ...attrs
  }, [
    h('path', {d: path})
  ]);
}

function toOptionArray(value: Iterable<SearchOptionInput> | undefined): SearchOptionInput[] {
  if (value == null) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return Array.from(value);
}

function normalizeKeyValue(key: SearchOptionKey | null | undefined): string | null {
  if (key == null) {
    return null;
  }

  return String(key);
}

function sanitizeDomId(value: SearchOptionKey, index: number): string {
  let normalized = String(value).replace(/[^A-Za-z0-9_-]/g, '');
  return normalized === '' ? `item-${index + 1}` : normalized;
}

function normalizeOption(option: SearchOptionInput, index: number): NormalizedOption {
  if (typeof option === 'string') {
    return {
      disabled: false,
      domId: sanitizeDomId(option, index),
      key: option,
      textValue: option
    };
  }

  let key = option.id
    ?? option.key
    ?? option.value
    ?? option.textValue
    ?? option.label
    ?? option.name
    ?? index;

  return {
    avatarSrc: option.avatarSrc,
    disabled: Boolean(option.disabled ?? option.isDisabled),
    domId: sanitizeDomId(key, index),
    inputValueOnSelect: option.inputValueOnSelect,
    key,
    textValue: option.textValue ?? option.label ?? option.name ?? String(key)
  };
}

function isIterableKeyCollection(value: unknown): value is Iterable<SearchOptionKey> {
  if (value == null || typeof value === 'string') {
    return false;
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return false;
  }

  for (let entry of value as Iterable<unknown>) {
    if (typeof entry !== 'string' && typeof entry !== 'number') {
      return false;
    }
  }

  return true;
}

let autocompleteId = 0;

export const SearchAutocomplete = defineComponent({
  name: 'VueSearchAutocomplete',
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
    defaultInputValue: {
      type: String,
      default: ''
    },
    defaultItems: {
      type: [Array, Set] as PropType<Iterable<SearchOptionInput> | undefined>,
      default: undefined
    },
    defaultSelectedKey: {
      type: [String, Number] as PropType<SearchOptionKey | undefined>,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disabledKeys: {
      type: [Array, Set] as PropType<Iterable<SearchOptionKey>>,
      default: () => []
    },
    direction: {
      type: String as PropType<Direction>,
      default: 'bottom'
    },
    id: {
      type: String,
      default: undefined
    },
    inputValue: {
      type: String as PropType<string | undefined>,
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
    items: {
      type: [Array, Set] as PropType<Iterable<SearchOptionInput> | undefined>,
      default: undefined
    },
    icon: {
      type: null as unknown as PropType<unknown>,
      default: undefined
    },
    label: {
      type: String,
      default: ''
    },
    loadingState: {
      type: String as PropType<LoadingState | undefined>,
      default: undefined
    },
    menuTrigger: {
      type: String as PropType<MenuTrigger>,
      default: 'input'
    },
    menuWidth: {
      type: [Number, String] as PropType<number | string | undefined>,
      default: undefined
    },
    modelValue: {
      type: String,
      default: ''
    },
    options: {
      type: Array as PropType<SearchOptionInput[]>,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    },
    selectedKey: {
      type: [String, Number] as PropType<SearchOptionKey | undefined>,
      default: undefined
    },
    validationState: {
      type: String as PropType<ValidationState | undefined>,
      default: undefined
    },
    width: {
      type: [Number, String] as PropType<number | string | undefined>,
      default: undefined
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    change: (value: string) => typeof value === 'string',
    clear: () => true,
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    inputChange: (value: string) => typeof value === 'string',
    loadMore: () => true,
    openChange: (value: boolean, trigger?: string) => typeof value === 'boolean' && (trigger == null || typeof trigger === 'string'),
    selectionChange: (key: SearchOptionKey | null) => key == null || typeof key === 'string' || typeof key === 'number',
    submit: (value: string | null, key: SearchOptionKey | null) => (value == null || typeof value === 'string') && (key == null || typeof key === 'string' || typeof key === 'number'),
    'update:modelValue': (value: string) => typeof value === 'string',
    'update:selectedKey': (key: SearchOptionKey | null) => key == null || typeof key === 'string' || typeof key === 'number'
  },
  setup(props, {attrs, emit}) {
    let componentInstance = getCurrentInstance();
    let generatedId = `vs-search-autocomplete-${++autocompleteId}`;
    let controlRef = ref<HTMLElement | null>(null);
    let inputRef = ref<HTMLInputElement | null>(null);
    let isHovered = ref(false);
    let isFocused = ref(false);
    let isFocusVisible = ref(false);
    let isOpen = ref(false);
    let activeOptionDomId = ref<string | null>(null);
    let popoverStyle = ref<CSSProperties>({});
    let showLoading = ref(false);
    let uncontrolledInputValue = ref(props.defaultInputValue);
    let uncontrolledSelectedKey = ref<SearchOptionKey | null>(props.defaultSelectedKey ?? null);
    let hasWarnedDeprecatedPlaceholder = ref(false);
    let loadingTimer: ReturnType<typeof setTimeout> | null = null;

    let hasProp = (propName: string) => {
      let vnodeProps = componentInstance?.vnode.props;
      if (!vnodeProps) {
        return false;
      }

      return Object.prototype.hasOwnProperty.call(vnodeProps, propName);
    };

    let isInputValueControlled = computed(() => (
      hasProp('inputValue')
      || hasProp('input-value')
      || hasProp('modelValue')
      || hasProp('model-value')
    ));
    let isSelectedKeyControlled = computed(() => hasProp('selectedKey') || hasProp('selected-key'));

    let inputId = computed(() => props.id ?? generatedId);
    let labelId = computed(() => props.label ? `${inputId.value}-label` : undefined);
    let listId = computed(() => `${inputId.value}-list`);

    let isDisabled = computed(() => props.isDisabled ?? props.disabled);
    let isInvalid = computed(() => (props.isInvalid || props.invalid || props.validationState === 'invalid') && !isDisabled.value);
    let isValid = computed(() => props.validationState === 'valid' && !isDisabled.value);
    let isAsync = computed(() => props.loadingState != null && props.loadingState !== 'idle');
    let resolvedInputValue = computed(() => {
      if (hasProp('inputValue') || hasProp('input-value')) {
        return props.inputValue ?? '';
      }

      if (hasProp('modelValue') || hasProp('model-value')) {
        return props.modelValue;
      }

      return uncontrolledInputValue.value;
    });
    let resolvedSelectedKey = computed<SearchOptionKey | null>(() => {
      if (isSelectedKeyControlled.value) {
        return props.selectedKey ?? null;
      }

      return uncontrolledSelectedKey.value;
    });

    let allOptions = computed(() => {
      if (props.items !== undefined) {
        return toOptionArray(props.items);
      }

      if (props.defaultItems !== undefined) {
        return toOptionArray(props.defaultItems);
      }

      return props.options;
    });
    let normalizedOptions = computed(() => allOptions.value.map((option, index) => normalizeOption(option, index)));
    let disabledKeySet = computed(() => {
      if (!isIterableKeyCollection(props.disabledKeys)) {
        return new Set<string>();
      }

      return new Set(Array.from(props.disabledKeys).map((key) => String(key)));
    });

    let filterOptions = (value: string) => {
      if (props.items !== undefined) {
        return normalizedOptions.value;
      }

      let query = value.trim().toLocaleLowerCase();
      if (!query) {
        return normalizedOptions.value;
      }

      return normalizedOptions.value.filter((option) => option.textValue.toLocaleLowerCase().includes(query));
    };

    let filteredOptions = computed(() => filterOptions(resolvedInputValue.value));
    let selectedOption = computed(() => {
      let selectedKey = normalizeKeyValue(resolvedSelectedKey.value);
      if (!selectedKey) {
        return null;
      }

      return normalizedOptions.value.find((option) => String(option.key) === selectedKey) ?? null;
    });
    let activeOption = computed(() => filteredOptions.value.find((option) => option.domId === activeOptionDomId.value) ?? null);
    let shouldShowMenu = computed(() => isOpen.value && (isAsync.value || filteredOptions.value.length > 0));
    let shouldShowLoadingIndicator = computed(() => {
      if (!showLoading.value) {
        return false;
      }

      return shouldShowMenu.value || props.menuTrigger === 'manual' || props.loadingState === 'loading';
    });
    let shouldShowClearButton = computed(() => {
      if (isDisabled.value || props.isReadOnly) {
        return false;
      }

      return resolvedInputValue.value !== '' || props.loadingState === 'filtering' || props.validationState != null;
    });
    let popoverPlacement = computed(() => props.direction === 'top' ? 'top' : 'bottom');

    watch(() => props.placeholder, (placeholder) => {
      if (placeholder && !hasWarnedDeprecatedPlaceholder.value && process.env.NODE_ENV !== 'production') {
        console.warn(SEARCH_AUTOCOMPLETE_PLACEHOLDER_WARNING);
        hasWarnedDeprecatedPlaceholder.value = true;
      }
    }, {immediate: true});

    watch(() => [props.loadingState, resolvedInputValue.value], ([loadingState, inputValue], previous) => {
      let prevLoadingState = previous?.[0];
      let prevInputValue = previous?.[1];
      let isLoading = loadingState === 'loading' || loadingState === 'filtering';

      if (!isLoading) {
        if (loadingTimer != null) {
          clearTimeout(loadingTimer);
          loadingTimer = null;
        }

        showLoading.value = false;
        return;
      }

      if (showLoading.value && loadingState === prevLoadingState && inputValue === prevInputValue) {
        return;
      }

      showLoading.value = false;
      if (loadingTimer != null) {
        clearTimeout(loadingTimer);
      }

      loadingTimer = setTimeout(() => {
        showLoading.value = true;
      }, 500);
    }, {immediate: true});

    watch(() => props.selectedKey, (selectedKey) => {
      if (!isSelectedKeyControlled.value || selectedKey == null || isInputValueControlled.value) {
        return;
      }

      let matchingOption = normalizedOptions.value.find((option) => String(option.key) === String(selectedKey));
      if (matchingOption) {
        uncontrolledInputValue.value = matchingOption.inputValueOnSelect ?? matchingOption.textValue;
      }
    }, {immediate: true});

    watch(() => shouldShowMenu.value, (nextOpen) => {
      if (!nextOpen) {
        activeOptionDomId.value = null;
      }

      if (!nextOpen) {
        return;
      }

      void nextTick(() => {
        resolvePopoverStyle();
      });
    });

    watch(() => [filteredOptions.value.length, props.loadingState, resolvedInputValue.value, isFocused.value, selectedOption.value?.key ?? null] as const, ([optionCount, loadingState, inputValue, focused, selectedKey]) => {
      if (!focused || props.menuTrigger === 'manual') {
        return;
      }

      let isLoading = loadingState != null && loadingState !== 'idle';
      if (!isOpen.value && inputValue !== '' && selectedKey == null && (isLoading || optionCount > 0)) {
        isOpen.value = true;
        emit('openChange', true, 'input');
      }

      if (isOpen.value && (isLoading || optionCount > 0)) {
        void nextTick(() => {
          resolvePopoverStyle();
        });
      }
    });

    let controlClassName = computed(() => classNames(
      inputGroupStyles,
      'spectrum-InputGroup',
      'spectrum-FocusRing',
      'spectrum-FocusRing-ring',
      fieldStyles,
      'spectrum-Field-field',
      {
        'spectrum-InputGroup--quiet': props.isQuiet,
        'is-disabled': isDisabled.value,
        'spectrum-InputGroup--invalid': isInvalid.value,
        'is-hovered': isHovered.value && !isDisabled.value,
        'is-focused': isFocused.value,
        'focus-ring': isFocusVisible.value
      },
      'searchautocomplete'
    ));

    let searchFieldClassName = computed(() => classNames(
      fieldStyles,
      'spectrum-Field',
      'spectrum-Field--positionTop',
      searchStyles,
      'spectrum-Search',
      'spectrum-Search--loadable',
      'spectrum-Textfield',
      {
        'is-disabled': isDisabled.value,
        'is-quiet': props.isQuiet,
        'spectrum-Search--invalid': isInvalid.value,
        'spectrum-Search--valid': isValid.value
      },
      textfieldStyles,
      'spectrum-Textfield-wrapper',
      {
        'spectrum-Textfield-wrapper--quiet': props.isQuiet
      },
      classNames(inputGroupStyles, 'spectrum-InputGroup-field')
    ));

    let textfieldClassName = computed(() => classNames(
      textfieldStyles,
      'spectrum-Textfield',
      'spectrum-FocusRing',
      'spectrum-FocusRing-ring',
      fieldStyles,
      'spectrum-Field-field'
    ));

    let inputClassName = computed(() => classNames(
      searchStyles,
      'spectrum-Search-input',
      textfieldStyles,
      'spectrum-Textfield-input',
      'i18nFontFamily',
      {
        'spectrum-Textfield-inputIcon': props.icon !== null,
        'is-hovered': isHovered.value && !isDisabled.value
      }
    ));

    let rootClassName = computed(() => classNames(
      fieldStyles,
      'spectrum-Field',
      'spectrum-Field--positionTop'
    ));

    let rootStyle = computed(() => {
      let width = dimensionValue(props.width);
      if (!width) {
        return attrs.style;
      }

      return [{width}, attrs.style as CSSProperties | undefined];
    });

    let labelClassName = computed(() => classNames(
      fieldStyles,
      'spectrum-FieldLabel'
    ));

    let iconClassName = computed(() => classNames(
      textfieldStyles,
      'spectrum-Icon',
      'spectrum-Textfield-icon'
    ));

    let clearButtonClassName = computed(() => classNames(
      buttonStyles,
      searchStyles,
      'spectrum-ClearButton',
      'spectrum-BaseButton',
      'i18nFontFamily',
      'spectrum-FocusRing',
      'spectrum-FocusRing-ring'
    ));

    let loadingIndicatorClassName = computed(() => classNames(
      textfieldStyles,
      'spectrum-Textfield-circleLoader',
      classNames(inputGroupStyles, 'spectrum-InputGroup-input-circleLoader'),
      classNames(searchStyles, 'spectrum-Search-circleLoader')
    ));

    let popoverClassName = computed(() => classNames(
      'spectrum-overlay',
      {
        'spectrum-overlay--open': true,
        [`spectrum-overlay--${popoverPlacement.value}--open`]: true
      },
      inputGroupStyles,
      'spectrum-InputGroup-popover',
      {
        'spectrum-InputGroup-popover--quiet': props.isQuiet
      }
    ));

    let rootAttrs = computed(() => {
      let next: Record<string, unknown> = {};
      for (let [key, value] of Object.entries(attrs)) {
        if (
          key === 'aria-label'
          || key === 'aria-labelledby'
          || key === 'autofocus'
          || key === 'class'
          || key === 'onBlur'
          || key === 'onFocus'
          || key === 'onInputChange'
          || key === 'onOpenChange'
          || key === 'onSelectionChange'
          || key === 'onSubmit'
          || key === 'style'
        ) {
          continue;
        }

        next[key] = value;
      }

      return next;
    });

    let externalAriaLabelledBy = computed(() => {
      let value = attrs['aria-labelledby'];
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    });

    let ariaLabelledBy = computed(() => {
      let parts = [labelId.value, externalAriaLabelledBy.value].filter((part): part is string => Boolean(part));
      return parts.length > 0 ? parts.join(' ') : undefined;
    });

    let ariaLabel = computed(() => {
      if (ariaLabelledBy.value) {
        return undefined;
      }

      let fromAttrs = attrs['aria-label'];
      if (typeof fromAttrs === 'string' && fromAttrs.length > 0) {
        return fromAttrs;
      }

      return undefined;
    });

    let iconNode = computed(() => {
      if (props.icon === null) {
        return null;
      }

      if (typeof props.icon === 'string') {
        let normalized = props.icon.trim().toLowerCase();
        if (normalized === '' || normalized === 'search') {
          return renderIconPath(
            `${iconClassName.value} spectrum-UIIcon-Magnifier`,
            MAGNIFIER_PATH,
            {'data-testid': 'searchicon'}
          );
        }

        if (normalized === 'filter') {
          return renderIconPath(
            `${iconClassName.value} spectrum-Icon--sizeS`,
            FILTER_PATH,
            {'data-testid': 'searchicon', 'fill-rule': 'evenodd'},
            '0 0 36 36'
          );
        }

        return h('span', {
          class: iconClassName.value,
          'data-testid': 'searchicon',
          'aria-hidden': 'true'
        }, props.icon);
      }

      if (props.icon !== undefined) {
        return h('span', {
          class: iconClassName.value,
          'data-testid': 'searchicon',
          'aria-hidden': 'true'
        }, [props.icon as never]);
      }

      return renderIconPath(
        `${iconClassName.value} spectrum-UIIcon-Magnifier`,
        MAGNIFIER_PATH,
        {'data-testid': 'searchicon'}
      );
    });

    let optionRowHeight = (option: NormalizedOption) => option.avatarSrc ? 34 : 32;
    let optionTop = (index: number) => {
      return DEFAULT_MENU_OFFSET + filteredOptions.value
        .slice(0, index)
        .reduce((height, option) => height + optionRowHeight(option), 0);
    };
    let listBoxVirtualizerHeight = computed(() => {
      let total = filteredOptions.value.reduce((height, option) => height + optionRowHeight(option), 0);
      return `${total + (filteredOptions.value.length > 0 ? DEFAULT_MENU_OFFSET * 2 : 0)}px`;
    });

    let emitValue = (value: string) => {
      if (!isInputValueControlled.value) {
        uncontrolledInputValue.value = value;
      }

      emit('update:modelValue', value);
      emit('change', value);
      emit('inputChange', value);
    };

    let updateSelectedKey = (key: SearchOptionKey | null, shouldEmit = true) => {
      if (!isSelectedKeyControlled.value) {
        uncontrolledSelectedKey.value = key;
      }

      if (!shouldEmit) {
        return;
      }

      emit('update:selectedKey', key);
      emit('selectionChange', key);
    };

    let openMenu = (trigger: MenuTrigger, autoFocus: 'first' | 'last' | 'none' = 'none') => {
      if (isDisabled.value || props.isReadOnly) {
        return;
      }

      let nextOptions = filteredOptions.value;
      if (!isAsync.value && nextOptions.length === 0) {
        return;
      }

      isOpen.value = true;
      if (autoFocus === 'first') {
        activeOptionDomId.value = nextOptions.find((option) => !option.disabled && !disabledKeySet.value.has(String(option.key)))?.domId ?? null;
      } else if (autoFocus === 'last') {
        let enabledOptions = nextOptions.filter((option) => !option.disabled && !disabledKeySet.value.has(String(option.key)));
        activeOptionDomId.value = enabledOptions.length > 0 ? enabledOptions[enabledOptions.length - 1].domId : null;
      } else {
        activeOptionDomId.value = null;
      }

      emit('openChange', true, trigger);
      void nextTick(() => {
        resolvePopoverStyle();
      });
    };

    let closeMenu = () => {
      if (!isOpen.value) {
        return;
      }

      isOpen.value = false;
      activeOptionDomId.value = null;
      emit('openChange', false);
    };

    let clearLoadingTimer = () => {
      if (loadingTimer != null) {
        clearTimeout(loadingTimer);
        loadingTimer = null;
      }
    };

    let resolvePopoverStyle = () => {
      let triggerRect = controlRef.value?.getBoundingClientRect();
      if (!triggerRect) {
        popoverStyle.value = {
          position: 'absolute',
          zIndex: '1'
        };
        return;
      }

      let style: CSSProperties = {
        left: `${window.scrollX + triggerRect.left}px`,
        minWidth: props.isQuiet
          ? `calc(${triggerRect.width}px + calc(2 * var(--spectrum-dropdown-quiet-offset)))`
          : `${triggerRect.width}px`,
        position: 'absolute',
        top: `${window.scrollY + triggerRect.bottom + DEFAULT_MENU_OFFSET}px`,
        transform: 'translateX(0) translateY(0)',
        zIndex: '1'
      };

      if (props.direction === 'top') {
        style.top = `${window.scrollY + triggerRect.top - DEFAULT_MENU_OFFSET}px`;
        style.transform = props.align === 'end'
          ? 'translateX(-100%) translateY(-100%)'
          : 'translateX(0) translateY(-100%)';
        if (props.align === 'end') {
          style.left = `${window.scrollX + triggerRect.right}px`;
        }
      } else if (props.align === 'end') {
        style.left = `${window.scrollX + triggerRect.right}px`;
        style.transform = 'translateX(-100%) translateY(0)';
      }

      let menuWidth = dimensionValue(props.menuWidth);
      if (menuWidth) {
        style.width = menuWidth;
      } else if (!props.isQuiet) {
        style.width = `${triggerRect.width}px`;
      }

      popoverStyle.value = style;
    };

    let moveActiveOption = (direction: -1 | 1) => {
      let enabledOptions = filteredOptions.value.filter((option) => !option.disabled && !disabledKeySet.value.has(String(option.key)));
      if (enabledOptions.length === 0) {
        activeOptionDomId.value = null;
        return;
      }

      let currentIndex = enabledOptions.findIndex((option) => option.domId === activeOptionDomId.value);
      if (currentIndex < 0) {
        activeOptionDomId.value = direction > 0 ? enabledOptions[0].domId : enabledOptions[enabledOptions.length - 1].domId;
        return;
      }

      let nextIndex = Math.max(0, Math.min(enabledOptions.length - 1, currentIndex + direction));
      activeOptionDomId.value = enabledOptions[nextIndex].domId;
    };

    let selectOption = (option: NormalizedOption, shouldSubmit = false) => {
      if (option.disabled || disabledKeySet.value.has(String(option.key))) {
        return;
      }

      updateSelectedKey(option.key);
      emitValue(option.inputValueOnSelect ?? option.textValue);
      closeMenu();

      if (shouldSubmit) {
        emit('submit', null, option.key);
      }
    };

    let emitSubmit = () => {
      let selected = selectedOption.value;
      let currentValue = resolvedInputValue.value;
      let selectedInputValue = selected ? (selected.inputValueOnSelect ?? selected.textValue) : null;
      if (selected && selectedInputValue === currentValue) {
        emit('submit', null, selected.key);
        return;
      }

      emit('submit', currentValue === '' ? null : currentValue, null);
    };

    let onWindowLayoutChange = () => {
      if (!shouldShowMenu.value) {
        return;
      }

      resolvePopoverStyle();
    };

    onMounted(() => {
      window.addEventListener('resize', onWindowLayoutChange);
      window.addEventListener('scroll', onWindowLayoutChange, true);
    });

    onBeforeUnmount(() => {
      clearLoadingTimer();
      window.removeEventListener('resize', onWindowLayoutChange);
      window.removeEventListener('scroll', onWindowLayoutChange, true);
    });

    return () => h('div', {
      ...rootAttrs.value,
      class: [rootClassName.value, attrs.class],
      style: rootStyle.value
    }, [
      props.label ? h('label', {id: labelId.value, class: labelClassName.value, for: inputId.value}, props.label) : null,
      h('div', {
        ref: controlRef,
        class: controlClassName.value,
        onMouseenter: () => {
          if (!isDisabled.value) {
            isHovered.value = true;
          }
        },
        onMouseleave: () => {
          isHovered.value = false;
        }
      }, [
        h('div', {
          class: searchFieldClassName.value
        }, [
          h('div', {class: textfieldClassName.value}, [
            iconNode.value,
            h('input', {
              ref: inputRef,
              id: inputId.value,
              class: inputClassName.value,
              type: 'text',
              value: resolvedInputValue.value,
              placeholder: props.placeholder || undefined,
              disabled: isDisabled.value,
              readonly: props.isReadOnly || undefined,
              autocomplete: 'off',
              autocorrect: 'off',
              spellcheck: 'false',
              role: 'combobox',
              tabindex: 0,
              'aria-activedescendant': shouldShowMenu.value && activeOptionDomId.value ? `${listId.value}-option-${activeOptionDomId.value}` : undefined,
              'aria-autocomplete': 'list',
              'aria-controls': shouldShowMenu.value ? listId.value : undefined,
              'aria-expanded': shouldShowMenu.value ? 'true' : 'false',
              'aria-invalid': isInvalid.value ? 'true' : undefined,
              'aria-label': ariaLabel.value,
              'aria-labelledby': ariaLabelledBy.value,
              autofocus: props.autoFocus || attrs.autofocus || undefined,
              onInput: (event: Event) => {
                let target = event.currentTarget as HTMLInputElement | null;
                let nextValue = target?.value ?? '';
                let previousSelectedValue = selectedOption.value ? (selectedOption.value.inputValueOnSelect ?? selectedOption.value.textValue) : null;
                if (previousSelectedValue != null && previousSelectedValue !== nextValue) {
                  updateSelectedKey(null, false);
                }

                emitValue(nextValue);

                if (props.menuTrigger === 'manual') {
                  return;
                }

                let nextOptions = filterOptions(nextValue);
                if (isAsync.value || nextOptions.length > 0) {
                  isOpen.value = true;
                  activeOptionDomId.value = null;
                  emit('openChange', true, 'input');
                  void nextTick(() => {
                    resolvePopoverStyle();
                  });
                } else {
                  closeMenu();
                }
              },
              onFocus: (event: FocusEvent) => {
                isFocused.value = true;
                let target = getEventTarget(event);
                isFocusVisible.value = target instanceof HTMLElement ? target.matches(':focus-visible') : false;
                if (props.menuTrigger === 'focus') {
                  openMenu('focus');
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
                  if (!shouldShowMenu.value) {
                    openMenu('manual', 'first');
                  } else {
                    moveActiveOption(1);
                  }
                  return;
                }

                if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  if (!shouldShowMenu.value) {
                    openMenu('manual', 'last');
                  } else {
                    moveActiveOption(-1);
                  }
                  return;
                }

                if (event.key === 'Enter') {
                  if (shouldShowMenu.value && activeOption.value) {
                    event.preventDefault();
                    selectOption(activeOption.value, true);
                    return;
                  }

                  emitSubmit();
                  return;
                }

                if (event.key === 'Escape') {
                  closeMenu();
                }
              }
            }),
            shouldShowLoadingIndicator.value
              ? h(ProgressCircle, {
                ariaLabel: 'Loading',
                class: loadingIndicatorClassName.value,
                isIndeterminate: true,
                size: 'S'
              })
              : null,
            shouldShowClearButton.value
              ? h('div', {
                class: clearButtonClassName.value,
                role: 'button',
                'data-react-aria-pressable': 'true',
                'aria-label': 'Clear search',
                'aria-hidden': 'true',
                onMousedown: (event: MouseEvent) => {
                  event.preventDefault();
                  inputRef.value?.focus();
                },
                onClick: () => {
                  updateSelectedKey(null);
                  emitValue('');
                  emit('clear');
                  inputRef.value?.focus();
                  if (!isAsync.value && filteredOptions.value.length === 0) {
                    closeMenu();
                  }
                }
              }, [
                renderIconPath(
                  classNames(buttonStyles, 'spectrum-Icon', 'spectrum-UIIcon-CrossSmall', 'spectrum-Icon'),
                  CLEAR_PATH
                )
              ])
              : null,
            isInvalid.value
              ? renderIconPath(
                classNames(textfieldStyles, 'spectrum-Icon', 'spectrum-UIIcon-AlertMedium', 'spectrum-Textfield-validationIcon'),
                ALERT_PATH
              )
              : null
          ])
        ])
      ]),
      shouldShowMenu.value
        ? h(Popover, {
          container: 'body',
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
            h('div', {
              id: listId.value,
              role: 'listbox',
              class: classNames(menuStyles, 'spectrum-Menu'),
              'aria-label': 'Suggestions',
              'aria-labelledby': [listId.value, labelId.value].filter((part): part is string => Boolean(part)).join(' ') || undefined,
              style: {
                overflow: 'hidden auto',
                padding: '0px',
                position: 'relative'
              }
            }, [
              filteredOptions.value.length > 0
                ? h('div', {
                  role: 'presentation',
                  style: {
                    height: listBoxVirtualizerHeight.value,
                    pointerEvents: 'auto',
                    position: 'relative'
                  }
                }, filteredOptions.value.map((option, index) => h('div', {
                  key: `${option.domId}-${index}`,
                  role: 'presentation',
                  style: {
                    contain: 'size layout style',
                    height: `${optionRowHeight(option)}px`,
                    left: '0px',
                    opacity: 1,
                    overflow: 'visible',
                    position: 'absolute',
                    top: `${optionTop(index)}px`,
                    width: '100%',
                    zIndex: 0
                  }
                }, [
                  h('div', {
                    id: `${listId.value}-option-${option.domId}`,
                    role: 'option',
                    'aria-disabled': option.disabled || disabledKeySet.value.has(String(option.key)) ? 'true' : undefined,
                    'aria-labelledby': `${listId.value}-option-${option.domId}-label`,
                    'aria-posinset': String(index + 1),
                    'aria-selected': selectedOption.value && String(selectedOption.value.key) === String(option.key) ? 'true' : 'false',
                    'aria-setsize': String(filteredOptions.value.length),
                    'data-key': String(option.key),
                    'data-react-aria-pressable': option.disabled || disabledKeySet.value.has(String(option.key)) ? undefined : 'true',
                    class: classNames(
                      menuStyles,
                      'spectrum-Menu-item',
                      {
                        'is-disabled': option.disabled || disabledKeySet.value.has(String(option.key)),
                        'is-focused': activeOptionDomId.value === option.domId && !(option.disabled || disabledKeySet.value.has(String(option.key))),
                        'is-selected': selectedOption.value && String(selectedOption.value.key) === String(option.key),
                        'is-selectable': true
                      }
                    ),
                    onMouseenter: () => {
                      if (!(option.disabled || disabledKeySet.value.has(String(option.key)))) {
                        activeOptionDomId.value = option.domId;
                      }
                    },
                    onMousedown: (event: MouseEvent) => {
                      if (option.disabled || disabledKeySet.value.has(String(option.key))) {
                        event.preventDefault();
                        return;
                      }

                      event.preventDefault();
                      selectOption(option, true);
                    }
                  }, [
                    h('div', {
                      class: classNames(menuStyles, 'spectrum-Menu-itemGrid'),
                      style: {
                        display: 'grid'
                      }
                    }, [
                      option.avatarSrc
                        ? h(Avatar, {
                          alt: '',
                          src: option.avatarSrc,
                          class: classNames(menuStyles, 'spectrum-Menu-avatar')
                        })
                        : null,
                      h('span', {
                        id: `${listId.value}-option-${option.domId}-label`,
                        role: 'none',
                        class: classNames(menuStyles, 'spectrum-Menu-itemLabel')
                      }, option.textValue)
                    ])
                  ])
                ])))
                : null,
              filteredOptions.value.length === 0 && isAsync.value && props.loadingState !== 'loading' && props.loadingState !== 'filtering'
                ? h('span', {
                  class: 'no-results'
                }, 'No results')
                : null,
              props.loadingState === 'loadingMore'
                ? h('div', {
                  class: classNames(menuStyles, 'spectrum-Menu-item'),
                  role: 'presentation',
                  'aria-hidden': 'true'
                }, [
                  h(ProgressCircle, {
                    class: 'vs-searchautocomplete__listbox-loading',
                    ariaLabel: 'Loading more',
                    isIndeterminate: true,
                    size: 'S'
                  })
                ])
                : null
            ])
          ]
        })
        : null
    ]);
  }
});

export const Autocomplete = SearchAutocomplete;
export const VueSearchAutocomplete = SearchAutocomplete;

export {Item, Section};
export type {SpectrumSearchAutocompleteProps} from '@vue-types/autocomplete';
