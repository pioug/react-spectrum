import {VueText} from 'vue-aria-components';
import {defineComponent, h, type PropType} from 'vue';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const Text = defineComponent({
  name: 'VueSpectrumText',
  inheritAttrs: false,
  setup(_, {attrs, slots}) {
    return () => h(VueText, {
      ...attrs,
      elementType: 'span',
      role: 'none'
    }, slots);
  }
});

export const Heading = defineComponent({
  name: 'VueSpectrumHeading',
  inheritAttrs: false,
  props: {
    level: {
      type: Number as PropType<HeadingLevel>,
      default: 3
    }
  },
  setup(props, {attrs, slots}) {
    return () => h(VueText, {
      ...attrs,
      elementType: `h${props.level}`,
      variant: 'heading'
    }, slots);
  }
});

export const Keyboard = defineComponent({
  name: 'VueSpectrumKeyboard',
  inheritAttrs: false,
  setup(_, {attrs, slots}) {
    return () => h(VueText, {
      ...attrs,
      elementType: 'kbd'
    }, slots);
  }
});

export {VueText};

export type TextProps = InstanceType<typeof Text>['$props'];
export type HeadingProps = InstanceType<typeof Heading>['$props'];
export type KeyboardProps = InstanceType<typeof Keyboard>['$props'];
