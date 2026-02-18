import type {App, Plugin} from 'vue';
import {VueButton} from './components/VueButton';
import {VueSpectrumProvider} from './components/VueSpectrumProvider';
import {VueTextField} from './components/VueTextField';

export const VueSpectrumPlugin: Plugin = {
  install(app: App) {
    app.component(VueSpectrumProvider.name ?? 'VueSpectrumProvider', VueSpectrumProvider);
    app.component(VueButton.name ?? 'VueButton', VueButton);
    app.component(VueTextField.name ?? 'VueTextField', VueTextField);
  }
};

export {VueButton, VueSpectrumProvider, VueTextField};
export type {SpectrumContextValue} from './context';
