import '@adobe/spectrum-css-temp/components/inlinealert/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType, ref, type VNodeChild} from 'vue';
import {getEventTarget} from '@vue-aria/utils';
const styles: {[key: string]: string} = {};


type Variant = 'neutral' | 'info' | 'positive' | 'notice' | 'negative';

export const InlineAlert = defineComponent({
  name: 'VueInlineAlert',
  inheritAttrs: false,
  props: {
    autoFocus: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    variant: {
      type: String as PropType<Variant>,
      default: 'neutral'
    }
  },
  setup(props, {slots, attrs}) {
    let isFocusVisible = ref(false);

    let className = computed(() => classNames(
      styles,
      'spectrum-InLineAlert',
      `spectrum-InLineAlert--${props.variant}`,
      {
        'focus-ring': isFocusVisible.value
      }
    ));

    return () => {
      let content: VNodeChild[] = [];
      if (slots.default) {
        content = slots.default();
      } else if (props.label) {
        content = [props.label];
      }

      return h('section', {
        ...attrs,
        class: [className.value, 'vs-inline-alert', `vs-inline-alert--${props.variant}`, attrs.class],
        role: 'alert',
        tabindex: props.autoFocus ? -1 : attrs.tabindex,
        'aria-label': attrs['aria-label'] ?? (props.title || props.label || undefined),
        'data-vac': '',
        onFocus: (event: FocusEvent) => {
          let target = getEventTarget(event);
          if (target instanceof HTMLElement && target.matches(':focus-visible')) {
            isFocusVisible.value = true;
          } else {
            isFocusVisible.value = true;
          }
        },
        onBlur: () => {
          isFocusVisible.value = false;
        }
      }, [
        h('div', {class: [classNames(styles, 'spectrum-InLineAlert-grid'), 'vs-inline-alert__grid']}, [
          props.title ? h('strong', {class: ['vs-inline-alert__title', classNames(styles, 'spectrum-InLineAlert-heading')]}, props.title) : null,
          h('div', {class: ['vs-inline-alert__content', classNames(styles, 'spectrum-InLineAlert-content')]}, content)
        ])
      ]);
    };
  }
});

export const VueInlineAlert = InlineAlert;
export type SpectrumInlineAlertProps = InstanceType<typeof InlineAlert>['$props'];
