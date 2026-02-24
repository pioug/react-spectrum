import {computed, defineComponent, h, type PropType} from 'vue';

interface BreadcrumbItem {
  id: string,
  url?: string
}

export const VueBreadcrumbs = defineComponent({
  name: 'VueBreadcrumbs',
  props: {
    items: {
      type: Array as PropType<Array<string | BreadcrumbItem>>,
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
    let normalizedItems = computed(() => (
      props.items.map((item) => (
        typeof item === 'string'
          ? {id: item, url: '#'}
          : {id: item.id, url: item.url ?? '#'}
      ))
    ));

    let currentItem = computed(() => {
      if (props.current) {
        return props.current;
      }

      return normalizedItems.value[normalizedItems.value.length - 1]?.id ?? '';
    });

    return function render() {
      return h('ol', {
        ...attrs,
        class: ['react-aria-Breadcrumbs', attrs.class],
        'aria-label': 'Breadcrumbs',
        'data-rac': ''
      }, normalizedItems.value.map((item, index) => {
        let isCurrent = item.id === currentItem.value;
        let link = isCurrent
          ? h('span', {
            class: 'react-aria-Link',
            'data-rac': '',
            href: item.url,
            'data-react-aria-pressable': 'true',
            role: 'link',
            'aria-disabled': 'true',
            'aria-current': 'page',
            'data-current': 'true',
            'data-disabled': 'true'
          }, item.id)
          : h('a', {
            class: 'react-aria-Link',
            'data-rac': '',
            href: item.url,
            tabindex: 0,
            'data-react-aria-pressable': 'true',
            onClick: (event: MouseEvent) => {
              event.preventDefault();
              if (!props.disabled) {
                emit('action', item.id);
              }
            }
          }, item.id);

        return h('li', {
          class: 'react-aria-Breadcrumb',
          key: `${item.id}-${index}`,
          'data-rac': '',
          'data-disabled': isCurrent ? 'true' : undefined,
          'data-current': isCurrent ? 'true' : undefined
        }, [link]);
      }));
    };
  }
});
