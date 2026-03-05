import {defineComponent, h} from '@vue/runtime-core';

function hasClassToken(value: unknown, token: string): boolean {
  if (!value) {
    return false;
  }

  if (typeof value === 'string') {
    return value.split(/\s+/).includes(token);
  }

  if (Array.isArray(value)) {
    return value.some(item => hasClassToken(item, token));
  }

  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).some(([key, enabled]) => Boolean(enabled) && key === token);
  }

  return false;
}

export const VueLink = defineComponent({
  name: 'VueLink',
  props: {
    href: {
      type: String,
      default: '#'
    },
    target: {
      type: String,
      default: undefined
    },
    rel: {
      type: String,
      default: undefined
    }
  },
  emits: {
    click: (event: MouseEvent) => event instanceof MouseEvent
  },
  setup(props, {slots, emit, attrs}) {
    let classAttr = attrs.class;
    let usesExternalButtonBase = hasClassToken(classAttr, 'button-base');
    let {
      class: _classAttr,
      ...forwardedAttrs
    } = attrs;

    return function render() {
      return h('a', {
        ...forwardedAttrs,
        class: [usesExternalButtonBase ? null : 'vs-link', classAttr],
        'data-vac': '',
        href: props.href,
        target: props.target,
        rel: props.rel,
        onClick: (event: MouseEvent) => emit('click', event)
      }, slots.default ? slots.default() : props.href);
    };
  }
});
