import type {App, Plugin} from 'vue';
import {VueButton} from './components/VueButton';
import {VueCheckbox} from './components/VueCheckbox';
import {VueDialog} from './components/VueDialog';
import {VuePopover} from './components/VuePopover';
import {VueRadio, VueRadioGroup} from './components/VueRadioGroup';
import {VueSpectrumProvider} from './components/VueSpectrumProvider';
import {VueTextField} from './components/VueTextField';

export const VueSpectrumPlugin: Plugin = {
  install(app: App) {
    app.component(VueSpectrumProvider.name ?? 'VueSpectrumProvider', VueSpectrumProvider);
    app.component(VueButton.name ?? 'VueButton', VueButton);
    app.component(VueCheckbox.name ?? 'VueCheckbox', VueCheckbox);
    app.component(VueDialog.name ?? 'VueDialog', VueDialog);
    app.component(VuePopover.name ?? 'VuePopover', VuePopover);
    app.component(VueRadioGroup.name ?? 'VueRadioGroup', VueRadioGroup);
    app.component(VueRadio.name ?? 'VueRadio', VueRadio);
    app.component(VueTextField.name ?? 'VueTextField', VueTextField);
  }
};

export {VueButton, VueCheckbox, VueDialog, VuePopover, VueRadio, VueRadioGroup, VueSpectrumProvider, VueTextField};
export type {SpectrumContextValue} from './context';
