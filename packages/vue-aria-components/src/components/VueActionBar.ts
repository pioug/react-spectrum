import {computed, defineComponent, h, type PropType} from 'vue';
import {getSpectrumContext} from '../context';

type SelectedItemCount = number | 'all';

export const VueActionBar = defineComponent({
  name: 'VueActionBar',
  props: {
    selectedItemCount: {
      type: [Number, String] as PropType<SelectedItemCount>,
      default: 0
    },
    emphasized: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    disabledKeys: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    clearLabel: {
      type: String,
      default: 'Clear selection'
    }
  },
  emits: {
    action: (key: string) => typeof key === 'string',
    clearSelection: () => true
  },
  setup(props, {emit, slots, attrs}) {
    let context = getSpectrumContext();
    let isOpen = computed(() => props.selectedItemCount === 'all' || props.selectedItemCount > 0);
    let selectedLabel = computed(() => props.selectedItemCount === 'all'
      ? 'All selected'
      : `${props.selectedItemCount} selected`);

    let classes = computed(() => ([
      'vs-action-bar',
      context.value.scale === 'large' ? 'vs-action-bar--large' : 'vs-action-bar--medium',
      props.emphasized ? 'is-emphasized' : null,
      isOpen.value ? 'is-open' : null
    ]));

    return function render() {
      if (!isOpen.value) {
        return null;
      }

      let actions = slots.default
        ? slots.default()
        : props.items.map((item) => h('button', {
          key: item,
          class: 'vs-action-bar__action',
          type: 'button',
          disabled: props.disabledKeys.includes(item),
          onClick: () => emit('action', item)
        }, item));

      return h('div', {
        ...attrs,
        class: [classes.value, attrs.class],
        tabindex: 0,
        'data-vac': '',
        onKeydown: (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            emit('clearSelection');
          }
        }
      }, [
        h('p', {class: 'vs-action-bar__count'}, selectedLabel.value),
        h('div', {
          class: 'vs-action-bar__actions',
          role: 'toolbar'
        }, actions),
        h('button', {
          class: 'vs-action-bar__clear',
          type: 'button',
          'aria-label': props.clearLabel,
          onClick: () => emit('clearSelection')
        }, '×')
      ]);
    };
  }
});

export const VueActionBarContainer = defineComponent({
  name: 'VueActionBarContainer',
  setup(_props, {slots, attrs}) {
    return function render() {
      return h('div', {
        ...attrs,
        class: ['vs-action-bar-container', attrs.class],
        'data-vac': ''
      }, slots.default ? slots.default() : []);
    };
  }
});
