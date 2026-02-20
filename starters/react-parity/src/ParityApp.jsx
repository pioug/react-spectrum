/* eslint-disable react/jsx-no-bind */
import React, {useEffect, useMemo, useState} from 'react';
import {Accordion, Disclosure, DisclosurePanel, DisclosureTitle} from '@react-spectrum/accordion';
import {ActionBar, ActionBarContainer} from '@react-spectrum/actionbar';
import {ActionGroup} from '@react-spectrum/actiongroup';
import {SearchAutocomplete} from '@react-spectrum/autocomplete';
import {Avatar} from '@react-spectrum/avatar';
import {Badge} from '@react-spectrum/badge';
import {Breadcrumbs} from '@react-spectrum/breadcrumbs';
import {Button} from '@react-spectrum/button';
import {ButtonGroup} from '@react-spectrum/buttongroup';
import {Calendar, RangeCalendar} from '@react-spectrum/calendar';
import {Card} from '@react-spectrum/card';
import {Checkbox, CheckboxGroup} from '@react-spectrum/checkbox';
import {ComboBox} from '@react-spectrum/combobox';
import {DateField, DatePicker, DateRangePicker, TimeField} from '@react-spectrum/datepicker';
import {Divider} from '@react-spectrum/divider';
import {DropZone} from '@react-spectrum/dropzone';
import {FileTrigger} from '@react-spectrum/filetrigger';
import {Form} from '@react-spectrum/form';
import {Icon} from '@react-spectrum/icon';
import {IllustratedMessage} from '@react-spectrum/illustratedmessage';
import {Image} from '@react-spectrum/image';
import {InlineAlert} from '@react-spectrum/inlinealert';
import {HelpText, Label} from '@react-spectrum/label';
import {LabeledValue} from '@react-spectrum/labeledvalue';
import {Flex, Grid, minmax, repeat} from '@react-spectrum/layout';
import {Link} from '@react-spectrum/link';
import {ListView} from '@react-spectrum/list';
import {ListBox} from '@react-spectrum/listbox';
import {Menu, MenuTrigger} from '@react-spectrum/menu';
import {Meter} from '@react-spectrum/meter';
import {NumberField} from '@react-spectrum/numberfield';
import {Picker} from '@react-spectrum/picker';
import {ProgressBar, ProgressCircle} from '@react-spectrum/progress';
import {Provider} from '@react-spectrum/provider';
import {Radio, RadioGroup} from '@react-spectrum/radio';
import {SearchField} from '@react-spectrum/searchfield';
import {Slider} from '@react-spectrum/slider';
import {StatusLight} from '@react-spectrum/statuslight';
import {StepList} from '@react-spectrum/steplist';
import {Switch} from '@react-spectrum/switch';
import {Cell, Column, Row, TableBody, TableHeader, TableView} from '@react-spectrum/table';
import {Tabs} from '@react-spectrum/tabs';
import {TagGroup} from '@react-spectrum/tag';
import {Text} from '@react-spectrum/text';
import {TextField} from '@react-spectrum/textfield';
import {theme as darkTheme} from '@react-spectrum/theme-dark';
import {theme as defaultTheme} from '@react-spectrum/theme-default';
import {theme as expressTheme} from '@react-spectrum/theme-express';
import {theme as lightTheme} from '@react-spectrum/theme-light';
import {ToastContainer, ToastQueue} from '@react-spectrum/toast';
import {Tooltip, TooltipTrigger} from '@react-spectrum/tooltip';
import {TreeView, TreeViewItem, TreeViewItemContent} from '@react-spectrum/tree';
import {View} from '@react-spectrum/view';
import {Well} from '@react-spectrum/well';
import {parseDate, parseTime} from '@internationalized/date';
import {Item} from '@react-stately/collections';

const tableRows = [
  {ticket: 'T-100', owner: 'Avery'},
  {ticket: 'T-101', owner: 'Quinn'}
];

