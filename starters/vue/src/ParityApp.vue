<template>
  <Provider color-scheme="light" scale="medium" class="parity-provider">
    <main class="parity-grid">
      <section data-parity-id="button-default" class="parity-card">
        <Button variant="primary">Submit</Button>
      </section>

      <section data-parity-id="button-disabled" class="parity-card">
        <Button variant="primary" :disabled="true">Submit</Button>
      </section>

      <section data-parity-id="button-hover" class="parity-card">
        <Button data-parity-target="button-hover-target" variant="primary">Hover state</Button>
      </section>

      <section data-parity-id="button-active" class="parity-card">
        <Button data-parity-target="button-active-target" variant="secondary">Active state</Button>
      </section>

      <section data-parity-id="button-focus" class="parity-card">
        <Button data-parity-target="button-focus-target" variant="secondary">Focus state</Button>
      </section>

      <section data-parity-id="button-dark" class="parity-card parity-card--dark">
        <Provider color-scheme="dark">
          <Button variant="primary">Dark scheme</Button>
        </Provider>
      </section>

      <section data-parity-id="button-large-scale" class="parity-card">
        <Provider scale="large">
          <Button variant="primary">Large scale</Button>
        </Provider>
      </section>

      <section data-parity-id="theme-default-cluster" class="parity-card parity-card--cluster">
        <Provider :theme="defaultTheme">
          <div class="parity-theme-cluster">
            <Button variant="primary">Default theme</Button>
            <TextField label="Owner" model-value="Avery" />
            <Switch :model-value="true" label="Alerts" />
          </div>
        </Provider>
      </section>

      <section data-parity-id="theme-light-cluster" class="parity-card parity-card--cluster">
        <Provider :theme="lightTheme">
          <div class="parity-theme-cluster">
            <Button variant="primary">Light theme</Button>
            <TextField label="Owner" model-value="Avery" />
            <Switch :model-value="true" label="Alerts" />
          </div>
        </Provider>
      </section>

      <section data-parity-id="theme-dark-cluster" class="parity-card parity-card--cluster">
        <Provider :theme="darkTheme" color-scheme="dark">
          <div class="parity-theme-cluster">
            <Button variant="primary">Dark theme</Button>
            <TextField label="Owner" model-value="Avery" />
            <Switch :model-value="true" label="Alerts" />
          </div>
        </Provider>
      </section>

      <section data-parity-id="theme-express-cluster" class="parity-card parity-card--cluster">
        <Provider :theme="expressTheme">
          <div class="parity-theme-cluster">
            <Button variant="primary">Express theme</Button>
            <TextField label="Owner" model-value="Avery" />
            <Switch :model-value="true" label="Alerts" />
          </div>
        </Provider>
      </section>

      <section data-parity-id="badge-positive" class="parity-card">
        <Badge variant="positive">Ready</Badge>
      </section>

      <section data-parity-id="text-detail" class="parity-card">
        <Text variant="detail">Token sync complete</Text>
      </section>

      <section data-parity-id="textfield-default" class="parity-card parity-card--input">
        <TextField label="Owner" model-value="Avery" placeholder="Owner" />
      </section>

      <section data-parity-id="textfield-invalid" class="parity-card parity-card--input">
        <TextField label="Owner" model-value="" :invalid="true" description="Owner is required" />
      </section>

      <section data-parity-id="textfield-focus" class="parity-card parity-card--input">
        <TextField data-parity-target="textfield-focus-target" label="Ticket" model-value="T-100" />
      </section>

      <section data-parity-id="view-bordered" class="parity-card">
        <View :border="true" padding="m">
          View baseline sample
        </View>
      </section>

      <section data-parity-id="icon-default" class="parity-card">
        <Icon label="Direction" size="m">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </Icon>
      </section>

      <section data-parity-id="switch-default" class="parity-card parity-card--input">
        <Switch :model-value="true" label="Alerts" />
      </section>

      <section data-parity-id="switch-disabled" class="parity-card parity-card--input">
        <Switch :model-value="false" :disabled="true" label="Alerts" />
      </section>

      <section data-parity-id="card-selected" class="parity-card">
        <Card title="Vue Migration" description="Selected state" :selected="true" />
      </section>

      <section data-parity-id="listbox-selected" class="parity-card parity-card--wide">
        <ListBox label="Framework" :items="listItems" model-value="Vue" />
      </section>

      <section data-parity-id="tabs-default" class="parity-card parity-card--wide">
        <Tabs v-model="selectedTab" :items="tabs" aria-label="Parity tabs" />
      </section>

      <section data-parity-id="table-default" class="parity-card parity-card--wide">
        <Table
          v-model="selectedRow"
          :columns="columns"
          :rows="rows"
          row-key="ticket"
          caption="Tickets" />
      </section>

      <section data-parity-id="pkg-accordion" class="parity-card parity-card--wide parity-card--stack">
        <Accordion v-model="accordionExpanded">
          <Disclosure id="core">
            <DisclosureTitle>Core primitives</DisclosureTitle>
            <DisclosurePanel>Accordion package parity fixture</DisclosurePanel>
          </Disclosure>
          <Disclosure id="states">
            <DisclosureTitle>State coverage</DisclosureTitle>
            <DisclosurePanel>Expanded state coverage is enabled.</DisclosurePanel>
          </Disclosure>
        </Accordion>
      </section>

      <section data-parity-id="pkg-actionbar" class="parity-card parity-card--wide parity-card--stack">
        <ActionBarContainer style="height: 220px;">
          <Table
            v-model="selectedRow"
            :columns="columns"
            :rows="rows"
            row-key="ticket"
            caption="Tickets" />
          <ActionBar :selected-item-count="2" :items="actionBarItems" />
        </ActionBarContainer>
      </section>

      <section data-parity-id="pkg-actiongroup" class="parity-card parity-card--wide">
        <ActionGroup v-model="actionGroupSelection" :items="actionGroupItems" selection-mode="multiple" />
      </section>

      <section data-parity-id="pkg-autocomplete" class="parity-card parity-card--input">
        <SearchAutocomplete v-model="autocompleteValue" label="Autocomplete" :options="frameworkOptions" />
      </section>

      <section data-parity-id="pkg-avatar" class="parity-card">
        <Avatar label="Vue Spectrum" size="l" />
      </section>

      <section data-parity-id="pkg-breadcrumbs" class="parity-card parity-card--wide">
        <Breadcrumbs :items="breadcrumbItems" current="Parity" />
      </section>

      <section data-parity-id="pkg-buttongroup" class="parity-card parity-card--wide">
        <ButtonGroup>
          <Button variant="primary">Save</Button>
          <Button variant="secondary">Cancel</Button>
        </ButtonGroup>
      </section>

      <section data-parity-id="pkg-calendar" class="parity-card parity-card--wide parity-card--stack">
        <Calendar v-model="calendarValue" label="Calendar" />
        <RangeCalendar v-model="calendarRangeValue" label="Range calendar" />
      </section>

      <section data-parity-id="pkg-checkbox" class="parity-card parity-card--wide parity-card--stack">
        <Checkbox v-model="checkboxValue">Subscribe</Checkbox>
        <CheckboxGroup label="Channels" description="Checkbox group package fixture">
          <Checkbox :model-value="true">Email</Checkbox>
          <Checkbox :model-value="false">SMS</Checkbox>
        </CheckboxGroup>
      </section>

      <section data-parity-id="pkg-color" class="parity-card parity-card--wide parity-card--stack">
        <div class="parity-placeholder">Color package reference fixture pending React macro bridge.</div>
      </section>

      <section data-parity-id="pkg-combobox" class="parity-card parity-card--input">
        <ComboBox v-model="comboBoxValue" label="ComboBox" :options="frameworkOptions" />
      </section>

      <section data-parity-id="pkg-datepicker" class="parity-card parity-card--wide parity-card--stack">
        <DateField v-model="dateFieldValue" label="Date field" />
        <DatePicker v-model="datePickerValue" label="Date picker" />
        <DateRangePicker v-model="dateRangeValue" label="Date range picker" />
        <TimeField v-model="timeFieldValue" label="Time field" />
      </section>

      <section data-parity-id="pkg-divider" class="parity-card parity-card--stack">
        <Text variant="detail">Divider package parity fixture</Text>
        <Divider />
        <Text variant="detail">After divider</Text>
      </section>

      <section data-parity-id="pkg-dnd" class="parity-card">
        <div class="parity-placeholder">Drag-and-drop hooks fixture placeholder</div>
      </section>

      <section data-parity-id="pkg-dropzone" class="parity-card">
        <DropZone class="parity-dropzone" label="Dropzone package fixture" />
      </section>

      <section data-parity-id="pkg-filetrigger" class="parity-card">
        <FileTrigger :accepted-file-types="acceptedFileTypes" allows-multiple>
          Select files
        </FileTrigger>
      </section>

      <section data-parity-id="pkg-form" class="parity-card parity-card--wide parity-card--stack">
        <Form>
          <TextField model-value="Avery" label="Name" />
          <NumberField :model-value="3" label="Seats" />
        </Form>
      </section>

      <section data-parity-id="pkg-illustratedmessage" class="parity-card">
        <IllustratedMessage title="No tasks" description="Illustrated message parity fixture" variant="info" />
      </section>

      <section data-parity-id="pkg-image" class="parity-card">
        <Image :src="sampleImage" alt="Parity illustration" fit="cover" />
      </section>

      <section data-parity-id="pkg-inlinealert" class="parity-card parity-card--stack">
        <InlineAlert variant="notice" title="Attention">Inline alert package fixture</InlineAlert>
      </section>

      <section data-parity-id="pkg-label" class="parity-card parity-card--stack">
        <Label for-id="pkg-label-input" :required="true">Owner</Label>
        <input id="pkg-label-input" class="parity-native-input" value="Avery" />
        <HelpText description="Assistive description" />
      </section>

      <section data-parity-id="pkg-labeledvalue" class="parity-card parity-card--stack">
        <LabeledValue label="Libraries" :value="['Vue Spectrum', 'React Spectrum']" />
      </section>

      <section data-parity-id="pkg-layout" class="parity-card parity-card--wide parity-card--stack">
        <Flex gap="size-100" justify-content="space-between">
          <View :border="true" padding="s">Flex A</View>
          <View :border="true" padding="s">Flex B</View>
        </Flex>
        <Grid :columns="layoutColumns" gap="size-100">
          <View :border="true" padding="s">Grid A</View>
          <View :border="true" padding="s">Grid B</View>
        </Grid>
      </section>

      <section data-parity-id="pkg-link" class="parity-card">
        <Link href="https://react-spectrum.adobe.com/" target="_blank" rel="noreferrer">Spectrum docs</Link>
      </section>

      <section data-parity-id="pkg-list" class="parity-card parity-card--wide">
        <ListView label="List view" :items="listItems" model-value="Vue" />
      </section>

      <section data-parity-id="pkg-menu" class="parity-card parity-card--wide">
        <Menu v-model="menuValue" label="Menu" :items="menuItems" />
      </section>

      <section data-parity-id="pkg-meter" class="parity-card parity-card--stack">
        <Meter label="Health" :value="68" :low="30" :high="75" :optimum="90" />
      </section>

      <section data-parity-id="pkg-numberfield" class="parity-card parity-card--input">
        <NumberField :model-value="7" label="Estimate" />
      </section>

      <section data-parity-id="pkg-picker" class="parity-card parity-card--input">
        <Picker v-model="pickerValue" label="Milestone" :items="pickerItems" />
      </section>

      <section data-parity-id="pkg-progress" class="parity-card parity-card--stack">
        <ProgressBar label="Progress" :value="64" />
        <ProgressCircle :value="64" />
      </section>

      <section data-parity-id="pkg-radio" class="parity-card parity-card--stack">
        <RadioGroup v-model="radioValue" label="Framework" orientation="horizontal">
          <Radio value="Vue">Vue</Radio>
          <Radio value="React">React</Radio>
          <Radio value="Svelte">Svelte</Radio>
        </RadioGroup>
      </section>

      <section data-parity-id="pkg-searchfield" class="parity-card parity-card--input">
        <SearchField v-model="searchValue" label="Search" />
      </section>

      <section data-parity-id="pkg-slider" class="parity-card parity-card--stack">
        <Slider v-model="sliderValue" label="Completion" :min="0" :max="100" :step="5" />
      </section>

      <section data-parity-id="pkg-statuslight" class="parity-card">
        <StatusLight variant="positive">Status: green</StatusLight>
      </section>

      <section data-parity-id="pkg-steplist" class="parity-card parity-card--wide">
        <StepList aria-label="Workflow" model-value="build" :items="stepItems" />
      </section>

      <section data-parity-id="pkg-tag" class="parity-card parity-card--wide">
        <TagGroup label="Tags" :items="tagItems" :model-value="['vue']" selection-mode="multiple" />
      </section>

      <section data-parity-id="pkg-toast" class="parity-card parity-card--wide">
        <ToastContainer :queue="toastQueue" aria-label="Notifications" placement="bottom" />
      </section>

      <section data-parity-id="pkg-tooltip" class="parity-card parity-card--wide">
        <TooltipTrigger :model-value="true" content="Persistent tooltip" placement="right" variant="positive" :show-icon="true">
          <Button variant="secondary">Tooltip trigger</Button>
        </TooltipTrigger>
      </section>

      <section data-parity-id="pkg-tree" class="parity-card parity-card--wide">
        <Tree :items="treeItems" model-value="project-alpha" />
      </section>

      <section data-parity-id="pkg-well" class="parity-card">
        <Well variant="notice">Well package parity fixture</Well>
      </section>

      <section data-parity-id="pkg-s2" class="parity-card parity-card--wide parity-card--stack">
        <div class="parity-placeholder">S2 parity fixture placeholder (React S2 starter uses a separate Parcel config path).</div>
      </section>

      <section data-parity-id="state-textfield-disabled" class="parity-card parity-card--input">
        <TextField label="Locked ticket" model-value="T-100" :disabled="true" />
      </section>

      <section data-parity-id="state-searchfield-invalid" class="parity-card parity-card--input">
        <SearchField v-model="searchInvalidValue" label="Search query" :invalid="true" description="No matching issues found" />
      </section>

      <section data-parity-id="state-searchfield-focus" class="parity-card parity-card--input">
        <SearchField data-parity-target="searchfield-focus-target" v-model="searchFocusValue" label="Focused search" />
      </section>

      <section data-parity-id="state-numberfield-invalid" class="parity-card parity-card--input">
        <NumberField :model-value="999" label="Estimate" :invalid="true" description="Estimate exceeds limit" />
      </section>

      <section data-parity-id="state-slider-disabled" class="parity-card parity-card--stack">
        <Slider :model-value="42" label="Disabled slider" :disabled="true" />
      </section>

      <section data-parity-id="state-radio-disabled" class="parity-card parity-card--stack">
        <RadioGroup v-model="radioValue" label="Disabled radio group" :disabled="true" orientation="horizontal">
          <Radio value="Vue">Vue</Radio>
          <Radio value="React">React</Radio>
          <Radio value="Svelte">Svelte</Radio>
        </RadioGroup>
      </section>

      <section data-parity-id="state-tabs-disabled" class="parity-card parity-card--wide">
        <Tabs v-model="disabledTabValue" :items="disabledTabs" aria-label="Disabled tabs fixture" />
      </section>

      <section data-parity-id="state-picker-disabled" class="parity-card parity-card--input">
        <Picker v-model="disabledPickerValue" label="Disabled picker" :items="pickerItems" :disabled="true" />
      </section>

      <section data-parity-id="state-dropzone-over" class="parity-card">
        <DropZone class="parity-dropzone is-over" label="Hovering drop target" />
      </section>

      <section data-parity-id="state-tree-selection" class="parity-card parity-card--wide">
        <Tree :items="treeItems" model-value="beta-qa" />
      </section>

      <section data-parity-id="async-collection-cluster" class="parity-card parity-card--wide parity-card--stack">
        <Text variant="detail">Async loading snapshot</Text>
        <ProgressBar label="Loading backlog" :value="35" />
        <div class="parity-placeholder">Table loading state placeholder</div>
      </section>

      <section data-parity-id="virtualized-collection-cluster" class="parity-card parity-card--wide parity-card--stack">
        <div class="parity-scroll-frame">
          <ListView label="Scrollable list viewport" :items="virtualListItems" model-value="Item 8" />
        </div>
        <div class="parity-scroll-frame">
          <Table :columns="columns" :rows="virtualRows" row-key="ticket" caption="Large table viewport" />
        </div>
        <div class="parity-scroll-frame">
          <Tree :items="virtualTreeItems" model-value="node-7" />
        </div>
      </section>

      <section data-parity-id="dnd-state-cluster" class="parity-card parity-card--wide">
        <div class="parity-dnd-cluster">
          <DropZone class="parity-dropzone parity-dropzone--wide is-over" label="Drop target (over)" />
          <DropZone class="parity-dropzone parity-dropzone--wide" :disabled="true" label="Drop target (disabled)" />
          <div class="parity-placeholder">Dnd drop target placeholder</div>
        </div>
      </section>
    </main>
  </Provider>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {Accordion, Disclosure, DisclosurePanel, DisclosureTitle} from '@vue-spectrum/accordion';
