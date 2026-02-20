<template>
  <Provider dir="rtl" locale="ar-EG" color-scheme="light" scale="medium" class="fixture-root">
    <section data-parity-id="rtl-cluster" class="fixture-card">
      <Text variant="heading">واجهة RTL</Text>
      <ButtonGroup>
        <Button variant="primary">حفظ</Button>
        <Button variant="secondary">إلغاء</Button>
      </ButtonGroup>
      <TextField label="المالك" model-value="أفري" />
      <Tabs v-model="selectedTab" :items="tabs" aria-label="علامات التبويب" />
      <Table :columns="columns" :rows="rows" row-key="ticket" caption="تذاكر" />
    </section>
  </Provider>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {Button} from '@vue-spectrum/button';
import {ButtonGroup} from '@vue-spectrum/buttongroup';
import {Provider} from '@vue-spectrum/provider';
import {Table} from '@vue-spectrum/table';
import {Tabs, type TabItemData} from '@vue-spectrum/tabs';
import {Text} from '@vue-spectrum/text';
import {TextField} from '@vue-spectrum/textfield';

const selectedTab = ref('overview');

const tabs: TabItemData[] = [
  {key: 'overview', label: 'نظرة عامة', content: 'محتوى النظرة العامة'},
  {key: 'details', label: 'تفاصيل', content: 'محتوى التفاصيل'}
];

const columns = [
  {key: 'ticket', label: 'التذكرة'},
  {key: 'owner', label: 'المالك'}
];

const rows = [
  {ticket: 'T-100', owner: 'أفري'},
  {ticket: 'T-101', owner: 'كوين'}
];
</script>

<style scoped>
.fixture-root {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24px;
}

.fixture-card {
  align-items: stretch;
  background: #ffffff;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  display: grid;
  gap: 12px;
  margin: 0 auto;
  max-width: 960px;
  padding: 16px;
}
</style>