const virtualRows = Array.from({length: 14}, (_, index) => ({
  ticket: `T-${200 + index}`,
  owner: index % 2 === 0 ? 'Avery' : 'Quinn'
}));

const virtualListItems = Array.from({length: 18}, (_, index) => `Item ${index + 1}`);

const sampleImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='360' height='140' viewBox='0 0 360 140'%3E%3Crect width='360' height='140' fill='%23e8eefc'/%3E%3Ctext x='24' y='78' fill='%2327476e' font-size='24' font-family='Arial'%3EReact Parity%3C/text%3E%3C/svg%3E";

const frameworkItems = ['React', 'Vue', 'Svelte', 'Solid'];
const pickerItems = ['Q1', 'Q2', 'Q3', 'Q4'];
const menuItems = ['Design', 'Build', 'Ship'];
const stepItems = ['Plan', 'Build', 'Ship'];

function Section({id, className, children}) {
  return (
    <section data-parity-id={id} className={`parity-card ${className ?? ''}`.trim()}>
      {children}
    </section>
  );
}

function SimpleTree({selectedKeys}) {
  return (
    <TreeView aria-label="Projects" selectionMode="single" selectedKeys={selectedKeys}>
      <TreeViewItem id="project-alpha" textValue="Project Alpha">
        <TreeViewItemContent>Project Alpha</TreeViewItemContent>
        <TreeViewItem id="alpha-ui" textValue="UI">
          <TreeViewItemContent>UI</TreeViewItemContent>
        </TreeViewItem>
        <TreeViewItem id="alpha-data" textValue="Data">
          <TreeViewItemContent>Data</TreeViewItemContent>
        </TreeViewItem>
      </TreeViewItem>
      <TreeViewItem id="project-beta" textValue="Project Beta">
        <TreeViewItemContent>Project Beta</TreeViewItemContent>
        <TreeViewItem id="beta-api" textValue="API">
          <TreeViewItemContent>API</TreeViewItemContent>
        </TreeViewItem>
        <TreeViewItem id="beta-qa" textValue="QA">
          <TreeViewItemContent>QA</TreeViewItemContent>
        </TreeViewItem>
      </TreeViewItem>
    </TreeView>
  );
}

function SimpleTable({selectedKeys, rows = tableRows}) {
  return (
    <TableView aria-label="Tickets" selectionMode="single" selectedKeys={selectedKeys}>
      <TableHeader>
        <Column key="ticket">Ticket</Column>
        <Column key="owner">Owner</Column>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <Row key={row.ticket}>
            <Cell>{row.ticket}</Cell>
            <Cell>{row.owner}</Cell>
          </Row>
        ))}
      </TableBody>
    </TableView>
  );
}