import {ActionBar, ActionBarContainer} from '@vue-spectrum/actionbar';
import {ActionGroup} from '@vue-spectrum/actiongroup';
import {SearchAutocomplete} from '@vue-spectrum/autocomplete';
import {Avatar} from '@vue-spectrum/avatar';
import {Badge} from '@vue-spectrum/badge';
import {Breadcrumbs} from '@vue-spectrum/breadcrumbs';
import {Button} from '@vue-spectrum/button';
import {ButtonGroup} from '@vue-spectrum/buttongroup';
import {Calendar, RangeCalendar} from '@vue-spectrum/calendar';
import {Card} from '@vue-spectrum/card';
import {Checkbox, CheckboxGroup} from '@vue-spectrum/checkbox';
import {ComboBox} from '@vue-spectrum/combobox';
import {DateField, DatePicker, DateRangePicker, TimeField} from '@vue-spectrum/datepicker';
import {Divider} from '@vue-spectrum/divider';
import {DropZone} from '@vue-spectrum/dropzone';
import {FileTrigger} from '@vue-spectrum/filetrigger';
import {Form} from '@vue-spectrum/form';
import {Icon} from '@vue-spectrum/icon';
import {IllustratedMessage} from '@vue-spectrum/illustratedmessage';
import {Image} from '@vue-spectrum/image';
import {InlineAlert} from '@vue-spectrum/inlinealert';
import {HelpText, Label} from '@vue-spectrum/label';
import {LabeledValue} from '@vue-spectrum/labeledvalue';
import {Flex, Grid, minmax, repeat} from '@vue-spectrum/layout';
import {Link} from '@vue-spectrum/link';
import {ListView} from '@vue-spectrum/list';
import {ListBox} from '@vue-spectrum/listbox';
import {Menu} from '@vue-spectrum/menu';
import {Meter} from '@vue-spectrum/meter';
import {NumberField} from '@vue-spectrum/numberfield';
import {Picker} from '@vue-spectrum/picker';
import {ProgressBar, ProgressCircle} from '@vue-spectrum/progress';
import {Provider} from '@vue-spectrum/provider';
import {Radio, RadioGroup} from '@vue-spectrum/radio';
import {SearchField} from '@vue-spectrum/searchfield';
import {Slider} from '@vue-spectrum/slider';
import {StatusLight} from '@vue-spectrum/statuslight';
import {StepList} from '@vue-spectrum/steplist';
import {Switch} from '@vue-spectrum/switch';
import {Table} from '@vue-spectrum/table';
import {TagGroup} from '@vue-spectrum/tag';
import {Tabs, type TabItemData} from '@vue-spectrum/tabs';
import {Text} from '@vue-spectrum/text';
import {TextField} from '@vue-spectrum/textfield';
import {createToastQueue, ToastContainer} from '@vue-spectrum/toast';
import {TooltipTrigger} from '@vue-spectrum/tooltip';
import {Tree} from '@vue-spectrum/tree';
import {View} from '@vue-spectrum/view';
import {Well} from '@vue-spectrum/well';
import {theme as darkTheme} from '@vue-spectrum/theme-dark';
import {theme as defaultTheme} from '@vue-spectrum/theme-default';
import {theme as expressTheme} from '@vue-spectrum/theme-express';
import {theme as lightTheme} from '@vue-spectrum/theme-light';

