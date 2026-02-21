import type {Preview} from '@storybook/vue3-vite';
import '@vue-spectrum/components/styles.css';

const preview: Preview = {
  parameters: {
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
