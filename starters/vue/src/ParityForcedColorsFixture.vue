<template>
  <Provider color-scheme="light" scale="medium" class="fixture-root">
    <section data-parity-id="forced-colors-cluster" class="fixture-card">
      <Text>Forced Colors Cluster</Text>
      <Button variant="primary">Primary action</Button>
      <TextField label="Owner" model-value="" :invalid="true" description="Required in forced colors" />
      <Switch :model-value="true" label="Alerts" />
      <StatusLight variant="positive">Healthy</StatusLight>
      <div class="native-control">
        <label for="forced-native-input">Native input</label>
        <input id="forced-native-input" value="Native surface" />
      </div>
    </section>
  </Provider>
</template>

<script setup lang="ts">
import {Button} from '@vue-spectrum/button';
import {Provider} from '@vue-spectrum/provider';
import {StatusLight} from '@vue-spectrum/statuslight';
import {Switch} from '@vue-spectrum/switch';
import {Text} from '@vue-spectrum/text';
import {TextField} from '@vue-spectrum/textfield';
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
  max-width: 620px;
  padding: 16px;
}

.native-control {
  display: grid;
  gap: 6px;
}

.native-control input {
  border: 1px solid #bdbdbd;
  border-radius: 6px;
  min-height: 32px;
  padding: 6px 10px;
}
</style>
