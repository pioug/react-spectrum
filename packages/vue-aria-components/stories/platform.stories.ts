import {
  isAndroid,
  isAppleDevice,
  isChrome,
  isIOS,
  isIPad,
  isIPhone,
  isMac,
  isWebKit
} from '@vue-aria/utils';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'platform'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    setup() {
      let rows = [
        {label: 'isAndroid', value: isAndroid()},
        {label: 'isAppleDevice', value: isAppleDevice()},
        {label: 'isChrome', value: isChrome()},
        {label: 'isIOS', value: isIOS()},
        {label: 'isIPad', value: isIPad()},
        {label: 'isIPhone', value: isIPhone()},
        {label: 'isMac', value: isMac()},
        {label: 'isWebKit', value: isWebKit()}
      ];

      return {
        rows
      };
    },
    template: `
      <table>
        <tr>
          <th>Platform</th>
          <th>Current</th>
        </tr>
        <tr v-for="row in rows" :key="row.label">
          <td>{{row.label}}:</td>
          <td>{{String(row.value)}}</td>
        </tr>
      </table>
    `
  }),
  name: 'all platforms'
};