const selectedTab = ref('overview');
const selectedRow = ref('T-100');
const disabledTabValue = ref('summary');
const disabledPickerValue = ref('Q3');
const listItems = ['React', 'Vue', 'Svelte'];

const tabs: TabItemData[] = [
  {key: 'overview', label: 'Overview', content: 'Overview content'},
  {key: 'details', label: 'Details', content: 'Details content'}
];

const disabledTabs: TabItemData[] = [
  {key: 'summary', label: 'Summary', content: 'Summary tab'},
  {key: 'history', label: 'History', content: 'History tab', disabled: true},
  {key: 'activity', label: 'Activity', content: 'Activity tab'}
];

const columns = [
  {key: 'ticket', label: 'Ticket'},
  {key: 'owner', label: 'Owner'}
];

const rows = [
  {ticket: 'T-100', owner: 'Avery'},
  {ticket: 'T-101', owner: 'Quinn'}
];

const accordionExpanded = ref<string[]>(['core']);
const actionBarItems = ['Approve', 'Assign', 'Archive'];
const actionGroupItems = ['Edit', 'Review', 'Publish'];
const actionGroupSelection = ref<string[]>(['Review']);
const autocompleteValue = ref('Vue');
const breadcrumbItems = ['Home', 'Migration', 'Parity'];
const calendarValue = ref('2026-02-20');
const calendarRangeValue = ref({
  start: '2026-02-20',
  end: '2026-02-24'
});
const checkboxValue = ref(true);
const comboBoxValue = ref('React');
const dateFieldValue = ref('2026-02-19');
const datePickerValue = ref('2026-02-21');
const dateRangeValue = ref({
  start: '2026-02-22',
  end: '2026-02-27'
});
const timeFieldValue = ref('09:45');
const acceptedFileTypes = ['image/png', 'image/jpeg', 'application/pdf'];
const layoutColumns = repeat(2, minmax(0, '1fr'));
const menuItems = ['Design', 'Build', 'Ship'];
const menuValue = ref('Build');
const pickerItems = ['Q1', 'Q2', 'Q3', 'Q4'];
const pickerValue = ref('Q2');
const radioValue = ref('Vue');
const searchValue = ref('Vue');
const searchInvalidValue = ref('react');
const searchFocusValue = ref('focus me');
const sliderValue = ref(64);
const stepItems = [
  {key: 'plan', label: 'Plan'},
  {key: 'build', label: 'Build'},
  {key: 'ship', label: 'Ship', disabled: true}
];
const tagItems = [
  {key: 'vue', label: 'Vue'},
  {key: 'react', label: 'React'},
  {key: 'spectrum', label: 'Spectrum'}
];
const treeItems = [
  {
    id: 'project-alpha',
    label: 'Project Alpha',
    children: [
      {id: 'alpha-ui', label: 'UI'},
      {id: 'alpha-data', label: 'Data'}
    ]
  },
  {
    id: 'project-beta',
    label: 'Project Beta',
    children: [
      {id: 'beta-api', label: 'API'},
      {id: 'beta-qa', label: 'QA'}
    ]
  }
];

