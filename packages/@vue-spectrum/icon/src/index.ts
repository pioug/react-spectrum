import '@adobe/spectrum-css-temp/components/icon/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {cloneVNode, computed, defineComponent, isVNode, mergeProps, type PropType, type VNode} from 'vue';
import {filterDOMProps} from '@vue-aria/utils';
import {useProvider} from '@vue-spectrum/provider';
const styles: {[key: string]: string} = {};


type IconScaleSize = 'L' | 'M';
type IconSize = 'XXL' | 'XXS' | 'XL' | 'XS' | 'L' | 'M' | 'S' | 'l' | 'm' | 's' | 'xl' | 'xs' | 'xxl' | 'xxs';
const iconColorTokens = new Set(['negative', 'notice', 'positive', 'informative']);

function resolveSize(size: IconSize): Exclude<IconSize, 'l' | 'm' | 's' | 'xl' | 'xs' | 'xxl' | 'xxs'> {
  return size.toUpperCase() as Exclude<IconSize, 'l' | 'm' | 's' | 'xl' | 'xs' | 'xxl' | 'xxs'>;
}

function resolveIconColor(color: string): string {
  if (iconColorTokens.has(color)) {
    return `var(--spectrum-semantic-${color}-color-icon)`;
  }

  return color;
}

function normalizeAriaHidden(explicitAriaHidden: unknown): string | undefined {
  if (explicitAriaHidden === true || explicitAriaHidden === 'true') {
    return 'true';
  }

  if (explicitAriaHidden === 'false') {
    return 'false';
  }

  return undefined;
}

function resolveIconAriaHidden(hasLabel: boolean, explicitAriaHidden: unknown): string | undefined {
  let normalized = normalizeAriaHidden(explicitAriaHidden);
  if (hasLabel) {
    return normalized;
  }

  return 'true';
}

function getSingleVNodeChild(slot: (() => unknown[]) | undefined): VNode | null {
  let nodes = slot ? slot() : [];
  for (let node of nodes) {
    if (isVNode(node)) {
      return node;
    }
  }

  return null;
}

function getVNodeDisplayName(node: VNode): string | undefined {
  let type = node.type;
  if (typeof type === 'object' && type != null) {
    let namedType = type as {displayName?: string, name?: string};
    return namedType.displayName || namedType.name;
  }

  if (typeof type === 'function') {
    let namedType = type as {displayName?: string, name?: string};
    return namedType.displayName || namedType.name;
  }

  return undefined;
}

const iconProps = {
  color: {
    type: String as PropType<string | undefined>,
    default: undefined
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
    let provider = useProvider();
    let providerScale = computed<IconScaleSize>(() => provider.scale === 'large' ? 'L' : 'M');
    let resolvedSize = computed(() => props.size ? resolveSize(props.size) : providerScale.value);

    return () => {
      let child = getSingleVNodeChild(slots.default);
      if (!child) {
        return null;
      }

      let ariaLabel = attrs['aria-label'];
      let hasLabel = typeof ariaLabel === 'string' && ariaLabel.length > 0;
      let domProps = filterDOMProps(attrs as Record<string, unknown>) as Record<string, unknown>;
      let {
        class: domClass,
        className: domClassName,
        style: domStyle,
        ...otherDomProps
      } = domProps;

      return cloneVNode(child, mergeProps(child.props ?? {}, otherDomProps, {
        class: [
          classNames(styles, 'spectrum-Icon', `spectrum-Icon--size${resolvedSize.value}`),
          child.props?.class,
          domClassName,
          domClass
        ],
        style: [
          domStyle,
          props.color ? {color: resolveIconColor(props.color)} : undefined
        ],
        focusable: 'false',
        role: 'img',
        'aria-label': typeof ariaLabel === 'string' ? ariaLabel : undefined,
        'aria-hidden': resolveIconAriaHidden(hasLabel, attrs['aria-hidden'])
      }));
    };
  }
});

export const UIIcon = defineComponent({
  name: 'VueUIIcon',
  inheritAttrs: false,
  setup(_props, {attrs, slots}) {
    let provider = useProvider();
    let providerScale = computed<IconScaleSize>(() => provider.scale === 'large' ? 'L' : 'M');

    return () => {
      let child = getSingleVNodeChild(slots.default);
      if (!child) {
        return null;
      }

      let ariaLabel = attrs['aria-label'];
      let hasLabel = typeof ariaLabel === 'string' && ariaLabel.length > 0;
      let domProps = filterDOMProps(attrs as Record<string, unknown>) as Record<string, unknown>;
      let {
        class: domClass,
        className: domClassName,
        style: domStyle,
        ...otherDomProps
      } = domProps;
      let iconName = getVNodeDisplayName(child);

      return cloneVNode(child, mergeProps(child.props ?? {}, otherDomProps, {
        class: [
          classNames(
            styles,
            'spectrum-Icon',
            {
              [`spectrum-UIIcon-${iconName}`]: Boolean(iconName)
            }
          ),
          child.props?.class,
          domClassName,
          domClass
        ],
        style: domStyle,
        scale: providerScale.value,
        focusable: 'false',
        role: 'img',
        'aria-label': typeof ariaLabel === 'string' ? ariaLabel : undefined,
        'aria-hidden': resolveIconAriaHidden(hasLabel, attrs['aria-hidden'])
      }));
    };
  }
});

export const Illustration = defineComponent({
  name: 'VueIllustration',
  inheritAttrs: false,
  setup(_props, {attrs, slots}) {
    return () => {
      let child = getSingleVNodeChild(slots.default);
      if (!child) {
        return null;
      }

      let domProps = filterDOMProps(attrs as Record<string, unknown>) as Record<string, unknown>;
      let {
        class: domClass,
        className: domClassName,
        style: domStyle,
        ...otherDomProps
      } = domProps;
      let ariaLabel = attrs['aria-label'];
      let ariaLabelledby = attrs['aria-labelledby'];
      let hasLabel = Boolean(
        (typeof ariaLabel === 'string' && ariaLabel.length > 0)
        || (typeof ariaLabelledby === 'string' && ariaLabelledby.length > 0)
      );

      return cloneVNode(child, mergeProps(child.props ?? {}, otherDomProps, {
        class: [child.props?.class, domClassName, domClass],
        style: domStyle,
        focusable: 'false',
        role: hasLabel ? 'img' : undefined,
        'aria-label': typeof ariaLabel === 'string' ? ariaLabel : undefined,
        'aria-labelledby': typeof ariaLabelledby === 'string' ? ariaLabelledby : undefined,
        'aria-hidden': normalizeAriaHidden(attrs['aria-hidden'])
      }));
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
