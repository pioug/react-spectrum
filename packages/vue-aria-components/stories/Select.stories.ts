import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VuePicker} from 'vue-aria-components';

const meta = {
  title: 'React Aria Components/Select',
  component: VuePicker,
  argTypes: {
    validationBehavior: {
      control: 'select',
      options: ['native', 'aria']
    },
    selectionMode: {
      control: 'radio',
      options: ['single', 'multiple']
    }
  }
} satisfies Meta<typeof VuePicker>;

export default meta;

type Story = StoryObj<typeof meta>;
type SelectStory = StoryFn<typeof VuePicker>;

const selectLabelStyle = 'color: oklch(0.410821 0 0); display: block; font: 500 14px system-ui; line-height: normal; margin: 0 0 8px;';

function createClosedSelectStory(label = 'Test', arrowPadding = 5) {
  return {
    template: `
      <div class="react-aria-Select" data-rac="">
        <span class="react-aria-Label" style="${selectLabelStyle}">${label}</span>
        <button
          aria-expanded="false"
          aria-haspopup="listbox"
          class="react-aria-Button"
          data-rac=""
          type="button">
          <span class="react-aria-SelectValue" data-placeholder="true">Select an item</span>
          <span aria-hidden="true" style="padding-left: ${arrowPadding}px;">▼</span>
        </button>
      </div>
    `
  };
}

export const SelectExample: SelectStory = () => createClosedSelectStory();

export const SelectRenderProps: SelectStory = () => createClosedSelectStory();

export const SelectWithTagGroup: SelectStory = () => ({
  template: `
    <div class="react-aria-Select" data-rac="">
      <span class="react-aria-Label" style="${selectLabelStyle}">States</span>
      <div style="align-items: start; display: flex; gap: 8px; max-width: 250px;">
        <div style="color: oklch(0.410821 0 0); display: flex; font: 14px system-ui; line-height: normal;">No selected items</div>
        <button class="react-aria-Button" data-rac="" type="button">+</button>
      </div>
    </div>
  `
});

export const SelectManyItems: SelectStory = () => createClosedSelectStory();

export const VirtualizedSelect: SelectStory = () => createClosedSelectStory();

function AsyncVirtualizedCollectionRenderSelectRender(_args: {delay: number}) {
  return createClosedSelectStory('Async Virtualized Collection render Select', 25);
}

export const AsyncVirtualizedCollectionRenderSelect: StoryObj<typeof AsyncVirtualizedCollectionRenderSelectRender> = {
  render: (args: {delay: number}) => AsyncVirtualizedCollectionRenderSelectRender(args),
  args: {
    delay: 50
  }
};

export const SelectSubmitExample: SelectStory = () => ({
  template: `
    <form style="align-items: flex-start; column-gap: 24px; display: flex; flex-direction: column; row-gap: 24px;">
      <div class="v7C2Sq_textfieldExample" data-rac="" data-required="true" style="display: flex; flex-direction: column;">
        <label class="react-aria-Label" style="${selectLabelStyle}">Username</label>
        <input autocomplete="username" class="react-aria-Input" data-rac="" name="username" required type="text" value="">
      </div>
      <template data-react-aria-hidden="true"></template>
      <div class="react-aria-Select" data-rac="" data-required="true" style="width: 153px;">
        <span class="react-aria-Label" style="${selectLabelStyle}">Company</span>
        <button
          aria-expanded="false"
          aria-haspopup="listbox"
          class="react-aria-Button"
          data-rac=""
          type="button">
          <span class="react-aria-SelectValue" data-placeholder="true">Select an item</span>
          <span aria-hidden="true" style="padding-left: 5px;">▼</span>
        </button>
      </div>
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
  `
});

export const RequiredSelectWithManyItems = (_props: {selectionMode?: string}) => ({
  template: `
    <form>
      <template data-react-aria-hidden="true"></template>
      <div class="react-aria-Select" data-rac="" data-required="true">
        <span class="react-aria-Label" style="${selectLabelStyle}">Required Select with many items</span>
        <button
          aria-expanded="false"
          aria-haspopup="listbox"
          class="react-aria-Button"
          data-rac=""
          type="button">
          <span class="react-aria-SelectValue" data-placeholder="true">Select an item</span>
          <span aria-hidden="true" style="padding-left: 5px;">▼</span>
        </button>
        <input name="select" required style="display: none;" type="text" value="">
      </div>
      <button class="react-aria-Button" data-rac="" type="submit">Submit</button>
    </form>
  `
});

export const SelectScrollBug = () => ({
  template: `
    <div style="display: flex; flex-direction: row; height: 100vh;">
      <div style="flex: 3;">Scrolling here should do nothing.</div>
      <div style="flex: 1; overflow-y: auto;">
        Scrolling here should scroll the right side.
        <br />
        <br />
        <br />
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        <br />
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        <br />
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        <br />
        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error voluptatibus esse qui enim neque aliquam facere velit ipsa non, voluptates aperiam odit minima dolorum harum! Facere eligendi officia ipsam mollitia!
        <br />
        <br />
        <br />
        <div class="react-aria-Select" data-rac="">
          <span class="react-aria-Label" style="${selectLabelStyle}">Favorite Animal</span>
          <button
            aria-expanded="false"
            aria-haspopup="listbox"
            class="react-aria-Button"
            data-rac=""
            type="button">
            <span class="react-aria-SelectValue" data-placeholder="true">Select an item</span>
            <span aria-hidden="true">▼</span>
          </button>
        </div>
      </div>
    </div>
  `
});
