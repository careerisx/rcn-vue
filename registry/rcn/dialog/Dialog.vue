<script setup lang="ts">
import type {HTMLAttributes} from 'vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';

interface Props {
  /**
   * 自定义类名
   */
  class?: HTMLAttributes['class'];

  /**
   * 对话框标题
   */
  title?: string;

  /**
   * 对话框描述
   */
  description?: string;

  /**
   * 是否显示底部按钮区域
   */
  footer?: boolean;

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

const props = withDefaults(defineProps<Props>(), {
  title: '编辑',
  description: '修改相关信息后，点击保存按钮进行保存',
  footer: true,
  confirmText: '保存',
  cancelText: '取消',
  confirmLoading: false,
});

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

// 控制 Dialog 开关状态
const open = defineModel<boolean>('open', {default: false});

// 打开 Dialog
function openDialog() {
  open.value = true;
}

// 关闭 Dialog
function closeDialog() {
  open.value = false;
}

// 确认按钮点击
function handleConfirm() {
  emit('confirm');
}

// 取消按钮点击
function handleCancel() {
  emit('cancel');
  closeDialog();
}

// 暴露方法供外部调用
defineExpose({
  open: openDialog,
  close: closeDialog,
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot name="trigger"/>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <slot name="header">
          <DialogTitle>{{ title }}</DialogTitle>
          <DialogDescription>
            {{ description }}
          </DialogDescription>
        </slot>
      </DialogHeader>
      <div :class="cn('max-h-[78vh] overflow-auto', props.class)">
        <slot/>
      </div>
      <DialogFooter v-if="footer">
        <slot name="footer">
          <Button variant="outline" @click="handleCancel">
            {{ cancelText }}
          </Button>
          <Button :disabled="confirmLoading" @click="handleConfirm">
            <span v-if="confirmLoading" class="i-lucide-loader-2 mr-2 h-4 w-4 animate-spin"/>
            {{ confirmText }}
          </Button>
        </slot>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>