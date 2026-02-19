import {ToastQueue, VueToastContainer} from './VueToast';

export const ToastContainer = VueToastContainer;
export {VueToastContainer, ToastQueue};
export {clearToastQueue, createToastQueue} from './VueToast';
export type SpectrumToastContainerProps = InstanceType<typeof VueToastContainer>['$props'];
export type {
  CreateToastQueueOptions,
  SpectrumQueuedToast,
  SpectrumToastOptions,
  SpectrumToastQueue,
  SpectrumToastValue,
  ToastPlacement,
  ToastVariant
} from './VueToast';
