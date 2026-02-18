import type {App, Plugin} from 'vue';
import {VueButton} from './components/VueButton';
import {VueCheckbox} from './components/VueCheckbox';
import {VueComboBox} from './components/VueComboBox';
import {VueDialog} from './components/VueDialog';
import {VueMenu} from './components/VueMenu';
import {VuePopover} from './components/VuePopover';
import {VueRadio, VueRadioGroup} from './components/VueRadioGroup';
import {VueSpectrumProvider} from './components/VueSpectrumProvider';
import {VueTextField} from './components/VueTextField';

export const VueSpectrumPlugin: Plugin = {
  install(app: App) {
    app.component(VueSpectrumProvider.name ?? 'VueSpectrumProvider', VueSpectrumProvider);
    app.component(VueButton.name ?? 'VueButton', VueButton);
    app.component(VueCheckbox.name ?? 'VueCheckbox', VueCheckbox);
    app.component(VueComboBox.name ?? 'VueComboBox', VueComboBox);
    app.component(VueDialog.name ?? 'VueDialog', VueDialog);
    app.component(VueMenu.name ?? 'VueMenu', VueMenu);
    app.component(VuePopover.name ?? 'VuePopover', VuePopover);
    app.component(VueRadioGroup.name ?? 'VueRadioGroup', VueRadioGroup);
    app.component(VueRadio.name ?? 'VueRadio', VueRadio);
    app.component(VueTextField.name ?? 'VueTextField', VueTextField);
  }
};

export {VueButton, VueCheckbox, VueComboBox, VueDialog, VueMenu, VuePopover, VueRadio, VueRadioGroup, VueSpectrumProvider, VueTextField};
export type {SpectrumContextValue} from './context';
