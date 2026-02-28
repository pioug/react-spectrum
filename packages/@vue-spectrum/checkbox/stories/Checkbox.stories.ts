import {action} from 'storybook/actions';
import {Checkbox} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'Checkbox',
  component: Checkbox,
  args: {
    onChange: action('onChange')
  },
  argTypes: {
    onChange: {
      table: {
        disable: true
      }
    },
    defaultSelected: {
      control: 'boolean'
    },
    isSelected: {
      control: 'boolean'
    },
    isIndeterminate: {
      control: 'boolean'
    },
    isEmphasized: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    isReadOnly: {
      control: 'boolean'
    },
    autoFocus: {
      control: 'boolean'
    },
    isInvalid: {
      control: 'boolean'
    }
  }
} satisfies Meta;

export default meta;
type CheckboxStory = StoryObj<typeof meta>;

function renderCheckbox(args: Record<string, unknown>, slot = 'Checkbox Label') {
  return {
    components: {Checkbox},
    setup() {
      return {args, slot};
    },
    template: `
      <Checkbox v-bind="args" @change="args.onChange">
        <template v-if="slot">{{ slot }}</template>
      </Checkbox>
    `
  };
}

export const Default: CheckboxStory = {
  render: (args) => renderCheckbox(args)
};

export const CustomLabel: CheckboxStory = {
  render: (args) => ({
    components: {Checkbox},
    setup() {
      return {args};
    },
    template: `
      <Checkbox v-bind="args" @change="args.onChange">
        <span><i>Italicized</i> Checkbox Label</span>
      </Checkbox>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: '<Checkbox><span><i>Italicized</i> Checkbox Label</span></Checkbox>'
      }
    }
  }
};

export const LongLabel: CheckboxStory = {
  render: (args) => renderCheckbox(
    args,
    'Super long checkbox label. Sample text. Arma virumque cano, Troiae qui primus ab oris. Italiam, fato profugus, Laviniaque venit.'
  )
};

export const NoLabel: CheckboxStory = {
  render: (args) => ({
    components: {Checkbox},
    setup() {
      return {args};
    },
    template: `
      <Checkbox
        v-bind="args"
        aria-label="checkbox with no visible label"
        @change="args.onChange" />
    `
  })
};

export const WHCM: CheckboxStory = {
  render: () => ({
    components: {Checkbox},
    setup() {
      let onChange = action('onChange');
      return {onChange};
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: var(--spectrum-global-dimension-size-200);">
        <div style="display: flex; gap: var(--spectrum-global-dimension-size-200);">
          <span>Shows the different states from</span>
          <a href="https://spectrum.adobe.com/static/Windows-High-Contrast-Kits/Checkbox-WindowsHighContrast.xd">spectrum</a>
        </div>
        <div style="display: flex; gap: var(--spectrum-global-dimension-size-200);">
          <Checkbox @change="onChange">Option</Checkbox>
          <Checkbox :is-disabled="true" @change="onChange">Option</Checkbox>
        </div>
        <div style="display: flex; gap: var(--spectrum-global-dimension-size-200);">
          <Checkbox :is-selected="true" :is-emphasized="true" @change="onChange">Option</Checkbox>
          <Checkbox :is-selected="true" :is-emphasized="true" :is-disabled="true" @change="onChange">Option</Checkbox>
        </div>
        <div style="display: flex; gap: var(--spectrum-global-dimension-size-200);">
          <Checkbox :is-indeterminate="true" :is-emphasized="true" @change="onChange">Option</Checkbox>
          <Checkbox :is-indeterminate="true" :is-emphasized="true" :is-disabled="true" @change="onChange">Option</Checkbox>
        </div>
        <div style="display: flex; gap: var(--spectrum-global-dimension-size-200);">
          <Checkbox :is-selected="true" @change="onChange">Option</Checkbox>
          <Checkbox :is-selected="true" :is-disabled="true" @change="onChange">Option</Checkbox>
        </div>
        <div style="display: flex; gap: var(--spectrum-global-dimension-size-200);">
          <Checkbox :is-indeterminate="true" @change="onChange">Option</Checkbox>
          <Checkbox :is-indeterminate="true" :is-disabled="true" @change="onChange">Option</Checkbox>
        </div>
        <div style="display: flex; gap: var(--spectrum-global-dimension-size-200);">
          <Checkbox :is-invalid="true" @change="onChange">Option</Checkbox>
          <Checkbox :is-invalid="true" :is-disabled="true" @change="onChange">Option</Checkbox>
        </div>
        <div style="display: flex; gap: var(--spectrum-global-dimension-size-200);">
          <Checkbox :is-invalid="true" :is-selected="true" @change="onChange">Option</Checkbox>
          <Checkbox :is-invalid="true" :is-selected="true" :is-disabled="true" @change="onChange">Option</Checkbox>
        </div>
      </div>
    `
  })
};
