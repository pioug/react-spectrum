<template>
  <VueSpectrumProvider class="app-root" color-scheme="light" scale="medium">
    <main class="app-shell">
      <header class="app-header">
        <VueAvatar class="header-avatar" label="VS" size="l" />
        <p class="eyebrow">Vue Migration Baseline</p>
        <h1>Vue Spectrum Starter</h1>
        <p class="lead">
          This starter uses <code>@vue-spectrum/components</code> from this monorepo.
        </p>
        <VueLink href="https://react-spectrum.adobe.com/" target="_blank" rel="noreferrer">
          React Spectrum docs
        </VueLink>
      </header>

      <VueForm class="demo-card" @submit="count += 1">
        <VueTextField
          v-model="name"
          label="Name"
          description="Used to demonstrate v-model and accessible labeling."
          placeholder="Ada Lovelace" />

        <VueNumberField
          v-model="seatCount"
          label="Seats"
          description="Numeric entry via the number field port."
          :min="1"
          :max="20" />

        <VueSlider
          v-model="completionProgress"
          label="Completion"
          description="Range selection via the slider port."
          :min="0"
          :max="100"
          :step="5" />

        <VueProgressBar
          label="Overall progress"
          :value="completionProgress" />

        <VueMeter
          label="Quality signal"
          :value="completionProgress"
          :low="30"
          :high="75"
          :optimum="90" />

        <VueStatusLight :variant="statusTone">
          {{ statusLabel }}
        </VueStatusLight>

        <VueBadge variant="info">
          Vue badge port
        </VueBadge>

        <VueComboBox
          v-model="favoriteLanguage"
          label="Favorite language"
          :options="languageOptions"
          placeholder="Type or select" />

        <VueCheckbox v-model="isSubscribed">
          Send me product updates
        </VueCheckbox>

        <VueSwitch v-model="isDigestEnabled">
          Enable weekly digest
        </VueSwitch>

        <VueSearchField
          v-model="searchQuery"
          label="Search components"
          description="Demonstrates search input semantics and clear behavior."
          placeholder="Search components" />

        <VueRadioGroup v-model="favoriteFramework" label="Favorite framework" orientation="horizontal">
          <VueRadio value="vue">Vue</VueRadio>
          <VueRadio value="react">React</VueRadio>
          <VueRadio value="svelte">Svelte</VueRadio>
        </VueRadioGroup>

        <VueMenu
          v-model="favoriteComponent"
          label="Favorite component category"
          :items="componentOptions" />

        <VueListBox
          v-model="favoriteLibrary"
          label="Favorite library"
          :items="libraryOptions" />

        <VueTable
          v-model="selectedTicket"
          caption="Open tickets"
          :columns="ticketColumns"
          :rows="ticketRows"
          row-key="ticket" />

        <VueTree
          v-model="selectedTreeNode"
          :items="treeItems" />

        <section class="virtual-list-demo">
          <p class="eyebrow">Virtualized Collection</p>
          <p class="summary">
            Rendering <strong>{{ virtualVisibleRows.length }}</strong>
            of <strong>{{ virtualBacklog.length }}</strong>
            items ({{ virtualRangeLabel }}).
          </p>
          <div class="virtual-list-viewport" @scroll="handleVirtualScroll">
            <div class="virtual-list-content" :style="{height: virtualTotalHeight}">
              <div
                v-for="row in virtualVisibleRows"
                :key="row.index"
                class="virtual-list-row"
                :style="{top: `${row.offsetTop}px`}">
                {{ row.label }}
              </div>
            </div>
          </div>
        </section>

        <VueWell variant="notice">
          Well port baseline: migration notes and rollout context live here.
        </VueWell>

        <VueDropZone
          label="Drop design assets"
          @files-drop="handleFilesDrop" />

        <VueDivider />

        <p class="summary">
          Selected: <strong>{{ favoriteFramework }}</strong>
          <span> · </span>
          Seats: <strong>{{ seatCount ?? 'none' }}</strong>
          <span> · </span>
          Progress: <strong>{{ completionProgress }}%</strong>
          <span> · </span>
          Menu: <strong>{{ favoriteComponent }}</strong>
          <span> · </span>
          List: <strong>{{ favoriteLibrary }}</strong>
          <span> · </span>
          Ticket: <strong>{{ selectedTicket }}</strong>
          <span> · </span>
          Tree: <strong>{{ selectedTreeNode }}</strong>
          <span> · </span>
          Files: <strong>{{ droppedFiles.length > 0 ? droppedFiles.length : 'none' }}</strong>
          <span> · </span>
          Digest: <strong>{{ isDigestEnabled ? 'on' : 'off' }}</strong>
          <span> · </span>
          Search: <strong>{{ searchQuery || 'none' }}</strong>
          <span> · </span>
          Subscribed: <strong>{{ isSubscribed ? 'yes' : 'no' }}</strong>
        </p>

        <div class="actions">
          <VueButton variant="primary" @click="count += 1">
            {{ ctaLabel }}
          </VueButton>
          <VueButton variant="secondary" @click="isPopoverOpen = !isPopoverOpen">
            {{ isPopoverOpen ? 'Hide popover' : 'Show popover' }}
          </VueButton>
          <VueButton variant="secondary" @click="isDialogOpen = true">
            Open dialog
          </VueButton>
          <VueButton variant="secondary" @click="reset">
            Reset
          </VueButton>
          <VueButton variant="secondary" type="submit">
            Submit form
          </VueButton>
        </div>
      </VueForm>

      <VueDialog
        :open="isDialogOpen"
        title="Vue Dialog"
        @close="isDialogOpen = false">
        <p>
          This dialog is provided by <code>@vue-spectrum/dialog</code> as the next composition-layer migration step.
        </p>
      </VueDialog>

      <VuePopover :open="isPopoverOpen" placement="right" @close="isPopoverOpen = false">
        <p class="summary">
          Popover from <code>@vue-spectrum/overlays</code>.
        </p>
      </VuePopover>
    </main>
  </VueSpectrumProvider>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {useVirtualizer} from '@vue-aria/virtualizer';
