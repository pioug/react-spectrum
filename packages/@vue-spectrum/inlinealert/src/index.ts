import '@adobe/spectrum-css-temp/components/inlinealert/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, nextTick, onMounted, type PropType, ref} from 'vue';
import {filterDOMProps, getEventTarget} from '@vue-aria/utils';
const styles: {[key: string]: string} = {};


type Variant = 'neutral' | 'info' | 'positive' | 'notice' | 'negative';
type IconDefinition = {
  ariaLabel: string,
  className: string,
  path: string
};

const ICON_BY_VARIANT: Partial<Record<Variant, IconDefinition>> = {
  info: {
    ariaLabel: 'Information',
    className: 'spectrum-UIIcon-InfoMedium',
    path: 'M9 1a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm-.15 2.15a1.359 1.359 0 0 1 1.431 1.283q.004.064.001.129A1.332 1.332 0 0 1 8.85 5.994a1.353 1.353 0 0 1-1.432-1.433 1.359 1.359 0 0 1 1.304-1.412q.064-.002.128.001zM11 13.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5H8V9h-.5a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V12h.5a.5.5 0 0 1 .5.5z'
  },
  positive: {
    ariaLabel: 'Success',
    className: 'spectrum-UIIcon-SuccessMedium',
    path: 'M9 1a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm5.333 4.54l-6.324 8.13a.6.6 0 0 1-.437.23h-.037a.6.6 0 0 1-.425-.176l-3.893-3.9a.6.6 0 0 1 0-.849l.663-.663a.6.6 0 0 1 .848 0L7.4 10.991l5.256-6.754a.6.6 0 0 1 .843-.1l.728.566a.6.6 0 0 1 .106.837z'
  },
  notice: {
    ariaLabel: 'Warning',
    className: 'spectrum-UIIcon-AlertMedium',
    path: 'M8.564 1.289L.2 16.256A.5.5 0 0 0 .636 17h16.728a.5.5 0 0 0 .436-.744L9.436 1.289a.5.5 0 0 0-.872 0zM10 14.75a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25zm0-3a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-6a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25z'
  },
  negative: {
    ariaLabel: 'Error',
    className: 'spectrum-UIIcon-AlertMedium',
    path: 'M8.564 1.289L.2 16.256A.5.5 0 0 0 .636 17h16.728a.5.5 0 0 0 .436-.744L9.436 1.289a.5.5 0 0 0-.872 0zM10 14.75a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25zm0-3a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-6a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25z'
  }
};

export const InlineAlert = defineComponent({
  name: 'VueInlineAlert',
  inheritAttrs: false,
  props: {
    autoFocus: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String as PropType<Variant>,
      default: 'neutral'
    }
  },
  setup(props, {slots, attrs}) {
    let rootRef = ref<HTMLElement | null>(null);
    let isFocusVisible = ref(false);

    onMounted(() => {
      if (props.autoFocus) {
        void nextTick(() => {
          rootRef.value?.focus();
        });
      }
    });

    let className = computed(() => classNames(
      styles,
      'spectrum-InLineAlert',
      'spectrum-FocusRing',
      'spectrum-FocusRing-ring',
      `spectrum-InLineAlert--${props.variant}`,
      {
        'focus-ring': isFocusVisible.value
      }
    ));

    return () => {
      let icon = ICON_BY_VARIANT[props.variant];
      let domProps = filterDOMProps(attrs as Record<string, unknown>) as Record<string, unknown>;
      let domTabIndex = domProps.tabindex ?? domProps.tabIndex;
      let {
        class: domClass,
        className: domClassName,
        style: domStyle,
        ...otherDomProps
      } = domProps;
      delete otherDomProps.tabindex;
      delete otherDomProps.tabIndex;
      let contentNodes = slots.default ? slots.default() : [];

      return h('div', {
        ...otherDomProps,
        ref: rootRef,
        class: [className.value, domClassName, domClass],
        style: domStyle,
        role: 'alert',
        tabindex: props.autoFocus ? -1 : domTabIndex,
        onFocus: (event: FocusEvent) => {
          let target = getEventTarget(event);
          if (target instanceof HTMLElement && target.matches(':focus-visible')) {
            isFocusVisible.value = true;
          } else {
            isFocusVisible.value = false;
          }
        },
        onBlur: () => {
          isFocusVisible.value = false;
        }
      }, [
        h('div', {
          class: classNames(styles, 'spectrum-InLineAlert-grid'),
          style: {display: 'grid'}
        }, [
          icon
            ? h('svg', {
              class: classNames(
                styles,
                'spectrum-InLineAlert-icon',
                'spectrum-Icon',
                icon.className
              ),
              viewBox: '0 0 18 18',
              focusable: 'false',
              'aria-label': icon.ariaLabel,
              role: 'img'
            }, [
              h('path', {d: icon.path})
            ])
            : null,
          ...contentNodes
        ])
      ]);
    };
  }
});

export const VueInlineAlert = InlineAlert;
export type SpectrumInlineAlertProps = InstanceType<typeof InlineAlert>['$props'];
