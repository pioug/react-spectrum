<template>
  <Provider color-scheme="light" scale="medium" class="fixture-root">
    <section data-parity-id="pkg-contextualhelp" class="fixture-card fixture-card--narrow">
      <ContextualHelp :model-value="true" variant="info" title="Contextual help parity" :dismissable="false">
        Contextual help package visual baseline
        <template #footer>
          <Text>Footer slot content</Text>
        </template>
      </ContextualHelp>
    </section>
  </Provider>
</template>

<script setup lang="ts">
import {ContextualHelp} from '@vue-spectrum/contextualhelp';
import {Provider} from '@vue-spectrum/provider';
import {Text} from '@vue-spectrum/text';
</script>

<style scoped>
.fixture-root {
  min-height: 100vh;
  background: #f5f5f5;
  color: #1f1f1f;
  font-family: Arial, sans-serif;
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

.fixture-card--narrow {
  max-width: 620px;
}
</style>
