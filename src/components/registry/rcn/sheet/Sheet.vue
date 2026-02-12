<script setup lang="ts">
import type {HTMLAttributes} from 'vue';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {Spinner} from '@/components/ui/spinner';

export interface MSheetProps {
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
   * 弹出方向
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * 是否显示底部按钮区域
   */
  showFooter?: boolean;
  /**
   * 确认按钮文本
   */
  confirmText?: string;
  /**
   * 取消按钮文本
   */
  cancelText?: string;
  /**
   * 确认按钮是否加载中
   */
  confirmLoading?: boolean;
}

const props = withDefaults(defineProps<MSheetProps>(), {
  title: '',
  description: '',
  side: 'right',
  showFooter: true,
  confirmText: '保存',
  cancelText: '取消',
  confirmLoading: false,
});

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

// 控制 Sheet 开关状态
const open = defineModel<boolean>('open', {default: false});

// 打开 Sheet
function openSheet() {
  open.value = true;
}

// 关闭 Sheet
function closeSheet() {
  open.value = false;
}

// 确认按钮点击
function handleConfirm() {
  emit('confirm');
}

// 取消按钮点击
function handleCancel() {
  emit('cancel');
  closeSheet();
}

// 暴露方法供外部调用
defineExpose({
  open: openSheet,
  close: closeSheet,
});
</script>

<template>
  <Sheet v-model:open="open">
    <SheetTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger"/>
    </SheetTrigger>
    <SheetContent :side="side" :class="cn('flex flex-col', props.class)">
      <SheetHeader v-if="title || description || $slots.header">
        <slot name="header">
          <SheetTitle v-if="title">{{ title }}</SheetTitle>
          <SheetDescription v-if="description">{{ description }}</SheetDescription>
        </slot>
      </SheetHeader>

      <div class="flex-1 min-h-0 p-1">
        <slot/>
      </div>

      <SheetFooter v-if="showFooter" class="flex-row justify-end">
        <slot name="footer">
          <SheetClose as-child>
            <Button variant="outline" @click="handleCancel">
              {{ cancelText }}
            </Button>
          </SheetClose>
          <Button :disabled="confirmLoading" @click="handleConfirm">
            <Spinner v-if="confirmLoading"/>
            {{ confirmText }}
          </Button>
        </slot>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>