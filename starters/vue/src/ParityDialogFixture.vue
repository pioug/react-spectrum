<template>
  <Provider color-scheme="light" scale="medium" class="fixture-root">
    <Dialog :open="true" title="Dialog parity fixture" :dismissable="false">
      <p>Dialog package visual baseline</p>
    </Dialog>
  </Provider>
</template>

<script setup lang="ts">
import {Dialog} from '@vue-spectrum/dialog';
import {Provider} from '@vue-spectrum/provider';
</script>

<style scoped>
.fixture-root {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
