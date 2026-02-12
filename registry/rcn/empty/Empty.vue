<script setup lang="ts">
import {computed} from 'vue';
import {Inbox, RefreshCcw} from 'lucide-vue-next';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {Button} from '@/components/ui/button';
import type {HTMLAttributes, Component} from 'vue';
import {cn} from '@/lib/utils';

export interface EmptyProps {
  /**
   * 额外的 CSS 类
   */
  class?: HTMLAttributes['class'];
  /**
   * 标题文本
   */
  title?: string;
  /**
   * 描述文本
   */
  description?: string;
  /**
   * 自定义图标组件
   */
  icon?: Component;
  /**
   * 图标大小
   */
  iconSize?: 'sm' | 'md' | 'lg';
  /**
   * 操作按钮变体
   */
  actionVariant?: 'default' | 'outline' | 'ghost' | 'secondary';
  /**
   * 是否显示操作按钮
   */
  showAction?: boolean;
}

const props = withDefaults(defineProps<EmptyProps>(), {
  title: '暂无数据',
  description: '',
  iconSize: 'md',
  actionVariant: 'outline',
  showAction: false,
});

// 使用计算属性处理图标，避免默认值问题
const IconComponent = computed(() => props.icon || Inbox);

const emit = defineEmits<{
  action: [];
}>();

// 根据 iconSize 计算图标样式
const iconSizeClass = computed(() => {
  const sizes = {
    sm: {wrapper: 'w-16 h-16', icon: 'size-8'},
    md: {wrapper: 'w-20 h-20', icon: 'size-12'},
    lg: {wrapper: 'w-24 h-24', icon: 'size-14'},
  };
  return sizes[props.iconSize];
});

function handleAction() {
  emit('action');
}
</script>

<template>
  <Empty :class="cn('py-12', props.class)">
    <EmptyHeader>
      <!-- 图标插槽，支持自定义 -->
      <EmptyMedia variant="icon" :class="cn('mx-auto', iconSizeClass.wrapper)">
        <slot name="icon">
          <component :stroke-width="1" :is="IconComponent" :class="cn('text-muted-foreground/80', iconSizeClass.icon)"/>
        </slot>
      </EmptyMedia>
    </EmptyHeader>
    <EmptyContent class="space-y-4">
      <!-- 标题和描述 -->
      <div class="space-y-2">
        <EmptyTitle class="text-lg font-semibold text-foreground/80">
          <slot name="title">{{ title }}</slot>
        </EmptyTitle>
        <EmptyDescription v-if="description" class="text-sm text-muted-foreground max-w-md mx-auto">
          <slot name="description">{{ description }}</slot>
        </EmptyDescription>
      </div>

      <!-- 操作按钮插槽，支持自定义 -->
      <div v-if="showAction" class="flex justify-center gap-2">
        <slot name="action">
          <Button :variant="actionVariant" size="sm" @click="handleAction">
            <RefreshCcw/>
            刷新
          </Button>
        </slot>
      </div>
    </EmptyContent>
  </Empty>
</template>

<style scoped>

</style>