import '@adobe/spectrum-css-temp/components/badge/vars.css';
import {classNames, filterDOMProps} from '@vue-spectrum/utils';
import {cloneVNode, Comment, defineComponent, Fragment, h, isVNode, Text, type PropType, type VNode} from 'vue';

const styles: {[key: string]: string} = {};

type BadgeVariant = 'neutral' | 'info' | 'positive' | 'negative' | 'indigo' | 'yellow' | 'magenta' | 'fuchsia' | 'purple' | 'seafoam';

function flattenChildren(nodes: unknown[]): VNode[] {
  let result: VNode[] = [];

  for (let node of nodes) {
    if (!isVNode(node) || node.type === Comment) {
      continue;
    }

    if (node.type === Fragment && Array.isArray(node.children)) {
      result.push(...flattenChildren(node.children));
      continue;
    }

    if (node.type === Text) {
      let text = typeof node.children === 'string' ? node.children : '';
      if (!text.trim()) {
        continue;
      }
    }

    result.push(node);
  }

  return result;
}

function isTextNode(node: VNode): boolean {
  return node.type === Text && typeof node.children === 'string';
}

function isIconNode(node: VNode): boolean {
  if (typeof node.type === 'string') {
    if (node.type === 'svg') {
      return true;
    }

    let className = node.props?.class;
    return typeof className === 'string' && className.includes('spectrum-Icon');
  }

  if (typeof node.type === 'object' && node.type !== null) {
    let componentName = ((node.type as {name?: string}).name ?? '').toLowerCase();
    return componentName.includes('icon') || componentName.includes('workflow');
  }

  return false;
}

function decorateChild(node: VNode): VNode {
  if (isTextNode(node)) {
    return h('span', {
      role: 'none',
      class: classNames(styles, 'spectrum-Badge-label')
    }, node.children);
  }

  if (isIconNode(node)) {
    return cloneVNode(node, {
      class: [node.props?.class, classNames(styles, 'spectrum-Badge-icon')],
      size: (node.props as {size?: string} | null | undefined)?.size ?? 'S'
    });
  }

  if (typeof node.type === 'string') {
    return cloneVNode(node, {
      class: [node.props?.class, classNames(styles, 'spectrum-Badge-label')],
      role: (node.props as {role?: string} | null | undefined)?.role ?? 'none'
    });
  }

  return node;
}

export const Badge = defineComponent({
  name: 'VueSpectrumBadge',
  inheritAttrs: false,
  props: {
    variant: {
      type: String as PropType<BadgeVariant | undefined>,
      default: undefined
    },
    UNSAFE_className: {
      type: String,
      default: ''
    },
    UNSAFE_style: {
      type: [String, Object, Array] as PropType<string | Record<string, unknown> | Array<unknown> | undefined>,
      default: undefined
    }
  },
  setup(props, {attrs, slots}) {
    return () => {
      let domProps = filterDOMProps(attrs as Record<string, unknown>, {labelable: true}) as Record<string, unknown>;
      let {class: domClass, className: domClassName, style: domStyle, ...restDomProps} = domProps;
      let children = slots.default ? flattenChildren(slots.default()) : [];
      let isTextOnly = children.length > 0 && children.every(isTextNode);
      let renderedChildren = isTextOnly
        ? [h('span', {role: 'none', class: classNames(styles, 'spectrum-Badge-label')}, children.map((child) => child.children).join(''))]
        : children.map(decorateChild);

      return h('span', {
        ...restDomProps,
        role: 'presentation',
        class: [
          classNames(styles, 'spectrum-Badge', {
            [`spectrum-Badge--${props.variant}`]: !!props.variant
          }),
          props.UNSAFE_className,
          domClassName,
          domClass
        ],
        style: [props.UNSAFE_style, domStyle]
      }, renderedChildren);
    };
  }
});

export const VueBadge = Badge;
export type {SpectrumBadgeProps} from '@vue-types/badge';
