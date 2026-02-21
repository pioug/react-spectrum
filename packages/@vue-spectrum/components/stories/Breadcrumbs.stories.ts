import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueBreadcrumbs} from '@vue-spectrum/components';

const meta = {
  title: 'React Aria Components/Breadcrumbs',
  component: VueBreadcrumbs
} satisfies Meta<typeof VueBreadcrumbs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BreadcrumbsExample: Story = {
  render: () => ({
    components: {
      VueBreadcrumbs
    },
    template: `
      <VueBreadcrumbs :items="['Home', 'React Aria', 'Breadcrumbs']" current="Breadcrumbs" />
    `
  })
};

export const DynamicBreadcrumbsExample: Story = {
  render: () => ({
    components: {
      VueBreadcrumbs
    },
    template: `
      <VueBreadcrumbs :items="['Home', 'React Aria', 'Breadcrumbs']" current="Breadcrumbs" />
    `
  })
};
