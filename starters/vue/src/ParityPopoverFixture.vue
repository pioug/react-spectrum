<template>
  <Provider color-scheme="light" scale="medium" class="fixture-root">
    <Popover :open="true" placement="right" :dismissable="false">
      <p>Popover package visual baseline</p>
    </Popover>
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
}
</style>
