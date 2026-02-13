<script setup lang="ts">
import {AvatarImage, Avatar, AvatarFallback} from '@/components/ui/avatar';
import {cn} from '@/lib/utils';
import {computed} from 'vue';

interface AvatarProps {
  /**
   * 头像图片地址
   */
  src?: string;

  /**
   * 头像替代文本
   */
  alt?: string;

  /**
   * 头像加载失败时显示的文字（取首字母大写）
   */
  fallback?: string;

  /**
   * 尺寸
   */
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';

  /**
   * 形状
   */
  shape?: 'circle' | 'square';

  /**
   * 自定义类名
   */
  class?: string;
}

const props = withDefaults(defineProps<AvatarProps>(), {
  alt: 'Avatar',
  fallback: 'U',
  size: 'default',
  shape: 'circle',
});

const sizeClass = computed(() => {
  const sizes: Record<string, string> = {
    xs: 'size-6 text-xs',
    sm: 'size-8 text-xs',
    default: 'size-10 text-sm',
    lg: 'size-12 text-base',
    xl: 'size-16 text-lg',
  };
  return sizes[props.size];
});

const shapeClass = computed(() => {
  return props.shape === 'square' ? 'rounded-md' : 'rounded-full';
});

const fallbackText = computed(() => {
  return props.fallback.slice(0, 2).toUpperCase();
});
</script>

<template>
  <Avatar :class="cn(sizeClass, shapeClass, props.class)">
    <AvatarImage v-if="src" :src="src" :alt="alt" :class="shapeClass"/>
    <AvatarFallback :class="shapeClass">{{ fallbackText }}</AvatarFallback>
  </Avatar>
</template>