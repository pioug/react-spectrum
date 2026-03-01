import '@adobe/spectrum-css-temp/components/tags/vars.css';
import {ActionButton, ClearButton} from '@vue-spectrum/button';
import {Avatar} from '@vue-spectrum/avatar';
import {Field} from '@vue-spectrum/label';
import {classNames} from '@vue-spectrum/utils';
import {cloneVNode, computed, defineComponent, h, inject, type InjectionKey, isVNode, nextTick, onMounted, onUnmounted, type PropType, provide, ref, watch} from 'vue';
import {useTag as createTag, useTagGroup as createTagGroup, type TagGroupAria} from '@vue-aria/tag';

export interface TagItemData {
  avatarAlt?: string,
  avatarSrc?: string,
  description?: string,
  disabled?: boolean,
  href?: string,
  icon?: unknown,
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
  getItemData: (key: string) => TagItemData | undefined,
  getLabel: (key: string) => string,
  tagGroup: TagGroupAria
}

const TAG_STYLE = {
  height: 24,
  margin: 4
};

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

  return Array.from(value as Iterable<unknown>, (entry) => String(entry));
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
    if (typeof entry !== 'string' && typeof entry !== 'number') {
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

    let renderIcon = (itemData: TagItemData | undefined) => {
      let icon = itemData?.icon;
      if (icon == null) {
        return null;
      }

      if (typeof icon === 'string' || typeof icon === 'number') {
        return h('span', {
          class: [classNames({}, 'spectrum-Tag-icon'), 'vs-tag-group__icon']
        }, String(icon));
      }

      if (isVNode(icon)) {
        return cloneVNode(icon, {
          class: [classNames({}, 'spectrum-Tag-icon'), 'vs-tag-group__icon', icon.props?.class],
          size: icon.props?.size ?? 'XS'
        }, true);
      }

      return h(icon as never, {
        class: [classNames({}, 'spectrum-Tag-icon'), 'vs-tag-group__icon'],
        size: 'XS'
      });
    };

    return () => {
      let rowProps = tag.rowProps.value;
      let gridCellProps = tag.gridCellProps.value;
      let removeButtonProps = tag.removeButtonProps.value;
      let itemData = context.getItemData(props.item.key);
      let label = context.getLabel(props.item.key);

      let contentNode = itemData?.href
        ? h('a', {
          class: [classNames({}, 'spectrum-Tag-content'), 'vs-tag-group__text'],
          href: itemData.href,
          onClick: (event: MouseEvent) => {
            event.stopPropagation();
          }
        }, label)
        : h('span', {
          class: [classNames({}, 'spectrum-Tag-content'), 'vs-tag-group__text']
        }, label);

      let avatarNode = itemData?.avatarSrc
        ? h(Avatar, {
          alt: itemData.avatarAlt || itemData.label,
          class: [classNames({}, 'spectrum-Tag-avatar'), 'vs-tag-group__avatar'],
          size: 'avatar-size-50',
          src: itemData.avatarSrc
        })
        : null;

      return h('div', {
        ...rowProps,
        class: [
          classNames({}, 'spectrum-Tag', {
            'is-disabled': tag.isDisabled.value,
            'is-pressed': tag.isPressed.value,
            'is-selected': tag.isSelected.value,
            'spectrum-Tag--removable': tag.allowsRemoving.value
          }),
          'vs-tag-group__tag'
        ]
      }, [
        h('div', {
          ...gridCellProps,
          class: [classNames({}, 'spectrum-Tag-cell'), 'vs-tag-group__cell']
        }, [
          renderIcon(itemData),
          avatarNode,
          contentNode,
          tag.allowsRemoving.value
            ? h('span', {
              class: [classNames({}, 'spectrum-Tag-removeButton'), 'vs-tag-group__remove-wrap']
            }, [
              h(ClearButton, {
                id: removeButtonProps.id,
                'aria-label': removeButtonProps['aria-label'],
                'aria-labelledby': removeButtonProps['aria-labelledby'],
                class: 'vs-tag-group__remove',
                inset: true,
                isDisabled: removeButtonProps.isDisabled,
                onClick: (event: MouseEvent) => {
                  event.stopPropagation();
                  removeButtonProps.onPress();
                }
              })
            ])
            : null
        ])
      ]);
    };
  }
});

