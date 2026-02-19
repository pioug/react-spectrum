import {VueAccordion, VueDisclosure, VueDisclosurePanel, VueDisclosureTitle} from '@vue-spectrum/components';

export const Accordion = VueAccordion;
export const Disclosure = VueDisclosure;
export const DisclosurePanel = VueDisclosurePanel;
export const DisclosureTitle = VueDisclosureTitle;
export {VueAccordion, VueDisclosure, VueDisclosurePanel, VueDisclosureTitle};
export type SpectrumAccordionProps = InstanceType<typeof VueAccordion>['$props'];
export type SpectrumDisclosureProps = InstanceType<typeof VueDisclosure>['$props'];
export type SpectrumDisclosurePanelProps = InstanceType<typeof VueDisclosurePanel>['$props'];
export type SpectrumDisclosureTitleProps = InstanceType<typeof VueDisclosureTitle>['$props'];
