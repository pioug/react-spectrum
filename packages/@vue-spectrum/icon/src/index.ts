import '@adobe/spectrum-css-temp/components/icon/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType} from 'vue';
const styles: {[key: string]: string} = {};


type IconScaleSize = 'L' | 'M';
type IconSize = 'XXL' | 'XXS' | 'XL' | 'XS' | 'L' | 'M' | 'S' | 'l' | 'm' | 's' | 'xl' | 'xs' | 'xxl' | 'xxs';

function resolveSize(size: IconSize | undefined): {scale: IconScaleSize, token: Exclude<IconSize, 'l' | 'm' | 's' | 'xl' | 'xs' | 'xxl' | 'xxs'>} {
  if (!size) {
    return {
      scale: 'M',
      token: 'M'
    };
  }

  let normalized = size.toUpperCase() as Exclude<IconSize, 'l' | 'm' | 's' | 'xl' | 'xs' | 'xxl' | 'xxs'>;
  let scale: IconScaleSize = normalized === 'L' || normalized === 'XL' || normalized === 'XXL' ? 'L' : 'M';
  return {
    scale,
    token: normalized
  };
}

function resolveAriaHidden(hasLabel: boolean, hidden: boolean, explicitAriaHidden: unknown): string | undefined {
  if (hidden) {
    return 'true';
  }

  if (typeof explicitAriaHidden === 'string') {
    return explicitAriaHidden;
  }

  if (typeof explicitAriaHidden === 'boolean') {
    return explicitAriaHidden ? 'true' : 'false';
  }

  return hasLabel ? undefined : 'true';
}

const iconProps = {
  color: {
    type: String,
    default: 'currentColor'
  },
  elementType: {
    type: String,
    default: 'span'
  },
  hidden: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  size: {
    type: String as PropType<IconSize | undefined>,
    default: undefined
  }
};

export const Icon = defineComponent({
  name: 'VueIcon',
  inheritAttrs: false,
  props: iconProps,
  setup(props, {attrs, slots}) {
    let resolvedSize = computed(() => resolveSize(props.size));

    return () => {
      let ariaLabel = props.label || attrs['aria-label'];
      let ariaLabelledby = attrs['aria-labelledby'];
      let hasLabel = !!ariaLabel || !!ariaLabelledby;
      let ariaHidden = resolveAriaHidden(hasLabel, props.hidden, attrs['aria-hidden']);

      return h(props.elementType, {
        ...attrs,
        class: [
          classNames(styles, 'spectrum-Icon', `spectrum-Icon--size${resolvedSize.value.token}`),
          'vs-icon',
          `vs-icon--${String(resolvedSize.value.token).toLowerCase()}`,
          attrs.class
        ],
        style: [{color: props.color}, attrs.style],
        role: 'img',
        hidden: props.hidden || undefined,
        'aria-label': typeof ariaLabel === 'string' ? ariaLabel : undefined,
        'aria-labelledby': typeof ariaLabelledby === 'string' ? ariaLabelledby : undefined,
        'aria-hidden': ariaHidden,
        'data-scale': resolvedSize.value.scale,
        'data-vac': ''
      }, slots.default ? slots.default() : []);
    };
  }
});

export const UIIcon = defineComponent({
  name: 'VueUIIcon',
  inheritAttrs: false,
  props: iconProps,
  setup(props, {attrs, slots}) {
    return () => h(Icon, {
      ...attrs,
      ...props,
      class: ['vs-ui-icon', attrs.class]
    }, slots);
  }
});

export const Illustration = defineComponent({
  name: 'VueIllustration',
  inheritAttrs: false,
  props: {
    elementType: {
      type: String,
      default: 'div'
    },
    hidden: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    }
  },
  setup(props, {attrs, slots}) {
    return () => {
      let ariaLabel = props.label || attrs['aria-label'];
      let ariaLabelledby = attrs['aria-labelledby'];
      let hasLabel = !!ariaLabel || !!ariaLabelledby;
      let ariaHidden = resolveAriaHidden(hasLabel, props.hidden, attrs['aria-hidden']);

      return h(props.elementType, {
        ...attrs,
        class: ['vs-illustration', attrs.class],
        role: hasLabel ? 'img' : undefined,
        hidden: props.hidden || undefined,
        'aria-label': typeof ariaLabel === 'string' ? ariaLabel : undefined,
        'aria-labelledby': typeof ariaLabelledby === 'string' ? ariaLabelledby : undefined,
        'aria-hidden': ariaHidden,
        'data-vac': ''
      }, slots.default ? slots.default() : []);
    };
  }
});

export {Icon as VueIcon, Illustration as VueIllustration, UIIcon as VueUIIcon};

export type IconProps = InstanceType<typeof Icon>['$props'];
export type UIIconProps = InstanceType<typeof UIIcon>['$props'];
export type IllustrationProps = InstanceType<typeof Illustration>['$props'];
export type IconPropsWithoutChildren = IconProps;
export type UIIconPropsWithoutChildren = UIIconProps;
export type IllustrationPropsWithoutChildren = IllustrationProps;