import {Avatar as VueAvatar} from '@vue-spectrum/avatar';
import {Badge as VueBadge} from '@vue-spectrum/badge';
import {Button as VueButton} from '@vue-spectrum/button';
import {Checkbox as VueCheckbox} from '@vue-spectrum/checkbox';
import {ComboBox as VueComboBox} from '@vue-spectrum/combobox';
import {DropZone as VueDropZone} from '@vue-spectrum/dnd';
import {Divider as VueDivider} from '@vue-spectrum/divider';
import {Dialog as VueDialog} from '@vue-spectrum/dialog';
import {Form as VueForm} from '@vue-spectrum/form';
import {Link as VueLink} from '@vue-spectrum/link';
import {ListBox as VueListBox} from '@vue-spectrum/listbox';
import {Menu as VueMenu} from '@vue-spectrum/menu';
import {Meter as VueMeter} from '@vue-spectrum/meter';
import {NumberField as VueNumberField} from '@vue-spectrum/numberfield';
import {Popover as VuePopover} from '@vue-spectrum/overlays';
import {ProgressBar as VueProgressBar} from '@vue-spectrum/progress';
import {Provider as VueSpectrumProvider} from '@vue-spectrum/provider';
import {Radio as VueRadio, RadioGroup as VueRadioGroup} from '@vue-spectrum/radio';
import {SearchField as VueSearchField} from '@vue-spectrum/searchfield';
import {Slider as VueSlider} from '@vue-spectrum/slider';
import {StatusLight as VueStatusLight} from '@vue-spectrum/statuslight';
import {Switch as VueSwitch} from '@vue-spectrum/switch';
import {Table as VueTable} from '@vue-spectrum/table';
import {TextField as VueTextField} from '@vue-spectrum/textfield';
import {Tree as VueTree} from '@vue-spectrum/tree';
import {Well as VueWell} from '@vue-spectrum/well';

