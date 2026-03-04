<script setup lang="ts">
import {ref} from 'vue';
import {VueButton} from 'vue-aria-components';

const isPending = ref(false);

function save() {
  if (isPending.value) {
    return;
  }

  isPending.value = true;
  setTimeout(() => {
    isPending.value = false;
  }, 5000);
}
</script>

<template>
  <!--- begin highlight -->
  <VueButton
    class="react-aria-Button button-base"
    :isPending="isPending"
    @press="save">
    Save
  </VueButton>
  <!--- end highlight -->
</template>
