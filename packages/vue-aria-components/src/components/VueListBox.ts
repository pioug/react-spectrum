import {defineComponent, h, ref, type CSSProperties, type PropType, type VNode} from 'vue';

type ListBoxSelectionMode = 'none' | 'single' | 'multiple';
type ListBoxLayout = 'stack' | 'grid';
type ListBoxValue = string | string[];
type CollectionRole = 'grid' | 'listbox';
type ItemRole = 'option' | 'row';

type ListBoxItemRecord = {
  description?: string,
  disabled?: boolean,
  id?: number | string,
  key?: number | string,
  label?: string,
  name?: string,
  textValue?: string
};

type ListBoxItemInput = ListBoxItemRecord | number | string;

type ListBoxSectionInput = {
  id?: number | string,
  items: ListBoxItemInput[],
  key?: number | string,
  label?: string,
  name?: string,
  title?: string
};

type NormalizedListBoxItem = {
  description?: string,
  disabled: boolean,
  key: string,
  label: string,
  original: ListBoxItemInput,
  value: string
};

type NormalizedListBoxSection = {
  items: NormalizedListBoxItem[],
  key: string,
  label: string
};

function normalizeItem(item: ListBoxItemInput, index: number, parentKey = 'item'): NormalizedListBoxItem {
  if (typeof item === 'string' || typeof item === 'number') {
    let value = String(item);
    return {
      description: undefined,
      disabled: false,
      key: `${parentKey}-${index}-${value}`,
      label: value,
      original: item,
      value
    };
  }

  let value = String(item.key ?? item.id ?? item.name ?? item.label ?? item.textValue ?? index);
  return {
    description: item.description,
    disabled: Boolean(item.disabled),
    key: `${parentKey}-${index}-${value}`,
    label: String(item.label ?? item.name ?? item.textValue ?? value),
    original: item,
    value
  };
}

function normalizeSection(section: ListBoxSectionInput, index: number): NormalizedListBoxSection {
  let label = String(section.label ?? section.name ?? section.title ?? `Section ${index + 1}`);
  let sectionKey = String(section.key ?? section.id ?? `section-${index}`);
  return {
    items: (section.items ?? []).map((item, itemIndex) => normalizeItem(item, itemIndex, sectionKey)),
    key: sectionKey,
    label
  };
}

