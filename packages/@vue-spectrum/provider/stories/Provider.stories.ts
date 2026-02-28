import {Button} from '@vue-spectrum/button';
import {Checkbox, CheckboxGroup} from '@vue-spectrum/checkbox';
import {ComboBox} from '@vue-spectrum/combobox';
import {Flex} from '@vue-spectrum/layout';
import {Form} from '@vue-spectrum/form';
import {NumberField} from '@vue-spectrum/numberfield';
import {Radio, RadioGroup} from '@vue-spectrum/radio';
import {SearchField} from '@vue-spectrum/searchfield';
import {Switch} from '@vue-spectrum/switch';
import {TextField} from '@vue-spectrum/textfield';
import {theme as defaultTheme} from '@vue-spectrum/theme-default';
import {theme as expressTheme} from '@vue-spectrum/theme-express';
import {computed, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Provider} from '../src';

const CUSTOM_THEME = defaultTheme;

const meta: Meta<typeof Provider> = {
  title: 'Provider',
  parameters: {
    providerSwitcher: {status: 'positive'}
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderProvider(providerArgs: Record<string, unknown> = {}, wrapperStyle = 'padding: 50px;') {
  return {
    components: {
      Button,
      Checkbox,
      CheckboxGroup,
      ComboBox,
      Flex,
      Form,
      NumberField,
      Provider,
      Radio,
      RadioGroup,
      SearchField,
      Switch,
      TextField
    },
    setup() {
      let radio = ref('dogs');
      let checkboxValues = ref(['dragons']);
      let comboOptions = [
        'Red Panda',
        'Aardvark',
        'Kangaroo',
        'Snake'
      ];
      let search = ref('');
      let switchValue = ref(true);
      let args = computed(() => providerArgs);

      return {
        args,
        checkboxValues,
        comboOptions,
        radio,
        search,
        switchValue
      };
    },
    template: `
      <Provider v-bind="args" :style="'${wrapperStyle}'">
        <Form>
          <Flex>
            <Button variant="primary">I am a button</Button>
          </Flex>
          <CheckboxGroup
            label="Pets"
            :model-value="checkboxValues"
            @update:model-value="checkboxValues = $event">
            <Checkbox value="dogs">Dogs</Checkbox>
            <Checkbox value="cats">Cats</Checkbox>
            <Checkbox value="dragons">Dragons</Checkbox>
          </CheckboxGroup>
          <ComboBox label="More Animals" :options="comboOptions" />
          <NumberField label="Years lived there" />
          <RadioGroup label="A radio group" :model-value="radio" @update:model-value="radio = $event">
            <Radio value="dogs">Dogs</Radio>
            <Radio value="cats">Cats</Radio>
            <Radio value="horses">Horses</Radio>
          </RadioGroup>
          <SearchField label="Search" :model-value="search" @update:model-value="search = $event" />
          <Switch :model-value="switchValue" @update:model-value="switchValue = $event">Dogs!</Switch>
          <TextField
            label="A text field"
            style="margin-top: 8px;"
            model-value="dummy value" />
        </Form>
      </Provider>
    `
  };
}

export const ColorSchemeDark: Story = {
  render: () => renderProvider({colorScheme: 'dark'}, 'padding: 50px; text-align: center; width: 500px;')
};

export const ScaleLarge: Story = {
  render: () => renderProvider({scale: 'large'})
};

export const NestedColorSchemes: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {Button, Provider},
    template: `
      <Provider color-scheme="dark" style="padding: 50px; text-align: center; width: 500px;">
        <Button variant="primary">I am a dark button</Button>
        <Provider color-scheme="light" style="padding: 50px; margin: 50px; text-align: center;">
          <Button variant="primary">I am a light button</Button>
        </Provider>
      </Provider>
    `
  })
};

export const NestedProps: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {Button, Provider},
    template: `
      <Provider :is-disabled="true">
        <Button variant="primary">I am disabled</Button>
        <Provider :is-quiet="true">
          <Button variant="primary">I am disabled and quiet</Button>
        </Provider>
      </Provider>
    `
  })
};

export const IsQuiet: Story = {
  render: () => renderProvider({isQuiet: true})
};

export const IsEmphasized: Story = {
  render: () => renderProvider({isEmphasized: true})
};

export const IsDisabled: Story = {
  render: () => renderProvider({isDisabled: true})
};

export const IsReadOnly: Story = {
  render: () => renderProvider({isReadOnly: true})
};

export const IsRequired: Story = {
  render: () => renderProvider({isRequired: true})
};

export const CustomTheme: Story = {
  render: () => renderProvider({theme: CUSTOM_THEME})
};

export const ExpressTheme: Story = {
  render: () => renderProvider({theme: expressTheme})
};

export const ResponsiveStyleProps: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {Button, Provider, TextField},
    template: `
      <Provider style="padding: 50px;">
        <div>
          <TextField label="A text field" style="width: min(100%, 300px);" />
        </div>
        <Button variant="primary" style="margin-top: 16px;">Responsive style preview</Button>
      </Provider>
    `
  })
};

export const CustomResponsiveStyleProps: Story = {
  render: () => ({
    components: {Button, Provider},
    setup() {
      let widthLabel = ref('size-1600');
      return {
        widthLabel
      };
    },
    template: `
      <Provider style="padding: 50px;">
        <Button variant="primary" style="width: min(100%, 340px);">Button with custom breakpoints.</Button>
        <div>width: {{widthLabel}}</div>
      </Provider>
    `
  })
};

export const BreakpointOmitted: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {Button, Provider},
    template: `
      <Provider style="padding: 50px;">
        <p>button's width will be S: 'size-2400' at M viewport.</p>
        <Button variant="primary" style="width: min(100%, 340px);">Button with omitted breakpoint.</Button>
      </Provider>
    `
  })
};

export const LocaleZhHant: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {Provider},
    template: `
      <div>
        <div>Heaven and earth are mysterious and yellow, the universe is prehistoric</div>
        <Provider locale="zh-Hant">
          <div>天地玄黃，宇宙洪荒</div>
        </Provider>
      </div>
    `
  })
};
