import {defineComponent, h, type PropType} from 'vue';

export const VuePopover = defineComponent({
  name: 'VuePopover',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
      default: 'bottom'
    },
    dismissable: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    close: () => true
  },
  setup(props, {slots, emit, attrs}) {
    return function render() {
      if (!props.open) {
        return null;
      }

      return h('div', {
        class: 'vs-popover-layer',
        'data-vac': ''
      }, [
        props.dismissable
          ? h('button', {
            class: 'vs-popover-layer__backdrop',
            type: 'button',
            'aria-label': 'Dismiss popover',
            onClick: () => emit('close')
          })
          : null,
        h('section', {
          ...attrs,
          class: ['vs-popover', `vs-popover--${props.placement}`, attrs.class],
          'data-vac': '',
          role: 'dialog'
        }, slots.default ? slots.default() : [])
      ]);
    };
  }
});
