import {
  AsyncLoading,
  ControlledCards,
  DisabledKeys,
  DynamicCards,
  EmptyWithHeightGrid,
  FalsyIds,
  FilteringGrid,
  IsLoadingHeightGrid,
  LoadingMoreGrid,
  StaticCards
} from './GridCardView.stories';
import {CardView, WaterfallLayout} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type WaterfallCardItemNoSize = {
  src: string,
  title: string
};

let itemsNoSize: WaterfallCardItemNoSize[] = [
  {src: 'https://i.imgur.com/Z7AzH2c.jpg', title: 'Bob 1'},
  {src: 'https://i.imgur.com/DhygPot.jpg', title: 'Joe 1 really really really really really really really really really really really really long'},
  {src: 'https://i.imgur.com/L7RTlvI.png', title: 'Jane 1'},
  {src: 'https://i.imgur.com/1nScMIH.jpg', title: 'Bob 2'},
  {src: 'https://i.imgur.com/DhygPot.jpg', title: 'Joe 2'},
  {src: 'https://i.imgur.com/1nScMIH.jpg', title: 'Jane 2'},
  {src: 'https://i.imgur.com/Z7AzH2c.jpg', title: 'Bob 3'},
  {src: 'https://i.imgur.com/L7RTlvI.png', title: 'Joe 3'},
  {src: 'https://i.imgur.com/zzwWogn.jpg', title: 'Jane 3'},
  {src: 'https://i.imgur.com/1nScMIH.jpg', title: 'Bob 4'},
  {src: 'https://i.imgur.com/L7RTlvI.png', title: 'Joe 4'},
  {src: 'https://i.imgur.com/Z7AzH2c.jpg', title: 'Jane 4'},
  {src: 'https://i.imgur.com/L7RTlvI.png', title: 'Bob 5'},
  {src: 'https://i.imgur.com/1nScMIH.jpg', title: 'Joe 5'},
  {src: 'https://i.imgur.com/L7RTlvI.png', title: 'Jane 5'},
  {src: 'https://i.imgur.com/1nScMIH.jpg', title: 'Bob 6'},
  {src: 'https://i.imgur.com/zzwWogn.jpg', title: 'Joe 6'},
  {src: 'https://i.imgur.com/DhygPot.jpg', title: 'Jane 6'},
  {src: 'https://i.imgur.com/L7RTlvI.png', title: 'Bob 7'},
  {src: 'https://i.imgur.com/Z7AzH2c.jpg', title: 'Joe 7'},
  {src: 'https://i.imgur.com/1nScMIH.jpg', title: 'Jane 7'},
  {src: 'https://i.imgur.com/zzwWogn.jpg', title: 'Bob 8'}
];

const meta = {
  title: 'CardView/Waterfall layout',
  component: CardView,
  parameters: {
    chromatic: {
      delay: 300
    }
  },
  args: {
    'aria-label': 'Test CardView'
  },
  argTypes: {
    layout: {
      table: {
        disable: true
      }
    },
    selectionMode: {
      control: 'radio',
      defaultValue: 'multiple',
      options: ['none', 'single', 'multiple']
    }
  }
} satisfies Meta<typeof CardView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultWaterfallStatic: Story = {
  ...StaticCards,
  args: {
    ...StaticCards.args,
    layout: WaterfallLayout
  }
};

export const FalsyIdWaterfall: Story = {
  ...FalsyIds,
  args: {
    ...FalsyIds.args,
    layout: WaterfallLayout
  }
};

export const DefaultWaterfall: Story = {
  ...DynamicCards,
  args: {
    ...DynamicCards.args,
    layout: WaterfallLayout
  },
  name: 'size provided with items'
};

export const DefaultWaterfallNoSize: Story = {
  ...DynamicCards,
  args: {
    ...DynamicCards.args,
    items: itemsNoSize,
    layout: WaterfallLayout
  },
  name: 'no size provided with items'
};

export const QuietWaterfall: Story = {
  ...DynamicCards,
  args: {
    ...DynamicCards.args,
    isQuiet: true,
    layout: WaterfallLayout
  },
  name: 'quiet cards'
};

export const QuietWaterfallNoSize: Story = {
  ...DynamicCards,
  args: {
    ...DynamicCards.args,
    isQuiet: true,
    items: itemsNoSize,
    layout: WaterfallLayout
  },
  name: 'quiet cards, no size provided with items'
};

export const DisabledKeysWaterfall: Story = {
  ...DisabledKeys,
  args: {
    ...DisabledKeys.args,
    layout: WaterfallLayout
  }
};

export const SelectedKeys: Story = {
  ...ControlledCards,
  args: {
    ...ControlledCards.args,
    layout: WaterfallLayout
  }
};

export const IsLoadingHeightWaterfall: Story = {
  ...IsLoadingHeightGrid,
  args: {
    ...IsLoadingHeightGrid.args,
    layout: WaterfallLayout
  }
};

export const LoadingMoreWaterfall: Story = {
  ...LoadingMoreGrid,
  args: {
    ...LoadingMoreGrid.args,
    layout: WaterfallLayout
  }
};

export const FilteringWaterfall: Story = {
  ...FilteringGrid,
  args: {
    ...FilteringGrid.args,
    layout: WaterfallLayout
  }
};

export const EmptyWithHeightWaterfall: Story = {
  ...EmptyWithHeightGrid,
  args: {
    ...EmptyWithHeightGrid.args,
    layout: WaterfallLayout
  }
};

export const AsyncLoadingWaterfall: Story = {
  ...AsyncLoading,
  args: {
    ...AsyncLoading.args,
    layout: WaterfallLayout
  }
};

export const CustomLayoutOptions: Story = {
  ...DynamicCards,
  args: {
    ...DynamicCards.args,
    items: itemsNoSize,
    layout: WaterfallLayout,
    layoutOptions: {maxColumns: 2, margin: 10, minSpace: {height: 50, width: 50}},
    selectionMode: 'multiple'
  },
  name: 'Custom layout options'
};
