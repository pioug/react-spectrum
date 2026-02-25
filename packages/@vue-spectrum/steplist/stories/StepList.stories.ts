import {action} from '@storybook/addon-actions';
import {computed, ref, watch} from 'vue';
import {Picker} from '@vue-spectrum/picker';
import {StepList, type StepListItemData, type StepListValue} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type StepListStoryArgs = {
  ariaLabel?: string,
  defaultLastCompletedStep?: StepListValue,
  defaultSelectedKey?: StepListValue,
  disabledKeys?: Array<string | number>,
  isDisabled?: boolean,
  isEmphasized?: boolean,
  isReadOnly?: boolean,
  items?: StepListItemData[],
  lastCompletedStep?: StepListValue,
  modelValue?: StepListValue,
  onLastCompletedStepChange?: (value: StepListValue) => void,
  onSelectionChange?: (value: StepListValue) => void,
  orientation?: 'horizontal' | 'vertical',
  selectedKey?: StepListValue,
  size?: 'S' | 'M' | 'L' | 'XL',
  width?: number
};

const options: StepListItemData[] = [{
  key: 'details',
  label: 'Details'
}, {
  key: 'select-offers',
  label: 'Select offers'
}, {
  key: 'fallback-offer',
  label: 'Fallback offer'
}, {
  key: 'summary',
  label: 'Summary'
}];

const oddOptions: StepListItemData[] = options.map((item) => ({
  ...item,
  label: `${item.label} ${item.label} ${item.label}`
}));

