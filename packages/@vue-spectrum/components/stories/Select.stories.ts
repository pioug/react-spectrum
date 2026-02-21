import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueButton, VueForm, VuePicker} from '@vue-spectrum/components';
import {ref} from 'vue';

type PickerItem = {id: string, label: string};

const usStateOptions: PickerItem[] = [
  {id: 'AL', label: 'Alabama'},
  {id: 'AK', label: 'Alaska'},
  {id: 'AZ', label: 'Arizona'},
  {id: 'CA', label: 'California'},
  {id: 'CO', label: 'Colorado'},
  {id: 'FL', label: 'Florida'},
  {id: 'GA', label: 'Georgia'},
  {id: 'NY', label: 'New York'},
  {id: 'TX', label: 'Texas'},
  {id: 'WA', label: 'Washington'}
];

const manyItems: PickerItem[] = Array.from({length: 100}, (_, index) => ({
  id: `${index + 1}`,
  label: `Item ${index + 1}`
}));

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

function createSelectStory(items: PickerItem[], label = 'Test') {
  return {
    components: {
      VuePicker
    },
    setup() {
      let value = ref('');
      return {
        items,
        label,
        value
      };
    },
    template: `
      <VuePicker
        v-model="value"
        :items="items"
        :label="label" />
    `
  };
}

export const SelectExample: SelectStory = () => createSelectStory(
  [
    {id: 'Foo', label: 'Foo'},
    {id: 'Bar', label: 'Bar'},
    {id: 'Baz', label: 'Baz'},
    {id: 'Google', label: 'Google'}
  ]
);

export const SelectRenderProps: SelectStory = () => createSelectStory(
  [
    {id: 'Foo', label: 'Foo'},
    {id: 'Bar', label: 'Bar'},
    {id: 'Baz', label: 'Baz'},
    {id: 'Google', label: 'Google'}
  ]
);

export const SelectWithTagGroup: SelectStory = () => createSelectStory(usStateOptions, 'States');

export const SelectManyItems: SelectStory = () => createSelectStory(usStateOptions);

export const VirtualizedSelect: SelectStory = () => createSelectStory(manyItems);

function AsyncVirtualizedCollectionRenderSelectRender(args: {delay: number}) {
  return {
    components: {
      VuePicker
    },
    setup() {
      let value = ref('');
      let items = ref<PickerItem[]>([]);
      setTimeout(() => {
        items.value = Array.from({length: 50}, (_, index) => ({
          id: `async-${index + 1}`,
          label: `Async Item ${index + 1}`
        }));
      }, args.delay ?? 50);

      return {
        items,
        value
      };
    },
    template: `
      <VuePicker
        v-model="value"
        :items="items"
        label="Async Virtualized Collection render Select" />
    `
  };
}

export const AsyncVirtualizedCollectionRenderSelect: StoryObj<typeof AsyncVirtualizedCollectionRenderSelectRender> = {
  render: (args: {delay: number}) => AsyncVirtualizedCollectionRenderSelectRender(args),
  args: {
    delay: 50
  }
};

export const SelectSubmitExample: SelectStory = () => ({
  components: {
    VueButton,
    VueForm,
    VuePicker
  },
  setup() {
    let company = ref('');
    let username = ref('');
    return {
      company,
      username
    };
  },
  template: `
    <VueForm>
      <label for="username">Username</label>
      <input id="username" v-model="username" name="username">
      <VuePicker
        v-model="company"
        :items="[
          {id: 'adobe', label: 'Adobe'},
          {id: 'google', label: 'Google'},
          {id: 'microsoft', label: 'Microsoft'}
        ]"
        label="Company" />
      <input type="hidden" name="company" :value="company">
      <VueButton type="submit">Submit</VueButton>
      <VueButton type="reset">Reset</VueButton>
    </VueForm>
  `
});

export const RequiredSelectWithManyItems = (props: {selectionMode?: string}) => ({
  components: {
    VueButton,
    VuePicker
  },
  setup() {
    let value = ref('');
    return {
      props,
      value
    };
  },
  template: `
    <form>
      <VuePicker
        v-model="value"
        :items="Array.from({length: 301}, (_, index) => ({id: String(index + 1), label: 'Item ' + (index + 1)}))"
        label="Required Select with many items" />
      <input type="hidden" name="select" :value="value">
      <VueButton type="submit">Submit</VueButton>
    </form>
  `
});

export const SelectScrollBug = () => ({
  components: {
    VuePicker
  },
  setup() {
    let value = ref('');
    return {
      value
    };
  },
  template: `
    <div style="display: flex; flex-direction: row; height: 100vh;">
      <div style="flex: 3;">
        Scrolling here should do nothing.
      </div>
      <div style="flex: 1; overflow-y: auto;">
        <p>Scrolling here should scroll the right side.</p>
        <p v-for="line in 30" :key="line">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        <VuePicker
          v-model="value"
          :items="[
            {id: 'cat', label: 'Cat'},
            {id: 'dog', label: 'Dog'},
            {id: 'kangaroo', label: 'Kangaroo'}
          ]"
          label="Favorite Animal" />
      </div>
    </div>
  `
});
