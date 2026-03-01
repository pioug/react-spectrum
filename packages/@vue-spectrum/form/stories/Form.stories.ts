import {action} from 'storybook/actions';
import {Button} from '@vue-spectrum/button';
import {ButtonGroup} from '@vue-spectrum/buttongroup';
import {Checkbox, CheckboxGroup} from '@vue-spectrum/checkbox';
import {ColorField} from '@vue-spectrum/color';
import {ComboBox} from '@vue-spectrum/combobox';
import {Content, Header} from '@vue-spectrum/view';
import {ContextualHelp} from '@vue-spectrum/contextualhelp';
import {DateField, DatePicker, DateRangePicker, TimeField} from '@vue-spectrum/datepicker';
import {Flex} from '@vue-spectrum/layout';
import {Form} from '../src';
import {Heading} from '@vue-spectrum/text';
import {InlineAlert} from '@vue-spectrum/inlinealert';
import {Picker} from '@vue-spectrum/picker';
import {NumberField} from '@vue-spectrum/numberfield';
import {Radio, RadioGroup} from '@vue-spectrum/radio';
import {SearchAutocomplete} from '@vue-spectrum/autocomplete';
import {SearchField} from '@vue-spectrum/searchfield';
import {Slider} from '@vue-spectrum/slider';
import {StatusLight} from '@vue-spectrum/statuslight';
import {Switch} from '@vue-spectrum/switch';
import {TagGroup} from '@vue-spectrum/tag';
import {TextArea, TextField} from '@vue-spectrum/textfield';
import {Well} from '@vue-spectrum/well';
import {computed, h, ref, watch} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type FormStoryArgs = {
  formData?: FormData,
  isDisabled?: boolean,
  isEmphasized?: boolean,
  isQuiet?: boolean,
  isReadOnly?: boolean,
  isRequired?: boolean,
  labelAlign?: 'end' | 'start',
  labelPosition?: 'side' | 'top',
  necessityIndicator?: 'icon' | 'label',
  onReset?: (event: Event) => void,
  onSubmit?: (event: Event) => void,
  showSubmit?: boolean,
  validationBehavior?: 'aria' | 'native',
  validationErrors?: Record<string, string | string[]>,
  validationState?: 'invalid' | 'valid',
  width?: number
};

type StatusVariant = 'info' | 'negative' | 'notice' | 'positive';

const states = [
  {id: 'CA', label: 'California'},
  {id: 'NY', label: 'New York'},
  {id: 'TX', label: 'Texas'},
  {id: 'WA', label: 'Washington'}
];

const countries = [
  {id: 'US', label: 'United States'},
  {id: 'CA', label: 'Canada'},
  {id: 'DE', label: 'Germany'},
  {id: 'JP', label: 'Japan'}
];

const animalOptions = ['Red Panda', 'Aardvark', 'Kangaroo', 'Snake'];

const colorItems = [
  {id: 'red', label: 'Red'},
  {id: 'orange', label: 'Orange'},
  {id: 'yellow', label: 'Yellow'},
  {id: 'green', label: 'Green'},
  {id: 'blue', label: 'Blue'},
  {id: 'purple', label: 'Purple'}
];

const tagItems = [
  {key: '1', label: 'Cool Tag 1'},
  {key: '2', label: 'Cool Tag 2'},
  {key: '3', label: 'Cool Tag 3'},
  {key: '4', label: 'Cool Tag 4'},
  {key: '5', label: 'Cool Tag 5'},
  {key: '6', label: 'Cool Tag 6'}
];

const RUMINANT_TRANSLATIONS = {
  ruminants: 'Ruminants (localized)',
  areRuminants: 'Choose from the list of farm animals.',
  whatIsARuminant: 'What is a ruminant?',
  ruminantDefinition: 'Animals like cows, sheep and goats that chew cud.',
  cow: 'Cow',
  goat: 'Goat',
  chicken: 'Chicken',
  sheep: 'Sheep',
  color: 'Color',
  colorError: 'Invalid color value.',
  farmAnimalCount: 'Farm animal count',
  farmCountError: 'Please enter a number.',
  notRuminantError: 'Please select a ruminant.',
  ageRange: 'Age range',
  cheeseSearch: 'Search cheese',
  findCheese: 'Search by cheese name.',
  farmScore: 'Farm score',
  amHappy: 'I am happy',
  clients: 'Clients',
  clientsError: 'Please enter client names.',
  clientHeading: 'Client details',
  clientContent: 'Client information is confidential.',
  farmName: 'Farm name',
  brownFenceFarm: 'Brown Fence Farm',
  farmDescription: 'Use the legal farm name.',
  farmTitle: 'Legal naming',
  farmLegal: 'Use the exact legal business name.'
};

