import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueBreadcrumbs} from 'vue-aria-components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/Breadcrumbs',
  component: VueBreadcrumbs
} satisfies Meta<typeof VueBreadcrumbs>;

export default meta;

type Story = StoryObj<typeof meta>;

const STATIC_BREADCRUMBS = [
  {id: 'Home', url: '/'},
  {id: 'React Aria', url: '/react-aria'},
  {id: 'Breadcrumbs', url: '/react-aria'}
];

const DYNAMIC_BREADCRUMBS = [
  {id: 'Home', url: '/'},
  {id: 'React Aria', url: '/react-aria'},
  {id: 'Breadcrumbs', url: '/react-aria/breadcrumbs'}
];

export const BreadcrumbsExample: Story = {
  render: () => ({
    components: {
      VueBreadcrumbs
    },
    setup() {
      let items = ref(STATIC_BREADCRUMBS.map((item) => ({...item})));
      return {
        items
      };
    },
    template: `
      <VueBreadcrumbs :items="items" />
    `
  })
};

export const DynamicBreadcrumbsExample: Story = {
  render: () => ({
    components: {
      VueBreadcrumbs
    },
    setup() {
      let items = ref(DYNAMIC_BREADCRUMBS.map((item) => ({...item})));
      return {
        items
      };
    },
    template: `
      <VueBreadcrumbs :items="items" />
    `
  })
};
