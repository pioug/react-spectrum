import {computed, defineComponent, h, inject, type InjectionKey, type PropType, provide, ref, unref, watch} from 'vue';
import {useSelectableList as createSelectableList, type SelectionKey} from '@vue-aria/selection';
import {useStepList as createStepList, useStepListItem as createStepListItem, type StepListState} from '@vue-aria/steplist';

export type StepListValue = SelectionKey | null;

export interface StepListItemData {
  disabled?: boolean,
  key: SelectionKey,
  label: string
}

interface StepListContextValue {
  getItemIndex: (key: SelectionKey) => number,
  state: StepListState
}

const stepListContextKey: InjectionKey<StepListContextValue> = Symbol('VueStepListContext');

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
      let index = context.getItemIndex(props.item.key);
      return index >= 0 ? index : 0;
    });
    let isSelected = computed(() => unref(context.state.selectedKey) === props.item.key);
    let isDisabled = computed(() => !context.state.isSelectable(props.item.key));

    return () => {
      let stepProps = stepItem.stepProps.value;

      return h('li', {
        class: [
          'vs-steplist__item',
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
            isSelected.value ? 'is-selected' : null,
            isDisabled.value ? 'is-disabled' : null
          ],
          onClick: (event: MouseEvent) => {
            event.preventDefault();
            stepProps.onClick();
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
      type: Array as PropType<SelectionKey[]>,
      default: () => []
    },
    items: {
      type: Array as PropType<StepListItemData[]>,
      default: () => []
    },
    modelValue: {
      type: [String, Number] as PropType<StepListValue>,
      default: null
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal'
    }
  },
  emits: {
    'update:modelValue': (value: StepListValue) => value === null || typeof value === 'number' || typeof value === 'string',
    change: (value: StepListValue) => value === null || typeof value === 'number' || typeof value === 'string'
  },
  setup(props, {attrs, emit}) {
    let selectedKeys = ref(new Set<SelectionKey>());
    let disabledKeySet = computed(() => {
      let keys = new Set<SelectionKey>(props.disabledKeys);
      for (let item of props.items) {
        if (item.disabled) {
          keys.add(item.key);
        }
      }

      return keys;
    });
    let selectableList = createSelectableList({
      selectedKeys,
      selectionMode: 'single'
    });
    let selectedKey = computed(() => props.modelValue ?? null);

    let state: StepListState = {
      isSelectable: (key) => !disabledKeySet.value.has(key),
      selectedKey,
      selectionManager: selectableList.selectionManager as StepListState['selectionManager']
    };
    let stepList = createStepList(state, {
      ariaLabel: computed(() => props.ariaLabel)
    });

    watch(() => props.modelValue, (value) => {
      if (value === null || value === undefined) {
        selectedKeys.value = new Set();
        return;
      }

      selectedKeys.value = new Set([value]);
    }, {immediate: true});

    watch(selectedKeys, (next) => {
      let selection = next.values().next();
      let value: StepListValue = selection.done ? null : selection.value;

      if (value === (props.modelValue ?? null)) {
        return;
      }

      emit('update:modelValue', value);
      emit('change', value);
    }, {deep: true});

    provide(stepListContextKey, {
      state,
      getItemIndex: (key: SelectionKey) => props.items.findIndex((item) => item.key === key)
    });

    let classes = computed(() => ([
      'vs-steplist',
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
