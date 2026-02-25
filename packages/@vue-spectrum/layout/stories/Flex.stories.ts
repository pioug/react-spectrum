import {Flex} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type FlexStoryArgs = {
  alignItems?: 'baseline' | 'center' | 'end' | 'start' | 'stretch',
  direction?: 'column' | 'row',
  elementType?: string,
  gap?: string,
  justifyContent?: 'center' | 'end' | 'space-around' | 'space-between' | 'space-evenly' | 'start',
  reverse?: boolean,
  wrap?: boolean
};

const colors = [
  'celery-600',
  'blue-600',
  'magenta-600',
  'indigo-600',
  'seafoam-600',
  'red-600',
  'orange-600',
  'green-600'
];

const meta: Meta<typeof Flex> = {
  title: 'Flex',
  component: Flex,
  args: {
    direction: 'row',
    gap: 'size-100',
    alignItems: 'center',
    justifyContent: 'start',
    wrap: false,
    reverse: false
  },
  argTypes: {
    alignItems: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline']
    },
    direction: {
      control: 'select',
      options: ['row', 'column']
    },
    elementType: {
      control: 'text'
    },
    gap: {
      control: 'text'
    },
    justifyContent: {
      control: 'select',
      options: ['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly']
    },
    reverse: {
      control: 'boolean'
    },
    wrap: {
      control: 'boolean'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderBlocks(args: FlexStoryArgs, style = '', blocks = [
  {color: 'celery-600', width: '80px', height: '80px'},
  {color: 'blue-600', width: '80px', height: '80px'},
  {color: 'magenta-600', width: '80px', height: '80px'}
]) {
  return {
    components: {Flex},
    setup() {
      return {
        args,
        blocks
      };
    },
    template: `
      <div style="${style}">
        <Flex v-bind="args">
          <div
            v-for="(block, index) in blocks"
            :key="index"
            :style="{
              backgroundColor: 'var(--spectrum-global-color-' + block.color + ')',
              width: block.width,
              height: block.height,
              order: block.order
            }" />
        </Flex>
      </div>
    `
  };
}

export const VerticalStackWithGap: Story = {
  render: () => renderBlocks({direction: 'column', gap: 'size-100'}, 'width: 200px;'),
  name: 'Vertical stack with gap'
};

export const HorizontalStackWithGap: Story = {
  render: () => renderBlocks({direction: 'row', gap: 'size-100'}, 'height: 80px;'),
  name: 'Horizontal stack with gap'
};

export const WrappingWithGap: Story = {
  render: () => renderBlocks(
    {direction: 'row', gap: 'size-100', wrap: true},
    'max-width: 80%; border: 1px solid var(--spectrum-global-color-gray-700); padding: 8px;',
    colors.map((color) => ({color, width: '80px', height: '80px'}))
  ),
  name: 'Wrapping with gap'
};

export const NestedFlexWithGap: Story = {
  render: () => ({
    components: {Flex},
    template: `
      <Flex direction="column" gap="size-150">
        <div style="background: var(--spectrum-global-color-celery-600); height: 80px;" />
        <Flex direction="row" gap="size-100" style="height: 80px;">
          <div style="background: var(--spectrum-global-color-indigo-600); width: 80px;" />
          <div style="background: var(--spectrum-global-color-seafoam-600); width: 80px;" />
          <div style="background: var(--spectrum-global-color-blue-600); width: 80px;" />
        </Flex>
        <div style="background: var(--spectrum-global-color-magenta-600); height: 80px;" />
      </Flex>
    `
  }),
  name: 'Nested flex with gap'
};

export const AlignCenter: Story = {
  render: () => renderBlocks(
    {direction: 'row', gap: 'size-100', alignItems: 'center'},
    '',
    [
      {color: 'celery-600', width: '80px', height: '80px'},
      {color: 'blue-600', width: '80px', height: '200px'},
      {color: 'magenta-600', width: '80px', height: '80px'}
    ]
  ),
  name: 'Align center'
};

export const AlignEnd: Story = {
  render: () => renderBlocks(
    {direction: 'row', gap: 'size-100', alignItems: 'end'},
    '',
    [
      {color: 'celery-600', width: '80px', height: '80px'},
      {color: 'blue-600', width: '80px', height: '200px'},
      {color: 'magenta-600', width: '80px', height: '80px'}
    ]
  ),
  name: 'Align end'
};

export const JustifyStart: Story = {
  render: () => renderBlocks({direction: 'row', gap: 'size-100', justifyContent: 'start'}, 'width: 80%;'),
  name: 'Justify start'
};

export const JustifyCenter: Story = {
  render: () => renderBlocks({direction: 'row', gap: 'size-100', justifyContent: 'center'}, 'width: 80%;'),
  name: 'Justify center'
};

export const JustifyEnd: Story = {
  render: () => renderBlocks({direction: 'row', gap: 'size-100', justifyContent: 'end'}, 'width: 80%;'),
  name: 'Justify end'
};

export const JustifySpaceAround: Story = {
  render: () => renderBlocks({direction: 'row', gap: 'size-100', justifyContent: 'space-around'}, 'width: 80%;'),
  name: 'Justify space-around'
};

export const JustifySpaceBetween: Story = {
  render: () => renderBlocks({direction: 'row', gap: 'size-100', justifyContent: 'space-between'}, 'width: 80%;'),
  name: 'Justify space-between'
};

export const JustifySpaceEvenly: Story = {
  render: () => renderBlocks({direction: 'row', gap: 'size-100', justifyContent: 'space-evenly'}, 'width: 80%;'),
  name: 'Justify space-evenly'
};

export const Ordered: Story = {
  render: () => renderBlocks(
    {direction: 'row', gap: 'size-100', justifyContent: 'space-evenly'},
    'width: 80%;',
    [
      {color: 'celery-600', width: '80px', height: '80px', order: 2},
      {color: 'blue-600', width: '80px', height: '80px'},
      {color: 'magenta-600', width: '80px', height: '80px', order: 1}
    ]
  ),
  name: 'ordered'
};

export const Responsive: Story = {
  render: () => ({
    components: {Flex},
    template: `
      <Flex direction="row" gap="size-100" style="flex-wrap: wrap;">
        <div style="background: var(--spectrum-global-color-celery-600); width: 80px; height: 80px;" />
        <div style="background: var(--spectrum-global-color-blue-600); width: 80px; height: 80px;" />
        <div style="background: var(--spectrum-global-color-magenta-600); width: 80px; height: 80px;" />
      </Flex>
    `
  }),
  name: 'responsive'
};
