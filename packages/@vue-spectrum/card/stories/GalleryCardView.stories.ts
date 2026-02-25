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
import {CardView, GalleryLayout} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type GalleryCardItem = {
  height: number,
  id: number,
  src: string,
  title: string,
  width: number
};

let itemsLowVariance: GalleryCardItem[] = [
  {width: 1001, height: 381, src: 'https://i.imgur.com/Z7AzH2c.jpg', id: 1, title: 'Bob 1'},
  {width: 640, height: 640, src: 'https://i.imgur.com/DhygPot.jpg', id: 2, title: 'Joe 1 really really really really long'},
  {width: 314, height: 1009, src: 'https://i.imgur.com/3lzeoK7.jpg', id: 3, title: 'Jane 1'},
  {width: 1516, height: 1009, src: 'https://i.imgur.com/1nScMIH.jpg', id: 4, title: 'Bob 2'},
  {width: 640, height: 640, src: 'https://i.imgur.com/DhygPot.jpg', id: 5, title: 'Joe 2'},
  {width: 1516, height: 1009, src: 'https://i.imgur.com/1nScMIH.jpg', id: 6, title: 'Jane 2'},
  {width: 1001, height: 381, src: 'https://i.imgur.com/Z7AzH2c.jpg', id: 7, title: 'Bob 3'},
  {width: 314, height: 1009, src: 'https://i.imgur.com/3lzeoK7.jpg', id: 8, title: 'Joe 3'},
  {width: 314, height: 1009, src: 'https://i.imgur.com/3lzeoK7.jpg', id: 9, title: 'Jane 3'},
  {width: 1516, height: 1009, src: 'https://i.imgur.com/1nScMIH.jpg', id: 10, title: 'Bob 4'},
  {width: 314, height: 1009, src: 'https://i.imgur.com/3lzeoK7.jpg', id: 11, title: 'Joe 4'},
  {width: 1001, height: 381, src: 'https://i.imgur.com/Z7AzH2c.jpg', id: 12, title: 'Jane 4'},
  {width: 314, height: 1009, src: 'https://i.imgur.com/3lzeoK7.jpg', id: 13, title: 'Bob 5'},
  {width: 1516, height: 1009, src: 'https://i.imgur.com/1nScMIH.jpg', id: 14, title: 'Joe 5'},
  {width: 314, height: 1009, src: 'https://i.imgur.com/3lzeoK7.jpg', id: 15, title: 'Jane 5'},
  {width: 1516, height: 1009, src: 'https://i.imgur.com/1nScMIH.jpg', id: 16, title: 'Bob 6'},
  {width: 314, height: 1009, src: 'https://i.imgur.com/3lzeoK7.jpg', id: 17, title: 'Joe 6'},
  {width: 640, height: 640, src: 'https://i.imgur.com/DhygPot.jpg', id: 18, title: 'Jane 6'},
  {width: 314, height: 1009, src: 'https://i.imgur.com/3lzeoK7.jpg', id: 19, title: 'Bob 7'},
  {width: 1001, height: 381, src: 'https://i.imgur.com/Z7AzH2c.jpg', id: 20, title: 'Joe 7'},
  {width: 1516, height: 1009, src: 'https://i.imgur.com/1nScMIH.jpg', id: 21, title: 'Jane 7'},
  {width: 314, height: 1009, src: 'https://i.imgur.com/3lzeoK7.jpg', id: 22, title: 'Bob 8'}
];

