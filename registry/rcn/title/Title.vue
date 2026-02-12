<script setup lang="ts">
import type {HTMLAttributes} from 'vue';

interface Props {
  /**
   * 页面标题
   */
  title: string;
  /**
   * 副标题
   */
  subtitle?: string;
  /**
   * 额外的 CSS 类
   */
  class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
});
</script>

<template>
  <div :class="['mb-2 flex justify-between items-center', props.class]">
    <div>
      <slot name="title">
        <h1 class="text-base font-semibold tracking-tight border-l-4 px-2 border-l-primary">
          {{ title }}
        </h1>
      </slot>
      <slot name="subtitle" v-if="subtitle">
        <p class="text-muted-foreground text-sm mt-2 px-2">
          {{ subtitle }}
        </p>
      </slot>
    </div>
    <div v-if="$slots.actions">
      <slot name="actions"/>
    </div>
  </div>
</template>

<style scoped>
</style>