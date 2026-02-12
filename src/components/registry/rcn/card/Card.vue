<script setup lang="ts">
import type {HTMLAttributes, Component} from 'vue';
import {computed} from 'vue';
import {cn} from '@/lib/utils';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export interface MCardProps {
  /**
   * 额外的 CSS 类
   */
  class?: HTMLAttributes['class'];
  /**
   * 标题
   */
  title?: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 标题图标
   */
  icon?: Component;
  /**
   * 是否显示头部
   */
  showHeader?: boolean;
  /**
   * 是否显示底部
   */
  showFooter?: boolean;
}

const props = withDefaults(defineProps<MCardProps>(), {
  title: '',
  description: '',
  showHeader: true,
  showFooter: false,
});

// 是否显示头部区域
const hasHeader = computed(() => {
  return props.showHeader && (props.title || props.description);
});
</script>

<template>
  <Card :class="cn('flex', props.class)">
    <!-- 头部 -->
    <CardHeader v-if="hasHeader || $slots.header || $slots.action">
      <slot name="header">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <component v-if="icon" :is="icon" class="size-5 text-muted-foreground"/>
            <div>
              <CardTitle v-if="title">{{ title }}</CardTitle>
              <CardDescription v-if="description">{{ description }}</CardDescription>
            </div>
          </div>
          <CardAction v-if="$slots.action">
            <slot name="action"/>
          </CardAction>
        </div>
      </slot>
    </CardHeader>

    <!-- 内容 -->
    <CardContent class="flex-1 min-h-0 min-w-0 px-4">
      <slot/>
    </CardContent>

    <!-- 底部 -->
    <CardFooter v-if="showFooter || $slots.footer">
      <slot name="footer"/>
    </CardFooter>
  </Card>
</template>