<script setup lang="ts">
import {computed} from 'vue';
import {VueButton} from 'vue-aria-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive' | 'quiet'
  isDisabled?: boolean
  isPending?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  isDisabled: false,
  isPending: false
});

const baseClass = 'tailwind-base relative inline-flex items-center justify-center gap-2 border border-transparent dark:border-white/10 h-9 box-border px-3.5 py-0 font-sans text-sm text-center transition rounded-lg cursor-default [-webkit-tap-highlight-color:transparent] outline outline-blue-600 dark:outline-blue-500 forced-colors:outline-[Highlight] outline-offset-2 outline-0 focus-visible:outline-2 focus-visible:outline-offset-2 data-[pending]:cursor-progress';

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 pressed:bg-blue-800 text-white',
  secondary: 'border-black/10 bg-neutral-50 hover:bg-neutral-100 pressed:bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:pressed:bg-neutral-500 dark:text-neutral-100',
  destructive: 'bg-red-700 hover:bg-red-800 pressed:bg-red-900 text-white',
  quiet: 'border-0 bg-transparent hover:bg-neutral-200 pressed:bg-neutral-300 text-neutral-800 dark:hover:bg-neutral-700 dark:pressed:bg-neutral-600 dark:text-neutral-100'
};

const disabledClass = 'border-transparent dark:border-transparent bg-neutral-100 dark:bg-neutral-800 text-neutral-300 dark:text-neutral-600 forced-colors:text-[GrayText]';

const buttonClass = computed(() => {
  const classes = [baseClass, variantClasses[props.variant]];

  if (props.isDisabled) {
    classes.push(disabledClass);
    if (props.variant === 'quiet') {
      classes.push('bg-transparent dark:bg-transparent');
    }
  }

  return classes.join(' ');
});
</script>

<template>
  <VueButton
    :class="buttonClass"
    :isDisabled="isDisabled"
    :isPending="isPending">
    <slot>Press me</slot>
  </VueButton>
</template>
