<template>
  <Provider color-scheme="light" scale="medium" class="fixture-root">
    <ContextualHelp :model-value="true" variant="info" title="Contextual help parity" :dismissable="false">
      Contextual help package visual baseline
      <template #footer>
        <Text variant="detail">Footer slot content</Text>
      </template>
    </ContextualHelp>
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
  padding: 24px;
}
</style>