export function ParityApp() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const selectedVueKey = useMemo(() => new Set(['Vue']), []);
  const selectedBuildKey = useMemo(() => new Set(['Build']), []);
  const selectedQ2Key = useMemo(() => new Set(['Q2']), []);
  const selectedQ3Key = useMemo(() => new Set(['Q3']), []);
  const selectedRow = useMemo(() => new Set(['T-100']), []);
  const selectedTreeAlpha = useMemo(() => new Set(['project-alpha']), []);
  const selectedTreeBeta = useMemo(() => new Set(['beta-qa']), []);
  const selectedVirtualTree = useMemo(() => new Set(['node-7']), []);

  useEffect(() => {
    ToastQueue.positive('Deployment ready', {actionLabel: 'View'});
  }, []);

  return (
    <Provider theme={defaultTheme} colorScheme="light" scale="medium" UNSAFE_className="parity-provider">
      <main className="parity-grid">
        <Section id="button-default">
          <Button variant="cta">Submit</Button>
        </Section>

        <Section id="button-disabled">
          <Button variant="cta" isDisabled>Submit</Button>
        </Section>

        <Section id="button-hover">
          <Button data-parity-target="button-hover-target" variant="cta">Hover state</Button>
        </Section>

        <Section id="button-active">
          <Button data-parity-target="button-active-target" variant="secondary">Active state</Button>
        </Section>

        <Section id="button-focus">
          <Button data-parity-target="button-focus-target" variant="secondary">Focus state</Button>
        </Section>

        <Section id="button-dark" className="parity-card--dark">
          <Provider theme={darkTheme} colorScheme="dark" scale="medium">
            <Button variant="cta">Dark scheme</Button>
          </Provider>
        </Section>

        <Section id="button-large-scale">
          <Provider theme={defaultTheme} colorScheme="light" scale="large">
            <Button variant="cta">Large scale</Button>
          </Provider>
        </Section>

        <Section id="theme-default-cluster" className="parity-card--cluster">
          <Provider theme={defaultTheme} colorScheme="light" scale="medium">
            <div className="parity-theme-cluster">
              <Button variant="cta">Default theme</Button>
              <TextField label="Owner" defaultValue="Avery" />
              <Switch defaultSelected>Alerts</Switch>
            </div>
          </Provider>
        </Section>

        <Section id="theme-light-cluster" className="parity-card--cluster">
          <Provider theme={lightTheme} colorScheme="light" scale="medium">
            <div className="parity-theme-cluster">
              <Button variant="cta">Light theme</Button>
              <TextField label="Owner" defaultValue="Avery" />
              <Switch defaultSelected>Alerts</Switch>
            </div>
          </Provider>
        </Section>

        <Section id="theme-dark-cluster" className="parity-card--cluster">
          <Provider theme={darkTheme} colorScheme="dark" scale="medium">
            <div className="parity-theme-cluster">
              <Button variant="cta">Dark theme</Button>
              <TextField label="Owner" defaultValue="Avery" />
              <Switch defaultSelected>Alerts</Switch>
            </div>
          </Provider>
        </Section>

        <Section id="theme-express-cluster" className="parity-card--cluster">
          <Provider theme={expressTheme} colorScheme="light" scale="medium">
            <div className="parity-theme-cluster">
              <Button variant="cta">Express theme</Button>
              <TextField label="Owner" defaultValue="Avery" />
              <Switch defaultSelected>Alerts</Switch>
            </div>
          </Provider>
        </Section>

        <Section id="badge-positive">
          <Badge variant="positive">Ready</Badge>
        </Section>

        <Section id="text-detail">
          <Text>Token sync complete</Text>
        </Section>

        <Section id="textfield-default" className="parity-card--input">
          <TextField label="Owner" defaultValue="Avery" placeholder="Owner" />
        </Section>

        <Section id="textfield-invalid" className="parity-card--input">
          <TextField
            label="Owner"
            validationState="invalid"
            errorMessage="Owner is required"
            defaultValue="" />
        </Section>

        <Section id="textfield-focus" className="parity-card--input">
          <div data-parity-target="textfield-focus-target" style={{width: '100%'}}>
            <TextField label="Ticket" defaultValue="T-100" />
          </div>
        </Section>

        <Section id="view-bordered">
          <View borderWidth="thin" borderColor="dark" borderRadius="regular" padding="size-100">View baseline sample</View>
        </Section>

        <Section id="icon-default">
          <Icon aria-label="Direction" size="M">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </Icon>
        </Section>

        <Section id="switch-default" className="parity-card--input">
          <Switch defaultSelected>Alerts</Switch>
        </Section>

        <Section id="switch-disabled" className="parity-card--input">
          <Switch isDisabled>Alerts</Switch>
        </Section>

        <Section id="card-selected">
          <Card title="Vue Migration" description="Selected state" isSelected>
            <Text>Selected state</Text>
          </Card>
        </Section>

        <Section id="listbox-selected" className="parity-card--wide">
          <ListBox aria-label="Framework" selectionMode="single" selectedKeys={selectedVueKey}>
            <Item key="React">React</Item>
            <Item key="Vue">Vue</Item>
            <Item key="Svelte">Svelte</Item>
          </ListBox>
        </Section>

        <Section id="tabs-default" className="parity-card--wide">
          <Tabs aria-label="Parity tabs" selectedKey={selectedTab} onSelectionChange={setSelectedTab}>
            <Item key="overview" title="Overview">Overview content</Item>
            <Item key="details" title="Details">Details content</Item>
          </Tabs>
        </Section>

        <Section id="table-default" className="parity-card--wide">
          <SimpleTable selectedKeys={selectedRow} />
        </Section>

        <Section id="pkg-accordion" className="parity-card--wide parity-card--stack">
          <Accordion defaultExpandedKeys={["core"]}>
            <Disclosure id="core">
              <DisclosureTitle>Core primitives</DisclosureTitle>
              <DisclosurePanel>Accordion package parity fixture</DisclosurePanel>
            </Disclosure>
            <Disclosure id="states">
              <DisclosureTitle>State coverage</DisclosureTitle>
              <DisclosurePanel>Expanded state coverage is enabled.</DisclosurePanel>
            </Disclosure>
          </Accordion>
        </Section>

        <Section id="pkg-actionbar" className="parity-card--wide parity-card--stack">
          <ActionBarContainer height={220}>
            <SimpleTable selectedKeys={selectedRow} />
            <ActionBar selectedItemCount={2} onClearSelection={() => {}}>
              <Item key="approve"><Text>Approve</Text></Item>
              <Item key="assign"><Text>Assign</Text></Item>
              <Item key="archive"><Text>Archive</Text></Item>
            </ActionBar>
          </ActionBarContainer>
        </Section>

        <Section id="pkg-actiongroup" className="parity-card--wide">
          <ActionGroup selectionMode="multiple" defaultSelectedKeys={['Review']}>
            <Item key="Edit">Edit</Item>
            <Item key="Review">Review</Item>
            <Item key="Publish">Publish</Item>
          </ActionGroup>
        </Section>

        <Section id="pkg-autocomplete" className="parity-card--input">
          <SearchAutocomplete label="Autocomplete" defaultInputValue="Vue">
            {frameworkItems.map((item) => <Item key={item}>{item}</Item>)}
          </SearchAutocomplete>
        </Section>

        <Section id="pkg-avatar">
          <Avatar alt="Vue Spectrum" size="avatar-size-1000" />
        </Section>

        <Section id="pkg-breadcrumbs" className="parity-card--wide">
          <Breadcrumbs>
            <Item key="home">Home</Item>
            <Item key="migration">Migration</Item>
            <Item key="parity">Parity</Item>
          </Breadcrumbs>
        </Section>

        <Section id="pkg-buttongroup" className="parity-card--wide">
          <ButtonGroup>
            <Button variant="cta">Save</Button>
            <Button variant="secondary">Cancel</Button>
          </ButtonGroup>
        </Section>

        <Section id="pkg-calendar" className="parity-card--wide parity-card--stack">
          <Calendar aria-label="Calendar" defaultValue={parseDate('2026-02-20')} />
          <RangeCalendar aria-label="Range calendar" defaultValue={{start: parseDate('2026-02-20'), end: parseDate('2026-02-24')}} />
        </Section>

        <Section id="pkg-checkbox" className="parity-card--wide parity-card--stack">
          <Checkbox defaultSelected>Subscribe</Checkbox>
          <CheckboxGroup label="Channels" description="Checkbox group package fixture">
            <Checkbox value="email">Email</Checkbox>
            <Checkbox value="sms">SMS</Checkbox>
          </CheckboxGroup>
        </Section>

        <Section id="pkg-color" className="parity-card--wide parity-card--stack">
          <div className="parity-placeholder">Color package reference fixture pending React macro bridge.</div>
        </Section>

        <Section id="pkg-combobox" className="parity-card--input">
          <ComboBox label="ComboBox" defaultInputValue="React">
            {frameworkItems.map((item) => <Item key={item}>{item}</Item>)}
          </ComboBox>
        </Section>

        <Section id="pkg-datepicker" className="parity-card--wide parity-card--stack">
          <DateField label="Date field" defaultValue={parseDate('2026-02-19')} />
          <DatePicker label="Date picker" defaultValue={parseDate('2026-02-21')} />
          <DateRangePicker label="Date range picker" defaultValue={{start: parseDate('2026-02-22'), end: parseDate('2026-02-27')}} />
          <TimeField label="Time field" defaultValue={parseTime('09:45')} />
        </Section>

        <Section id="pkg-divider" className="parity-card--stack">
          <Text>Divider package parity fixture</Text>
          <Divider />
          <Text>After divider</Text>
        </Section>

        <Section id="pkg-dnd">
          <div className="parity-placeholder">Drag-and-drop hooks fixture placeholder</div>
        </Section>

        <Section id="pkg-dropzone">
          <DropZone>
            <Text>Dropzone package fixture</Text>
          </DropZone>
        </Section>

        <Section id="pkg-filetrigger">
          <FileTrigger allowsMultiple acceptedFileTypes={['image/png', 'image/jpeg', 'application/pdf']}>
            <Button variant="secondary">Select files</Button>
          </FileTrigger>
        </Section>

        <Section id="pkg-form" className="parity-card--wide parity-card--stack">
          <Form>
            <TextField label="Name" defaultValue="Avery" />
            <NumberField label="Seats" defaultValue={3} />
          </Form>
        </Section>

        <Section id="pkg-illustratedmessage">
          <IllustratedMessage>
            <Text>No tasks</Text>
          </IllustratedMessage>
        </Section>

        <Section id="pkg-image">
          <Image src={sampleImage} alt="Parity illustration" objectFit="cover" />
        </Section>

        <Section id="pkg-inlinealert" className="parity-card--stack">
          <InlineAlert variant="notice">
            <Text>Attention</Text>
            <Text>Inline alert package fixture</Text>
          </InlineAlert>
        </Section>

        <Section id="pkg-label" className="parity-card--stack">
          <Label htmlFor="pkg-label-input" isRequired>Owner</Label>
          <input id="pkg-label-input" className="parity-native-input" defaultValue="Avery" />
          <HelpText description="Assistive description" />
        </Section>

        <Section id="pkg-labeledvalue" className="parity-card--stack">
          <LabeledValue label="Libraries" value={['Vue Spectrum', 'React Spectrum']} />
        </Section>

        <Section id="pkg-layout" className="parity-card--wide parity-card--stack">
          <Flex gap="size-100" justifyContent="space-between">
            <View borderWidth="thin" borderColor="dark" borderRadius="regular" padding="size-100">Flex A</View>
            <View borderWidth="thin" borderColor="dark" borderRadius="regular" padding="size-100">Flex B</View>
          </Flex>
          <Grid columns={repeat(2, minmax(0, '1fr'))} gap="size-100">
            <View borderWidth="thin" borderColor="dark" borderRadius="regular" padding="size-100">Grid A</View>
            <View borderWidth="thin" borderColor="dark" borderRadius="regular" padding="size-100">Grid B</View>
          </Grid>
        </Section>

        <Section id="pkg-link">
          <Link href="https://react-spectrum.adobe.com/" target="_blank" rel="noreferrer">Spectrum docs</Link>
        </Section>

        <Section id="pkg-list" className="parity-card--wide">
          <ListView aria-label="List view" selectionMode="single" selectedKeys={selectedVueKey}>
            <Item key="React">React</Item>
            <Item key="Vue">Vue</Item>
            <Item key="Svelte">Svelte</Item>
          </ListView>
        </Section>

        <Section id="pkg-menu" className="parity-card--wide">
          <MenuTrigger>
            <Button variant="secondary">Menu</Button>
            <Menu onAction={() => {}}>
              {menuItems.map((item) => <Item key={item}>{item}</Item>)}
            </Menu>
          </MenuTrigger>
        </Section>

        <Section id="pkg-meter" className="parity-card--stack">
          <Meter label="Health" value={68} minValue={0} maxValue={100} />
        </Section>

        <Section id="pkg-numberfield" className="parity-card--input">
          <NumberField label="Estimate" defaultValue={7} />
        </Section>

        <Section id="pkg-picker" className="parity-card--input">
          <Picker label="Milestone" selectedKeys={selectedQ2Key}>
            {pickerItems.map((item) => <Item key={item}>{item}</Item>)}
          </Picker>
        </Section>

        <Section id="pkg-progress" className="parity-card--stack">
          <ProgressBar label="Progress" value={64} />
          <ProgressCircle value={64} />
        </Section>

        <Section id="pkg-radio" className="parity-card--stack">
          <RadioGroup label="Framework" defaultValue="Vue" orientation="horizontal">
            <Radio value="Vue">Vue</Radio>
            <Radio value="React">React</Radio>
            <Radio value="Svelte">Svelte</Radio>
          </RadioGroup>
        </Section>

        <Section id="pkg-searchfield" className="parity-card--input">
          <SearchField label="Search" defaultValue="Vue" />
        </Section>

        <Section id="pkg-slider" className="parity-card--stack">
          <Slider label="Completion" defaultValue={64} minValue={0} maxValue={100} step={5} />
        </Section>

        <Section id="pkg-statuslight">
          <StatusLight variant="positive">Status: green</StatusLight>
        </Section>

        <Section id="pkg-steplist" className="parity-card--wide">
          <StepList aria-label="Workflow" selectedKeys={selectedBuildKey} disabledKeys={['Ship']}>
            {stepItems.map((item) => <Item key={item}>{item}</Item>)}
          </StepList>
        </Section>

        <Section id="pkg-tag" className="parity-card--wide">
          <TagGroup aria-label="Tags" selectionMode="multiple" defaultSelectedKeys={['Vue']}>
            <Item key="Vue">Vue</Item>
            <Item key="React">React</Item>
            <Item key="Spectrum">Spectrum</Item>
          </TagGroup>
        </Section>

        <Section id="pkg-toast" className="parity-card--wide">
          <ToastContainer aria-label="Notifications" placement="bottom" />
        </Section>

        <Section id="pkg-tooltip" className="parity-card--wide">
          <TooltipTrigger isOpen placement="right">
            <Button variant="secondary">Tooltip trigger</Button>
            <Tooltip variant="positive" showIcon>Persistent tooltip</Tooltip>
          </TooltipTrigger>
        </Section>

        <Section id="pkg-tree" className="parity-card--wide">
          <SimpleTree selectedKeys={selectedTreeAlpha} />
        </Section>

        <Section id="pkg-well">
          <Well>Well package parity fixture</Well>
        </Section>

        <Section id="pkg-s2" className="parity-card--wide parity-card--stack">
          <div className="parity-placeholder">S2 parity fixture placeholder (React S2 starter uses a separate Parcel config path).</div>
        </Section>

        <Section id="state-textfield-disabled" className="parity-card--input">
          <TextField label="Locked ticket" defaultValue="T-100" isDisabled />
        </Section>

        <Section id="state-searchfield-invalid" className="parity-card--input">
          <SearchField label="Search query" defaultValue="react" validationState="invalid" errorMessage="No matching issues found" />
        </Section>

        <Section id="state-searchfield-focus" className="parity-card--input">
          <div data-parity-target="searchfield-focus-target" style={{width: '100%'}}>
            <SearchField label="Focused search" defaultValue="focus me" />
          </div>
        </Section>

        <Section id="state-numberfield-invalid" className="parity-card--input">
          <NumberField label="Estimate" defaultValue={999} validationState="invalid" errorMessage="Estimate exceeds limit" />
        </Section>

        <Section id="state-slider-disabled" className="parity-card--stack">
          <Slider label="Disabled slider" defaultValue={42} isDisabled />
        </Section>

        <Section id="state-radio-disabled" className="parity-card--stack">
          <RadioGroup label="Disabled radio group" defaultValue="Vue" isDisabled orientation="horizontal">
            <Radio value="Vue">Vue</Radio>
            <Radio value="React">React</Radio>
            <Radio value="Svelte">Svelte</Radio>
          </RadioGroup>
        </Section>

        <Section id="state-tabs-disabled" className="parity-card--wide">
          <Tabs aria-label="Disabled tabs fixture" disabledKeys={['history']}>
            <Item key="summary" title="Summary">Summary tab</Item>
            <Item key="history" title="History">History tab</Item>
            <Item key="activity" title="Activity">Activity tab</Item>
          </Tabs>
        </Section>

        <Section id="state-picker-disabled" className="parity-card--input">
          <Picker label="Disabled picker" isDisabled selectedKeys={selectedQ3Key}>
            {pickerItems.map((item) => <Item key={item}>{item}</Item>)}
          </Picker>
        </Section>

        <Section id="state-dropzone-over">
          <DropZone isFilled replaceMessage="Hovering drop target">
            <Text>Hovering drop target</Text>
          </DropZone>
        </Section>

        <Section id="state-tree-selection" className="parity-card--wide">
          <SimpleTree selectedKeys={selectedTreeBeta} />
        </Section>

        <Section id="async-collection-cluster" className="parity-card--wide parity-card--stack">
          <Text>Async loading snapshot</Text>
          <ProgressBar label="Loading backlog" value={35} />
          <div className="parity-placeholder">Table loading state placeholder</div>
        </Section>

        <Section id="virtualized-collection-cluster" className="parity-card--wide parity-card--stack">
          <div className="parity-scroll-frame">
            <ListView aria-label="Scrollable list viewport" selectionMode="single" selectedKeys={new Set(['Item 8'])}>
              {virtualListItems.map((item) => <Item key={item}>{item}</Item>)}
            </ListView>
          </div>
          <div className="parity-scroll-frame">
            <SimpleTable rows={virtualRows} selectedKeys={new Set(['T-207'])} />
          </div>
          <div className="parity-scroll-frame">
            <TreeView aria-label="Virtualized tree" selectionMode="single" selectedKeys={selectedVirtualTree}>
              <TreeViewItem id="node-1" textValue="Node 1">
                <TreeViewItemContent>Node 1</TreeViewItemContent>
                <TreeViewItem id="node-2" textValue="Node 2"><TreeViewItemContent>Node 2</TreeViewItemContent></TreeViewItem>
                <TreeViewItem id="node-3" textValue="Node 3"><TreeViewItemContent>Node 3</TreeViewItemContent></TreeViewItem>
              </TreeViewItem>
              <TreeViewItem id="node-4" textValue="Node 4">
                <TreeViewItemContent>Node 4</TreeViewItemContent>
                <TreeViewItem id="node-5" textValue="Node 5"><TreeViewItemContent>Node 5</TreeViewItemContent></TreeViewItem>
                <TreeViewItem id="node-6" textValue="Node 6"><TreeViewItemContent>Node 6</TreeViewItemContent></TreeViewItem>
                <TreeViewItem id="node-7" textValue="Node 7"><TreeViewItemContent>Node 7</TreeViewItemContent></TreeViewItem>
              </TreeViewItem>
            </TreeView>
          </div>
        </Section>

        <Section id="dnd-state-cluster" className="parity-card--wide">
          <div className="parity-dnd-cluster">
            <DropZone isFilled replaceMessage="Drop target (over)">
              <Text>Drop target (over)</Text>
            </DropZone>
            <DropZone isDisabled>
              <Text>Drop target (disabled)</Text>
            </DropZone>
            <div className="parity-placeholder">Dnd drop target placeholder</div>
          </div>
        </Section>
      </main>
    </Provider>
  );
}