const count = ref(0);
const name = ref('');
const seatCount = ref<number | null>(2);
const completionProgress = ref(40);
const favoriteLanguage = ref('TypeScript');
const isDigestEnabled = ref(false);
const searchQuery = ref('');
const isSubscribed = ref(true);
const favoriteFramework = ref('vue');
const favoriteComponent = ref('Forms');
const favoriteLibrary = ref('Vue Spectrum');
const selectedTicket = ref('T-402');
const selectedTreeNode = ref('project-alpha');
const droppedFiles = ref<string[]>([]);
const isDialogOpen = ref(false);
const isPopoverOpen = ref(false);
const languageOptions = ['TypeScript', 'JavaScript', 'Rust', 'Go', 'Python'];
const componentOptions = ['Forms', 'Navigation', 'Overlays', 'Data display'];
const libraryOptions = ['Vue Spectrum', 'React Spectrum', 'Tailwind CSS'];
const ticketColumns = [
  {key: 'ticket', label: 'Ticket'},
  {key: 'owner', label: 'Owner'},
  {key: 'status', label: 'Status'}
];
const ticketRows = [
  {ticket: 'T-401', owner: 'Avery', status: 'Todo'},
  {ticket: 'T-402', owner: 'Quinn', status: 'In Progress'},
  {ticket: 'T-403', owner: 'Riley', status: 'Review'}
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
const virtualRowHeight = 36;
const virtualBacklog = Array.from({length: 240}, (_value, index) => `Backlog item ${index + 1}`);
const virtualScrollTop = ref(0);
const virtualizer = useVirtualizer({
  itemCount: virtualBacklog.length,
  itemHeight: virtualRowHeight,
  viewportHeight: 240,
  scrollTop: virtualScrollTop,
  overscan: 3
});
const virtualTotalHeight = computed(() => `${virtualizer.totalHeight.value}px`);
const virtualVisibleRows = computed(() => virtualizer.visibleIndexes.value.map((index) => ({
  index,
  label: virtualBacklog[index],
  offsetTop: index * virtualRowHeight
})));
const virtualRangeLabel = computed(() => {
  if (virtualizer.visibleCount.value === 0) {
    return 'none';
  }

  let start = virtualizer.startIndex.value + 1;
  let end = virtualizer.endIndex.value;
  return `${start}-${end}`;
});

const statusTone = computed(() => {
  if (completionProgress.value >= 80) {
    return 'positive';
  }

  if (completionProgress.value >= 50) {
    return 'notice';
  }

  return 'negative';
});

const statusLabel = computed(() => {
  if (statusTone.value === 'positive') {
    return 'Delivery status: on track';
  }

  if (statusTone.value === 'notice') {
    return 'Delivery status: monitor';
  }

  return 'Delivery status: at risk';
});

const ctaLabel = computed(() => {
  let suffix = name.value ? `, ${name.value}` : '';
  return `Say hello${suffix} (${count.value})`;
});

function reset() {
  count.value = 0;
  name.value = '';
  seatCount.value = 2;
  completionProgress.value = 40;
  favoriteLanguage.value = 'TypeScript';
  isDigestEnabled.value = false;
  searchQuery.value = '';
  isSubscribed.value = true;
  favoriteFramework.value = 'vue';
  favoriteComponent.value = 'Forms';
  favoriteLibrary.value = 'Vue Spectrum';
  selectedTicket.value = 'T-402';
  selectedTreeNode.value = 'project-alpha';
  droppedFiles.value = [];
  isDialogOpen.value = false;
  isPopoverOpen.value = false;
}

function handleFilesDrop(files: File[]) {
  droppedFiles.value = files.map((file) => file.name);
}

function handleVirtualScroll(event: Event) {
  let target = event.currentTarget;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  virtualScrollTop.value = target.scrollTop;
}
</script>

<style scoped>
.app-root {
  min-height: 100vh;
}

.app-shell {
  margin: 0 auto;
  max-width: 640px;
  padding: 48px 20px 64px;
}

.app-header {
  margin-bottom: 24px;
}

.header-avatar {
  margin-bottom: 12px;
}

.eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0 0 8px;
  text-transform: uppercase;
}

h1 {
  font-size: clamp(28px, 5vw, 42px);
  line-height: 1.1;
  margin: 0;
}

.lead {
  font-size: 16px;
  line-height: 1.5;
  margin-top: 12px;
}

.demo-card {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  display: grid;
  gap: 16px;
  padding: 20px;
}

.actions {
  display: flex;
  gap: 12px;
}

.summary {
  margin: 0;
}

.virtual-list-demo {
  display: grid;
  gap: 8px;
}

.virtual-list-viewport {
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 8px;
  height: 240px;
  overflow: auto;
}

.virtual-list-content {
  position: relative;
}

.virtual-list-row {
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  height: 36px;
  left: 0;
  padding: 0 12px;
  position: absolute;
  right: 0;
}

code {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  padding: 2px 6px;
}

@media (max-width: 640px) {
  .actions {
    flex-direction: column;
  }
}
</style>
