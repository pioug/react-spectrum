import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'React Aria Components/TagGroup',
  args: {
    selectionMode: 'none',
    selectionBehavior: 'toggle'
  },
  argTypes: {
    selectionMode: {
      control: 'inline-radio',
      options: ['none', 'single', 'multiple']
    },
    selectionBehavior: {
      control: 'inline-radio',
      options: ['toggle', 'replace']
    }
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TagGroupExample: Story = {
  render: () => ({
    template: `
      <div class="react-aria-TagGroup">
        <span class="react-aria-Label">Categories</span>
        <div
          class="react-aria-TagList"
          data-rac=""
          role="grid"
          tabindex="0"
          style="display: flex; gap: 4px;">
          <div class="react-aria-Tag" data-rac="" tabindex="0" role="row" aria-label="News" style="border: 1px solid gray; border-radius: 4px; padding: 0 4px; cursor: pointer;">
            <div role="gridcell" aria-colindex="1" style="display: contents;">News</div>
          </div>
          <div class="react-aria-Tag" data-rac="" tabindex="0" role="row" aria-label="Travel" style="border: 1px solid gray; border-radius: 4px; padding: 0 4px; cursor: default;">
            <div role="gridcell" aria-colindex="1" style="display: contents;">Travel</div>
          </div>
          <div class="react-aria-Tag" data-rac="" tabindex="0" role="row" aria-label="Gaming" style="border: 1px solid gray; border-radius: 4px; padding: 0 4px; cursor: default;">
            <div role="gridcell" aria-colindex="1" style="display: contents;">Gaming</div>
          </div>
          <div class="react-aria-Tag" data-rac="" tabindex="0" role="row" aria-label="Shopping" style="border: 1px solid gray; border-radius: 4px; padding: 0 4px; cursor: default;">
            <div role="gridcell" aria-colindex="1" style="display: contents;">Shopping</div>
          </div>
        </div>
      </div>
    `
  })
};

export const TagGroupExampleWithRemove: Story = {
  render: () => ({
    template: `
      <div class="react-aria-TagGroup">
        <span class="react-aria-Label">Categories</span>
        <div
          class="react-aria-TagList"
          data-rac=""
          role="grid"
          tabindex="0"
          style="display: flex; gap: 4px;">
          <div
            class="react-aria-Tag"
            data-rac=""
            tabindex="0"
            role="row"
            data-allows-removing="true"
            style="border: 1px solid gray; border-radius: 4px; padding: 0 4px; cursor: default;">
            <div role="gridcell" aria-colindex="1" style="display: contents;">Marsupial<button class="react-aria-Button" data-rac="" type="button" tabindex="0" slot="remove">X</button></div>
          </div>
          <div
            class="react-aria-Tag"
            data-rac=""
            tabindex="0"
            role="row"
            data-allows-removing="true"
            style="border: 1px solid gray; border-radius: 4px; padding: 0 4px; cursor: default;">
            <div role="gridcell" aria-colindex="1" style="display: contents;">Animal<button class="react-aria-Button" data-rac="" type="button" tabindex="0" slot="remove">X</button></div>
          </div>
          <div
            class="react-aria-Tag"
            data-rac=""
            tabindex="0"
            role="row"
            data-allows-removing="true"
            style="border: 1px solid gray; border-radius: 4px; padding: 0 4px; cursor: default;">
            <div role="gridcell" aria-colindex="1" style="display: contents;">Mammal<button class="react-aria-Button" data-rac="" type="button" tabindex="0" slot="remove">X</button></div>
          </div>
          <div
            class="react-aria-Tag"
            data-rac=""
            tabindex="0"
            role="row"
            data-allows-removing="true"
            style="border: 1px solid gray; border-radius: 4px; padding: 0 4px; cursor: default;">
            <div role="gridcell" aria-colindex="1" style="display: contents;">Chordate<button class="react-aria-Button" data-rac="" type="button" tabindex="0" slot="remove">X</button></div>
          </div>
        </div>
      </div>
    `
  })
};

export const EmptyTagGroup: Story = {
  render: () => ({
    template: `
      <div class="react-aria-TagGroup">
        <div class="react-aria-TagList" data-rac="" aria-label="Categories" role="group" tabindex="0" aria-atomic="false" aria-relevant="additions" aria-live="off" data-empty="true">
          No categories.
        </div>
      </div>
    `
  })
};
