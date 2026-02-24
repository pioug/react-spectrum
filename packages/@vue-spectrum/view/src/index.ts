import {VueView} from 'vue-aria-components';

export const View = VueView;
export const Header = VueView;
export const Content = VueView;
export const Footer = VueView;
export {VueView};

export type ViewProps = Record<string, unknown>;
export type HeaderProps = ViewProps;
export type ContentProps = ViewProps;
export type FooterProps = ViewProps;