const frameworkOptions = ['React', 'Vue', 'Svelte', 'Solid'];
const virtualListItems = Array.from({length: 18}, (_, index) => `Item ${index + 1}`);
const virtualRows = Array.from({length: 14}, (_, index) => ({
  ticket: `T-${200 + index}`,
  owner: index % 2 === 0 ? 'Avery' : 'Quinn'
}));
const virtualTreeItems = [
  {
    id: 'node-1',
    label: 'Node 1',
    children: [
      {id: 'node-2', label: 'Node 2'},
      {id: 'node-3', label: 'Node 3'}
    ]
  },
  {
    id: 'node-4',
    label: 'Node 4',
    children: [
      {id: 'node-5', label: 'Node 5'},
      {id: 'node-6', label: 'Node 6'},
      {id: 'node-7', label: 'Node 7'}
    ]
  }
];
const toastQueue = createToastQueue({maxVisibleToasts: 1});
toastQueue.positive('Deployment ready', {actionLabel: 'View'});

const sampleImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='360' height='140' viewBox='0 0 360 140'%3E%3Crect width='360' height='140' fill='%23e8eefc'/%3E%3Ctext x='24' y='78' fill='%2327476e' font-size='24' font-family='Arial'%3EReact Parity%3C/text%3E%3C/svg%3E";
</script>

