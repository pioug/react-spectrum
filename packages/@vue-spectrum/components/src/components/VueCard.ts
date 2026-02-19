import {computed, defineComponent, h, type PropType} from 'vue';
import {getSpectrumContext} from '../context';

type CardViewItem = {
  description?: string,
  id: string,
  title: string
};

export const VueCard = defineComponent({
  name: 'VueCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    selected: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    quiet: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    press: () => true
  },
  setup(props, {slots, emit, attrs}) {
    let context = getSpectrumContext();
    let classes = computed(() => ([
      'vs-card',
      context.value.scale === 'large' ? 'vs-card--large' : 'vs-card--medium',
      props.selected ? 'is-selected' : null,
      props.quiet ? 'is-quiet' : null
    ]));

    return function render() {
      return h('button', {
        ...attrs,
        class: [classes.value, attrs.class],
        type: 'button',
        disabled: props.disabled,
        'data-vac': '',
        onClick: () => emit('press')
      }, [
        props.title ? h('span', {class: 'vs-card__title'}, props.title) : null,
        props.description ? h('span', {class: 'vs-card__description'}, props.description) : null,
        slots.default ? h('span', {class: 'vs-card__content'}, slots.default()) : null
      ]);
    };
  }
});

export const VueCardView = defineComponent({
  name: 'VueCardView',
  props: {
    items: {
      type: Array as PropType<CardViewItem[]>,
      default: () => []
    },
    modelValue: {
      type: String,
      default: ''
    },
    columns: {
      type: Number,
      default: 3
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
    action: (item: CardViewItem) => typeof item === 'object' && item !== null
  },
  setup(props, {emit, attrs}) {
    let columnCount = computed(() => Math.max(1, Math.round(props.columns)));

    return function render() {
      return h('div', {
        ...attrs,
        class: ['vs-card-view', attrs.class],
        style: {
          gridTemplateColumns: `repeat(${columnCount.value}, minmax(0, 1fr))`
        },
        'data-vac': ''
      }, props.items.map((item) => {
        let isSelected = props.modelValue === item.id;
        return h('button', {
          key: item.id,
          class: ['vs-card-view__item', isSelected ? 'is-selected' : null],
          type: 'button',
          disabled: props.disabled,
          onClick: () => {
            emit('update:modelValue', item.id);
            emit('action', item);
          }
        }, [
          h('span', {class: 'vs-card-view__title'}, item.title),
          item.description ? h('span', {class: 'vs-card-view__description'}, item.description) : null
        ]);
      }));
    };
  }
});
