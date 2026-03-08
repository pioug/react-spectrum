import '@adobe/spectrum-css-temp/components/illustratedmessage/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {cloneVNode, Comment, defineComponent, Fragment, h, isVNode, Text, type VNode} from 'vue';
import {filterDOMProps} from '@vue-aria/utils';
const styles: {[key: string]: string} = {};

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

function decorateChild(node: VNode): VNode {
  if (typeof node.type !== 'object' || node.type == null) {
    return node;
  }

  let componentName = (node.type as {name?: string}).name ?? '';
  if (componentName === 'VueSpectrumHeading') {
    return cloneVNode(node, {
      class: [node.props?.class, classNames(styles, 'spectrum-IllustratedMessage-heading')]
    }, true);
  }

  if (componentName === 'VueSpectrumContent') {
    return cloneVNode(node, {
      class: [node.props?.class, classNames(styles, 'spectrum-IllustratedMessage-description')]
    }, true);
  }

  return node;
}

export const IllustratedMessage = defineComponent({
  name: 'VueIllustratedMessage',
  inheritAttrs: false,
  setup(_props, {slots, attrs}) {
    return () => {
      let domProps = filterDOMProps(attrs as Record<string, unknown>) as Record<string, unknown>;
      let {
        class: domClass,
        className: domClassName,
        style: domStyle,
        ...otherDomProps
      } = domProps;
      let children = slots.default ? flattenChildren(slots.default()).map(decorateChild) : [];

      return h('div', {
        ...otherDomProps,
        class: [
          classNames(styles, 'spectrum-IllustratedMessage', 'flex'),
          domClassName,
          domClass
        ],
        style: domStyle
      }, children);
    };
  }
});

export {IllustratedMessage as VueIllustratedMessage};
export type {SpectrumIllustratedMessageProps} from '@vue-types/illustratedmessage';
