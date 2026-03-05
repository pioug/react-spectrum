<script setup lang="ts">
import {ref} from 'vue';
import {VueButton} from 'vue-aria-components';
import type {PressEvent} from '@react-types/shared';
import 'vanilla-starter/Button.css';

const pointerType = ref('');

function handlePressStart(event: PressEvent) {
  pointerType.value = event.pointerType;
}

function handlePressEnd() {
  pointerType.value = '';
}
</script>

<template>
  <!--- begin highlight -->
  <VueButton
    class="react-aria-Button button-base"
    @press-start="handlePressStart"
    @press-end="handlePressEnd">
    Press me
  </VueButton>
  <!--- end highlight -->
  <p>{{ pointerType ? `You are pressing the button with a ${pointerType}!` : 'Ready to be pressed.' }}</p>
</template>
