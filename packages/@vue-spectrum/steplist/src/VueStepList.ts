import '@adobe/spectrum-css-temp/components/steplist/vars.css';
import {computed, defineComponent, h, inject, mergeProps, type InjectionKey, type PropType, provide, ref, watch} from 'vue';
import {filterDOMProps, getEventTarget, useId} from '@vue-aria/utils';
import {classNames} from '@vue-spectrum/utils';
import {useStepList as createStepList, useStepListItem as createStepListItem} from '@vue-aria/steplist';
import type {SelectionKey} from '@vue-aria/selection';
import {useHover} from '@vue-aria/interactions';
import {useLocale, useNumberFormatter} from '@vue-aria/i18n';
import {VisuallyHidden} from '@vue-aria/visually-hidden';
import {useProviderProps} from '@vue-spectrum/provider';
import {useStepListState as createStepListState, type StepListState} from '@vue-stately/steplist';

export type StepListValue = SelectionKey | null;
type StepListSize = 'S' | 'M' | 'L' | 'XL';
const CHEVRON_RIGHT_MEDIUM_PATH = 'M5.99 5a.997.997 0 0 0-.293-.707L1.717.303A1 1 0 1 0 .303 1.717L3.586 5 .303 8.283a1 1 0 1 0 1.414 1.414l3.98-3.99A.997.997 0 0 0 5.99 5z';
const STEP_STATE_TEXT = {
  completed: 'Completed: ',
  current: 'Current: ',
  notCompleted: 'Not completed: '
} as const;
const styles: {[key: string]: string} = {};

export interface StepListItemData {
  disabled?: boolean,
  key: SelectionKey,
  label: string
}

interface StepListContextValue {
  isDisabled: Readonly<{value: boolean}>,
  isReadOnly: Readonly<{value: boolean}>,
  state: StepListState<StepListItemData>
}

const stepListContextKey: InjectionKey<StepListContextValue> = Symbol('VueStepListContext');

function isStepListValue(value: unknown): value is StepListValue {
  return value === null || typeof value === 'string' || typeof value === 'number';
}

function toSelectionKeys(value: unknown): SelectionKey[] {
  if (value == null) {
    return [];
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return [value];
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] === 'function') {
    return Array.from(value as Iterable<unknown>).filter((key): key is SelectionKey => typeof key === 'string' || typeof key === 'number');
  }

  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).filter((key): key is SelectionKey => typeof key === 'string' || typeof key === 'number');
  }

  return [];
}

const VueStepListRow = defineComponent({
  name: 'VueStepListRow',
  props: {
    item: {
      type: Object as PropType<StepListItemData>,
      required: true
    }
  },
  setup(props) {
    let context = inject(stepListContextKey);
    if (!context) {
      throw new Error('VueStepListRow must be rendered inside VueStepList.');
    }

    let markerId = useId();
    let labelId = useId();
    let isFocusVisible = ref(false);
    let stepItem = createStepListItem({key: props.item.key}, context.state);
    let {direction} = useLocale();
    let numberFormatter = useNumberFormatter();
    let itemIndex = computed(() => {
      let index = context.state.collection.getItem(props.item.key)?.index ?? 0;
      return index >= 0 ? index : 0;
    });
    let isSelected = computed(() => context.state.selectedKey.value === props.item.key);
    let isCompleted = computed(() => context.state.isCompleted(props.item.key));
    let isItemDisabled = computed(() => context.isDisabled.value || context.state.disabledKeys.has(props.item.key));
    let isSelectable = computed(() => context.state.isSelectable(props.item.key) && !isSelected.value);
    let stepStateText = computed(() => {
      if (isSelected.value) {
        return STEP_STATE_TEXT.current;
      }

      if (isCompleted.value) {
        return STEP_STATE_TEXT.completed;
      }

      return STEP_STATE_TEXT.notCompleted;
    });
    let {hoverProps, isHovered} = useHover({
      isDisabled: computed(() => isItemDisabled.value || isSelected.value || context.isReadOnly.value)
    });

    return () => {
      let stepProps = stepItem.stepProps.value;

      return h('li', {
        class: classNames(styles, 'spectrum-Steplist-item')
      }, [
        h('a', mergeProps(
          hoverProps.value as Record<string, unknown>,
          {
            role: stepProps.role,
            tabIndex: stepProps.tabIndex,
            href: '#',
            'aria-current': stepProps['aria-current'],
            'aria-disabled': stepProps['aria-disabled'],
            'aria-labelledby': `${markerId} ${labelId}`,
            class: classNames(
              styles,
              'spectrum-Steplist-link',
              {
                'focus-ring': isFocusVisible.value,
                'is-completed': isCompleted.value,
                'is-disabled': isItemDisabled.value,
                'is-hovered': isHovered.value,
                'is-selectable': isSelectable.value,
                'is-selected': isSelected.value && !isItemDisabled.value
              }
            ),
            onBlur: () => {
              isFocusVisible.value = false;
            },
            onClick: (event: MouseEvent) => {
              event.preventDefault();
              stepProps.onClick?.(event);
            },
            onFocus: (event: FocusEvent) => {
              let target = getEventTarget(event);
              isFocusVisible.value = target instanceof HTMLElement ? target.matches(':focus-visible') : false;
            },
            onKeydown: (event: KeyboardEvent) => {
              stepProps.onKeyDown?.(event);
            }
          }
        ), [
          h(VisuallyHidden, {
            elementType: 'span'
          }, {
            default: () => stepStateText.value
          }),
          h('div', {
            id: labelId,
            'aria-hidden': 'true',
            class: classNames(styles, 'spectrum-Steplist-label')
          }, props.item.label),
          h('div', {
            class: classNames(
              styles,
              'spectrum-Steplist-segment',
              {'is-completed': isCompleted.value}
            )
          }, [
            h('svg', {
              class: classNames(styles, 'spectrum-Steplist-segmentLine'),
              xmlns: 'http://www.w3.org/2000/svg',
              height: '100%',
              viewBox: '0 0 2 8',
              preserveAspectRatio: 'none'
            }, [
              h('line', {
                x1: '1',
                y1: '0',
                x2: '1',
                y2: '8',
                vectorEffect: 'non-scaling-stroke'
              })
            ]),
            h('svg', {
              class: [
                classNames(styles, 'spectrum-Steplist-chevron', {
                  'is-reversed': direction === 'rtl'
                }),
                'spectrum-Icon',
                'spectrum-UIIcon-ChevronRightMedium'
              ],
              focusable: 'false',
              'aria-hidden': 'true',
              role: 'img',
              viewBox: '0 0 6 10',
              width: '6',
              height: '10'
            }, [
              h('path', {d: CHEVRON_RIGHT_MEDIUM_PATH})
            ])
          ]),
          h('div', {
            'aria-hidden': 'true',
            class: classNames(styles, 'spectrum-Steplist-markerWrapper')
          }, [
            h('div', {
              id: markerId,
              class: classNames(styles, 'spectrum-Steplist-marker')
            }, numberFormatter.format(itemIndex.value + 1))
          ])
        ])
      ]);
    };
  }
});

