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
    </main>
  </Provider>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {Badge} from '@vue-spectrum/badge';
import {Button} from '@vue-spectrum/button';
import {Card} from '@vue-spectrum/card';
import {Icon} from '@vue-spectrum/icon';
import {ListBox} from '@vue-spectrum/listbox';
import {Provider} from '@vue-spectrum/provider';
import {Switch} from '@vue-spectrum/switch';
import {Table} from '@vue-spectrum/table';
import {Tabs, type TabItemData} from '@vue-spectrum/tabs';
import {TextField} from '@vue-spectrum/textfield';
import {Text} from '@vue-spectrum/text';
import {View} from '@vue-spectrum/view';

const selectedTab = ref('overview');
const selectedRow = ref('T-100');

const tabs: TabItemData[] = [
  {key: 'overview', label: 'Overview', content: 'Overview content'},
  {key: 'details', label: 'Details', content: 'Details content'}
];

const columns = [
  {key: 'ticket', label: 'Ticket'},
  {key: 'owner', label: 'Owner'}
];

const rows = [
  {ticket: 'T-100', owner: 'Avery'},
  {ticket: 'T-101', owner: 'Quinn'}
];

const listItems = ['React', 'Vue', 'Svelte'];
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
  max-width: 1200px;
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
