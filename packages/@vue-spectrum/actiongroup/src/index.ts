import '@adobe/spectrum-css-temp/components/actiongroup/vars.css';
import '@adobe/spectrum-css-temp/components/button/vars.css';
import '@adobe/spectrum-css-temp/components/menu/vars.css';
import './actiongroup.css';
import More from '@spectrum-icons-vue/workflow/More';
import {classNames} from '@vue-spectrum/utils';
import {
  computed,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  type PropType,
  ref,
  watch
} from 'vue';
const actionGroupStyles: {[key: string]: string} = {};
const buttonStyles: {[key: string]: string} = {};
const menuStyles: {[key: string]: string} = {};


type SelectionMode = 'none' | 'single' | 'multiple';

interface CollapseCalculation {
  containerSize: number,
  itemSizes: number[],
  overflowTriggerSize: number,
  selectionMode: SelectionMode
}

export function calculateVisibleItemsForCollapse({
  containerSize,
  itemSizes,
  overflowTriggerSize,
  selectionMode
}: CollapseCalculation): number {
  if (itemSizes.length === 0) {
    return 0;
  }

  let totalSize = itemSizes.reduce((sum, itemSize) => sum + itemSize, 0);
  if (Math.round(totalSize) <= Math.round(containerSize)) {
    return itemSizes.length;
  }

  let availableSize = Math.max(0, containerSize - Math.max(0, overflowTriggerSize));
  let usedSize = 0;
  let visibleItems = 0;
  for (let itemSize of itemSizes) {
    usedSize += itemSize;
    if (Math.round(usedSize) <= Math.round(availableSize)) {
      visibleItems++;
    } else {
      break;
    }
  }

  if (selectionMode !== 'none' && visibleItems < itemSizes.length) {
    return 0;
  }

  return visibleItems;
}

