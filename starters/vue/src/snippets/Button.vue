<script setup lang="ts">
import {VueButton} from 'vue-aria-components';
import 'vanilla-starter/Button.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'quiet'
  isDisabled?: boolean
  isPending?: boolean
}

withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  isDisabled: false,
  isPending: false
});
</script>

<template>
  <VueButton
    class="react-aria-Button button-base"
    :data-variant="variant"
    :isDisabled="isDisabled"
    :isPending="isPending">
    <slot>Press me</slot>
  </VueButton>
</template>
