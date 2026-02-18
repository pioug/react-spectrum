<template>
  <VueSpectrumProvider class="app-root" color-scheme="light" scale="medium">
    <main class="app-shell">
      <header class="app-header">
        <p class="eyebrow">Vue Migration Baseline</p>
        <h1>Vue Spectrum Starter</h1>
        <p class="lead">
          This starter uses <code>@vue-spectrum/components</code> from this monorepo.
        </p>
      </header>

      <section class="demo-card">
        <VueTextField
          v-model="name"
          label="Name"
          description="Used to demonstrate v-model and accessible labeling."
          placeholder="Ada Lovelace" />

        <VueCheckbox v-model="isSubscribed">
          Send me product updates
        </VueCheckbox>

        <VueRadioGroup v-model="favoriteFramework" label="Favorite framework" orientation="horizontal">
          <VueRadio value="vue">Vue</VueRadio>
          <VueRadio value="react">React</VueRadio>
          <VueRadio value="svelte">Svelte</VueRadio>
        </VueRadioGroup>

        <p class="summary">
          Selected: <strong>{{ favoriteFramework }}</strong>
          <span> · </span>
          Subscribed: <strong>{{ isSubscribed ? 'yes' : 'no' }}</strong>
        </p>

        <div class="actions">
          <VueButton variant="primary" @click="count += 1">
            {{ ctaLabel }}
          </VueButton>
          <VueButton variant="secondary" @click="isDialogOpen = true">
            Open dialog
          </VueButton>
          <VueButton variant="secondary" @click="reset">
            Reset
          </VueButton>
        </div>
      </section>

      <VueDialog
        :open="isDialogOpen"
        title="Vue Dialog"
        @close="isDialogOpen = false">
        <p>
          This dialog is provided by <code>@vue-spectrum/dialog</code> as the next composition-layer migration step.
        </p>
      </VueDialog>
    </main>
  </VueSpectrumProvider>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {Button as VueButton} from '@vue-spectrum/button';
import {Checkbox as VueCheckbox} from '@vue-spectrum/checkbox';
import {Dialog as VueDialog} from '@vue-spectrum/dialog';
import {Provider as VueSpectrumProvider} from '@vue-spectrum/provider';
import {Radio as VueRadio, RadioGroup as VueRadioGroup} from '@vue-spectrum/radio';
import {TextField as VueTextField} from '@vue-spectrum/textfield';

const count = ref(0);
const name = ref('');
const isSubscribed = ref(true);
const favoriteFramework = ref('vue');
const isDialogOpen = ref(false);

const ctaLabel = computed(() => {
  let suffix = name.value ? `, ${name.value}` : '';
  return `Say hello${suffix} (${count.value})`;
});

function reset() {
  count.value = 0;
  name.value = '';
  isSubscribed.value = true;
  favoriteFramework.value = 'vue';
  isDialogOpen.value = false;
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