const meta: Meta<typeof StepList> = {
  title: 'StepList',
  component: StepList,
  excludeStories: [
    'options',
    'oddOptions',
    'renderDefault',
    'renderWithButtons',
    'renderControlled'
  ],
  args: {
    ariaLabel: 'Step list',
    items: options,
    onSelectionChange: action('onSelectionChange'),
    onLastCompletedStepChange: action('onLastCompletedStepChange')
  },
  argTypes: {
    defaultLastCompletedStep: {
      table: {
        disable: true
      }
    },
    defaultSelectedKey: {
      table: {
        disable: true
      }
    },
    items: {
      table: {
        disable: true
      }
    },
    lastCompletedStep: {
      table: {
        disable: true
      }
    },
    modelValue: {
      table: {
        disable: true
      }
    },
    onLastCompletedStepChange: {
      table: {
        disable: true
      }
    },
    onSelectionChange: {
      table: {
        disable: true
      }
    },
    selectedKey: {
      table: {
        disable: true
      }
    },
    width: {
      table: {
        disable: true
      }
    },
    isEmphasized: {
      control: 'boolean'
    },
    isReadOnly: {
      control: 'boolean'
    },
    orientation: {
      control: {
        type: 'inline-radio'
      },
      options: ['horizontal', 'vertical']
    },
    size: {
      control: {
        type: 'inline-radio'
      },
      options: ['S', 'M', 'L', 'XL']
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderDefault(baseArgs: Partial<StepListStoryArgs> = {}) {
  return (args: StepListStoryArgs) => ({
    components: {StepList},
    setup() {
      let mergedArgs = computed(() => ({
        ...args,
        ...baseArgs,
        items: baseArgs.items ?? args.items ?? options
      }));
      let containerStyle = computed(() => {
        let width = mergedArgs.value.width;
        return typeof width === 'number' ? {width: `${width}px`} : undefined;
      });
      let stepListArgs = computed(() => {
        let nextArgs = {...mergedArgs.value};
        delete nextArgs.width;
        return nextArgs;
      });

      return {containerStyle, stepListArgs};
    },
    template: `
      <div :style="containerStyle">
        <StepList v-bind="stepListArgs" />
      </div>
    `
  });
}

function renderWithButtons(baseArgs: Partial<StepListStoryArgs> = {}) {
  return (args: StepListStoryArgs) => ({
    components: {StepList},
    setup() {
      let keys = options.map((item) => String(item.key));
      let mergedArgs = computed(() => ({
        ...args,
        ...baseArgs,
        items: options
      }));
      let selectedKey = ref<string>(keys[0] ?? '');

      watch(mergedArgs, (nextArgs) => {
        let maybeSelectedKey = nextArgs.selectedKey ?? nextArgs.defaultSelectedKey;
        if (typeof maybeSelectedKey === 'string' || typeof maybeSelectedKey === 'number') {
          selectedKey.value = String(maybeSelectedKey);
          return;
        }

        if (!keys.includes(selectedKey.value) && keys[0]) {
          selectedKey.value = keys[0];
        }
      }, {immediate: true, deep: true});

      let stepNumber = computed(() => {
        let index = keys.indexOf(selectedKey.value);
        return index < 0 ? 1 : index + 1;
      });

      let stepListArgs = computed(() => {
        let nextArgs = {...mergedArgs.value, selectedKey: selectedKey.value};
        delete nextArgs.width;
        delete nextArgs.onSelectionChange;
        return nextArgs;
      });

      let goToStep = (nextStep: number) => {
        if (!keys.length) {
          return;
        }

        let clampedStep = Math.max(1, Math.min(keys.length, nextStep));
        selectedKey.value = keys[clampedStep - 1];
      };

      let handleSelectionChange = (value: StepListValue) => {
        if (typeof value === 'string' || typeof value === 'number') {
          selectedKey.value = String(value);
        }

        mergedArgs.value.onSelectionChange?.(value);
      };

      return {
        goToStep,
        handleSelectionChange,
        keys,
        stepListArgs,
        stepNumber
      };
    },
    template: `
      <div>
        <StepList
          v-bind="stepListArgs"
          @selection-change="handleSelectionChange" />
        <div style="margin-top: var(--spectrum-global-dimension-size-300); display: flex; gap: var(--spectrum-global-dimension-size-100);">
          <button
            type="button"
            :disabled="stepNumber === 1"
            @click="goToStep(stepNumber - 1)">
            Back
          </button>
          <button
            type="button"
            :disabled="stepNumber === keys.length"
            @click="goToStep(stepNumber + 1)">
            Next
          </button>
        </div>
      </div>
    `
  });
}

function renderControlled(args: StepListStoryArgs) {
  return {
    components: {Picker, StepList},
    setup() {
      let pickerItems = options.map((item) => ({
        id: String(item.key),
        label: item.label
      }));
      let selectedKey = ref<StepListValue>('details');
      let lastCompletedStep = ref<StepListValue>(null);
      let mergedArgs = computed(() => ({
        ...args,
        items: options
      }));
      let stepListArgs = computed(() => {
        let nextArgs = {...mergedArgs.value};
        delete nextArgs.width;
        delete nextArgs.modelValue;
        delete nextArgs.selectedKey;
        delete nextArgs.lastCompletedStep;
        return nextArgs;
      });

      watch(mergedArgs, (nextArgs) => {
        if (typeof nextArgs.selectedKey === 'string' || typeof nextArgs.selectedKey === 'number') {
          selectedKey.value = nextArgs.selectedKey;
        }
      }, {immediate: true, deep: true});

      let handleSelectionChange = (value: StepListValue) => {
        selectedKey.value = value;
        mergedArgs.value.onSelectionChange?.(value);
      };

      let handleLastCompletedStepChange = (value: StepListValue) => {
        lastCompletedStep.value = value;
        mergedArgs.value.onLastCompletedStepChange?.(value);
      };

      let setSelectedKey = (value: string) => {
        selectedKey.value = value || null;
      };

      let setLastCompletedStep = (value: string) => {
        lastCompletedStep.value = value || null;
      };

      return {
        handleLastCompletedStepChange,
        handleSelectionChange,
        lastCompletedStep,
        pickerItems,
        selectedKey,
        setLastCompletedStep,
        setSelectedKey,
        stepListArgs
      };
    },
    template: `
      <div style="display: grid; gap: var(--spectrum-global-dimension-size-300); max-width: 640px;">
        <StepList
          v-bind="stepListArgs"
          :last-completed-step="lastCompletedStep"
          :selected-key="selectedKey"
          @last-completed-step-change="handleLastCompletedStepChange"
          @selection-change="handleSelectionChange" />
        <div style="display: flex; gap: var(--spectrum-global-dimension-size-300);">
          <Picker
            label="lastCompletedStep"
            :items="pickerItems"
            :model-value="typeof lastCompletedStep === 'string' ? lastCompletedStep : ''"
            @update:model-value="setLastCompletedStep" />
          <Picker
            label="selectedKey"
            :items="pickerItems"
            :model-value="typeof selectedKey === 'string' ? selectedKey : ''"
            @update:model-value="setSelectedKey" />
        </div>
      </div>
    `
  };
}

export const Default: Story = {
  render: renderDefault()
};

export const DefaultCompleted: Story = {
  render: renderDefault({
    defaultLastCompletedStep: 'summary'
  }),
  name: 'Default - Completed'
};

export const DisabledAllKeys: Story = {
  render: renderDefault({
    defaultLastCompletedStep: 'select-offers',
    defaultSelectedKey: 'select-offers',
    disabledKeys: options.map((item) => item.key)
  }),
  name: 'disabledAllKeys'
};

export const DisabledKey: Story = {
  render: renderDefault({
    defaultLastCompletedStep: 'select-offers',
    defaultSelectedKey: 'select-offers',
    disabledKeys: ['select-offers']
  }),
  name: 'disabledKeys'
};

export const Disabled: Story = {
  render: renderDefault({
    defaultLastCompletedStep: 'select-offers',
    defaultSelectedKey: 'select-offers',
    isDisabled: true
  }),
  name: 'disabled'
};

export const ReadOnly: Story = {
  render: renderDefault({
    defaultLastCompletedStep: 'select-offers',
    defaultSelectedKey: 'select-offers',
    isReadOnly: true
  }),
  name: 'readonly'
};

export const WithButtonsDefault: Story = {
  render: renderWithButtons(),
  name: 'Control Selected Key'
};

export const VerticalWithOddLengths: Story = {
  render: renderDefault({
    defaultLastCompletedStep: 'select-offers',
    defaultSelectedKey: 'select-offers',
    items: oddOptions,
    orientation: 'vertical',
    width: 75
  }),
  name: 'Vertical Odd names'
};

export const HorizontalWithOddLengths: Story = {
  render: renderDefault({
    defaultLastCompletedStep: 'select-offers',
    defaultSelectedKey: 'select-offers',
    items: oddOptions,
    width: 600
  }),
  name: 'Horizontal Odd names'
};

export const WithButtonsDefaultCompletedStep: Story = {
  render: renderWithButtons({
    defaultLastCompletedStep: 'select-offers',
    defaultSelectedKey: 'fallback-offer'
  }),
  name: 'Control Selected Key with Default Completed Step'
};

export const ControlledStory: Story = {
  render: renderControlled,
  args: {
    selectedKey: 'details'
  },
  name: 'Controlled'
};
