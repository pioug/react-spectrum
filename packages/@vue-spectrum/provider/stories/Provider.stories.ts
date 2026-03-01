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
import {useBreakpoint} from '@vue-spectrum/utils';
import {theme as defaultTheme} from '@vue-spectrum/theme-default';
import {theme as expressTheme} from '@vue-spectrum/theme-express';
import {computed, defineComponent} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Provider} from '../src';
import './custom-theme.css';

const CUSTOM_THEME = {
  light: {
    className: 'theme'
  },
  medium: defaultTheme.medium,
  large: defaultTheme.large
};

const meta: Meta<typeof Provider> = {
  title: 'Provider',
  parameters: {
    providerSwitcher: {status: 'positive'}
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderProvider(providerArgs: Record<string, unknown> = {}) {
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
      let comboOptions = [
        'Red Panda',
        'Aardvark',
        'Kangaroo',
        'Snake'
      ];
      let args = computed(() => providerArgs);

      return {
        args,
        comboOptions
      };
    },
    template: `
      <Provider v-bind="args" style="padding: 50px;">
        <Form>
          <Flex>
            <Button variant="primary">I am a button</Button>
          </Flex>
          <CheckboxGroup label="Pets" :default-value="['dragons']">
            <Checkbox value="dogs">Dogs</Checkbox>
            <Checkbox value="cats">Cats</Checkbox>
            <Checkbox value="dragons">Dragons</Checkbox>
          </CheckboxGroup>
          <ComboBox label="More Animals" :options="comboOptions" />
          <NumberField label="Years lived there" />
          <RadioGroup label="A radio group">
            <Radio value="dogs">Dogs</Radio>
            <Radio value="cats">Cats</Radio>
            <Radio value="horses">Horses</Radio>
          </RadioGroup>
          <SearchField label="Search" />
          <Switch :is-selected="true">Dogs!</Switch>
          <TextField
            label="A text field"
            necessity-indicator="label"
            style="margin-top: 8px;"
            model-value="dummy value" />
        </Form>
      </Provider>
    `
  };
}

export const ColorSchemeDark: Story = {
  render: () => renderProvider({colorScheme: 'dark'})
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
          <TextField
            label="A text field"
            :width="{base: 'size-800', S: 'size-1000', M: 'size-2000', L: 'size-3000'}" />
        </div>
        <Button
          variant="primary"
          v-bind="{isHidden: {base: false, S: false, M: false, L: true}, marginTop: {base: 'size-100', M: 'size-1000'}}">
          This button is hidden in large display.
        </Button>
      </Provider>
    `
  })
};

const CustomBreakpointPreview = defineComponent({
  name: 'CustomBreakpointPreview',
  components: {Button},
  setup() {
    let width = {
      base: 'size-1600',
      XS: 'size-2000',
      S: 'size-2400',
      M: 'size-3000',
      L: 'size-3400',
      XL: 'size-4600',
      XXL: 'size-6000'
    } as Record<string, string>;

    let breakpoint = computed(() => useBreakpoint()?.matchedBreakpoints[0] ?? 'base');
    let widthLabel = computed(() => width[breakpoint.value] ?? width.base);
    return {
      breakpoint,
      width,
      widthLabel
    };
  },
  template: `
    <Button variant="primary" v-bind="{width}">
      Button with {{breakpoint}} breakpoint.
    </Button>
    <div>width: {{widthLabel}}</div>
  `
});

export const CustomResponsiveStyleProps: Story = {
  render: () => ({
    components: {CustomBreakpointPreview, Provider},
    template: `
      <Provider :breakpoints="{S: 480, M: 640, L: 1024}" style="padding: 50px;">
        <CustomBreakpointPreview />
      </Provider>
    `
  })
};

const BreakpointOmittedPreview = defineComponent({
  name: 'BreakpointOmittedPreview',
  components: {Button},
  setup() {
    let width = {base: 'size-1600', S: 'size-2400', L: 'size-3400'};
    let breakpoint = computed(() => useBreakpoint()?.matchedBreakpoints[0] ?? 'base');
    return {
      breakpoint,
      width
    };
  },
  template: `
    <p>button's width will be S: 'size-2400' at M viewport.</p>
    <Button variant="primary" v-bind="{width}">
      Button with {{breakpoint}} breakpoint.
    </Button>
  `
});

export const BreakpointOmitted: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {BreakpointOmittedPreview, Provider},
    template: `
      <Provider style="padding: 50px;">
        <BreakpointOmittedPreview />
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
