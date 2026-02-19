import {VuePopover} from '@vue-spectrum/components';
import {computed, defineComponent, h, Teleport, Transition, type PropType} from 'vue';

type OverlayStateLike = {
  isOpen?: boolean,
  close?: () => void
};

export const Popover = VuePopover;
export {VuePopover};

export const OpenTransition = defineComponent({
  name: 'VueOpenTransition',
  props: {
    in: {
      type: Boolean,
      default: false
    },
    appear: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {slots}) {
    return () => h(Transition, {
      name: 'vs-open-transition',
      appear: props.appear
    }, () => (props.in ? slots.default?.() : null));
  }
});

export const Overlay = defineComponent({
  name: 'VueOverlay',
  inheritAttrs: false,
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    container: {
      type: [String, Object] as PropType<string | Element | ShadowRoot | null | undefined>,
      default: 'body'
    }
  },
  setup(props, {attrs, slots}) {
    return () => {
      if (!props.isOpen) {
        return null;
      }

      let content = h('div', {
        ...attrs,
        class: ['vs-overlay', attrs.class],
        'data-vac': ''
      }, slots.default ? slots.default() : []);

      return h(Teleport, {to: props.container ?? 'body'}, [
        h(OpenTransition, {in: props.isOpen, appear: true}, {
          default: () => [content]
        })
      ]);
    };
  }
});

export const Modal = defineComponent({
  name: 'VueModal',
  inheritAttrs: false,
  props: {
    state: {
      type: Object as PropType<OverlayStateLike | undefined>,
      default: undefined
    },
    isOpen: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    container: {
      type: [String, Object] as PropType<string | Element | ShadowRoot | null | undefined>,
      default: 'body'
    }
  },
  setup(props, {attrs, slots}) {
    let isOpen = computed(() => props.isOpen ?? props.state?.isOpen ?? false);

    return () => h(Overlay, {
      isOpen: isOpen.value,
      container: props.container
    }, {
      default: () => [
        h('div', {
          ...attrs,
          class: ['vs-modal', attrs.class],
          'data-vac': ''
        }, slots.default ? slots.default() : [])
      ]
    });
  }
});

export const Tray = defineComponent({
  name: 'VueTray',
  inheritAttrs: false,
  props: {
    state: {
      type: Object as PropType<OverlayStateLike | undefined>,
      default: undefined
    },
    isOpen: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    container: {
      type: [String, Object] as PropType<string | Element | ShadowRoot | null | undefined>,
      default: 'body'
    }
  },
  setup(props, {attrs, slots}) {
    let isOpen = computed(() => props.isOpen ?? props.state?.isOpen ?? false);

    return () => h(Overlay, {
      isOpen: isOpen.value,
      container: props.container
    }, {
      default: () => [
        h('div', {
          ...attrs,
          class: ['vs-tray', attrs.class],
          'data-vac': ''
        }, slots.default ? slots.default() : [])
      ]
    });
  }
});
