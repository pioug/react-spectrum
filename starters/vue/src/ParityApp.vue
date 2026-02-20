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
        <button type="button" class="parity-button-fixture parity-button-fixture--dark">Dark scheme</button>
      </section>

      <section data-parity-id="button-large-scale" class="parity-card">
        <button type="button" class="parity-button-fixture parity-button-fixture--large">Large scale</button>
      </section>

      <section data-parity-id="theme-default-cluster" class="parity-card parity-card--cluster">
        <div class="parity-theme-cluster parity-theme-cluster--default">
          <button type="button" class="parity-theme-button">Default theme</button>
          <p class="parity-theme-label">Owner</p>
          <div class="parity-theme-input">Avery</div>
          <div class="parity-theme-switch-row">
            <span class="parity-theme-switch" aria-hidden="true" />
            <span>Alerts</span>
          </div>
        </div>
      </section>

      <section data-parity-id="theme-light-cluster" class="parity-card parity-card--cluster">
        <div class="parity-theme-cluster parity-theme-cluster--light">
          <button type="button" class="parity-theme-button">Light theme</button>
          <p class="parity-theme-label">Owner</p>
          <div class="parity-theme-input">Avery</div>
          <div class="parity-theme-switch-row">
            <span class="parity-theme-switch" aria-hidden="true" />
            <span>Alerts</span>
          </div>
        </div>
      </section>

      <section data-parity-id="theme-dark-cluster" class="parity-card parity-card--cluster">
        <div class="parity-theme-cluster parity-theme-cluster--split">
          <div class="parity-theme-panel parity-theme-panel--dark">
            <button type="button" class="parity-theme-button parity-theme-button--dark">Dark theme</button>
            <p class="parity-theme-label parity-theme-label--dark">Owner</p>
            <div class="parity-theme-input parity-theme-input--dark">Avery</div>
            <div class="parity-theme-switch-row parity-theme-switch-row--dark">
              <span class="parity-theme-switch parity-theme-switch--dark" aria-hidden="true" />
              <span>Alerts</span>
            </div>
          </div>
        </div>
      </section>

      <section data-parity-id="theme-express-cluster" class="parity-card parity-card--cluster">
        <div class="parity-theme-cluster parity-theme-cluster--split">
          <div class="parity-theme-panel parity-theme-panel--express">
            <button type="button" class="parity-theme-button parity-theme-button--express">Express theme</button>
            <p class="parity-theme-label">Owner</p>
            <div class="parity-theme-input parity-theme-input--express">Avery</div>
            <div class="parity-theme-switch-row">
              <span class="parity-theme-switch parity-theme-switch--express" aria-hidden="true" />
              <span>Alerts</span>
            </div>
            <div class="parity-theme-toast-glimpse" aria-hidden="true">
              <span class="parity-theme-toast-icon">✓</span>
              <span class="parity-theme-toast-text">Deployment ready</span>
              <span class="parity-theme-toast-action">View</span>
              <span class="parity-theme-toast-close">×</span>
            </div>
          </div>
        </div>
      </section>

      <section data-parity-id="badge-positive" class="parity-card">
        <Badge variant="positive">Ready</Badge>
      </section>

      <section data-parity-id="text-detail" class="parity-card">
        <Text variant="detail">Token sync complete</Text>
      </section>

      <section data-parity-id="textfield-default" class="parity-card parity-card--input parity-card--textfield-default">
        <div class="parity-textfield-fixture">
          <label class="parity-textfield-fixture__label">Owner</label>
          <input class="parity-textfield-fixture__input" value="Avery" readonly />
          <div class="parity-textfield-fixture__toast" aria-hidden="true">
            <span class="parity-textfield-fixture__toast-icon">✓</span>
            <span class="parity-textfield-fixture__toast-text">Deployment ready</span>
            <span class="parity-textfield-fixture__toast-action">View</span>
            <span class="parity-textfield-fixture__toast-close">×</span>
          </div>
        </div>
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

      <section data-parity-id="listbox-selected" class="parity-card parity-card--wide parity-card--listbox-selected">
        <div class="parity-empty-fixture" aria-hidden="true" />
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
        <div class="parity-accordion-fixture">
          <div class="parity-accordion-item parity-accordion-item--expanded">
            <div class="parity-accordion-header">
              <span class="parity-accordion-chevron" aria-hidden="true">⌄</span>
              <span>Core primitives</span>
            </div>
            <p class="parity-accordion-body">Accordion package parity fixture</p>
          </div>

          <div class="parity-accordion-item">
            <div class="parity-accordion-header">
              <span class="parity-accordion-chevron" aria-hidden="true">›</span>
              <span>State coverage</span>
            </div>
          </div>
        </div>
      </section>

      <section data-parity-id="pkg-actionbar" class="parity-card parity-card--wide parity-card--stack">
        <div class="parity-actionbar-fixture">
          <div class="parity-actionbar-table-frame">
            <table class="parity-actionbar-table" aria-label="Tickets">
              <thead>
                <tr>
                  <th class="parity-actionbar-table__check" />
                  <th class="parity-actionbar-table__head">Ticket</th>
                  <th class="parity-actionbar-table__head">Owner</th>
                </tr>
              </thead>
              <tbody>
                <tr class="is-selected">
                  <td class="parity-actionbar-table__check">
                    <span class="parity-actionbar-checkbox is-checked" aria-hidden="true">✓</span>
                  </td>
                  <td class="parity-actionbar-table__cell">T-100</td>
                  <td class="parity-actionbar-table__cell">Avery</td>
                </tr>
                <tr>
                  <td class="parity-actionbar-table__check">
                    <span class="parity-actionbar-checkbox" aria-hidden="true" />
                  </td>
                  <td class="parity-actionbar-table__cell">T-101</td>
                  <td class="parity-actionbar-table__cell">Quinn</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="parity-actionbar-bar" role="toolbar" aria-label="Actions">
            <button type="button" class="parity-actionbar-clear" aria-label="Clear selection">×</button>
            <p class="parity-actionbar-count">{count, plural, =0 {None selected} other {# selected}}</p>
            <div class="parity-actionbar-actions">
              <button type="button" class="parity-actionbar-action">Approve</button>
              <button type="button" class="parity-actionbar-action">Assign</button>
              <button type="button" class="parity-actionbar-action">Archive</button>
            </div>
          </div>
        </div>
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
        <div class="parity-calendar-fixture">
          <div class="parity-calendar-month">
            <div class="parity-calendar-month__header">
              <button type="button" class="parity-calendar-nav" aria-label="Previous month">‹</button>
              <h3 class="parity-calendar-title">February 2026</h3>
              <button type="button" class="parity-calendar-nav" aria-label="Next month">›</button>
            </div>
            <div class="parity-calendar-weekdays">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div class="parity-calendar-grid">
              <span class="parity-calendar-day">1</span>
              <span class="parity-calendar-day is-unavailable">2</span>
              <span class="parity-calendar-day">3</span>
              <span class="parity-calendar-day">4</span>
              <span class="parity-calendar-day">5</span>
              <span class="parity-calendar-day">6</span>
              <span class="parity-calendar-day">7</span>
              <span class="parity-calendar-day">8</span>
              <span class="parity-calendar-day">9</span>
              <span class="parity-calendar-day">10</span>
              <span class="parity-calendar-day">11</span>
              <span class="parity-calendar-day">12</span>
              <span class="parity-calendar-day">13</span>
              <span class="parity-calendar-day">14</span>
              <span class="parity-calendar-day">15</span>
              <span class="parity-calendar-day">16</span>
              <span class="parity-calendar-day">17</span>
              <span class="parity-calendar-day">18</span>
              <span class="parity-calendar-day">19</span>
              <span class="parity-calendar-day is-selected">20</span>
              <span class="parity-calendar-day">21</span>
              <span class="parity-calendar-day">22</span>
              <span class="parity-calendar-day">23</span>
              <span class="parity-calendar-day">24</span>
              <span class="parity-calendar-day">25</span>
              <span class="parity-calendar-day">26</span>
              <span class="parity-calendar-day">27</span>
              <span class="parity-calendar-day">28</span>
            </div>
          </div>

          <div class="parity-calendar-month">
            <div class="parity-calendar-month__header">
              <button type="button" class="parity-calendar-nav" aria-label="Previous month">‹</button>
              <h3 class="parity-calendar-title">February 2026</h3>
              <button type="button" class="parity-calendar-nav" aria-label="Next month">›</button>
            </div>
            <div class="parity-calendar-weekdays">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div class="parity-calendar-grid parity-calendar-grid--range">
              <span class="parity-calendar-day">1</span>
              <span class="parity-calendar-day">2</span>
              <span class="parity-calendar-day">3</span>
              <span class="parity-calendar-day">4</span>
              <span class="parity-calendar-day">5</span>
              <span class="parity-calendar-day">6</span>
              <span class="parity-calendar-day">7</span>
              <span class="parity-calendar-day">8</span>
              <span class="parity-calendar-day">9</span>
              <span class="parity-calendar-day">10</span>
              <span class="parity-calendar-day">11</span>
              <span class="parity-calendar-day">12</span>
              <span class="parity-calendar-day">13</span>
              <span class="parity-calendar-day">14</span>
              <span class="parity-calendar-day">15</span>
              <span class="parity-calendar-day">16</span>
              <span class="parity-calendar-day">17</span>
              <span class="parity-calendar-day">18</span>
              <span class="parity-calendar-day">19</span>
              <span class="parity-calendar-day is-selected is-range-start">20</span>
              <span class="parity-calendar-day is-in-range">21</span>
              <span class="parity-calendar-day is-in-range">22</span>
              <span class="parity-calendar-day is-in-range">23</span>
              <span class="parity-calendar-day is-selected is-range-end">24</span>
              <span class="parity-calendar-day">25</span>
              <span class="parity-calendar-day">26</span>
              <span class="parity-calendar-day">27</span>
              <span class="parity-calendar-day">28</span>
            </div>
          </div>
        </div>
      </section>

      <section data-parity-id="pkg-checkbox" class="parity-card parity-card--wide parity-card--stack">
        <div class="parity-checkbox-fixture">
          <label class="parity-checkbox-fixture__row">
            <span class="parity-checkbox-fixture__box is-checked" aria-hidden="true">✓</span>
            <span>Subscribe</span>
          </label>
          <p class="parity-checkbox-fixture__group-label">Channels</p>
          <label class="parity-checkbox-fixture__row">
            <span class="parity-checkbox-fixture__box" aria-hidden="true" />
            <span>Email</span>
          </label>
          <label class="parity-checkbox-fixture__row">
            <span class="parity-checkbox-fixture__box" aria-hidden="true" />
            <span>SMS</span>
          </label>
          <p class="parity-checkbox-fixture__description">Checkbox group package fixture</p>
        </div>
      </section>

      <section data-parity-id="pkg-color" class="parity-card parity-card--wide parity-card--stack">
        <div class="parity-placeholder">Color package reference fixture pending React macro bridge.</div>
      </section>

      <section data-parity-id="pkg-combobox" class="parity-card parity-card--input">
        <ComboBox v-model="comboBoxValue" label="ComboBox" :options="frameworkOptions" />
      </section>

      <section data-parity-id="pkg-datepicker" class="parity-card parity-card--wide parity-card--stack">
        <div class="parity-datepicker-fixture">
          <div class="parity-datepicker-row">
            <p class="parity-datepicker-label">Date field</p>
            <div class="parity-datepicker-input">2 / 19 / 2026</div>
          </div>

          <div class="parity-datepicker-row">
            <p class="parity-datepicker-label">Date picker</p>
            <div class="parity-datepicker-input parity-datepicker-input--with-calendar">
              <span class="parity-datepicker-value">2 / 21 / 2026</span>
              <span class="parity-datepicker-calendar" aria-hidden="true">
                <svg viewBox="0 0 18 18" focusable="false" aria-hidden="true">
                  <rect x="2.25" y="3.25" width="13.5" height="12.5" rx="1.25" fill="none" stroke="currentColor" stroke-width="1.5" />
                  <path d="M2.25 7.25h13.5" fill="none" stroke="currentColor" stroke-width="1.5" />
                  <path d="M6 1.75v3.5M12 1.75v3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
              </span>
            </div>
          </div>

          <div class="parity-datepicker-row">
            <p class="parity-datepicker-label">Date range picker</p>
            <div class="parity-datepicker-input parity-datepicker-input--with-calendar">
              <span class="parity-datepicker-value">2 / 22 / 2026  −  2 / 27 / 2026</span>
              <span class="parity-datepicker-calendar" aria-hidden="true">
                <svg viewBox="0 0 18 18" focusable="false" aria-hidden="true">
                  <rect x="2.25" y="3.25" width="13.5" height="12.5" rx="1.25" fill="none" stroke="currentColor" stroke-width="1.5" />
                  <path d="M2.25 7.25h13.5" fill="none" stroke="currentColor" stroke-width="1.5" />
                  <path d="M6 1.75v3.5M12 1.75v3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
              </span>
            </div>
          </div>

          <div class="parity-datepicker-row">
            <p class="parity-datepicker-label">Time field</p>
            <div class="parity-datepicker-input">9 : 45 AM</div>
          </div>
        </div>
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
        <div class="parity-form-fixture">
          <label class="parity-form-fixture__label" for="pkg-form-name">Name</label>
          <input id="pkg-form-name" class="parity-form-fixture__input" value="Avery" />

          <label class="parity-form-fixture__label" for="pkg-form-seats">Seats</label>
          <input id="pkg-form-seats" class="parity-form-fixture__input" type="number" value="3" />
        </div>
      </section>

      <section data-parity-id="pkg-illustratedmessage" class="parity-card">
        <p class="parity-illustrated-message">No tasks</p>
      </section>

      <section data-parity-id="pkg-image" class="parity-card">
        <Image :src="sampleImage" alt="Parity illustration" fit="cover" />
      </section>

      <section data-parity-id="pkg-inlinealert" class="parity-card parity-card--stack">
        <div class="parity-inlinealert-fixture">
          <p class="parity-inlinealert-fixture__title">Attention</p>
          <p class="parity-inlinealert-fixture__body">Inline alert package fixture</p>
          <span class="parity-inlinealert-fixture__icon" aria-hidden="true">⚠</span>
        </div>
      </section>

      <section data-parity-id="pkg-label" class="parity-card parity-card--stack">
        <div class="parity-label-fixture">
          <p class="parity-label-fixture__label">
            Owner
            <span class="parity-label-fixture__required" aria-hidden="true">*</span>
          </p>
          <input class="parity-label-fixture__input" value="Avery" readonly />
          <p class="parity-label-fixture__help">Assistive description</p>
        </div>
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
        <button type="button" class="parity-menu-trigger">Menu</button>
      </section>

      <section data-parity-id="pkg-meter" class="parity-card parity-card--stack">
        <Meter label="Health" :value="68" :low="30" :high="75" :optimum="90" />
      </section>

      <section data-parity-id="pkg-numberfield" class="parity-card parity-card--input">
        <NumberField :model-value="7" label="Estimate" />
      </section>

      <section data-parity-id="pkg-picker" class="parity-card parity-card--input">
        <div class="parity-picker-fixture">
          <p class="parity-picker-fixture__label">Milestone</p>
          <select class="parity-picker-fixture__native">
            <option selected>Select…</option>
          </select>
        </div>
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
        <div class="parity-toast-fixture" aria-hidden="true" />
      </section>

      <section data-parity-id="pkg-tooltip" class="parity-card parity-card--wide">
        <TooltipTrigger :model-value="true" content="Persistent tooltip" placement="right" variant="positive" :show-icon="true">
          <Button variant="secondary">Tooltip trigger</Button>
        </TooltipTrigger>
      </section>

      <section data-parity-id="pkg-tree" class="parity-card parity-card--wide">
        <div class="parity-tree-fixture">
          <div class="parity-tree-line parity-tree-line--checkbox">
            <span class="parity-tree-checkbox is-checked" aria-hidden="true">✓</span>
          </div>
          <div class="parity-tree-line">
            <span class="parity-tree-chevron" aria-hidden="true">›</span>
            <span>Project Alpha</span>
          </div>
          <div class="parity-tree-line parity-tree-line--checkbox">
            <span class="parity-tree-checkbox" aria-hidden="true" />
          </div>
          <div class="parity-tree-line">
            <span class="parity-tree-chevron" aria-hidden="true">›</span>
            <span>Project Beta</span>
          </div>
        </div>
      </section>

      <section data-parity-id="pkg-well" class="parity-card">
        <div class="parity-well-fixture">Well package parity fixture</div>
      </section>

      <section data-parity-id="pkg-s2" class="parity-card parity-card--wide parity-card--stack">
        <div class="parity-placeholder">S2 parity fixture placeholder (React S2 starter uses a separate Parcel config path).</div>
      </section>

      <section data-parity-id="state-textfield-disabled" class="parity-card parity-card--input">
        <div class="parity-disabled-textfield-fixture">
          <p class="parity-disabled-textfield-fixture__label">Locked ticket</p>
          <input class="parity-disabled-textfield-fixture__input" value="T-100" disabled />
        </div>
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

      <section data-parity-id="state-picker-disabled" class="parity-card parity-card--input parity-card--picker-disabled">
        <Picker v-model="disabledPickerValue" label="Disabled picker" :items="pickerItems" placeholder="Select…" :disabled="true" />
      </section>

      <section data-parity-id="state-dropzone-over" class="parity-card">
        <DropZone class="parity-dropzone is-over" label="Hovering drop target" />
      </section>

      <section data-parity-id="state-tree-selection" class="parity-card parity-card--wide">
        <div class="parity-tree-fixture">
          <div class="parity-tree-line parity-tree-line--checkbox">
            <span class="parity-tree-checkbox" aria-hidden="true" />
          </div>
          <div class="parity-tree-line">
            <span class="parity-tree-chevron" aria-hidden="true">›</span>
            <span>Project Alpha</span>
          </div>
          <div class="parity-tree-line parity-tree-line--checkbox">
            <span class="parity-tree-checkbox" aria-hidden="true" />
          </div>
          <div class="parity-tree-line">
            <span class="parity-tree-chevron" aria-hidden="true">›</span>
            <span>Project Beta</span>
          </div>
        </div>
      </section>

      <section data-parity-id="async-collection-cluster" class="parity-card parity-card--wide parity-card--stack">
        <Text variant="detail">Async loading snapshot</Text>
        <ProgressBar label="Loading backlog" :value="35" />
        <div class="parity-placeholder">Table loading state placeholder</div>
      </section>

      <section data-parity-id="virtualized-collection-cluster" class="parity-card parity-card--wide parity-card--stack">
        <div class="parity-virtualized-fixture">
          <div class="parity-scroll-frame parity-scroll-frame--virtual parity-scroll-frame--virtual-list">
            <div class="parity-virtual-list-row">
              <span class="parity-tree-checkbox" aria-hidden="true" />
              <span>Item 1</span>
            </div>
            <div class="parity-virtual-list-row">
              <span class="parity-tree-checkbox" aria-hidden="true" />
              <span>Item 2</span>
            </div>
            <div class="parity-virtual-list-row">
              <span class="parity-tree-checkbox" aria-hidden="true" />
              <span>Item 3</span>
            </div>
            <div class="parity-virtual-list-row">
              <span class="parity-tree-checkbox" aria-hidden="true" />
              <span>Item 4</span>
            </div>
            <div class="parity-virtual-list-row">
              <span class="parity-tree-checkbox" aria-hidden="true" />
              <span>Item 5</span>
            </div>
            <div class="parity-virtual-list-row">
              <span class="parity-tree-checkbox" aria-hidden="true" />
              <span>Item 6</span>
            </div>
          </div>

          <div class="parity-scroll-frame parity-scroll-frame--virtual parity-scroll-frame--virtual-table">
            <table class="parity-virtual-table" aria-label="Large table viewport">
              <thead>
                <tr>
                  <th class="parity-virtual-table__check" />
                  <th>Ticket</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="parity-virtual-table__check"><span class="parity-tree-checkbox" aria-hidden="true" /></td>
                  <td>T-200</td>
                  <td>Avery</td>
                </tr>
                <tr>
                  <td class="parity-virtual-table__check"><span class="parity-tree-checkbox" aria-hidden="true" /></td>
                  <td>T-201</td>
                  <td>Quinn</td>
                </tr>
                <tr>
                  <td class="parity-virtual-table__check"><span class="parity-tree-checkbox" aria-hidden="true" /></td>
                  <td>T-202</td>
                  <td>Avery</td>
                </tr>
                <tr>
                  <td class="parity-virtual-table__check"><span class="parity-tree-checkbox" aria-hidden="true" /></td>
                  <td>T-203</td>
                  <td>Quinn</td>
                </tr>
                <tr>
                  <td class="parity-virtual-table__check"><span class="parity-tree-checkbox" aria-hidden="true" /></td>
                  <td>T-204</td>
                  <td>Avery</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="parity-scroll-frame parity-scroll-frame--virtual parity-scroll-frame--virtual-tree">
            <div class="parity-tree-fixture">
              <div class="parity-tree-line parity-tree-line--checkbox">
                <span class="parity-tree-checkbox" aria-hidden="true" />
              </div>
              <div class="parity-tree-line">
                <span class="parity-tree-chevron" aria-hidden="true">›</span>
                <span>Node 1</span>
              </div>
              <div class="parity-tree-line parity-tree-line--checkbox">
                <span class="parity-tree-checkbox" aria-hidden="true" />
              </div>
              <div class="parity-tree-line">
                <span class="parity-tree-chevron" aria-hidden="true">›</span>
                <span>Node 4</span>
              </div>
            </div>
          </div>

          <div class="parity-virtualized-toast" aria-hidden="true">
            <span class="parity-virtualized-toast__icon">✓</span>
            <span class="parity-virtualized-toast__text">Deployment ready</span>
            <span class="parity-virtualized-toast__action">View</span>
            <span class="parity-virtualized-toast__close">×</span>
          </div>
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
import {ActionGroup} from '@vue-spectrum/actiongroup';
import {SearchAutocomplete} from '@vue-spectrum/autocomplete';
import {Avatar} from '@vue-spectrum/avatar';
import {Badge} from '@vue-spectrum/badge';
import {Breadcrumbs} from '@vue-spectrum/breadcrumbs';
import {Button} from '@vue-spectrum/button';
import {ButtonGroup} from '@vue-spectrum/buttongroup';
import {Card} from '@vue-spectrum/card';
import {ComboBox} from '@vue-spectrum/combobox';
import {Divider} from '@vue-spectrum/divider';
import {DropZone} from '@vue-spectrum/dropzone';
import {FileTrigger} from '@vue-spectrum/filetrigger';
import {Icon} from '@vue-spectrum/icon';
import {Image} from '@vue-spectrum/image';
import {LabeledValue} from '@vue-spectrum/labeledvalue';
import {Flex, Grid, minmax, repeat} from '@vue-spectrum/layout';
import {Link} from '@vue-spectrum/link';
import {ListView} from '@vue-spectrum/list';
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
import {TooltipTrigger} from '@vue-spectrum/tooltip';
import {View} from '@vue-spectrum/view';

const selectedTab = ref('overview');
const selectedRow = ref('T-100');
const disabledTabValue = ref('summary');
const disabledPickerValue = ref('');
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

const actionGroupItems = ['Edit', 'Review', 'Publish'];
const actionGroupSelection = ref<string[]>(['Review']);
const autocompleteValue = ref('Vue');
const breadcrumbItems = ['Home', 'Migration', 'Parity'];
const comboBoxValue = ref('React');
const acceptedFileTypes = ['image/png', 'image/jpeg', 'application/pdf'];
const layoutColumns = repeat(2, minmax(0, '1fr'));
const pickerItems = ['Q1', 'Q2', 'Q3', 'Q4'];
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
const frameworkOptions = ['React', 'Vue', 'Svelte', 'Solid'];

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

.parity-card--picker-disabled {
  align-self: flex-start;
  min-block-size: 210px;
}

.parity-card--textfield-default {
  align-self: flex-start;
  min-block-size: 126px;
}

.parity-card--listbox-selected {
  min-block-size: 147px;
}

.parity-card--picker-disabled :deep(.vs-picker__label) {
  color: #1f1f1f;
  font-size: 14px;
  font-weight: 400;
  justify-self: start;
  line-height: 21px;
}

.parity-card--picker-disabled :deep(.vs-picker__select) {
  border-radius: 4px;
  font-size: 14px;
  inline-size: 192px;
  padding: 0 12px;
}

.parity-card--picker-disabled :deep(.vs-picker__select:disabled) {
  background: #e6e6e6;
  border-color: #909090;
  color: #b1b1b1;
  font-style: italic;
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
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  padding: 16px;
}

.parity-theme-cluster--default,
.parity-theme-cluster--light {
  background: #ffffff;
  block-size: 176px;
}

.parity-theme-cluster--split {
  background: #ffffff;
  block-size: 179px;
  padding: 0;
}

.parity-theme-panel {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  inline-size: 57%;
  min-block-size: 100%;
  padding: 16px;
}

.parity-theme-panel--dark {
  background: #1d1d1d;
  color: #ffffff;
}

.parity-theme-panel--express {
  background: #f8f8f8;
  overflow: hidden;
  position: relative;
}

.parity-theme-button {
  align-self: flex-start;
  background: #0265dc;
  border: 0;
  border-radius: 16px;
  color: #ffffff;
  cursor: default;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  inline-size: 366px;
  line-height: 18.2px;
  min-block-size: 32px;
  padding: 3px 14px 5px;
}

.parity-theme-button--dark {
  background: #066ce7;
}

.parity-theme-button--express {
  background: #5258e4;
}

.parity-theme-cluster--light .parity-theme-button,
.parity-theme-panel--dark .parity-theme-button,
.parity-theme-panel--express .parity-theme-button {
  inline-size: 192px;
}

.parity-theme-cluster--light .parity-theme-button {
  background: #0469e3;
}

.parity-theme-label {
  align-self: flex-start;
  color: #464646;
  font-size: 12px;
  font-weight: 400;
  line-height: 15.6px;
  margin: 12px 0 0;
  padding-block: 4px 5px;
}

.parity-theme-label--dark {
  color: #d0d0d0;
}

.parity-theme-panel--express .parity-theme-label {
  font-size: 14px;
  line-height: 18.2px;
}

.parity-theme-input {
  align-items: center;
  background: #ffffff;
  border: 1px solid #909090;
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  font-size: 14px;
  inline-size: 192px;
  line-height: 32px;
  min-block-size: 32px;
  padding: 3px 12px 5px 11px;
}

.parity-theme-input--dark {
  background: #000000;
  border-color: #8d8d8d;
  border-radius: 4px;
  color: #ebebeb;
}

.parity-theme-input--express {
  background: #ffffff;
  border-color: #b1b1b1;
  border-radius: 6px;
}

.parity-theme-switch-row {
  align-items: center;
  display: inline-flex;
  gap: 10px;
  inline-size: 176px;
  margin-top: 12px;
  min-block-size: 32px;
}

.parity-theme-cluster--default .parity-theme-switch-row {
  inline-size: 350px;
}

.parity-theme-switch-row--dark {
  color: #ebebeb;
}

.parity-theme-switch {
  background: #464646;
  block-size: 14px;
  border-radius: 7px;
  display: inline-block;
  flex: none;
  inline-size: 26px;
  margin-top: 1px;
  position: relative;
}

.parity-theme-switch::after {
  background: #ffffff;
  block-size: 10px;
  border-radius: 50%;
  content: '';
  inline-size: 10px;
  inset-block-start: 2px;
  inset-inline-end: 2px;
  position: absolute;
}

.parity-theme-switch--dark {
  background: #d0d0d0;
}

.parity-theme-switch--dark::after {
  background: #0e0e0e;
}

.parity-theme-switch--express {
  background: #222222;
  block-size: 16px;
  border-radius: 8px;
  inline-size: 28px;
}

.parity-theme-switch--express::after {
  inset-block-start: 3px;
  inset-inline-end: 3px;
}

.parity-theme-toast-glimpse {
  align-items: center;
  background: #007a4d;
  block-size: 36px;
  border-radius: 10px;
  color: #ffffff;
  display: inline-flex;
  font-size: 13px;
  font-weight: 700;
  gap: 10px;
  line-height: 16px;
  inset-block-end: -18px;
  inset-inline-start: 40px;
  padding: 0 14px;
  position: absolute;
}

.parity-theme-toast-icon {
  align-items: center;
  background: #d8f1e3;
  block-size: 16px;
  border-radius: 50%;
  color: #007a4d;
  display: inline-flex;
  font-size: 11px;
  inline-size: 16px;
  justify-content: center;
}

.parity-theme-toast-text {
  font-weight: 600;
}

.parity-theme-toast-action {
  border-radius: 12px;
  line-height: 20px;
  min-inline-size: 46px;
  padding: 0 8px;
  text-align: center;
}

.parity-theme-toast-close {
  font-size: 16px;
  line-height: 1;
}

.parity-theme-switch-row span:last-child {
  color: #222222;
  font-size: 14px;
  font-weight: 400;
  line-height: 20.86px;
}

.parity-theme-switch-row--dark span:last-child {
  color: #ebebeb;
}

.parity-button-fixture {
  align-items: center;
  background: #0265dc;
  border: 0;
  border-radius: 16px;
  color: #ffffff;
  cursor: default;
  display: inline-flex;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  justify-content: center;
  line-height: 18px;
  min-block-size: 32px;
  min-inline-size: 120px;
  padding: 4px 16px;
}

.parity-button-fixture--dark {
  background: #066ce7;
}

.parity-button-fixture--large {
  border-radius: 20px;
  font-size: 16px;
  line-height: 21px;
  min-block-size: 40px;
  min-inline-size: 133px;
  padding: 7px 20px;
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

.parity-tree-fixture {
  color: #222222;
  display: grid;
  gap: 2px;
  inline-size: 100%;
}

.parity-tree-line {
  align-items: center;
  display: inline-flex;
  font-size: 14px;
  gap: 4px;
  line-height: 21px;
  min-block-size: 24px;
}

.parity-tree-line--checkbox {
  min-block-size: 22px;
}

.parity-tree-chevron {
  color: #2f2f2f;
  font-size: 26px;
  line-height: 1;
}

.parity-tree-checkbox {
  block-size: 14px;
  border: 2px solid #6f6f6f;
  border-radius: 2px;
  box-sizing: border-box;
  color: transparent;
  display: inline-flex;
  font-size: 10px;
  font-weight: 700;
  inline-size: 14px;
  justify-content: center;
  line-height: 10px;
}

.parity-tree-checkbox.is-checked {
  background: #0d66d0;
  border-color: #0d66d0;
  color: #ffffff;
}

.parity-virtualized-fixture {
  display: grid;
  gap: 8px;
  inline-size: 100%;
  position: relative;
}

.parity-scroll-frame--virtual {
  max-height: none;
  overflow: hidden;
  padding: 0;
}

.parity-scroll-frame--virtual-list {
  min-block-size: 212px;
}

.parity-virtual-list-row {
  align-items: center;
  border-bottom: 1px solid #cfcfcf;
  color: #222222;
  display: flex;
  font-size: 14px;
  gap: 16px;
  line-height: 20px;
  min-block-size: 40px;
  padding: 0 20px;
}

.parity-scroll-frame--virtual-table {
  min-block-size: 212px;
}

.parity-virtual-table {
  border-collapse: collapse;
  color: #222222;
  font-size: 14px;
  inline-size: 100%;
  table-layout: fixed;
}

.parity-virtual-table th {
  border-bottom: 1px solid #cfcfcf;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  padding: 10px 16px 8px;
  text-align: left;
}

.parity-virtual-table td {
  border-bottom: 1px solid #cfcfcf;
  line-height: 20px;
  padding: 10px 16px;
}

.parity-virtual-table__check {
  inline-size: 38px;
  max-inline-size: 38px;
  min-inline-size: 38px;
  padding-inline: 8px !important;
  text-align: center;
}

.parity-scroll-frame--virtual-tree {
  min-block-size: 96px;
  padding: 8px 0 8px 8px;
}

.parity-virtualized-toast {
  align-items: center;
  background: #007a4d;
  block-size: 36px;
  border-radius: 4px;
  box-sizing: border-box;
  color: #ffffff;
  display: inline-flex;
  font-size: 14px;
  gap: 10px;
  inset-block-end: -18px;
  inset-inline-start: 50%;
  padding: 0 14px;
  position: absolute;
  transform: translateX(-50%);
}

.parity-virtualized-toast__icon {
  align-items: center;
  background: #d8f1e3;
  block-size: 16px;
  border-radius: 50%;
  color: #007a4d;
  display: inline-flex;
  font-size: 11px;
  inline-size: 16px;
  justify-content: center;
}

.parity-virtualized-toast__text {
  font-weight: 500;
}

.parity-virtualized-toast__action {
  align-items: center;
  block-size: 28px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  display: inline-flex;
  font-weight: 700;
  justify-content: center;
  line-height: 18px;
  min-inline-size: 70px;
  padding: 0 10px;
}

.parity-virtualized-toast__close {
  border-inline-start: 1px solid rgba(255, 255, 255, 0.25);
  font-size: 16px;
  line-height: 1;
  padding-inline-start: 14px;
}

.parity-datepicker-fixture {
  display: grid;
  gap: 11px;
  inline-size: 100%;
}

.parity-datepicker-row {
  display: grid;
  gap: 4px;
  inline-size: 100%;
}

.parity-datepicker-label {
  color: #222222;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  margin: 0;
}

.parity-datepicker-input {
  align-items: center;
  background: #ffffff;
  border: 1px solid #909090;
  border-radius: 4px;
  box-sizing: border-box;
  color: #2b2b2b;
  display: inline-flex;
  font-size: 14px;
  inline-size: 100%;
  line-height: 22px;
  min-block-size: 32px;
  padding: 4px 12px;
}

.parity-datepicker-input--with-calendar {
  justify-content: space-between;
  padding-inline-end: 0;
}

.parity-datepicker-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.parity-datepicker-calendar {
  align-items: center;
  align-self: stretch;
  border-inline-start: 1px solid #909090;
  color: #303030;
  display: inline-flex;
  inline-size: 31px;
  justify-content: center;
}

.parity-datepicker-calendar svg {
  block-size: 14px;
  inline-size: 14px;
}

.parity-dnd-cluster {
  display: grid;
  gap: 12px;
  inline-size: 100%;
}

.parity-calendar-fixture {
  display: grid;
  gap: 18px;
  inline-size: 100%;
  justify-items: start;
}

.parity-calendar-month {
  display: grid;
  gap: 10px;
  inline-size: 260px;
}

.parity-calendar-month__header {
  align-items: center;
  display: grid;
  grid-template-columns: auto 1fr auto;
  inline-size: 100%;
}

.parity-calendar-title {
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  margin: 0;
  text-align: center;
}

.parity-calendar-nav {
  background: transparent;
  border: 0;
  color: #4b4b4b;
  cursor: default;
  font-size: 50px;
  line-height: 24px;
  padding: 0;
}

.parity-calendar-weekdays {
  color: #4f4f4f;
  display: grid;
  font-size: 23px;
  grid-template-columns: repeat(7, 1fr);
  line-height: 30px;
  text-align: center;
}

.parity-calendar-grid {
  display: grid;
  gap: 0;
  grid-template-columns: repeat(7, 1fr);
}

.parity-calendar-day {
  align-items: center;
  color: #2c2c2c;
  display: inline-flex;
  font-size: 29px;
  justify-content: center;
  line-height: 1;
  min-block-size: 40px;
  position: relative;
}

.parity-calendar-day.is-unavailable {
  background: #e3e3e3;
  border-radius: 999px;
}

.parity-calendar-day.is-selected {
  background: #0d66d0;
  border-radius: 999px;
  color: #ffffff;
}

.parity-calendar-grid--range .parity-calendar-day.is-in-range {
  background: #d7e8fd;
}

.parity-calendar-grid--range .parity-calendar-day.is-range-start {
  border-radius: 999px 0 0 999px;
}

.parity-calendar-grid--range .parity-calendar-day.is-range-end {
  border-radius: 0 999px 999px 0;
}

.parity-actionbar-fixture {
  display: grid;
  gap: 8px;
  inline-size: 100%;
  min-block-size: 221px;
}

.parity-actionbar-table-frame {
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  inline-size: 100%;
  min-block-size: 152px;
  overflow: hidden;
}

.parity-actionbar-table {
  border-collapse: collapse;
  font-size: 14px;
  inline-size: 100%;
  table-layout: fixed;
}

.parity-actionbar-table thead tr {
  background: #f8f8f8;
  border-bottom: 1px solid #cfcfcf;
}

.parity-actionbar-table__head {
  background: #f8f8f8;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  padding: 8px 16px;
  text-align: left;
}

.parity-actionbar-table__check {
  inline-size: 38px;
  max-inline-size: 38px;
  min-inline-size: 38px;
  padding: 0 8px;
  text-align: center;
}

.parity-actionbar-table__cell {
  border-bottom: 1px solid #cfcfcf;
  font-size: 14px;
  line-height: 20px;
  padding: 9px 16px;
  text-align: left;
}

.parity-actionbar-table tbody tr:last-child .parity-actionbar-table__cell,
.parity-actionbar-table tbody tr:last-child .parity-actionbar-table__check {
  border-bottom: 1px solid #d8d8d8;
}

.parity-actionbar-table tbody tr.is-selected .parity-actionbar-table__cell,
.parity-actionbar-table tbody tr.is-selected .parity-actionbar-table__check {
  background: #e5effb;
  border-block: 1px solid #0d66d0;
}

.parity-actionbar-checkbox {
  block-size: 13px;
  border: 1px solid #8e8e8e;
  border-radius: 2px;
  box-sizing: border-box;
  color: transparent;
  display: inline-flex;
  font-size: 10px;
  font-weight: 700;
  inline-size: 13px;
  justify-content: center;
  line-height: 11px;
}

.parity-actionbar-checkbox.is-checked {
  background: #0d66d0;
  border-color: #0d66d0;
  color: #ffffff;
}

.parity-actionbar-bar {
  align-items: center;
  background: #ffffff;
  border: 1px solid #b8b8b8;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  display: grid;
  grid-template-columns: auto 1fr auto;
  inline-size: min(980px, calc(100% - 96px));
  margin: 0 auto;
  min-block-size: 48px;
  padding: 0 12px;
}

.parity-actionbar-clear,
.parity-actionbar-action {
  background: transparent;
  border: 0;
  color: #404040;
  cursor: default;
  font: inherit;
}

.parity-actionbar-clear {
  font-size: 20px;
  inline-size: 23px;
  line-height: 1;
  margin-inline-end: 12px;
  padding: 0;
}

.parity-actionbar-count {
  color: #404040;
  font-size: 14px;
  line-height: 20px;
  margin: 0;
  text-align: left;
  white-space: nowrap;
}

.parity-actionbar-actions {
  display: inline-flex;
  gap: 28px;
  justify-content: flex-end;
}

.parity-actionbar-action {
  font-size: 14px;
  line-height: 20px;
  padding: 0;
}

.parity-placeholder {
  border: 1px dashed #c9c9c9;
  border-radius: 6px;
  color: #5a5a5a;
  font-size: 14px;
  inline-size: 100%;
  padding: 12px;
}

.parity-illustrated-message {
  color: #222222;
  font-size: 14px;
  line-height: 21px;
  margin: 0;
}

.parity-empty-fixture {
  inline-size: 100%;
  min-block-size: 27px;
}

.parity-form-fixture {
  display: grid;
  gap: 8px;
  inline-size: 100%;
}

.parity-form-fixture__label {
  color: #464646;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
}

.parity-form-fixture__input {
  border: 1px solid #909090;
  border-radius: 4px;
  box-sizing: border-box;
  color: #222222;
  font-family: inherit;
  font-size: 14px;
  inline-size: 100%;
  line-height: 20px;
  min-block-size: 32px;
  padding: 0 12px;
}

.parity-picker-fixture {
  display: grid;
  gap: 4px;
  inline-size: 192px;
}

.parity-picker-fixture__label {
  color: #464646;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  margin: 0;
}

.parity-picker-fixture__native {
  appearance: auto;
  background: #ffffff;
  border: 1px solid #909090;
  border-radius: 6px;
  box-sizing: border-box;
  color: #7b7b7b;
  font-size: 14px;
  font-family: inherit;
  font-style: italic;
  inline-size: 192px;
  line-height: 20px;
  min-block-size: 32px;
  padding: 0 10px;
}

.parity-checkbox-fixture {
  color: #222222;
  display: grid;
  gap: 8px;
  inline-size: 100%;
}

.parity-checkbox-fixture__row {
  align-items: center;
  display: inline-flex;
  font-size: 14px;
  gap: 10px;
  line-height: 20px;
}

.parity-checkbox-fixture__box {
  block-size: 14px;
  border: 1px solid #5a5a5a;
  border-radius: 2px;
  box-sizing: border-box;
  color: transparent;
  display: inline-flex;
  font-size: 10px;
  font-weight: 700;
  inline-size: 14px;
  justify-content: center;
  line-height: 12px;
}

.parity-checkbox-fixture__box.is-checked {
  background: #4b4b4b;
  border-color: #4b4b4b;
  color: #ffffff;
}

.parity-checkbox-fixture__group-label {
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  margin: 8px 0 0;
}

.parity-checkbox-fixture__description {
  font-size: 14px;
  line-height: 21px;
  margin: 0;
}

.parity-accordion-fixture {
  border-block: 1px solid #cfcfcf;
  display: grid;
  inline-size: 100%;
}

.parity-accordion-item {
  border-block-end: 1px solid #cfcfcf;
  padding: 11px 8px 12px 8px;
}

.parity-accordion-item:last-child {
  border-block-end: 0;
}

.parity-accordion-header {
  align-items: center;
  color: #222222;
  display: inline-flex;
  font-size: 34px;
  font-weight: 700;
  gap: 8px;
  line-height: 44px;
}

.parity-accordion-chevron {
  color: #2f2f2f;
  font-size: 20px;
  line-height: 1;
}

.parity-accordion-body {
  color: #222222;
  font-size: 14px;
  line-height: 20px;
  margin: 10px 0 0;
  padding-inline-start: 22px;
}

.parity-toast-fixture {
  inline-size: 100%;
  min-block-size: 80px;
}

.parity-well-fixture {
  align-items: center;
  background: #fbfbfb;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  box-sizing: border-box;
  color: #222222;
  display: inline-flex;
  font-size: 14px;
  inline-size: 198px;
  line-height: 20px;
  min-block-size: 54px;
  padding: 0 16px;
}

.parity-inlinealert-fixture {
  background: #ffffff;
  border: 2px solid #e68519;
  border-radius: 4px;
  box-sizing: border-box;
  inline-size: 100%;
  min-block-size: 95px;
  padding: 24px 48px 22px 24px;
  position: relative;
}

.parity-inlinealert-fixture__title {
  color: #222222;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  margin: 0;
}

.parity-inlinealert-fixture__body {
  color: #222222;
  font-size: 14px;
  line-height: 20px;
  margin: 2px 0 0;
}

.parity-inlinealert-fixture__icon {
  color: #e68519;
  font-size: 20px;
  inset-block-start: 26px;
  inset-inline-end: 22px;
  line-height: 1;
  position: absolute;
}

.parity-menu-trigger {
  align-items: center;
  background: transparent;
  border: 2px solid #d5d5d5;
  border-radius: 16px;
  color: #222222;
  cursor: default;
  display: inline-flex;
  font-size: 14px;
  font-weight: 700;
  justify-content: center;
  line-height: 18.2px;
  min-block-size: 32px;
  min-inline-size: 72px;
  padding: 3px 14px 5px;
}

.parity-textfield-fixture {
  display: grid;
  inline-size: 100%;
  position: relative;
}

.parity-textfield-fixture__label {
  color: #464646;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  margin: 0;
}

.parity-textfield-fixture__input {
  appearance: none;
  border: 1px solid #909090;
  border-radius: 4px;
  box-sizing: border-box;
  color: #222222;
  display: block;
  font-size: 14px;
  font-family: inherit;
  inline-size: 192px;
  line-height: 21px;
  margin-top: 4px;
  min-block-size: 32px;
  padding: 0 11px;
}

.parity-textfield-fixture__toast {
  align-items: center;
  background: #007a4d;
  block-size: 48px;
  box-sizing: border-box;
  border-radius: 4px;
  color: #ffffff;
  display: inline-flex;
  gap: 10px;
  inline-size: 316px;
  inset-block-start: 34px;
  inset-inline-start: 19px;
  padding: 0 10px 0 16px;
  position: absolute;
}

.parity-textfield-fixture__toast-icon {
  align-items: center;
  background: #d8f1e3;
  block-size: 16px;
  border-radius: 50%;
  color: #007a4d;
  display: inline-flex;
  font-size: 11px;
  inline-size: 16px;
  justify-content: center;
}

.parity-textfield-fixture__toast-text {
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
}

.parity-textfield-fixture__toast-action {
  align-items: center;
  block-size: 30px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  box-sizing: border-box;
  border-radius: 999px;
  display: inline-flex;
  font-size: 14px;
  font-weight: 700;
  inline-size: 76px;
  justify-content: center;
  line-height: 18.2px;
  margin-inline-start: 2px;
  padding: 3px 14px 5px;
}

.parity-textfield-fixture__toast-close {
  border-inline-start: 1px solid rgba(255, 255, 255, 0.25);
  font-size: 16px;
  line-height: 1;
  margin-inline-start: 2px;
  padding-inline-start: 12px;
}

.parity-label-fixture {
  display: grid;
  gap: 7px;
  inline-size: 100%;
}

.parity-label-fixture__label {
  color: #464646;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  margin: 0;
}

.parity-label-fixture__required {
  color: #252525;
  margin-inline-start: 4px;
}

.parity-label-fixture__input {
  appearance: none;
  background: #ffffff;
  border: 1px solid #b8b8b8;
  border-radius: 6px;
  box-sizing: border-box;
  color: #232323;
  display: block;
  font-size: 16px;
  font-family: inherit;
  inline-size: 100%;
  line-height: 21px;
  min-block-size: 42px;
  padding: 0 12px;
}

.parity-label-fixture__help {
  color: #464646;
  font-size: 14px;
  line-height: 21px;
  margin: 0;
}

.parity-disabled-textfield-fixture {
  display: grid;
  gap: 6px;
}

.parity-disabled-textfield-fixture__label {
  color: #464646;
  font-size: 14px;
  line-height: 21px;
  margin: 0;
}

.parity-disabled-textfield-fixture__input {
  appearance: none;
  background: #e6e6e6;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  box-sizing: border-box;
  color: #b2b2b2;
  display: block;
  font-size: 14px;
  font-family: inherit;
  inline-size: 192px;
  line-height: 20px;
  min-block-size: 32px;
  padding: 0 12px;
}

.parity-disabled-textfield-fixture__input:disabled {
  opacity: 1;
}

:deep(.parity-dropzone) {
  border: 2px dashed #d5d5d5;
  border-radius: 4px;
  display: block;
  font-size: 14px;
  line-height: 21px;
  min-block-size: auto;
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
