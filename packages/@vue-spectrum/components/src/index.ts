import type {App, Plugin} from 'vue';
import {VueButton} from './components/VueButton';
import {VueCheckbox} from './components/VueCheckbox';
import {VueComboBox} from './components/VueComboBox';
import {VueDialog} from './components/VueDialog';
import {VueForm} from './components/VueForm';
import {VueLink} from './components/VueLink';
import {VueListBox} from './components/VueListBox';
import {VueMenu} from './components/VueMenu';
import {VueNumberField} from './components/VueNumberField';
import {VuePopover} from './components/VuePopover';
import {VueRadio, VueRadioGroup} from './components/VueRadioGroup';
import {VueSearchField} from './components/VueSearchField';
import {VueSlider} from './components/VueSlider';
import {VueSpectrumProvider} from './components/VueSpectrumProvider';
import {VueSwitch} from './components/VueSwitch';
import {VueTextField} from './components/VueTextField';

export const VueSpectrumPlugin: Plugin = {
  install(app: App) {
    app.component(VueSpectrumProvider.name ?? 'VueSpectrumProvider', VueSpectrumProvider);
    app.component(VueButton.name ?? 'VueButton', VueButton);
    app.component(VueCheckbox.name ?? 'VueCheckbox', VueCheckbox);
    app.component(VueComboBox.name ?? 'VueComboBox', VueComboBox);
    app.component(VueDialog.name ?? 'VueDialog', VueDialog);
    app.component(VueForm.name ?? 'VueForm', VueForm);
    app.component(VueLink.name ?? 'VueLink', VueLink);
    app.component(VueListBox.name ?? 'VueListBox', VueListBox);
    app.component(VueMenu.name ?? 'VueMenu', VueMenu);
    app.component(VueNumberField.name ?? 'VueNumberField', VueNumberField);
    app.component(VuePopover.name ?? 'VuePopover', VuePopover);
    app.component(VueRadioGroup.name ?? 'VueRadioGroup', VueRadioGroup);
    app.component(VueRadio.name ?? 'VueRadio', VueRadio);
    app.component(VueSearchField.name ?? 'VueSearchField', VueSearchField);
    app.component(VueSlider.name ?? 'VueSlider', VueSlider);
    app.component(VueSwitch.name ?? 'VueSwitch', VueSwitch);
    app.component(VueTextField.name ?? 'VueTextField', VueTextField);
  }
};

export {VueButton, VueCheckbox, VueComboBox, VueDialog, VueForm, VueLink, VueListBox, VueMenu, VueNumberField, VuePopover, VueRadio, VueRadioGroup, VueSearchField, VueSlider, VueSpectrumProvider, VueSwitch, VueTextField};
export type {SpectrumContextValue} from './context';
