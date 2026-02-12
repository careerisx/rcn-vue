<script setup lang="ts">
import {type Component, type HTMLAttributes} from 'vue';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {cn} from '@/lib/utils';

export interface MConfirmProps {
  /**
   * 自定义类名
   */
  class?: HTMLAttributes['class'];

  /**
   * 确认框标题
   */
  title?: string;

  /**
   * 确认框图标插槽
   */
  icon?: Component;

  /**
   * 确认框描述
   */
  description?: string;

  /**
   * 确认按钮文本
   */
  confirmText?: string;

  /**
   * 取消按钮文本
   */
  cancelText?: string;

  /**
   * 确认按钮变体
   */
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

  /**
   * 是否禁用确认按钮
   */
  confirmDisabled?: boolean;

  /**
   * 确认数据
   */
  confirmData?: any;
}

const props = withDefaults(defineProps<MConfirmProps>(), {
  title: '确认操作',
  description: '此操作不可撤销，确定要继续吗？',
  confirmText: '确认',
  cancelText: '取消',
  confirmVariant: 'default',
  confirmDisabled: false,
});

const emit = defineEmits<{
  (e: 'confirm', confirmData?: any): void
}>();

// 控制 AlertDialog 开关状态
const open = defineModel<boolean>('open', {default: false});

// 打开确认框
function openConfirm() {
  open.value = true;
}

// 关闭确认框
function closeConfirm() {
  open.value = false;
}

// 确认按钮点击
function handleConfirm() {
  emit('confirm', props.confirmData);
}

// 暴露方法供外部调用
defineExpose({
  open: openConfirm,
  close: closeConfirm,
});
</script>

<template>
  <AlertDialog v-model:open="open">
    <AlertDialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger"/>
    </AlertDialogTrigger>

    <AlertDialogContent :class="cn(props.class)">
      <AlertDialogHeader>
        <slot name="header">
          <AlertDialogTitle>{{ title }}</AlertDialogTitle>
          <AlertDialogDescription class="flex gap-2 items-center">
            <Component v-if="icon" :is="icon" class="size-5"/>
            {{ description }}
          </AlertDialogDescription>
        </slot>
      </AlertDialogHeader>

      <!-- 自定义内容插槽 -->
      <slot/>

      <AlertDialogFooter>
        <slot name="footer">
          <AlertDialogCancel>
            {{ cancelText }}
          </AlertDialogCancel>
          <AlertDialogAction
              :disabled="confirmDisabled"
              :class="cn(confirmVariant === 'destructive' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90')"
              @click="handleConfirm"
          >
            {{ confirmText }}
          </AlertDialogAction>
        </slot>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped>
</style>