let itemsNoThinImages: GalleryCardItem[] = [
  {width: 1001, height: 381, src: 'https://i.imgur.com/Z7AzH2c.jpg', id: 1, title: 'Bob 1'},
  {width: 640, height: 640, src: 'https://i.imgur.com/DhygPot.jpg', id: 2, title: 'Joe 1 really really really really long'},
  {width: 1516, height: 1009, src: 'https://i.imgur.com/1nScMIH.jpg', id: 4, title: 'Jane 1'},
  {width: 640, height: 640, src: 'https://i.imgur.com/DhygPot.jpg', id: 5, title: 'Bob 2'},
  {width: 1516, height: 1009, src: 'https://i.imgur.com/1nScMIH.jpg', id: 6, title: 'Joe 2'},
  {width: 1001, height: 381, src: 'https://i.imgur.com/Z7AzH2c.jpg', id: 7, title: 'Jane 2'},
  {width: 1516, height: 1009, src: 'https://i.imgur.com/1nScMIH.jpg', id: 10, title: 'Bob 3'},
  {width: 1001, height: 381, src: 'https://i.imgur.com/Z7AzH2c.jpg', id: 12, title: 'Joe 3'},
  {width: 1516, height: 1009, src: 'https://i.imgur.com/1nScMIH.jpg', id: 14, title: 'Jane 3'},
  {width: 1516, height: 1009, src: 'https://i.imgur.com/1nScMIH.jpg', id: 16, title: 'Bob 4'},
  {width: 640, height: 640, src: 'https://i.imgur.com/DhygPot.jpg', id: 18, title: 'Joe 4'},
  {width: 1001, height: 381, src: 'https://i.imgur.com/Z7AzH2c.jpg', id: 20, title: 'Jane 4'},
  {width: 1516, height: 1009, src: 'https://i.imgur.com/1nScMIH.jpg', id: 21, title: 'Bob 5'}
];

const meta = {
  title: 'CardView/Gallery layout',
  component: CardView,
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

export const DefaultGalleryStatic: Story = {
  ...StaticCards,
  args: {
    ...StaticCards.args,
    layout: GalleryLayout
  }
};

export const FalsyIdGallery: Story = {
  ...FalsyIds,
  args: {
    ...FalsyIds.args,
    layout: GalleryLayout
  }
};

export const DefaultGalleryNoThinImages: Story = {
  ...DynamicCards,
  args: {
    ...DynamicCards.args,
    layout: GalleryLayout,
    items: itemsNoThinImages
  },
  name: 'dynamic cards, no thin images'
};

export const DefaultGalleryLowVariance: Story = {
  ...DynamicCards,
  args: {
    ...DynamicCards.args,
    layout: GalleryLayout,
    items: itemsLowVariance
  },
  name: 'dynamic cards, low variance in aspect ratios'
};

export const DefaultGallery: Story = {
  ...DynamicCards,
  args: {
    ...DynamicCards.args,
    layout: GalleryLayout
  },
  name: 'dynamic cards, high variance in aspect ratios'
};

export const DisabledKeysGallery: Story = {
  ...DisabledKeys,
  args: {
    ...DisabledKeys.args,
    layout: GalleryLayout,
    items: itemsLowVariance
  }
};

export const SelectedKeys: Story = {
  ...ControlledCards,
  args: {
    ...ControlledCards.args,
    layout: GalleryLayout,
    items: itemsLowVariance
  }
};

export const IsLoadingHeightGallery: Story = {
  ...IsLoadingHeightGrid,
  args: {
    ...IsLoadingHeightGrid.args,
    layout: GalleryLayout
  }
};

export const LoadingMoreGallery: Story = {
  ...LoadingMoreGrid,
  args: {
    ...LoadingMoreGrid.args,
    layout: GalleryLayout
  }
};

export const FilteringGallery: Story = {
  ...FilteringGrid,
  args: {
    ...FilteringGrid.args,
    layout: GalleryLayout
  }
};

export const EmptyWithHeightGallery: Story = {
  ...EmptyWithHeightGrid,
  args: {
    ...EmptyWithHeightGrid.args,
    layout: GalleryLayout
  }
};

export const AsyncLoadingGallery: Story = {
  ...AsyncLoading,
  args: {
    ...AsyncLoading.args,
    layout: GalleryLayout
  }
};

export const CustomLayoutOptions: Story = {
  ...DynamicCards,
  args: {
    ...DynamicCards.args,
    layout: GalleryLayout,
    layoutOptions: {
      idealRowHeight: 400,
      itemPadding: 78,
      itemSpacing: {height: 10, width: 10},
      minItemSize: {height: 400, width: 150}
    },
    items: itemsLowVariance,
    selectionMode: 'multiple'
  },
  name: 'Custom layout options'
};
