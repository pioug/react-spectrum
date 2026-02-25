import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {ActionButton} from '@vue-spectrum/button';
import {Divider} from '../src';
import Properties from '@spectrum-icons-vue/workflow/Properties';
import Select from '@spectrum-icons-vue/workflow/Select';

const meta: Meta<typeof Divider> = {
  title: 'Divider',
  component: Divider
};

export default meta;

type Story = StoryObj<typeof meta>;

export const LargeDefault: Story = {
  name: 'Large (Default)',
  render: () => ({
    components: {Divider},
    template: `
      <section>
        <h1>Large</h1>
        <Divider />
        <p>Page or Section Titles.</p>
      </section>
    `
  })
};

export const Medium: Story = {
  render: () => ({
    components: {Divider},
    template: `
      <section>
        <h1>Medium</h1>
        <Divider size="M" />
        <p>Divide subsections, or divide different groups of elements (between panels, rails, etc.)</p>
      </section>
    `
  })
};

export const Small: Story = {
  render: () => ({
    components: {Divider},
    template: `
      <section>
        <h1>Small</h1>
        <Divider size="S" />
        <p>Divide like-elements (tables, tool groups, elements within a panel, etc.)</p>
      </section>
    `
  })
};

export const VerticalLargeDefault: Story = {
  name: 'Vertical, Large (Default)',
  render: () => renderVertical()
};

export const VerticalMedium: Story = {
  name: 'Vertical, Medium',
  render: () => renderVertical({size: 'M'})
};

export const VerticalSmall: Story = {
  name: 'Vertical, Small',
  render: () => renderVertical({size: 'S'})
};

function renderVertical(args: Record<string, unknown> = {}) {
  return {
    components: {
      ActionButton,
      Divider,
      Properties,
      Select
    },
    setup() {
      return {args};
    },
    template: `
      <section style="display: flex;">
        <ActionButton aria-label="Properties" is-quiet>
          <Properties />
        </ActionButton>
        <Divider orientation="vertical" v-bind="args" />
        <ActionButton aria-label="Select" is-quiet>
          <Select />
        </ActionButton>
      </section>
    `
  };
}
