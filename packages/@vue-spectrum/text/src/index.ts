import {VueText} from '@vue-spectrum/components';

export const Text = VueText;
export const Heading = VueText;
export const Keyboard = VueText;
export {VueText};

export type TextProps = Record<string, unknown>;
export type HeadingProps = TextProps;
export type KeyboardProps = TextProps;
