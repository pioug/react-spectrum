<template>
  <VueSpectrumProvider class="app-root" color-scheme="light" scale="medium">
    <main class="app-shell">
      <header class="app-header">
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
import {Button as VueButton} from '@vue-spectrum/button';
import {Checkbox as VueCheckbox} from '@vue-spectrum/checkbox';
import {ComboBox as VueComboBox} from '@vue-spectrum/combobox';
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
import {TextField as VueTextField} from '@vue-spectrum/textfield';

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
const isDialogOpen = ref(false);
const isPopoverOpen = ref(false);
const languageOptions = ['TypeScript', 'JavaScript', 'Rust', 'Go', 'Python'];
const componentOptions = ['Forms', 'Navigation', 'Overlays', 'Data display'];
const libraryOptions = ['Vue Spectrum', 'React Spectrum', 'Tailwind CSS'];

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
  isDialogOpen.value = false;
  isPopoverOpen.value = false;
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
