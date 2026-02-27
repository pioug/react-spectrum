import {computed, defineComponent, h, inject, type InjectionKey, type PropType, provide, ref, watch} from 'vue';
import {useStepList as createStepList, useStepListItem as createStepListItem} from '@vue-aria/steplist';
import type {SelectionKey} from '@vue-aria/selection';
import {useStepListState as createStepListState, type StepListState} from '@vue-stately/steplist';

export type StepListValue = SelectionKey | null;
type StepListSize = 'S' | 'M' | 'L' | 'XL';

export interface StepListItemData {
  disabled?: boolean,
  key: SelectionKey,
  label: string
}

interface StepListContextValue {
  state: StepListState<StepListItemData>
}

const stepListContextKey: InjectionKey<StepListContextValue> = Symbol('VueStepListContext');

function isStepListValue(value: unknown): value is StepListValue {
  return value === null || typeof value === 'string' || typeof value === 'number';
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

    let stepItem = createStepListItem({key: props.item.key}, context.state);
    let itemIndex = computed(() => {
      let index = context.state.collection.getItem(props.item.key)?.index ?? 0;
      return index >= 0 ? index : 0;
    });
    let isSelected = computed(() => context.state.selectedKey.value === props.item.key);
    let isCompleted = computed(() => context.state.isCompleted(props.item.key));
    let isSelectable = computed(() => context.state.isSelectable(props.item.key));
    let isDisabled = computed(() => !isSelectable.value);

    return () => {
      let stepProps = stepItem.stepProps.value;

      return h('li', {
        class: [
          'vs-steplist__item',
          isCompleted.value ? 'is-completed' : null,
          isSelectable.value ? 'is-selectable' : null,
          isSelected.value ? 'is-selected' : null,
          isDisabled.value ? 'is-disabled' : null
        ]
      }, [
        h('a', {
          role: stepProps.role,
          tabIndex: stepProps.tabIndex,
          href: '#',
          'aria-current': stepProps['aria-current'],
          'aria-disabled': stepProps['aria-disabled'],
          'aria-selected': stepProps['aria-selected'],
          class: [
            'vs-steplist__link',
            isCompleted.value ? 'is-completed' : null,
            isSelectable.value ? 'is-selectable' : null,
            isSelected.value ? 'is-selected' : null,
            isDisabled.value ? 'is-disabled' : null
          ],
          onClick: (event: MouseEvent) => {
            event.preventDefault();
            stepProps.onClick?.();
          },
          onKeydown: stepProps.onKeyDown
        }, [
          h('span', {
            class: 'vs-steplist__marker',
            'aria-hidden': 'true'
          }, String(itemIndex.value + 1)),
          h('span', {
            class: 'vs-steplist__label'
          }, props.item.label)
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
      default: 'Step list'
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
    let selectedKeyRef = ref<StepListValue>(props.defaultSelectedKey ?? null);
    let lastCompletedStepRef = ref<StepListValue | undefined>(undefined);
    let disabledKeySet = new Set<SelectionKey>(props.disabledKeys);
    for (let item of props.items) {
      if (item.disabled) {
        disabledKeySet.add(item.key);
      }
    }

    watch(() => [props.modelValue, props.selectedKey], ([modelValue, selectedKey]) => {
      let controlledValue = selectedKey !== undefined ? selectedKey : modelValue;
      if (controlledValue === undefined) {
        return;
      }

      selectedKeyRef.value = controlledValue ?? null;
    }, {immediate: true});

    watch(() => props.lastCompletedStep, (value) => {
      lastCompletedStepRef.value = value;
    }, {immediate: true});

    let state = createStepListState<StepListItemData>({
      collection: computed(() => props.items.map((item) => ({
        key: item.key,
        rendered: item.label,
        textValue: item.label,
        type: 'item',
        value: item
      }))),
      defaultLastCompletedStep: props.defaultLastCompletedStep,
      defaultSelectedKey: props.defaultSelectedKey ?? null,
      disabledKeys: disabledKeySet,
      isDisabled: computed(() => props.isDisabled),
      isReadOnly: computed(() => props.isReadOnly),
      lastCompletedStep: lastCompletedStepRef,
      onLastCompletedStepChange: (key) => {
        let value = key ?? null;
        props.onLastCompletedStepChange?.(value);
        emit('update:lastCompletedStep', value);
        emit('lastCompletedStepChange', value);
      },
      onSelectionChange: (key) => {
        let value = key ?? null;
        props.onSelectionChange?.(value);
        emit('update:modelValue', value);
        emit('update:selectedKey', value);
        emit('change', value);
        emit('selectionChange', value);
      },
      selectedKey: selectedKeyRef
    });

    let stepList = createStepList(state, {
      ariaLabel: computed(() => props.ariaLabel)
    });

    provide(stepListContextKey, {
      state
    });

    let classes = computed(() => ([
      'vs-steplist',
      props.isEmphasized ? 'vs-steplist--emphasized' : null,
      props.size === 'S' ? 'vs-steplist--small' : null,
      props.size === 'M' ? 'vs-steplist--medium' : null,
      props.size === 'L' ? 'vs-steplist--large' : null,
      props.size === 'XL' ? 'vs-steplist--xlarge' : null,
      props.orientation === 'vertical' ? 'vs-steplist--vertical' : 'vs-steplist--horizontal'
    ]));

    return () => h('ol', {
      ...attrs,
      ...stepList.listProps.value,
      class: [classes.value, attrs.class],
      'data-vac': ''
    }, props.items.map((item) => h(VueStepListRow, {
      key: String(item.key),
      item
    })));
  }
});
