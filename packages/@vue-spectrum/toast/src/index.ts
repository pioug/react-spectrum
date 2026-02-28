import '@adobe/spectrum-css-temp/components/button/vars.css';
import '@adobe/spectrum-css-temp/components/icon/vars.css';
import '@adobe/spectrum-css-temp/components/toast/vars.css';
import './toastContainer.css';
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
