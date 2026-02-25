import {Grid, repeat} from '../src';
import {View} from '@vue-spectrum/view';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Grid> = {
  title: 'Grid',
  component: Grid
};

export default meta;

type Story = StoryObj<typeof meta>;

const baseColors = [
  'celery',
  'chartreuse',
  'yellow',
  'magenta',
  'fuchsia',
  'purple',
  'indigo',
  'seafoam',
  'red',
  'orange',
  'green',
  'blue'
];

const colors: string[] = [];
for (let color of baseColors) {
  for (let i = 4; i <= 7; i++) {
    colors.push(`${color}-${i}00`);
  }
}

export const ExplicitGrid: Story = {
  name: 'Explicit grid',
  render: () => ({
    components: {Grid, View},
    template: `
      <Grid
        :areas="['header header', 'sidebar content', 'footer footer']"
        :columns="['size-3000', 'auto']"
        :rows="['size-1000', 'auto', 'size-1000']"
        height="size-6000"
        width="80%"
        gap="size-100">
        <View background-color="celery-600" grid-area="header" padding="size-100">
          Header
        </View>
        <View background-color="blue-600" grid-area="sidebar" padding="size-100">
          Sidebar
        </View>
        <View background-color="purple-600" grid-area="content" padding="size-100">
          Content
        </View>
        <View background-color="magenta-600" grid-area="footer" padding="size-100">
          Footer
        </View>
      </Grid>
    `
  })
};

export const ImplicitGrid: Story = {
  name: 'Implicit grid',
  render: () => ({
    components: {Grid, View},
    setup() {
      return {
        colors,
        repeat
      };
    },
    template: `
      <Grid
        :columns="repeat('auto-fit', 'size-800')"
        auto-rows="size-800"
        justify-content="center"
        width="80%"
        gap="size-100">
        <View
          v-for="color in colors"
          :key="color"
          :background-color="color" />
      </Grid>
    `
  })
};

export const Responsive: Story = {
  name: 'responsive',
  render: () => ({
    components: {Grid, View},
    setup() {
      return {
        colors,
        repeat
      };
    },
    template: `
      <Grid
        :columns="{
          base: repeat('auto-fit', 'size-800'),
          M: repeat('auto-fit', 'size-1200'),
          L: repeat('auto-fit', 'size-2000')
        }"
        :auto-rows="{base: 'size-800', M: 'size-1200', L: 'size-2000'}"
        justify-content="center"
        width="80%"
        :gap="{base: 'size-100', M: 'size-250', L: 'size-350'}">
        <View
          v-for="color in colors"
          :key="color"
          :background-color="color" />
      </Grid>
    `
  })
};
