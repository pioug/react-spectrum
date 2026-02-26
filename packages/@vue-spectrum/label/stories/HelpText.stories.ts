/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {Radio, RadioGroup} from '@vue-spectrum/radio';
import {TextField} from '@vue-spectrum/textfield';
import {computed, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type HelpTextStoryArgs = {
  customDescription?: string,
  description?: string,
  errorMessage?: string,
  isDisabled?: boolean,
  label?: string | null,
  labelAlign?: 'end' | 'start',
  labelPosition?: 'side' | 'top',
  validationState?: 'invalid' | 'valid',
  width?: string,
  'aria-describedby'?: string,
  'aria-label'?: string
};

const meta: Meta<typeof TextField> = {
  title: 'HelpText',
  component: TextField,
  args: {
    label: 'Password',
    description: 'Password must be at least 8 characters.'
  },
  argTypes: {
    label: {
      control: 'text'
    },
    description: {
      control: 'text'
    },
    errorMessage: {
      control: 'text'
    },
    validationState: {
      control: 'radio',
      options: ['invalid', 'valid']
    },
    isDisabled: {
      control: 'boolean'
    },
    labelAlign: {
      control: 'radio',
      options: ['end', 'start']
    },
    labelPosition: {
      control: 'radio',
      options: ['side', 'top']
    },
    width: {
      control: 'radio',
      options: ['100px', '440px', 'var(--spectrum-global-dimension-top, var(--spectrum-alias-top))']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithState: Story = {
  args: {
    label: 'Empty field',
    description: 'This input is only valid when it\'s empty.',
    errorMessage: 'Remove input.'
  },
  argTypes: {
    validationState: {
      control: {
        disable: true
      }
    }
  },
  render: (args) => ({
    components: {Radio, RadioGroup, TextField},
    setup() {
      let value = ref('');
      let valid = ref('');
      let validationState = computed<'invalid' | 'valid' | undefined>(() => {
        if (value.value.length) {
          return 'invalid';
        }
        if (valid.value === 'valid') {
          return 'valid';
        }
        return undefined;
      });

      return {
        args,
        valid,
        validationState,
        value
      };
    },
    template: `
      <div style="display: grid; gap: var(--spectrum-global-dimension-size-200, var(--spectrum-alias-size-200));">
        <TextField v-bind="args" :model-value="value" :validation-state="validationState" @update:model-value="value = $event" />
        <RadioGroup label="Valid State" :model-value="valid" @update:model-value="valid = $event">
          <Radio value="valid">Valid</Radio>
          <Radio value="">undefined</Radio>
        </RadioGroup>
      </div>
    `
  })
};

export const AriaLabel: Story = {
  args: {
    label: null,
    'aria-label': 'Password'
  },
  argTypes: {
    label: {
      control: {
        disable: true
      }
    },
    'aria-label': {
      control: 'text'
    }
  }
};

export const DescriptionAndCustomDescription: Story = {
  args: {
    customDescription: 'Custom description.',
    'aria-describedby': 'custom-description'
  },
  argTypes: {
    customDescription: {
      control: 'text'
    },
    'aria-describedby': {
      control: {
        disable: true
      }
    }
  },
  render: (args) => ({
    components: {TextField},
    setup() {
      let textFieldArgs = computed(() => {
        let {customDescription, ...rest} = args as HelpTextStoryArgs;
        return rest;
      });

      return {
        args,
        textFieldArgs
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: var(--spectrum-global-dimension-size-125, var(--spectrum-alias-size-125));">
        <TextField v-bind="textFieldArgs" />
        <p :id="args['aria-describedby']">{{args.customDescription}}</p>
      </div>
    `
  })
};

export const AriaLabelWithDynamicHelpText: Story = {
  args: {
    label: null,
    'aria-label': 'Password',
    description: undefined
  },
  render: (args) => ({
    components: {TextField},
    setup() {
      let value = ref('');

      return {
        args,
        value
      };
    },
    template: `
      <TextField
        v-bind="args"
        :model-value="value"
        :validation-state="value.length ? 'invalid' : undefined"
        error-message="Invalid length."
        @update:model-value="value = $event" />
    `
  }),
  parameters: {
    description: {
      data: 'For the case when there is no label and help text is added or removed dynamically. Focus should remain in the text field as the user types and the help text gets added or removed.'
    }
  }
};
