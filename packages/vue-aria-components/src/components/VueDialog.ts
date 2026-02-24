import {defineComponent, h} from 'vue';

export const VueDialog = defineComponent({
  name: 'VueDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    open: {
      type: Boolean,
      default: false
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

      let closeButton = props.dismissable
        ? h('button', {
          class: 'vs-dialog__close',
          type: 'button',
          'aria-label': 'Close dialog',
          onClick: () => emit('close')
        }, '×')
        : null;

      return h('div', {
        class: 'vs-dialog-layer',
        'data-vac': ''
      }, [
        h('button', {
          class: 'vs-dialog-layer__backdrop',
          type: 'button',
          'aria-label': 'Dismiss dialog',
          onClick: () => props.dismissable && emit('close')
        }),
        h('section', {
          ...attrs,
          class: ['vs-dialog', attrs.class],
          'data-vac': '',
          role: 'dialog',
          'aria-modal': 'true'
        }, [
          h('header', {class: 'vs-dialog__header'}, [
            slots.header ? slots.header() : h('h2', {class: 'vs-dialog__title'}, props.title),
            closeButton
          ]),
          h('div', {class: 'vs-dialog__body'}, slots.default ? slots.default() : [])
        ])
      ]);
    };
  }
});
