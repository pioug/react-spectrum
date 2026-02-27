import './font-faces.css';
import './Toast.module.css';
import type {App, Plugin} from 'vue';

export {Accordion} from '@vue-spectrum/accordion';
export {ActionBar} from '@vue-spectrum/actionbar';
export {ActionGroup} from '@vue-spectrum/actiongroup';
export {Autocomplete} from '@vue-spectrum/autocomplete';
export {Avatar} from '@vue-spectrum/avatar';
export {Badge} from '@vue-spectrum/badge';
export {Breadcrumbs} from '@vue-spectrum/breadcrumbs';
export {Button} from '@vue-spectrum/button';
export {ActionButton, ToggleButton} from '@vue-spectrum/button';
export {ButtonGroup} from '@vue-spectrum/buttongroup';
export {Calendar, RangeCalendar} from '@vue-spectrum/calendar';
export {Card, CardView} from '@vue-spectrum/card';
export {Checkbox} from '@vue-spectrum/checkbox';
export {CheckboxGroup} from '@vue-spectrum/checkbox';
export {ComboBox} from '@vue-spectrum/combobox';
export {ContextualHelp} from '@vue-spectrum/contextualhelp';
export {Dialog} from '@vue-spectrum/dialog';
export {AlertDialog, DialogContainer, DialogTrigger, useDialogContainer} from '@vue-spectrum/dialog';
export {DateField, DatePicker, DateRangePicker, TimeField} from '@vue-spectrum/datepicker';
export {Divider} from '@vue-spectrum/divider';
export {DropZone} from '@vue-spectrum/dropzone';
export {FileTrigger} from '@vue-spectrum/filetrigger';
export {Form} from '@vue-spectrum/form';
export {Image} from '@vue-spectrum/image';
export {InlineAlert} from '@vue-spectrum/inlinealert';
export {Link} from '@vue-spectrum/link';
export {Menu, MenuTrigger, ActionMenu, SubmenuTrigger, ContextualHelpTrigger} from '@vue-spectrum/menu';
export {Item as MenuItem, Section as MenuSection} from '@vue-spectrum/menu';
export {Meter} from '@vue-spectrum/meter';
export {NumberField} from '@vue-spectrum/numberfield';
export {Popover} from '@vue-spectrum/overlays';
export {Picker} from '@vue-spectrum/picker';
export {Item as PickerItem, Section as PickerSection} from '@vue-spectrum/picker';
export {ProgressBar, ProgressCircle} from '@vue-spectrum/progress';
export {Radio, RadioGroup} from '@vue-spectrum/radio';
export {Provider} from '@vue-spectrum/provider';
export {SearchField} from '@vue-spectrum/searchfield';
export {Slider, RangeSlider} from '@vue-spectrum/slider';
export {StatusLight} from '@vue-spectrum/statuslight';
export {Switch} from '@vue-spectrum/switch';
export {Tabs, TabList} from '@vue-spectrum/tabs';
export {TagGroup} from '@vue-spectrum/tag';
export {TableView} from '@vue-spectrum/table';
export {Text, Heading, Keyboard} from '@vue-spectrum/text';
export {TextField, TextArea} from '@vue-spectrum/textfield';
export {ToastContainer, ToastQueue} from '@vue-spectrum/toast';
export {Tooltip, TooltipTrigger} from '@vue-spectrum/tooltip';
export {TreeView} from '@vue-spectrum/tree';
export {TreeViewItem, TreeViewItemContent} from '@vue-spectrum/tree';

export const Spectrum2Plugin: Plugin = {
  install(app: App) {
    void app;
    // Aggregation-only compatibility plugin.
  }
};

export * from './compat';