<style scoped>
.parity-provider {
  min-height: 100vh;
  background: #f5f5f5;
  color: #1f1f1f;
  font-family: Arial, sans-serif;
}

.parity-grid {
  box-sizing: border-box;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0 auto;
  max-width: 1280px;
  padding: 24px;
}

.parity-card {
  align-items: center;
  background: #ffffff;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  min-height: 120px;
  overflow: hidden;
  padding: 20px;
}

.parity-card--input {
  align-items: flex-start;
}

.parity-card--wide {
  grid-column: span 3;
}

.parity-card--stack {
  align-items: stretch;
  flex-direction: column;
  gap: 10px;
}

.parity-card--cluster {
  align-items: stretch;
  padding: 0;
}

.parity-card--dark {
  background: #2a2a2a;
  border-color: #444444;
}

.parity-theme-cluster {
  box-sizing: border-box;
  display: grid;
  gap: 12px;
  inline-size: 100%;
  padding: 16px;
}

.parity-native-input {
  border: 1px solid #bdbdbd;
  border-radius: 6px;
  font-size: 14px;
  inline-size: 100%;
  min-height: 32px;
  padding: 4px 10px;
}

.parity-scroll-frame {
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  max-height: 220px;
  overflow: auto;
  padding: 8px;
}

.parity-dnd-cluster {
  display: grid;
  gap: 12px;
  inline-size: 100%;
}

.parity-placeholder {
  border: 1px dashed #c9c9c9;
  border-radius: 6px;
  color: #5a5a5a;
  font-size: 14px;
  inline-size: 100%;
  padding: 12px;
}

:deep(.parity-dropzone) {
  border: 2px dashed #d5d5d5;
  border-radius: 4px;
  font-size: 14px;
  line-height: 21px;
  min-block-size: 169px;
  padding: 72px;
}

:deep(.parity-dropzone .vs-drop-zone__label) {
  font-size: 14px;
  line-height: 21px;
}

:deep(.parity-dropzone .vs-drop-zone__browse) {
  display: none;
}

:deep(.parity-dropzone.is-over) {
  background: transparent;
  border-color: #d5d5d5;
}

:deep(.parity-dropzone--wide) {
  inline-size: 100%;
}

@media (max-width: 1024px) {
  .parity-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .parity-card--wide {
    grid-column: span 2;
  }
}

@media (max-width: 720px) {
  .parity-grid {
    grid-template-columns: 1fr;
  }

  .parity-card--wide {
    grid-column: span 1;
  }
}
</style>
