import {computed, defineComponent, h, inject, type InjectionKey, type PropType, provide, ref, watch} from 'vue';
import {useTag as createTag, useTagGroup as createTagGroup, type TagGroupAria} from '@vue-aria/tag';

export interface TagItemData {
  description?: string,
  disabled?: boolean,
  key: string,
  label: string
}

interface TagNode {
  description?: string,
  index: number,
  isDisabled?: boolean,
  key: string,
  textValue?: string
}

interface TagGroupContextValue {
  getLabel: (key: string) => string,
  tagGroup: TagGroupAria
}

const tagGroupContextKey: InjectionKey<TagGroupContextValue> = Symbol('VueTagGroupContext');
type TagGroupSelectionValue = Iterable<string>;

function hasSameKeys(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) {
    return false;
  }

  for (let key of a) {
    if (!b.has(key)) {
      return false;
    }
  }

  return true;
}

function normalizeTagGroupSelection(value: TagGroupSelectionValue | undefined): string[] {
  if (value == null || typeof value === 'string') {
    return [];
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return [];
  }

  return Array.from(value as Iterable<unknown>).filter((entry): entry is string => typeof entry === 'string');
}

function isTagGroupSelectionValue(value: unknown): value is TagGroupSelectionValue {
  if (value == null || typeof value === 'string') {
    return false;
  }

  let maybeIterable = value as {[Symbol.iterator]?: (() => Iterator<unknown>) | undefined};
  if (typeof maybeIterable[Symbol.iterator] !== 'function') {
    return false;
  }

  for (let entry of value as Iterable<unknown>) {
    if (typeof entry !== 'string') {
      return false;
    }
  }

  return true;
}

const VueTagItem = defineComponent({
  name: 'VueTagItem',
  props: {
    item: {
      type: Object as PropType<TagNode>,
      required: true
    }
  },
  setup(props) {
    let context = inject(tagGroupContextKey);
    if (!context) {
      throw new Error('VueTagItem must be rendered inside VueTagGroup.');
    }

    let tag = createTag({
      item: computed(() => props.item),
      tagGroup: context.tagGroup
    });

    return () => {
      let rowProps = tag.rowProps.value;
      let gridCellProps = tag.gridCellProps.value;
      let removeButtonProps = tag.removeButtonProps.value;

      return h('div', {
        ...rowProps,
        class: [
          'vs-tag-group__tag',
          tag.isSelected.value ? 'is-selected' : null,
          tag.isPressed.value ? 'is-pressed' : null,
          tag.isDisabled.value ? 'is-disabled' : null
        ]
      }, [
        h('span', {
          ...gridCellProps,
          class: 'vs-tag-group__text'
        }, context.getLabel(props.item.key)),
        tag.allowsRemoving.value
          ? h('button', {
            id: removeButtonProps.id,
            type: 'button',
            disabled: removeButtonProps.isDisabled,
            class: 'vs-tag-group__remove',
            'aria-label': removeButtonProps['aria-label'],
            'aria-labelledby': removeButtonProps['aria-labelledby'],
            onClick: () => {
              removeButtonProps.onPress();
            }
          }, '×')
          : null
      ]);
    };
  }
});

export const VueTagGroup = defineComponent({
  name: 'VueTagGroup',
  props: {
    allowsRemoving: {
      type: Boolean,
      default: true
    },
    emptyStateLabel: {
      type: String,
      default: 'No tags'
    },
    items: {
      type: Array as PropType<TagItemData[]>,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [Array, Set] as PropType<TagGroupSelectionValue>,
      default: () => []
    },
    selectionMode: {
      type: String as PropType<'multiple' | 'none' | 'single'>,
      default: 'multiple'
    }
  },
  emits: {
    'update:modelValue': (value: TagGroupSelectionValue) => isTagGroupSelectionValue(value),
    change: (value: TagGroupSelectionValue) => isTagGroupSelectionValue(value),
    remove: (value: string[]) => Array.isArray(value)
  },
  setup(props, {attrs, emit}) {
    let hiddenKeys = ref(new Set<string>());
    let selectedKeys = ref(new Set<string>());
    let visibleItems = computed(() => props.items
      .filter((item) => !hiddenKeys.value.has(item.key))
      .map((item) => ({
        key: item.key,
        textValue: item.label,
        description: item.description,
        isDisabled: item.disabled
      })));
    let labelByKey = computed(() => new Map(visibleItems.value.map((item) => [item.key, item.textValue ?? item.key])));

    let tagGroup = createTagGroup({
      label: computed(() => props.label || undefined),
      items: visibleItems,
      selectedKeys,
      selectionMode: computed(() => props.selectionMode),
      onRemove: props.allowsRemoving
        ? (keys) => {
          let removedKeys = Array.from(keys, (key) => String(key));
          hiddenKeys.value = new Set([...hiddenKeys.value, ...removedKeys]);
          let nextSelectedKeys = new Set(selectedKeys.value);
          for (let key of removedKeys) {
            nextSelectedKeys.delete(key);
          }
          selectedKeys.value = nextSelectedKeys;
          emit('remove', removedKeys);
        }
        : undefined
    });

    watch(() => normalizeTagGroupSelection(props.modelValue).join('|'), () => {
      selectedKeys.value = new Set(normalizeTagGroupSelection(props.modelValue));
    }, {immediate: true});

    watch(selectedKeys, (nextSelection) => {
      let propKeys = new Set(normalizeTagGroupSelection(props.modelValue));
      if (hasSameKeys(nextSelection, propKeys)) {
        return;
      }

      let nextKeys = new Set(nextSelection);
      emit('update:modelValue', nextKeys);
      emit('change', nextKeys);
    }, {deep: true});

    watch(() => props.items.map((item) => item.key).join('|'), () => {
      let availableKeys = new Set(props.items.map((item) => item.key));
      hiddenKeys.value = new Set(Array.from(hiddenKeys.value).filter((key) => availableKeys.has(key)));
      selectedKeys.value = new Set(Array.from(selectedKeys.value).filter((key) => availableKeys.has(key) && !hiddenKeys.value.has(key)));
    }, {immediate: true});

    provide(tagGroupContextKey, {
      tagGroup,
      getLabel: (key: string) => labelByKey.value.get(key) ?? key
    });

    return () => h('section', {
      ...attrs,
      class: ['vs-tag-group', attrs.class],
      'data-vac': ''
    }, [
      props.label
        ? h('span', {
          ...tagGroup.labelProps.value,
          class: 'vs-tag-group__label'
        }, props.label)
        : null,
      h('div', {
        ...tagGroup.gridProps.value,
        class: 'vs-tag-group__grid'
      }, tagGroup.collection.value.items.length > 0
        ? tagGroup.collection.value.items.map((item) => h(VueTagItem, {
          key: item.key,
          item
        }))
        : h('div', {
          class: 'vs-tag-group__empty'
        }, props.emptyStateLabel))
    ]);
  }
});
