<script setup lang="ts">
import {X} from 'lucide-vue-next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {cn} from '@/lib/utils';
import {type MaybeRefOrGetter, toValue} from "vue";

/**
 * Select 选项
 */
export interface SelectOption {
  /**
   * 显示的标签文本
   */
  label: string;
  /**
   * 实际的值
   */
  value: any;
  /**
   * 是否禁用此选项
   */
  disabled?: boolean;
}

interface Props {
  /**
   * 自定义类名
   */
  class?: string;
  /**
   * 占位符
   */
  placeholder?: string;
  /**
   * 选项列表
   */
  options?: MaybeRefOrGetter<SelectOption[]>;
  /**
   * 是否允许清除值
   */
  clearable?: boolean;
  /**
   * 是否禁用
   */
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  clearable: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'change', value: any): void;
}>();

const modelValue = defineModel<any>();

/**
 * 值变化处理
 */
function handleChange(val: any) {
  modelValue.value = val;
  emit('change', val);
}

/**
 * 清除选中值
 */
function handleClear() {
  modelValue.value = undefined;
  emit('change', undefined);
}
</script>

<template>
  <div :class="cn('relative w-full', props.class)">
    <Select v-model:model-value="modelValue" @update:model-value="handleChange" :disabled="disabled">
      <SelectTrigger class="w-full" :class="{'pr-8': clearable && modelValue}">
        <SelectValue :placeholder="placeholder"/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="option in toValue(options)" :key="option.value" :value="option.value"
                    :disabled="option.disabled ?? false">
          {{ option.label }}
        </SelectItem>
      </SelectContent>
    </Select>
    <button v-if="clearable && modelValue" type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-sm hover:bg-muted" @click.stop="handleClear">
      <X class="h-3.5 w-3.5 text-muted-foreground"/>
    </button>
  </div>
</template>
