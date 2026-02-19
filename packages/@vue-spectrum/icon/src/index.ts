import {VueIcon, VueIllustration, VueUIIcon} from '@vue-spectrum/components';

export const Icon = VueIcon;
export const UIIcon = VueUIIcon;
export const Illustration = VueIllustration;

export {VueIcon, VueIllustration, VueUIIcon};

export type IconProps = Record<string, unknown>;
export type UIIconProps = IconProps;
export type IllustrationProps = IconProps;
export type IconPropsWithoutChildren = IconProps;
export type UIIconPropsWithoutChildren = IconProps;
export type IllustrationPropsWithoutChildren = IconProps;
