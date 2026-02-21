import './font-faces.css';
import './Toast.module.css';
import type {App, Plugin} from 'vue';

export {Button} from '@vue-spectrum/button';
export {Checkbox} from '@vue-spectrum/checkbox';
export {Dialog} from '@vue-spectrum/dialog';
export {Popover} from '@vue-spectrum/overlays';
export {Radio, RadioGroup} from '@vue-spectrum/radio';
export {Provider} from '@vue-spectrum/provider';
export {Switch} from '@vue-spectrum/switch';
export {TableView} from '@vue-spectrum/table';
export {TextField} from '@vue-spectrum/textfield';
export {TreeView} from '@vue-spectrum/tree';

export const Spectrum2Plugin: Plugin = {
  install(app: App) {
    void app;
    // Aggregation-only compatibility plugin.
  }
};

export * from './compat';
