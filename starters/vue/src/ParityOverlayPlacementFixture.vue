<template>
  <Provider color-scheme="light" scale="medium" class="fixture-root">
    <section data-parity-id="overlay-placement-matrix" class="fixture-card fixture-card--overlay">
      <Text>Overlay Placement Matrix</Text>
      <div class="placement-grid">
        <TooltipTrigger :model-value="true" content="Top placement" placement="top">
          <Button variant="secondary">Top</Button>
        </TooltipTrigger>
        <TooltipTrigger :model-value="true" content="Right placement" placement="right">
          <Button variant="secondary">Right</Button>
        </TooltipTrigger>
        <TooltipTrigger :model-value="true" content="Bottom placement" placement="bottom">
          <Button variant="secondary">Bottom</Button>
        </TooltipTrigger>
        <TooltipTrigger :model-value="true" content="Left placement" placement="left">
          <Button variant="secondary">Left</Button>
        </TooltipTrigger>
      </div>
    </section>
  </Provider>
</template>

<script setup lang="ts">
import {Button} from '@vue-spectrum/button';
import {Provider} from '@vue-spectrum/provider';
import {Text} from '@vue-spectrum/text';
import {TooltipTrigger} from '@vue-spectrum/tooltip';
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

.fixture-card--overlay {
  gap: 16px;
  max-width: 720px;
  padding: 20px;
}

.placement-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  justify-items: center;
  min-height: 220px;
  padding: 16px;
}
</style>