const meta: Meta<typeof Form> = {
  title: 'Form',
  providerSwitcher: {status: 'positive'},
  component: Form
};

export default meta;

type Story = StoryObj<typeof meta>;

function readString(formData: FormData | undefined, key: string): string {
  if (!formData) {
    return '';
  }

  let value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function readStringArray(formData: FormData | undefined, key: string): string[] {
  if (!formData) {
    return [];
  }

  return formData.getAll(key)
    .map((value) => typeof value === 'string' ? value : '')
    .filter((value) => value.length > 0);
}

function readNumber(formData: FormData | undefined, key: string): number | undefined {
  let value = readString(formData, key);
  if (!value) {
    return undefined;
  }

  let parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function createSegmentContextualHelp() {
  return h(ContextualHelp, {}, {
    default: () => [
      h(Heading, {level: 4}, () => 'What is a segment?'),
      h(Content, {}, () => 'Segments identify who your visitors are, what devices and services they use, where they navigated from, and much more.')
    ]
  });
}

function createStyle(width: number | undefined, rtl: boolean) {
  return {
    dir: rtl ? 'rtl' : 'ltr',
    wrapper: width ? {width: `${width}px`} : undefined
  };
}

function renderMain(baseArgs: Partial<FormStoryArgs> = {}, rtl = false) {
  return (args: FormStoryArgs) => ({
    components: {
      Button,
      ButtonGroup,
      Checkbox,
      CheckboxGroup,
      ColorField,
      ComboBox,
      DateField,
      DatePicker,
      DateRangePicker,
      Form,
      NumberField,
      Picker,
      Radio,
      RadioGroup,
      SearchAutocomplete,
      SearchField,
      Switch,
      TagGroup,
      TextArea,
      TextField,
      TimeField
    },
    setup() {
      let mergedArgs = computed<FormStoryArgs>(() => ({...args, ...baseArgs}));
      let resolvedFormData = computed(() => mergedArgs.value.formData instanceof FormData ? mergedArgs.value.formData : undefined);

      let formProps = computed(() => {
        let {
          formData: _formData,
          onReset: _onReset,
          onSubmit: _onSubmit,
          showSubmit: _showSubmit,
          width: _width,
          ...props
        } = mergedArgs.value;
        return props;
      });

      let style = computed(() => createStyle(mergedArgs.value.width, rtl));
      let contextualHelp = createSegmentContextualHelp();
      let labelableFieldProps = computed(() => ({
        isDisabled: mergedArgs.value.isDisabled,
        isQuiet: mergedArgs.value.isQuiet,
        isReadOnly: mergedArgs.value.isReadOnly,
        isRequired: mergedArgs.value.isRequired,
        labelAlign: mergedArgs.value.labelAlign,
        labelPosition: mergedArgs.value.labelPosition,
        necessityIndicator: mergedArgs.value.necessityIndicator,
        validationState: mergedArgs.value.validationState
      }));
      let switchProps = computed(() => ({
        isDisabled: mergedArgs.value.isDisabled,
        isReadOnly: mergedArgs.value.isReadOnly
      }));

      let onSubmit = (event: Event) => {
        mergedArgs.value.onSubmit?.(event);
        if (!mergedArgs.value.onSubmit) {
          action('onSubmit')(event);
        }
      };

      let onReset = (event: Event) => {
        mergedArgs.value.onReset?.(event);
        if (!mergedArgs.value.onReset) {
          action('onReset')(event);
        }
      };

      let readValue = (key: string) => readString(resolvedFormData.value, key);
      let readValues = (key: string) => readStringArray(resolvedFormData.value, key);
      let readNumericValue = (key: string) => readNumber(resolvedFormData.value, key);
      let readDateRange = () => ({
        start: readValue('startDate'),
        end: readValue('endDate')
      });

      return {
        animalOptions,
        colorItems,
        contextualHelp,
        countries,
        formProps,
        labelableFieldProps,
        mergedArgs,
        onReset,
        onSubmit,
        readDateRange,
        readNumericValue,
        readValue,
        readValues,
        states,
        style,
        switchProps,
        tagItems
      };
    },
    template: `
      <div :dir="style.dir" :style="style.wrapper">
        <Form v-bind="formProps" @submit.prevent="onSubmit" @reset="onReset">
          <CheckboxGroup v-bind="labelableFieldProps" label="Pets" name="pets" :default-value="readValues('pets')">
            <Checkbox value="dogs">Dogs</Checkbox>
            <Checkbox value="cats">Cats</Checkbox>
            <Checkbox value="dragons">Dragons</Checkbox>
          </CheckboxGroup>
          <ComboBox
            v-bind="labelableFieldProps"
            label="More Animals"
            name="combobox"
            :options="animalOptions"
            :default-input-value="readValue('combobox')" />
          <SearchAutocomplete
            v-bind="labelableFieldProps"
            label="Search Animals"
            name="searchAutocomplete"
            :options="animalOptions"
            :default-input-value="readValue('searchAutocomplete')" />
          <NumberField
            v-bind="labelableFieldProps"
            label="Years lived there"
            name="years"
            :default-value="readNumericValue('years')" />
          <Picker
            v-bind="labelableFieldProps"
            label="State"
            name="state"
            :items="states"
            :model-value="readValue('state')" />
          <Picker
            v-bind="labelableFieldProps"
            label="Country"
            name="country"
            :items="countries"
            :model-value="readValue('country')" />
          <Picker
            v-bind="labelableFieldProps"
            label="Favorite color"
            name="favoriteColor"
            description="Select any color you like."
            error-message="Please select a nicer color."
            :items="colorItems"
            :model-value="readValue('color')" />
          <RadioGroup
            v-bind="labelableFieldProps"
            label="Favorite pet"
            name="favorite-pet-group"
            :default-value="readValue('favorite-pet-group')">
            <Radio value="dogs">Dogs</Radio>
            <Radio value="cats">Cats</Radio>
            <Radio value="dragons">Dragons</Radio>
          </RadioGroup>
          <SearchField
            v-bind="labelableFieldProps"
            label="Search"
            name="search"
            :default-value="readValue('search')" />
          <Switch v-bind="switchProps" name="switch" :default-selected="readValue('switch') === 'on'">Low power mode</Switch>
          <TextArea
            v-bind="labelableFieldProps"
            name="comments"
            label="Comments"
            description="Express yourself!"
            error-message="No wrong answers, except for this one."
            :default-value="readValue('comments')" />
          <TextField
            v-bind="labelableFieldProps"
            label="City"
            name="city"
            :default-value="readValue('city')"
            :contextual-help="contextualHelp" />
          <TextField
            v-bind="labelableFieldProps"
            label="Zip code"
            description="Please enter a five-digit zip code."
            pattern="[0-9]{5}"
            name="zip"
            :default-value="readValue('zip')" />
          <TagGroup label="Favorite tags" :items="tagItems" />
          <ColorField v-bind="labelableFieldProps" label="Color" name="color" :model-value="readValue('color')" />
          <DateField
            v-bind="labelableFieldProps"
            label="Date"
            granularity="minute"
            name="date"
            :model-value="readValue('date')" />
          <TimeField
            v-bind="labelableFieldProps"
            label="Time"
            name="time"
            :model-value="readValue('time')" />
          <DatePicker
            v-bind="labelableFieldProps"
            label="Date picker"
            name="datePicker"
            :model-value="readValue('datePicker')" />
          <DateRangePicker
            v-bind="labelableFieldProps"
            label="Date range"
            :model-value="readDateRange()" />
          <TextField
            v-bind="labelableFieldProps"
            type="email"
            label="Email"
            name="email"
            :default-value="readValue('email')" />
          <ButtonGroup v-if="mergedArgs.showSubmit">
            <Button variant="primary" type="submit">Submit</Button>
            <Button variant="secondary" type="reset">Reset</Button>
          </ButtonGroup>
        </Form>
      </div>
    `
  });
}

export const Default: Story = {
  render: renderMain()
};

export const LabelPositionSide: Story = {
  render: renderMain({labelPosition: 'side'}),
  args: {
    labelPosition: 'side'
  },
  name: 'labelPosition: side'
};

export const CustomWidth: Story = {
  render: renderMain(),
  args: {
    width: 400
  },
  name: 'custom width'
};

export const CustomWidthLabelPositionSide: Story = {
  render: renderMain({labelPosition: 'side'}),
  args: {
    width: 400,
    labelPosition: 'side'
  },
  name: 'custom width, labelPosition: side'
};

export const LabelAlignEnd: Story = {
  render: renderMain({labelAlign: 'end'}),
  args: {
    width: 400,
    labelAlign: 'end'
  },
  name: 'labelAlign: end'
};

export const LabelPositionSideLabelAlignEnd: Story = {
  render: renderMain({labelPosition: 'side', labelAlign: 'end'}),
  args: {
    width: 400,
    labelPosition: 'side',
    labelAlign: 'end'
  },
  name: 'labelPosition: side, labelAlign: end'
};

export const FieldsNextToEachOther: Story = {
  render: () => ({
    components: {Flex, Form, Picker, TextField},
    setup() {
      return {states};
    },
    template: `
      <Form>
        <Flex>
          <TextField
            label="First Name"
            description="Please enter your first name."
            style="margin-inline-end: var(--spectrum-global-dimension-size-100); flex: 1;" />
          <TextField label="Last Name" description="Please enter your last name." style="flex: 1;" />
        </Flex>
        <TextField label="Street Address" description="Please include apartment or suite number." />
        <Flex>
          <TextField
            label="City"
            description="Please enter the city you live in."
            style="margin-inline-end: var(--spectrum-global-dimension-size-100); flex: 1;" />
          <Picker
            label="State"
            :items="states"
            style="margin-inline-end: var(--spectrum-global-dimension-size-100); flex: 1;" />
          <TextField label="Zip code" description="Please enter a five-digit zip code." style="flex: 1;" />
        </Flex>
      </Form>
    `
  }),
  name: 'fields next to each other'
};

export const FieldsWithAutoCompleteProperty: Story = {
  render: () => ({
    components: {Checkbox, Flex, Form, Picker, TextArea, TextField, Well},
    setup() {
      let sameAsBilling = ref(true);
      return {
        countries,
        sameAsBilling,
        states
      };
    },
    template: `
      <Form>
        <Well role="group" aria-labelledby="billing-legend">
          <h2 id="billing-legend">Billing address</h2>
          <Flex>
            <TextField
              auto-complete="billing given-name"
              name="firstName"
              is-required
              label="First Name"
              style="margin-inline-end: var(--spectrum-global-dimension-size-100); flex: 1;" />
            <TextField
              auto-complete="billing family-name"
              name="lastName"
              is-required
              label="Last Name"
              style="flex: 1;" />
          </Flex>
          <Flex>
            <TextArea
              auto-complete="billing street-address"
              name="streetAddress"
              is-required
              label="Street Address"
              style="flex: 1;" />
          </Flex>
          <Flex>
            <TextField
              auto-complete="billing address-level2"
              name="city"
              is-required
              label="City"
              style="margin-inline-end: var(--spectrum-global-dimension-size-100); flex: 1;" />
            <Picker
              auto-complete="billing address-level1"
              name="state"
              is-required
              label="State"
              :items="states"
              style="margin-inline-end: var(--spectrum-global-dimension-size-100); flex: 1;" />
            <TextField
              auto-complete="billing postal-code"
              name="zip"
              is-required
              label="Zip code"
              style="flex: 1;" />
          </Flex>
          <Flex>
            <Picker
              auto-complete="billing country"
              name="country"
              is-required
              label="Country"
              :items="countries"
              style="margin-inline-end: var(--spectrum-global-dimension-size-100); flex: 1;" />
          </Flex>
          <Flex>
            <TextField
              auto-complete="billing tel"
              type="tel"
              name="phone"
              label="Phone number"
              style="margin-inline-end: var(--spectrum-global-dimension-size-100); flex: 1;" />
            <TextField
              auto-complete="billing email"
              type="email"
              name="email"
              is-required
              label="Email address"
              style="margin-inline-end: var(--spectrum-global-dimension-size-100); flex: 1;" />
          </Flex>
        </Well>

        <Well role="group" aria-labelledby="shipping-legend">
          <h2 id="shipping-legend">Shipping address</h2>
          <Checkbox :is-selected="sameAsBilling" @change="sameAsBilling = $event">
            Same as billing address
          </Checkbox>
          <template v-if="!sameAsBilling">
            <Flex>
              <TextField
                auto-complete="shipping given-name"
                name="shippingFirstName"
                is-required
                label="First Name"
                style="margin-inline-end: var(--spectrum-global-dimension-size-100); flex: 1;" />
              <TextField
                auto-complete="shipping family-name"
                name="shippingLastName"
                is-required
                label="Last Name"
                style="flex: 1;" />
            </Flex>
            <Flex>
              <TextArea
                auto-complete="shipping street-address"
                name="shippingStreetAddress"
                is-required
                label="Street Address"
                style="flex: 1;" />
            </Flex>
            <Flex>
              <TextField
                auto-complete="shipping address-level2"
                name="shippingCity"
                is-required
                label="City"
                style="margin-inline-end: var(--spectrum-global-dimension-size-100); flex: 1;" />
              <Picker
                auto-complete="shipping address-level1"
                name="shippingState"
                is-required
                label="State"
                :items="states"
                style="margin-inline-end: var(--spectrum-global-dimension-size-100); flex: 1;" />
              <TextField
                auto-complete="shipping postal-code"
                name="shippingZip"
                is-required
                label="Zip code"
                style="flex: 1;" />
            </Flex>
            <Flex>
              <Picker
                auto-complete="shipping country"
                name="shippingCountry"
                is-required
                label="Country"
                :items="countries"
                style="margin-inline-end: var(--spectrum-global-dimension-size-100); flex: 1;" />
            </Flex>
            <Flex>
              <TextField
                auto-complete="shipping tel"
                type="tel"
                name="shippingPhone"
                label="Phone number"
                style="margin-inline-end: var(--spectrum-global-dimension-size-100); flex: 1;" />
              <TextField
                auto-complete="shipping email"
                type="email"
                name="shippingEmail"
                is-required
                label="Email address"
                style="margin-inline-end: var(--spectrum-global-dimension-size-100); flex: 1;" />
            </Flex>
          </template>
        </Well>
      </Form>
    `
  }),
  name: 'fields with autoComplete property'
};

export const IsRequiredTrue: Story = {
  render: renderMain({isRequired: true}),
  args: {
    isRequired: true
  },
  name: 'isRequired: true'
};

export const IsRequiredTrueNecessityIndicatorLabel: Story = {
  render: renderMain({isRequired: true, necessityIndicator: 'label'}),
  args: {
    isRequired: true,
    necessityIndicator: 'label'
  },
  name: 'isRequired: true, necessityIndicator: label'
};

export const IsRequiredFalseNecessityIndicatorLabel: Story = {
  render: renderMain({isRequired: false, necessityIndicator: 'label'}),
  args: {
    isRequired: false,
    necessityIndicator: 'label'
  },
  name: 'isRequired: false, necessityIndicator: label'
};

export const IsDisabled: Story = {
  render: renderMain({isDisabled: true}),
  args: {
    isDisabled: true
  },
  name: 'isDisabled'
};

export const IsQuiet: Story = {
  render: renderMain({isQuiet: true}),
  args: {
    isQuiet: true
  },
  name: 'isQuiet'
};

export const IsQuietLabelPositionSide: Story = {
  render: renderMain({isQuiet: true, labelPosition: 'side'}),
  args: {
    isQuiet: true,
    labelPosition: 'side'
  },
  name: 'isQuiet, labelPosition: side'
};

export const IsEmphasized: Story = {
  render: renderMain({isEmphasized: true}),
  args: {
    isEmphasized: true
  },
  name: 'isEmphasized'
};

export const ValidationStateInvalid: Story = {
  render: renderMain({validationState: 'invalid'}),
  args: {
    validationState: 'invalid'
  },
  name: 'validationState: invalid'
};

export const ValidationStateValid: Story = {
  render: renderMain({validationState: 'valid'}),
  args: {
    validationState: 'valid'
  },
  name: 'validationState: valid'
};

export const ValidationStateInvalidIsQuietTrue: Story = {
  render: renderMain({validationState: 'invalid', isQuiet: true}),
  args: {
    validationState: 'invalid',
    isQuiet: true
  },
  name: 'validationState: invalid, isQuiet: true'
};

export const ValidationStateValidIsQuietTrue: Story = {
  render: renderMain({validationState: 'valid', isQuiet: true}),
  args: {
    validationState: 'valid',
    isQuiet: true
  },
  name: 'validationState: valid, isQuiet: true'
};

export const FormWithReset: Story = {
  render: () => ({
    components: {
      Button,
      ButtonGroup,
      Checkbox,
      ComboBox,
      DateField,
      DateRangePicker,
      Form,
      NumberField,
      Picker,
      Radio,
      RadioGroup,
      Slider,
      Switch,
      TextArea,
      TextField
    },
    setup() {
      let firstName = ref('hello');
      let isHunter = ref(true);
      let favoritePet = ref('cats');
      let favoriteColor = ref('green');
      let howIFeel = ref('I feel good, o I feel so good!');
      let birthday = ref('1732-02-22');
      let money = ref(50);
      let superSpeed = ref(true);

      let handleSubmit = (event: Event) => {
        let form = event.target as HTMLFormElement | null;
        if (form) {
          action('onSubmit')(Object.fromEntries(new FormData(form).entries()));
        }
        event.preventDefault();
      };

      let resetForm = () => {
        firstName.value = 'hello';
        isHunter.value = true;
        favoritePet.value = 'cats';
        favoriteColor.value = 'green';
        howIFeel.value = 'I feel good, o I feel so good!';
        birthday.value = '1732-02-22';
        money.value = 50;
        superSpeed.value = true;
      };

      return {
        animalOptions,
        birthday,
        colorItems,
        countries,
        favoriteColor,
        favoritePet,
        firstName,
        handleSubmit,
        howIFeel,
        isHunter,
        money,
        resetForm,
        superSpeed
      };
    },
    template: `
      <Form @submit="handleSubmit" @reset="resetForm">
        <TextField name="first-name" label="First Name (controlled)" :model-value="firstName" @update:model-value="firstName = $event" />
        <TextField name="last-name" label="Last Name (uncontrolled)" default-value="world" />
        <TextField name="street-address" label="Street Address (uncontrolled)" />
        <Picker name="country" label="Country (uncontrolled)" :items="countries" />
        <NumberField name="age" label="Age (uncontrolled)" />
        <NumberField
          name="money"
          label="Money (controlled)"
          :model-value="money"
          :format-options="{style: 'currency', currency: 'USD'}"
          @update:model-value="money = $event ?? 0" />
        <Picker
          name="favorite-color"
          label="Favorite color (controlled)"
          :items="colorItems"
          :model-value="favoriteColor"
          @update:model-value="favoriteColor = $event" />
        <Checkbox name="is-hunter" :is-selected="isHunter" @change="isHunter = $event">I am a hunter! (controlled)</Checkbox>
        <Checkbox name="is-wizard" default-selected>I am a wizard! (uncontrolled)</Checkbox>
        <Switch name="airplane-mode">Airplane mode (uncontrolled)</Switch>
        <Switch name="super-speed" :is-selected="superSpeed" @change="superSpeed = $event">Super speed (controlled)</Switch>
        <RadioGroup label="Favorite pet (controlled)" name="favorite-pet-group" :model-value="favoritePet" @update:model-value="favoritePet = $event">
          <Radio value="dogs">Dogs</Radio>
          <Radio value="cats">Cats</Radio>
          <Radio value="dragons">Dragons</Radio>
        </RadioGroup>
        <RadioGroup label="Favorite pet (uncontrolled)" name="favorite-pet-group2" default-value="cats">
          <Radio value="dogs">Dogs</Radio>
          <Radio value="cats">Cats</Radio>
          <Radio value="dragons">Dragons</Radio>
        </RadioGroup>
        <TextArea name="comments-controlled" label="Comments (controlled)" :model-value="howIFeel" @update:model-value="howIFeel = $event" />
        <TextArea name="comments-uncontrolled" label="Comments (uncontrolled)" default-value="hello" />
        <ComboBox label="Favorite Animal (uncontrolled)" name="favorite-animal" form-value="key" :options="animalOptions" />
        <DateField name="date-uncontrolled" label="Birth date (uncontrolled)" />
        <DateField name="date-controlled" label="Birth date (controlled)" :model-value="birthday" @update:model-value="birthday = $event" />
        <DateRangePicker label="Trip dates (uncontrolled)" />
        <Slider name="cookies" label="Cookies (uncontrolled)" :model-value="50" />
        <ButtonGroup>
          <Button variant="primary" type="submit">Submit</Button>
          <Button variant="secondary" type="reset">Reset</Button>
        </ButtonGroup>
      </Form>
    `
  }),
  name: 'form with reset'
};

export const _FormWithSubmit: Story = {
  render: () => ({
    components: {
      Button,
      Checkbox,
      CheckboxGroup,
      Form,
      InlineAlert,
      Radio,
      RadioGroup,
      StatusLight,
      TagGroup,
      TextField
    },
    setup() {
      let policies = ref<string[]>([]);
      let policiesDirty = ref(false);
      let pet = ref('');
      let petDirty = ref(false);
      let truth = ref(false);
      let truthDirty = ref(false);
      let email = ref('');
      let emailDirty = ref(false);
      let formStatus = ref<'progress' | 'invalid' | 'valid' | 'fixing'>('progress');
      let isSubmitted = ref(false);

      let getValidationState = (isValid: boolean): 'invalid' | undefined => {
        return (formStatus.value === 'invalid' || formStatus.value === 'fixing') && !isValid ? 'invalid' : undefined;
      };

      watch([policies, policiesDirty, pet, petDirty, truth, truthDirty, email, emailDirty, isSubmitted], () => {
        let isValid = policies.value.length === 3 && Boolean(pet.value) && truth.value && email.value.includes('@');
        let isDirty = policiesDirty.value || petDirty.value || truthDirty.value || emailDirty.value;

        if (!isSubmitted.value) {
          formStatus.value = 'progress';
          return;
        }

        formStatus.value = isDirty ? 'fixing' : (isValid ? 'valid' : 'invalid');
      });

      let statusVariant = computed<StatusVariant>(() => {
        if (formStatus.value === 'invalid') {
          return 'negative';
        }

        if (formStatus.value === 'valid') {
          return 'positive';
        }

        if (formStatus.value === 'fixing') {
          return 'notice';
        }

        return 'info';
      });

      let handleSubmit = (event: Event) => {
        event.preventDefault();
        policiesDirty.value = false;
        truthDirty.value = false;
        petDirty.value = false;
        emailDirty.value = false;
        isSubmitted.value = true;
        action('onSubmit')(event);
      };

      let resetForm = () => {
        isSubmitted.value = false;
        policies.value = [];
        pet.value = '';
        truth.value = false;
        policiesDirty.value = false;
        petDirty.value = false;
        truthDirty.value = false;
        email.value = '';
        emailDirty.value = false;
        formStatus.value = 'progress';
      };

      return {
        formStatus,
        getValidationState,
        handleSubmit,
        pet,
        policies,
        resetForm,
        statusVariant,
        tagItems,
        truth,
        email,
        setEmail: (value: string) => {
          emailDirty.value = true;
          email.value = value;
        },
        setPolicies: (value: string[]) => {
          policiesDirty.value = true;
          policies.value = value;
        },
        setPet: (value: string) => {
          petDirty.value = true;
          pet.value = value;
        },
        setTruth: (value: boolean) => {
          truthDirty.value = true;
          truth.value = value;
        }
      };
    },
    template: `
      <Form @submit="handleSubmit" :is-read-only="formStatus === 'valid'">
        <InlineAlert v-if="formStatus === 'invalid' || formStatus === 'valid'" :variant="formStatus === 'invalid' ? 'negative' : 'positive'">
          <Header>{{ formStatus === 'invalid' ? 'Error' : 'Success' }}</Header>
          <Content>{{ formStatus === 'invalid' ? 'There was an error with the form.' : 'Form was successfully completed.' }}</Content>
        </InlineAlert>

        <TextField
          label="Email address"
          type="email"
          :model-value="email"
          @update:model-value="setEmail"
          :validation-state="getValidationState(email.includes('@'))"
          error-message="Email address must contain @" />

        <CheckboxGroup label="Agree to the following" is-required :model-value="policies" @update:model-value="setPolicies">
          <Checkbox value="terms" is-required :is-invalid="getValidationState(policies.includes('terms')) === 'invalid'">Terms and conditions</Checkbox>
          <Checkbox value="privacy" is-required :is-invalid="getValidationState(policies.includes('privacy')) === 'invalid'">Privacy policy</Checkbox>
          <Checkbox value="cookies" is-required :is-invalid="getValidationState(policies.includes('cookies')) === 'invalid'">Cookie policy</Checkbox>
        </CheckboxGroup>

        <Checkbox
          is-required
          value="truth"
          :is-selected="truth"
          @change="setTruth"
          :is-invalid="getValidationState(truth) === 'invalid'">
          I am telling the truth
        </Checkbox>

        <RadioGroup
          label="Favorite pet"
          is-required
          :model-value="pet"
          @update:model-value="setPet"
          :is-invalid="getValidationState(Boolean(pet)) === 'invalid'">
          <Radio value="dogs">Dogs</Radio>
          <Radio value="cats">Cats</Radio>
          <Radio value="dragons">Dragons</Radio>
        </RadioGroup>

        <TagGroup label="Favorite tags" :items="tagItems" />

        <Button variant="cta" type="submit" :is-disabled="formStatus === 'valid'">Submit</Button>
        <Button variant="secondary" type="reset" @press="resetForm">Reset</Button>

        <StatusLight :variant="statusVariant">
          <template v-if="formStatus === 'progress'">In progress</template>
          <template v-else-if="formStatus === 'valid'">Submitted successfully</template>
          <template v-else-if="formStatus === 'invalid'">Error</template>
          <template v-else>Fixing mistakes</template>
        </StatusLight>
      </Form>
    `
  }),
  name: 'form with submit'
};

export const FormWithNumberfieldAndLocaleArAe: Story = {
  render: () => ({
    components: {Flex, Form, NumberField, TextField},
    template: `
      <div dir="rtl">
        <Flex gap="size-100">
          <NumberField label="Outside form" description="Hello" />
          <Form>
            <NumberField label="Inside form" />
          </Form>
          <Form>
            <TextField label="First Name" />
          </Form>
          <Form>
            <TextField label="First Name" />
            <NumberField label="Inside form" />
          </Form>
        </Flex>
      </div>
    `
  }),
  name: 'form with numberfield and locale=ar-AE'
};

export const WithTranslations: Story = {
  render: () => ({
    components: {
      Checkbox,
      CheckboxGroup,
      ColorField,
      ComboBox,
      Content,
      ContextualHelp,
      Form,
      Heading,
      NumberField,
      Picker,
      Radio,
      RadioGroup,
      SearchField,
      Slider,
      Switch,
      TextArea,
      TextField
    },
    setup() {
      let t = RUMINANT_TRANSLATIONS;
      let help = () => h(ContextualHelp, {}, {
        default: () => [
          h(Heading, {level: 4}, () => t.whatIsARuminant),
          h(Content, {}, () => t.ruminantDefinition)
        ]
      });

      return {
        help,
        t
      };
    },
    template: `
      <Form>
        <CheckboxGroup :label="t.ruminants" :description="t.areRuminants" :contextual-help="help()" :default-value="['cow', 'goat']">
          <Checkbox value="cow">{{t.cow}}</Checkbox>
          <Checkbox value="goat">{{t.goat}}</Checkbox>
          <Checkbox value="chicken">{{t.chicken}}</Checkbox>
        </CheckboxGroup>
        <ColorField :label="t.color" model-value="#119911" validation-state="invalid" :error-message="t.colorError" />
        <ComboBox :label="t.ruminants" :default-input-value="t.cow" validation-state="valid" :description="t.areRuminants" :contextual-help="help()" :options="[t.cow, t.goat, t.chicken, t.sheep]" />
        <NumberField :label="t.farmAnimalCount" validation-state="invalid" :error-message="t.farmCountError" />
        <Picker :label="t.ruminants" :model-value="t.chicken" is-invalid :error-message="t.notRuminantError" :items="[
          {id: t.cow, label: t.cow},
          {id: t.goat, label: t.goat},
          {id: t.chicken, label: t.chicken},
          {id: t.sheep, label: t.sheep}
        ]" />
        <RadioGroup :label="t.ruminants" :default-value="t.sheep" :description="t.areRuminants" :contextual-help="help()">
          <Radio value="cow">{{t.cow}}</Radio>
          <Radio value="goat">{{t.goat}}</Radio>
          <Radio value="chicken">{{t.chicken}}</Radio>
          <Radio :value="t.sheep">{{t.sheep}}</Radio>
        </RadioGroup>
        <Slider :label="t.farmScore" :model-value="25" />
        <SearchField :label="t.cheeseSearch" validation-state="valid" :description="t.findCheese" />
        <Switch>{{t.amHappy}}</Switch>
        <TextArea :label="t.clients" validation-state="invalid" :error-message="t.clientsError" :contextual-help="help()" />
        <TextField :label="t.farmName" :model-value="t.brownFenceFarm" validation-state="valid" :description="t.farmDescription" :contextual-help="help()" />
      </Form>
    `
  }),
  name: 'with translations',
  parameters: {
    description: {
      data: 'Translations included for: Arabic, English, Hebrew, Japanese, Korean, Simplified Chinese, and Traditional Chinese.'
    }
  }
};

export const NativeValidation: Story = {
  render: renderMain({
    validationBehavior: 'native',
    isRequired: true,
    showSubmit: true
  }),
  args: {
    isRequired: true,
    validationBehavior: 'native',
    showSubmit: true,
    onSubmit: (event: Event) => {
      event.preventDefault();
      let form = event.target as HTMLFormElement | null;
      if (form) {
        action('onSubmit')(Object.fromEntries(new FormData(form).entries()));
        return;
      }

      action('onSubmit')(event);
    }
  },
  parameters: {
    description: {
      data: 'This story is to test that client validation occurs on form submit and updates when the user commits changes to a field value (e.g. on blur).'
    }
  }
};

export const ServerValidation: Story = {
  render: renderMain({
    validationBehavior: 'native',
    showSubmit: true
  }),
  parameters: {
    description: {
      data: 'This story is to test that server errors appear after submission, and are cleared when a field is modified.'
    }
  }
};

export const NumberFieldFormSubmit: Story = {
  render: () => ({
    components: {Form, NumberField},
    setup() {
      let value = ref<number | null>(null);
      let submit = (event: Event) => {
        event.preventDefault();
        action('submitted the form')(value.value);
      };

      return {
        submit,
        value
      };
    },
    template: `
      <Form @submit="submit">
        <NumberField label="Number" name="number" :model-value="value" @update:model-value="value = $event" />
      </Form>
    `
  }),
  parameters: {
    description: {
      data: 'Try using "Enter" to submit the form from the NumberField. It should call an action in the actions panel.'
    }
  }
};

export const FormAction: Story = {
  render: renderMain({
    showSubmit: true
  })
};