export const VueStepList = defineComponent({
  name: 'VueStepList',
  props: {
    ariaLabel: {
      type: String,
      default: undefined
    },
    disabledKeys: {
      type: [Array, Set] as PropType<Iterable<SelectionKey>>,
      default: () => []
    },
    items: {
      type: Array as PropType<StepListItemData[]>,
      default: () => []
    },
    defaultLastCompletedStep: {
      type: [String, Number] as PropType<StepListValue>,
      default: null
    },
    defaultSelectedKey: {
      type: [String, Number] as PropType<StepListValue>,
      default: undefined
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isEmphasized: {
      type: Boolean,
      default: false
    },
    isReadOnly: {
      type: Boolean,
      default: false
    },
    lastCompletedStep: {
      type: [String, Number] as PropType<StepListValue | undefined>,
      default: undefined
    },
    modelValue: {
      type: [String, Number] as PropType<StepListValue | undefined>,
      default: undefined
    },
    onLastCompletedStepChange: {
      type: Function as PropType<((value: StepListValue) => void) | undefined>,
      default: undefined
    },
    onSelectionChange: {
      type: Function as PropType<((value: StepListValue) => void) | undefined>,
      default: undefined
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal'
    },
    selectedKey: {
      type: [String, Number] as PropType<StepListValue | undefined>,
      default: undefined
    },
    size: {
      type: String as PropType<StepListSize>,
      default: 'M'
    }
  },
  emits: {
    change: (value: StepListValue) => isStepListValue(value),
    lastCompletedStepChange: (value: StepListValue) => isStepListValue(value),
    selectionChange: (value: StepListValue) => isStepListValue(value),
    'update:lastCompletedStep': (value: StepListValue) => isStepListValue(value),
    'update:modelValue': (value: StepListValue) => isStepListValue(value),
    'update:selectedKey': (value: StepListValue) => isStepListValue(value)
  },
  setup(props, {attrs, emit}) {
    let providerProps = useProviderProps(props);
    let resolvedProps = computed(() => Object.assign({}, providerProps, props));
    let selectedKeyRef = ref<StepListValue>(resolvedProps.value.defaultSelectedKey ?? null);
    let lastCompletedStepRef = ref<StepListValue | undefined>(resolvedProps.value.defaultLastCompletedStep ?? undefined);
    let isDisabled = computed(() => Boolean(resolvedProps.value.isDisabled));
    let isReadOnly = computed(() => Boolean(resolvedProps.value.isReadOnly));
    let isSelectedControlled = computed(() => resolvedProps.value.selectedKey !== undefined || resolvedProps.value.modelValue !== undefined);
    let isLastCompletedControlled = computed(() => resolvedProps.value.lastCompletedStep !== undefined);
    let findItemIndexByKey = (key: StepListValue | undefined): number => {
      if (key === null || key === undefined) {
        return -1;
      }

      return resolvedProps.value.items.findIndex((item) => item.key === key);
    };
    let syncLastCompletedFromControlledSelection = (nextSelectedKey: StepListValue | undefined) => {
      if (isLastCompletedControlled.value || nextSelectedKey === null || nextSelectedKey === undefined) {
        return;
      }

      let selectedIndex = findItemIndexByKey(nextSelectedKey);
      if (selectedIndex <= 0) {
        return;
      }

      let completedIndex = findItemIndexByKey(lastCompletedStepRef.value);
      if (completedIndex >= selectedIndex - 1) {
        return;
      }

      let nextLastCompletedStep = resolvedProps.value.items[selectedIndex - 1]?.key;
      if (nextLastCompletedStep === undefined || lastCompletedStepRef.value === nextLastCompletedStep) {
        return;
      }

      lastCompletedStepRef.value = nextLastCompletedStep;
      resolvedProps.value.onLastCompletedStepChange?.(nextLastCompletedStep);
      emit('update:lastCompletedStep', nextLastCompletedStep);
      emit('lastCompletedStepChange', nextLastCompletedStep);
    };
    let disabledKeySet = computed(() => {
      let keys = new Set<SelectionKey>(toSelectionKeys(resolvedProps.value.disabledKeys));
      for (let item of resolvedProps.value.items) {
        if (item.disabled) {
          keys.add(item.key);
        }
      }
      return keys;
    });

    watch(() => [resolvedProps.value.modelValue, resolvedProps.value.selectedKey], ([modelValue, selectedKey]) => {
      let controlledValue = selectedKey !== undefined ? selectedKey : modelValue;
      if (controlledValue === undefined) {
        return;
      }

      selectedKeyRef.value = controlledValue ?? null;
      syncLastCompletedFromControlledSelection(controlledValue ?? null);
    }, {immediate: true});

    watch(() => resolvedProps.value.lastCompletedStep, (value) => {
      if (isLastCompletedControlled.value) {
        lastCompletedStepRef.value = value;
      }
    }, {immediate: true});

    let state = createStepListState<StepListItemData>({
      collection: computed(() => resolvedProps.value.items.map((item) => ({
        key: item.key,
        rendered: item.label,
        textValue: item.label,
        type: 'item',
        value: item
      }))),
      defaultLastCompletedStep: resolvedProps.value.defaultLastCompletedStep ?? null,
      defaultSelectedKey: resolvedProps.value.defaultSelectedKey ?? null,
      get disabledKeys() {
        return disabledKeySet.value;
      },
      isDisabled,
      isReadOnly,
      lastCompletedStep: lastCompletedStepRef,
      onLastCompletedStepChange: (key) => {
        let value = key ?? null;
        if (!isLastCompletedControlled.value) {
          lastCompletedStepRef.value = value;
        }

        resolvedProps.value.onLastCompletedStepChange?.(value);
        emit('update:lastCompletedStep', value);
        emit('lastCompletedStepChange', value);
      },
      onSelectionChange: (key) => {
        let value = key ?? null;
        if (!isSelectedControlled.value) {
          selectedKeyRef.value = value;
        }

        resolvedProps.value.onSelectionChange?.(value);
        emit('update:modelValue', value);
        emit('update:selectedKey', value);
        emit('change', value);
        emit('selectionChange', value);
      },
      selectedKey: selectedKeyRef
    });

    let stepList = createStepList(state, {
      ariaLabel: computed(() => resolvedProps.value.ariaLabel),
      ariaLabelledby: computed(() => {
        let labelledby = attrs['aria-labelledby'];
        return typeof labelledby === 'string' ? labelledby : undefined;
      })
    });

    provide(stepListContextKey, {
      isDisabled,
      isReadOnly,
      state
    });

    return () => {
      let domProps = filterDOMProps(attrs as Record<string, unknown>, {labelable: true}) as Record<string, unknown>;
      let {
        class: domClass,
        className: domClassName,
        style: domStyle,
        ...otherDomProps
      } = domProps;

      return h('ol', {
        ...stepList.listProps.value,
        ...otherDomProps,
        class: [
          classNames(styles, 'spectrum-Steplist', {
            'spectrum-Steplist--small': resolvedProps.value.size === 'S',
            'spectrum-Steplist--medium': resolvedProps.value.size === 'M',
            'spectrum-Steplist--large': resolvedProps.value.size === 'L',
            'spectrum-Steplist--xlarge': resolvedProps.value.size === 'XL',
            'spectrum-Steplist--emphasized': Boolean(resolvedProps.value.isEmphasized),
            'spectrum-Steplist--horizontal': resolvedProps.value.orientation === 'horizontal',
            'spectrum-Steplist--vertical': resolvedProps.value.orientation === 'vertical'
          }),
          domClassName,
          domClass
        ],
        style: domStyle
      }, resolvedProps.value.items.map((item) => h(VueStepListRow, {
        key: item.key,
        item
      })));
    };
  }
});