export const VueListBox = defineComponent({
  name: 'VueListBox',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Array] as PropType<ListBoxValue>,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    selectionMode: {
      type: String as PropType<ListBoxSelectionMode>,
      default: 'single'
    },
    layout: {
      type: String as PropType<ListBoxLayout>,
      default: 'stack'
    },
    items: {
      type: Array as PropType<ListBoxItemInput[]>,
      default: () => []
    },
    sections: {
      type: Array as PropType<ListBoxSectionInput[]>,
      default: () => []
    },
    itemClass: {
      type: String,
      default: ''
    },
    collectionClass: {
      type: String,
      default: 'react-aria-ListBox'
    },
    itemBaseClass: {
      type: String,
      default: 'react-aria-ListBoxItem'
    },
    headerClass: {
      type: String,
      default: 'react-aria-Header'
    },
    collectionRole: {
      type: String as PropType<CollectionRole>,
      default: 'listbox'
    },
    itemRole: {
      type: String as PropType<ItemRole>,
      default: 'option'
    },
    itemStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: ListBoxValue) => (
      typeof value === 'string'
      || (Array.isArray(value) && value.every((item) => typeof item === 'string'))
    ),
    select: (value: string) => typeof value === 'string'
  },
  setup(props, {emit, attrs, slots}) {
    let hoveredKey = ref<string>('');
    let focusedKey = ref<string>('');
    let normalizeNodes = (value: unknown): unknown[] => {
      if (Array.isArray(value)) {
        return value.flatMap((entry) => normalizeNodes(entry));
      }

      if (value === null || value === undefined || value === false) {
        return [];
      }

      return [value];
    };

    let onSelect = (item: NormalizedListBoxItem) => {
      if (item.disabled) {
        return;
      }

      emit('select', item.value);

      if (props.selectionMode === 'none') {
        return;
      }

      if (props.selectionMode === 'multiple') {
        let current = Array.isArray(props.modelValue) ? props.modelValue : [];
        let next = current.includes(item.value)
          ? current.filter((value) => value !== item.value)
          : [...current, item.value];
        emit('update:modelValue', next);
        return;
      }

      emit('update:modelValue', item.value);
    };

    let isSelected = (item: NormalizedListBoxItem) => {
      if (props.selectionMode === 'none') {
        return false;
      }

      if (props.selectionMode === 'multiple') {
        return Array.isArray(props.modelValue) && props.modelValue.includes(item.value);
      }

      return props.modelValue === item.value;
    };

    let renderItem = (item: NormalizedListBoxItem): VNode => {
      let selected = isSelected(item);
      let slotContent = slots.default ? slots.default({item: item.original, label: item.label, value: item.value}) : null;
      let children = slotContent && slotContent.length > 0
        ? slotContent
        : [
            item.label,
            item.description ? h('span', {slot: 'description'}, item.description) : null
          ];
      let itemChildren = props.collectionRole === 'grid' && props.itemRole === 'row'
        ? [
            h('div', {
              role: 'gridcell',
              'aria-colindex': 1,
              style: {display: 'contents'}
            }, children)
          ]
        : children;

      return h('div', {
        key: item.key,
        class: [
          props.itemBaseClass,
          props.itemClass || null,
          hoveredKey.value === item.key ? 'hovered' : null,
          focusedKey.value === item.key ? 'focused' : null,
          focusedKey.value === item.key ? 'focusVisible' : null,
          selected ? 'selected is-selected' : null
        ],
        role: props.itemRole,
        tabindex: item.disabled ? -1 : 0,
        'data-hovered': hoveredKey.value === item.key ? '' : undefined,
        'data-focus-visible': focusedKey.value === item.key ? '' : undefined,
        'data-disabled': item.disabled ? '' : undefined,
        'aria-disabled': item.disabled ? 'true' : undefined,
        'aria-selected': props.selectionMode === 'none' ? undefined : (selected ? 'true' : 'false'),
        style: props.itemStyle,
        onClick: () => onSelect(item),
        onFocus: () => {
          focusedKey.value = item.key;
        },
        onBlur: () => {
          if (focusedKey.value === item.key) {
            focusedKey.value = '';
          }
        },
        onMouseenter: () => {
          hoveredKey.value = item.key;
        },
        onMouseleave: () => {
          if (hoveredKey.value === item.key) {
            hoveredKey.value = '';
          }
        },
        onKeydown: (event: KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect(item);
          }
        }
      }, itemChildren);
    };

    let renderCollection = () => {
      let hasItems = false;

      if (props.sections.length > 0) {
        let sections = props.sections.map((section, sectionIndex) => normalizeSection(section, sectionIndex));
        let sectionNodes = sections.map((section) => {
          hasItems = hasItems || section.items.length > 0;
          let headerId = `${section.key}-header`;
          return h('div', {
            key: section.key,
            class: 'react-aria-GridListSection',
            role: props.collectionRole === 'grid' ? 'rowgroup' : undefined,
            'aria-labelledby': props.collectionRole === 'grid' ? headerId : undefined
          }, [
            h('div', {
              class: props.headerClass,
              role: props.collectionRole === 'grid' ? 'row' : undefined
            }, [
              h('div', {
                id: headerId,
                role: props.collectionRole === 'grid' ? 'rowheader' : undefined,
                style: props.collectionRole === 'grid' ? {display: 'contents'} : undefined
              }, section.label)
            ]),
            ...section.items.map((item) => renderItem(item))
          ]);
        });

        if (!hasItems && slots.empty) {
          return slots.empty({isLoading: props.isLoading});
        }

        return sectionNodes;
      }

      let items = props.items.map((item, index) => normalizeItem(item, index));
      if (items.length === 0 && slots.empty) {
        return slots.empty({isLoading: props.isLoading});
      }

      return items.map((item) => renderItem(item));
    };

    return function render() {
      let itemCollection = normalizeNodes(renderCollection());
      let loaderNodes = slots.loader ? normalizeNodes(slots.loader({isLoading: props.isLoading})) : [];
      let className = attrs.class as string | string[] | undefined;
      let style = attrs.style;
      let ariaLabelFromAttrs = attrs['aria-label'];

      let passthroughAttrs: Record<string, unknown> = {};
      for (let [key, value] of Object.entries(attrs)) {
        if (key !== 'class' && key !== 'style' && key !== 'aria-label') {
          passthroughAttrs[key] = value;
        }
      }

      return h('section', {
        'data-vac': ''
      }, [
        props.label ? h('p', {}, props.label) : null,
        h('div', {
          ...passthroughAttrs,
          class: [props.collectionClass, className],
          style: [
            props.layout === 'grid'
              ? {
                alignContent: 'start',
                columnGap: 'var(--grid-min-space, 0px)',
                display: 'grid',
                gridAutoFlow: 'row',
                gridTemplateColumns: 'repeat(auto-fill, minmax(var(--grid-min-item-size, 100px), var(--grid-max-item-size, 140px)))',
                rowGap: 'var(--grid-vertical-space, var(--grid-min-space, 0px))'
              }
              : null,
            style
          ],
          role: props.collectionRole,
          'aria-label': ariaLabelFromAttrs ?? (props.label || undefined),
          'aria-multiselectable': props.selectionMode === 'multiple' ? 'true' : undefined,
          'data-layout': props.layout,
          tabindex: props.collectionRole === 'grid' ? 0 : undefined
        }, [...itemCollection, ...loaderNodes])
      ]);
    };
  }
});