export const VueTagGroup = defineComponent({
  name: 'VueTagGroup',
  props: {
    actionLabel: {
      type: String,
      default: ''
    },
    allowsRemoving: {
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
    emptyStateLabel: {
      type: String,
      default: 'None'
    },
    errorMessage: {
      type: [String, Number, Object, Function, Array] as PropType<unknown>,
      default: undefined
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    isRequired: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    items: {
      type: Array as PropType<TagItemData[]>,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    labelAlign: {
      type: String as PropType<'end' | 'start' | undefined>,
      default: undefined
    },
    labelPosition: {
      type: String as PropType<'side' | 'top' | undefined>,
      default: undefined
    },
    maxRows: {
      type: Number as PropType<number | undefined>,
      default: undefined
    },
    modelValue: {
      type: [Array, Set] as PropType<TagGroupSelectionValue>,
      default: () => []
    },
    necessityIndicator: {
      type: String as PropType<'icon' | 'label' | undefined>,
      default: undefined
    },
    onAction: {
      type: Function as PropType<(() => void) | undefined>,
      default: undefined
    },
    renderEmptyState: {
      type: Function as PropType<(() => unknown) | undefined>,
      default: undefined
    },
    selectionMode: {
      type: String as PropType<'multiple' | 'none' | 'single'>,
      default: 'none'
    }
  },
  emits: {
    'update:modelValue': (value: TagGroupSelectionValue) => isTagGroupSelectionValue(value),
    action: () => true,
    change: (value: TagGroupSelectionValue) => isTagGroupSelectionValue(value),
    remove: (value: string[]) => Array.isArray(value)
  },
  setup(props, {attrs, emit}) {
    let hiddenKeys = ref(new Set<string>());
    let isMeasuring = ref(false);
    let selectedKeys = ref(new Set<string>());
    let isCollapsed = ref(Boolean(props.maxRows != null));
    let showCollapseButton = ref(false);
    let visibleTagCount = ref(0);
    let containerRef = ref<HTMLElement | null>(null);
    let tagsRef = ref<HTMLElement | null>(null);
    let actionsRef = ref<HTMLElement | null>(null);
    let resizeObserver: ResizeObserver | null = null;

    let normalizedItems = computed(() => props.items.map((item) => ({
      ...item,
      key: String(item.key)
    })));

    let visibleItems = computed(() => normalizedItems.value.filter((item) => !hiddenKeys.value.has(item.key)));
    let itemMap = computed(() => new Map(visibleItems.value.map((item) => [item.key, item])));

    let tagNodes = computed(() => visibleItems.value.map((item, index) => ({
      key: item.key,
      textValue: item.label,
      description: item.description,
      isDisabled: item.disabled,
      index
    })));

    let tagGroup = createTagGroup({
      errorMessage: computed(() => typeof props.errorMessage === 'string' ? props.errorMessage : undefined),
      isInvalid: computed(() => props.isInvalid),
      items: tagNodes,
      label: computed(() => props.label || undefined),
      selectedKeys,
      selectionMode: computed(() => props.selectionMode),
      description: computed(() => props.description || undefined),
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

    let isEmpty = computed(() => visibleItems.value.length === 0);

    let renderedItems = computed(() => {
      if (isMeasuring.value) {
        return tagNodes.value;
      }

      if (!isCollapsed.value || props.maxRows == null || props.maxRows <= 0) {
        return tagNodes.value;
      }

      return tagNodes.value.slice(0, Math.max(visibleTagCount.value, isEmpty.value ? 0 : 1));
    });

    let renderEmptyState = () => props.renderEmptyState ? props.renderEmptyState() : props.emptyStateLabel;

    let updateVisibleTagCount = async () => {
      if (props.maxRows == null || props.maxRows <= 0) {
        visibleTagCount.value = tagNodes.value.length;
        showCollapseButton.value = false;
        return;
      }

      if (!isCollapsed.value) {
        visibleTagCount.value = tagNodes.value.length;
        return;
      }

      isMeasuring.value = true;
      showCollapseButton.value = true;
      visibleTagCount.value = tagNodes.value.length;
      await nextTick();

      try {
        let currentContainer = containerRef.value;
        let currentTags = tagsRef.value;
        let currentActions = actionsRef.value;
        if (!currentContainer || !currentTags || !currentActions || tagNodes.value.length === 0) {
          visibleTagCount.value = 0;
          showCollapseButton.value = false;
          return;
        }

        let tagElements = Array.from(currentTags.children) as HTMLElement[];
        let rowCount = 0;
        let currentTop = -Infinity;
        let visibleCount = 0;
        let tagWidths: number[] = [];

        for (let tagElement of tagElements) {
          let {width, y} = tagElement.getBoundingClientRect();

          if (y !== currentTop) {
            currentTop = y;
            rowCount++;
          }

          if (rowCount > props.maxRows) {
            break;
          }

          tagWidths.push(width);
          visibleCount++;
        }

        let actionButtons = Array.from(currentActions.children) as HTMLElement[];
        if (rowCount >= props.maxRows && actionButtons.length > 0 && currentContainer.parentElement) {
          let buttonsWidth = actionButtons.reduce((sum, button) => sum + button.getBoundingClientRect().width, 0);
          buttonsWidth += TAG_STYLE.margin * 2 * actionButtons.length;

          let direction = typeof document !== 'undefined' && document.dir === 'rtl' ? 'rtl' : 'ltr';
          let edge = direction === 'ltr' ? 'right' : 'left';
          let containerEdge = currentContainer.parentElement.getBoundingClientRect()[edge];
          let lastTagEdge = tagElements[visibleCount - 1]?.getBoundingClientRect()[edge] ?? containerEdge;
          lastTagEdge += TAG_STYLE.margin;
          let availableWidth = containerEdge - lastTagEdge;

          while (availableWidth < buttonsWidth && visibleCount > 0) {
            availableWidth += tagWidths.pop() ?? 0;
            visibleCount--;
          }
        }

        visibleTagCount.value = Math.max(visibleCount, 1);
        showCollapseButton.value = visibleCount < tagNodes.value.length;
      } finally {
        isMeasuring.value = false;
      }
    };

    let updateVisibleTagCountSoon = () => {
      void updateVisibleTagCount();
    };

    watch(() => ({
      itemKeys: normalizedItems.value.map((item) => item.key).join('|'),
      modelValue: normalizeTagGroupSelection(props.modelValue).join('|')
    }), () => {
      let availableKeys = new Set(visibleItems.value.map((item) => item.key));
      let nextSelectedKeys = new Set(
        normalizeTagGroupSelection(props.modelValue)
          .filter((key) => availableKeys.has(key) && !hiddenKeys.value.has(key))
      );
      selectedKeys.value = nextSelectedKeys;
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

    watch(() => normalizedItems.value.map((item) => item.key).join('|'), () => {
      let availableKeys = new Set(normalizedItems.value.map((item) => item.key));

      hiddenKeys.value = new Set(Array.from(hiddenKeys.value).filter((key) => availableKeys.has(key)));
      selectedKeys.value = new Set(
        Array.from(selectedKeys.value).filter((key) => availableKeys.has(key) && !hiddenKeys.value.has(key))
      );

      void updateVisibleTagCountSoon();
    }, {immediate: true});

    watch(() => props.maxRows, (nextMaxRows) => {
      if (nextMaxRows == null || nextMaxRows <= 0) {
        isCollapsed.value = false;
        showCollapseButton.value = false;
        visibleTagCount.value = tagNodes.value.length;
        return;
      }

      isCollapsed.value = true;
      void updateVisibleTagCountSoon();
    }, {immediate: true});

    watch(() => [tagNodes.value.length, isCollapsed.value, props.maxRows, props.actionLabel, props.allowsRemoving], () => {
      void updateVisibleTagCountSoon();
    });

    onMounted(() => {
      if (typeof ResizeObserver !== 'undefined' && containerRef.value) {
        resizeObserver = new ResizeObserver(() => {
          void updateVisibleTagCountSoon();
        });
        resizeObserver.observe(containerRef.value);
      }

      let fontsReady = (document as Document & {fonts?: FontFaceSet}).fonts?.ready;
      if (fontsReady) {
        fontsReady.then(() => {
          void updateVisibleTagCountSoon();
        }).catch(() => {
          // no-op
        });
      }

      void updateVisibleTagCountSoon();
    });

    onUnmounted(() => {
      resizeObserver?.disconnect();
    });

    provide(tagGroupContextKey, {
      tagGroup,
      getItemData: (key: string) => itemMap.value.get(key),
      getLabel: (key: string) => itemMap.value.get(key)?.label ?? key
    });

    let containerStyle = computed<Record<string, string> | undefined>(() => {
      if (!isCollapsed.value || props.maxRows == null || props.maxRows <= 0 || isEmpty.value) {
        return undefined;
      }

      let maxHeight = (TAG_STYLE.height + (TAG_STYLE.margin * 2)) * props.maxRows;
      return {
        maxHeight: `${maxHeight}px`,
        overflow: 'hidden'
      };
    });

    let showActions = computed(() => {
      if (isEmpty.value) {
        return false;
      }

      return showCollapseButton.value || Boolean(props.actionLabel && props.onAction);
    });

    let toggleCollapsed = () => {
      isCollapsed.value = !isCollapsed.value;
      void updateVisibleTagCountSoon();
    };

    let onAction = () => {
      props.onAction?.();
      emit('action');
    };

    return () => h(Field, {
      ...attrs,
      class: [attrs.class, 'vs-tag-group'],
      contextualHelp: props.contextualHelp,
      description: props.description || undefined,
      elementType: 'span',
      errorMessage: props.errorMessage,
      isInvalid: props.isInvalid,
      isRequired: props.isRequired,
      label: props.label || undefined,
      labelAlign: props.labelAlign,
      labelPosition: props.labelPosition,
      necessityIndicator: props.necessityIndicator,
      showErrorIcon: true,
      wrapperClassName: classNames({}, 'spectrum-Tags-fieldWrapper', {
        'spectrum-Tags-fieldWrapper--positionSide': props.labelPosition === 'side'
      }),
      'data-vac': ''
    }, {
      default: () => h('div', {
        ref: containerRef,
        class: [
          classNames({}, 'spectrum-Tags-container', {
            'spectrum-Tags-container--empty': isEmpty.value
          }),
          'vs-tag-group__container'
        ],
        style: containerStyle.value
      }, [
        h('div', {
          ...tagGroup.gridProps.value,
          ref: tagsRef,
          class: [classNames({}, 'spectrum-Tags'), 'vs-tag-group__grid']
        }, renderedItems.value.length > 0
          ? renderedItems.value.map((item) => h(VueTagItem, {
            key: item.key,
            item
          }))
          : h('div', {
            class: [classNames({}, 'spectrum-Tags-empty-state'), 'vs-tag-group__empty']
          }, renderEmptyState())
        ),
        showActions.value
          ? h('div', {
            ref: actionsRef,
            class: [classNames({}, 'spectrum-Tags-actions'), 'vs-tag-group__actions'],
            role: 'group'
          }, [
            showCollapseButton.value
              ? h(ActionButton, {
                isQuiet: true,
                UNSAFE_className: classNames({}, 'spectrum-Tags-actionButton'),
                onClick: toggleCollapsed
              }, () => isCollapsed.value ? `Show all (${tagNodes.value.length})` : 'Show less')
              : null,
            props.actionLabel && props.onAction
              ? h(ActionButton, {
                isQuiet: true,
                UNSAFE_className: classNames({}, 'spectrum-Tags-actionButton'),
                onClick: onAction
              }, () => props.actionLabel)
              : null
          ])
          : null
      ])
    });
  }
});
