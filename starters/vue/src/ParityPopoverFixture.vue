<template>
  <Provider color-scheme="light" scale="medium" class="fixture-root">
    <section data-parity-id="pkg-overlays" class="fixture-card fixture-card--narrow">
      <button type="button" class="fixture-trigger">Open popover</button>
      <Popover :open="true" placement="right" :dismissable="false">
        <p>Popover package visual baseline</p>
      </Popover>
    </section>
  </Provider>
</template>

<script setup lang="ts">
import {Popover} from '@vue-spectrum/overlays';
import {Provider} from '@vue-spectrum/provider';
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

.fixture-trigger {
  align-self: start;
}
</style>
