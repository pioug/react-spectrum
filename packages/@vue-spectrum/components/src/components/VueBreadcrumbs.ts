import {computed, defineComponent, h, type PropType} from 'vue';

export const VueBreadcrumbs = defineComponent({
  name: 'VueBreadcrumbs',
  props: {
    items: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    current: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    action: (key: string) => typeof key === 'string'
  },
  setup(props, {emit, attrs}) {
    let currentItem = computed(() => {
      if (props.current) {
        return props.current;
      }

      return props.items[props.items.length - 1] ?? '';
    });

    return function render() {
      return h('nav', {
        ...attrs,
        class: ['vs-breadcrumbs', attrs.class],
        'aria-label': 'Breadcrumbs',
        'data-vac': ''
      }, [
        h('ol', {class: 'vs-breadcrumbs__list'}, props.items.map((item, index) => {
          let isCurrent = item === currentItem.value;
          let link = isCurrent
            ? h('span', {class: 'vs-breadcrumbs__current', 'aria-current': 'page'}, item)
            : h('button', {
              class: 'vs-breadcrumbs__link',
              type: 'button',
              disabled: props.disabled,
              onClick: () => emit('action', item)
            }, item);

          return h('li', {
            class: 'vs-breadcrumbs__item',
            key: `${item}-${index}`
          }, [
            link,
            index < props.items.length - 1
              ? h('span', {class: 'vs-breadcrumbs__separator', 'aria-hidden': 'true'}, '›')
              : null
          ]);
        }))
      ]);
    };
  }
});
