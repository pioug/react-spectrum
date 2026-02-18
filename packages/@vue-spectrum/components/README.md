# @vue-spectrum/components

Vue-native Spectrum-inspired primitives for incremental migration from React packages in this repository.

## Included components

* `VueSpectrumProvider`
* `VueButton`
* `VueTextField`
* `VueCheckbox`
* `VueRadioGroup`
* `VueRadio`
* `VueDialog`
* `VuePopover`

## Quick start

```ts
import {createApp} from 'vue';
import {VueSpectrumPlugin} from '@vue-spectrum/components';
import '@vue-spectrum/components/styles.css';
import App from './App.vue';

createApp(App).use(VueSpectrumPlugin).mount('#app');
```