function toNumber(value: string): number {
  let parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function outerSize(
  element: HTMLElement,
  orientation: 'horizontal' | 'vertical',
  ignoreStartMargin: boolean,
  ignoreEndMargin: boolean
): number {
  let style = window.getComputedStyle(element);
  if (orientation === 'horizontal') {
    return element.getBoundingClientRect().width
      + (ignoreStartMargin ? 0 : toNumber(style.marginLeft))
      + (ignoreEndMargin ? 0 : toNumber(style.marginRight));
  }

  return element.getBoundingClientRect().height
    + (ignoreStartMargin ? 0 : toNumber(style.marginTop))
    + (ignoreEndMargin ? 0 : toNumber(style.marginBottom));
}

export const ActionGroup = defineComponent({
  name: 'VueActionGroup',
  inheritAttrs: false,
  props: {
    buttonLabelBehavior: {
      type: String as PropType<'collapse' | 'hide' | 'show'>,
      default: 'show'
    },
    density: {
      type: String as PropType<'compact' | 'regular'>,
      default: 'regular'
    },
    disabledKeys: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    emphasized: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isEmphasized: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isQuiet: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    items: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    isJustified: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal'
    },
    quiet: {
      type: Boolean,
      default: false
    },
    overflowMode: {
      type: String as PropType<'wrap' | 'collapse'>,
      default: 'wrap'
    },
    selectionMode: {
      type: String as PropType<SelectionMode>,
      default: 'none'
    },
    staticColor: {
      type: String as PropType<'black' | 'white' | undefined>,
      default: undefined
    }
  },
  emits: {
    action: (key: string) => typeof key === 'string',
    change: (value: string[]) => Array.isArray(value),
    'update:modelValue': (value: string[]) => Array.isArray(value)
  },
  setup(props, {emit, attrs, slots}) {
    let wrapperRef = ref<HTMLElement | null>(null);
    let groupRef = ref<HTMLElement | null>(null);
    let overflowMeasureRef = ref<HTMLElement | null>(null);
    let overflowTriggerRef = ref<HTMLElement | null>(null);
    let overflowMenuRef = ref<HTMLElement | null>(null);
    let hoveredKey = ref<string | null>(null);
    let visibleItems = ref(props.items.length);
    let isOverflowMenuOpen = ref(false);
    let rafId = 0;
    let resizeObserver: ResizeObserver | null = null;

    let isDisabled = computed(() => props.isDisabled ?? props.disabled);
    let isQuiet = computed(() => props.isQuiet ?? props.quiet);
    let isEmphasized = computed(() => props.isEmphasized ?? props.emphasized);
    let isVertical = computed(() => props.orientation === 'vertical');
    let canCollapse = computed(() => {
      if (props.overflowMode !== 'collapse') {
        return false;
      }

      // Vertical collapsing with selection is unsupported in React Spectrum.
      if (isVertical.value && props.selectionMode !== 'none') {
        return false;
      }

      return true;
    });
    let resolvedRole = computed(() => props.selectionMode === 'none' ? 'toolbar' : 'group');
    let resolvedVisibleItems = computed(() => {
      if (!canCollapse.value) {
        return props.items.length;
      }

      return Math.min(props.items.length, Math.max(0, visibleItems.value));
    });
    let visibleActionItems = computed(() => props.items.slice(0, resolvedVisibleItems.value));
    let overflowItems = computed(() => props.items.slice(resolvedVisibleItems.value));
    let hasOverflow = computed(() => canCollapse.value && overflowItems.value.length > 0);
    let shouldHideGroupAria = computed(() => hasOverflow.value && resolvedVisibleItems.value === 0);
    let shouldHideButtonText = computed(() => {
      if (!slots.item) {
        return false;
      }

      if (props.buttonLabelBehavior === 'hide') {
        return true;
      }

      return props.buttonLabelBehavior === 'collapse' && hasOverflow.value;
    });
    let itemCount = computed(() => props.items.length);

    let className = computed(() => classNames(
      actionGroupStyles,
      'flex-gap',
      'spectrum-ActionGroup',
      {
        'spectrum-ActionGroup--compact': props.density === 'compact',
        'spectrum-ActionGroup--justified': props.isJustified,
        'spectrum-ActionGroup--quiet': isQuiet.value,
        'spectrum-ActionGroup--vertical': isVertical.value,
        'spectrum-ActionGroup--overflowCollapse': canCollapse.value
      }
    ));

    let onAction = (item: string) => {
      let isItemDisabled = isDisabled.value || props.disabledKeys.includes(item);
      if (isItemDisabled) {
        return;
      }

      emit('action', item);

      if (props.selectionMode === 'none') {
        return;
      }

      if (props.selectionMode === 'single') {
        let next = [item];
        emit('update:modelValue', next);
        emit('change', next);
        return;
      }

      let isSelected = props.modelValue.includes(item);
      let next = isSelected
        ? props.modelValue.filter((key) => key !== item)
        : [...props.modelValue, item];
      emit('update:modelValue', next);
      emit('change', next);
    };

    let updateOverflow = async () => {
      if (!canCollapse.value) {
        visibleItems.value = itemCount.value;
        isOverflowMenuOpen.value = false;
        return;
      }

      if (itemCount.value === 0) {
        visibleItems.value = 0;
        isOverflowMenuOpen.value = false;
        return;
      }

      if (visibleItems.value !== itemCount.value) {
        visibleItems.value = itemCount.value;
      }

      await nextTick();
      let groupElement = groupRef.value;
      let wrapperElement = wrapperRef.value;
      if (!groupElement || !wrapperElement) {
        return;
      }

      let containerRect = wrapperElement.getBoundingClientRect();
      let containerSize = isVertical.value ? containerRect.height : containerRect.width;

      let itemElements = Array.from(groupElement.querySelectorAll<HTMLElement>('[data-vs-action-group-item="true"]'));
      let itemSizes = itemElements.map((itemElement, index) => outerSize(
        itemElement,
        props.orientation,
        index === 0,
        index === itemElements.length - 1
      ));
      let fallbackOverflowSize = itemSizes[itemSizes.length - 1] ?? 0;
      let overflowSize = overflowMeasureRef.value
        ? outerSize(overflowMeasureRef.value, props.orientation, false, true)
        : fallbackOverflowSize;
      let nextVisibleItems = calculateVisibleItemsForCollapse({
        containerSize,
        itemSizes,
        overflowTriggerSize: overflowSize,
        selectionMode: props.selectionMode
      });

      visibleItems.value = nextVisibleItems;
      if (nextVisibleItems >= itemCount.value) {
        isOverflowMenuOpen.value = false;
      }
    };

    let scheduleOverflowUpdate = () => {
      if (typeof window === 'undefined') {
        return;
      }

      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        rafId = 0;
        void updateOverflow();
      });
    };

    let closeOverflowMenu = () => {
      isOverflowMenuOpen.value = false;
    };

    let onOverflowItemAction = (item: string) => {
      onAction(item);
      closeOverflowMenu();
    };

    let onDocumentPointerDown = (event: PointerEvent) => {
      if (!isOverflowMenuOpen.value) {
        return;
      }

      let target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (overflowTriggerRef.value?.contains(target) || overflowMenuRef.value?.contains(target)) {
        return;
      }

      closeOverflowMenu();
    };

    onMounted(() => {
      document.addEventListener('pointerdown', onDocumentPointerDown, true);

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          scheduleOverflowUpdate();
        });
        let observedElement = wrapperRef.value?.parentElement ?? wrapperRef.value;
        if (observedElement) {
          resizeObserver.observe(observedElement);
        }
      }

      scheduleOverflowUpdate();
    });

    onBeforeUnmount(() => {
      document.removeEventListener('pointerdown', onDocumentPointerDown, true);
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }

      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    });

    watch(
      () => props.items.slice(),
      () => {
        if (isOverflowMenuOpen.value && overflowItems.value.length === 0) {
          closeOverflowMenu();
        }
        scheduleOverflowUpdate();
      },
      {immediate: true}
    );

    watch(
      () => [props.buttonLabelBehavior, props.overflowMode, props.orientation, props.selectionMode],
      () => {
        scheduleOverflowUpdate();
      },
      {immediate: true}
    );

    return () => h('div', {
      ref: wrapperRef,
      class: ['flex-container', 'vs-action-group__wrapper']
    }, [
      h('div', {
        ...attrs,
        ref: groupRef,
        class: [className.value, 'vs-action-group', attrs.class],
        role: shouldHideGroupAria.value ? undefined : resolvedRole.value,
        'aria-orientation': shouldHideGroupAria.value ? undefined : props.orientation,
        'aria-label': shouldHideGroupAria.value ? undefined : attrs['aria-label'],
        'aria-labelledby': shouldHideGroupAria.value ? undefined : attrs['aria-labelledby'],
        'data-vac': ''
      }, [
      ...visibleActionItems.value.map((item) => {
        let isSelected = props.modelValue.includes(item);
        let isItemDisabled = isDisabled.value || props.disabledKeys.includes(item);
        let ariaPressed: 'true' | 'false' | undefined = undefined;
        if (props.selectionMode !== 'none') {
          ariaPressed = isSelected ? 'true' : 'false';
        }

        return h('button', {
          key: item,
          'data-vs-action-group-item': 'true',
          class: [classNames(
            actionGroupStyles,
            'spectrum-ActionGroup-item',
            {
              'is-selected': isSelected,
              'is-hovered': hoveredKey.value === item && !isItemDisabled,
              'spectrum-ActionGroup-item--iconOnly': shouldHideButtonText.value,
              'spectrum-ActionGroup-item--isDisabled': isItemDisabled
            },
            classNames(
              buttonStyles,
              'spectrum-ActionButton',
              {
                'spectrum-ActionButton--emphasized': isEmphasized.value,
                'spectrum-ActionButton--quiet': isQuiet.value,
                'spectrum-ActionButton--staticBlack': props.staticColor === 'black',
                'spectrum-ActionButton--staticColor': !!props.staticColor,
                'spectrum-ActionButton--staticWhite': props.staticColor === 'white',
                'is-selected': isSelected
              }
            )
          ), 'vs-action-group__item'],
          type: 'button',
          disabled: isItemDisabled,
          'aria-label': shouldHideButtonText.value ? item : undefined,
          'aria-pressed': ariaPressed,
          'aria-disabled': isItemDisabled ? 'true' : undefined,
          onMouseenter: () => {
            if (isItemDisabled) {
              return;
            }

            hoveredKey.value = item;
          },
          onMouseleave: () => {
            hoveredKey.value = null;
          },
          onClick: () => onAction(item)
        }, slots.item ? slots.item({item, selected: isSelected, hideButtonText: shouldHideButtonText.value}) : [
          h('span', {class: classNames(actionGroupStyles, 'spectrum-ActionButton-label')}, item)
        ]);
      }),
      hasOverflow.value
        ? h('div', {class: 'vs-action-group__overflow'}, [
          h('button', {
            ref: overflowTriggerRef,
            class: [
              classNames(
                actionGroupStyles,
                'spectrum-ActionGroup-item',
                'spectrum-ActionGroup-menu',
                classNames(
                  buttonStyles,
                  'spectrum-ActionButton',
                  {
                    'spectrum-ActionButton--emphasized': isEmphasized.value,
                    'spectrum-ActionButton--quiet': isQuiet.value,
                    'spectrum-ActionButton--staticBlack': props.staticColor === 'black',
                    'spectrum-ActionButton--staticColor': !!props.staticColor,
                    'spectrum-ActionButton--staticWhite': props.staticColor === 'white',
                    'is-selected': props.selectionMode !== 'none' && props.modelValue.length > 0
                  }
                )
              ),
              'vs-action-group__item',
              'vs-action-group__overflow-trigger'
            ],
            type: 'button',
            'aria-haspopup': 'menu',
            'aria-expanded': isOverflowMenuOpen.value ? 'true' : 'false',
            'aria-label': shouldHideGroupAria.value ? attrs['aria-label'] ?? 'More actions' : 'More actions',
            'aria-labelledby': shouldHideGroupAria.value ? attrs['aria-labelledby'] : undefined,
            'data-vs-action-group-overflow-trigger': 'true',
            onClick: () => {
              isOverflowMenuOpen.value = !isOverflowMenuOpen.value;
            },
            onKeydown: (event: KeyboardEvent) => {
              if (event.key === 'Escape') {
                event.stopPropagation();
                closeOverflowMenu();
              }
            }
          }, [
            h('span', {
              class: classNames(actionGroupStyles, 'spectrum-ActionGroup-menu-contents'),
              'aria-hidden': 'true'
            }, [h(More)])
          ]),
          isOverflowMenuOpen.value
            ? h('div', {
              ref: overflowMenuRef,
              class: [
                classNames(menuStyles, 'spectrum-Menu-wrapper'),
                classNames(actionGroupStyles, 'spectrum-ActionGroup-menu-popover'),
                'vs-action-group__overflow-menu-wrapper'
              ],
              role: 'presentation'
            }, [
              h('ul', {
                class: [classNames(menuStyles, 'spectrum-Menu'), 'vs-action-group__overflow-menu'],
                role: 'menu',
                'aria-label': 'More actions'
              }, overflowItems.value.map((item) => {
                let isItemDisabled = isDisabled.value || props.disabledKeys.includes(item);
                return h('li', {
                  key: `${item}-overflow`,
                  class: 'vs-action-group__overflow-item-wrapper'
                }, [
                  h('button', {
                    class: classNames(menuStyles, 'spectrum-Menu-item', {
                      'is-disabled': isItemDisabled
                    }),
                    type: 'button',
                    disabled: isItemDisabled,
                    role: 'menuitem',
                    onClick: () => onOverflowItemAction(item)
                  }, [
                    h('span', {
                      class: classNames(menuStyles, 'spectrum-Menu-itemLabel')
                    }, item)
                  ])
                ]);
              }))
            ])
            : null
        ])
        : null,
      h('span', {
        hidden: true,
        'aria-hidden': 'true',
        class: 'vs-action-group__hidden-marker'
      })
    ]),
      h('button', {
        ref: overflowMeasureRef,
        type: 'button',
        tabIndex: -1,
        'aria-hidden': 'true',
        class: [
          classNames(
            actionGroupStyles,
            'spectrum-ActionGroup-item',
            'spectrum-ActionGroup-menu',
            classNames(
              buttonStyles,
              'spectrum-ActionButton',
              {
                'spectrum-ActionButton--emphasized': isEmphasized.value,
                'spectrum-ActionButton--quiet': isQuiet.value,
                'spectrum-ActionButton--staticBlack': props.staticColor === 'black',
                'spectrum-ActionButton--staticColor': !!props.staticColor,
                'spectrum-ActionButton--staticWhite': props.staticColor === 'white'
              }
            )
          ),
          'vs-action-group__overflow-measure'
        ]
      }, [
        h('span', {
          class: classNames(actionGroupStyles, 'spectrum-ActionGroup-menu-contents'),
          'aria-hidden': 'true'
        }, [h(More)])
      ])
    ]);
  }
});

export const VueActionGroup = ActionGroup;
export {Item} from '@vue-stately/collections';
export type {SpectrumActionGroupProps} from '@vue-types/actiongroup';
