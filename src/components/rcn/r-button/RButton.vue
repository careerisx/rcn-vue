<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-vue-next'
import { computed, type HTMLAttributes } from 'vue'

interface Props {
  /** 是否处于加载状态 */
  loading?: boolean
  /** 加载时显示的文本，不传则显示默认 slot 内容 */
  loadingText?: string
  /** Button 原生 variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /** Button 原生 size */
  size?: 'default' | 'sm' | 'lg' | 'icon'
  /** 是否禁用 */
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  variant: 'default',
  size: 'default',
  disabled: false,
})

const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <Button
    :variant="props.variant"
    :size="props.size"
    :disabled="isDisabled"
    :class="cn('relative', props.class)"
  >
    <template v-if="props.loading">
      <Loader2 class="mr-2 h-4 w-4 animate-spin" />
      <span v-if="props.loadingText">{{ props.loadingText }}</span>
      <slot v-else />
    </template>
    <slot v-else />
  </Button>
</template>
