<script setup lang="ts">
import {computed, ref} from 'vue';
import type {DateValue} from '@internationalized/date';
import {getLocalTimeZone, today, CalendarDate} from '@internationalized/date';
import {CalendarIcon, X} from 'lucide-vue-next';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Input} from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
   * 是否显示时分秒
   */
  showTime?: boolean;
  /**
   * 是否允许清除
   */
  clearable?: boolean;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 日期格式
   */
  format?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择日期',
  showTime: false,
  clearable: false,
  disabled: false,
  format: 'YYYY-MM-DD',
});

const emit = defineEmits<{
  (e: 'change', value: string | undefined): void;
}>();

// 日期值
const dateValue = ref<DateValue>();
// 时间值
const timeValue = ref('00:00:00');
// 弹出框打开状态
const open = ref(false);
// 默认占位符
const defaultPlaceholder = today(getLocalTimeZone());

// 双向绑定
const modelValue = defineModel<string>();

// 格式化日期显示
const displayValue = computed(() => {
  if (!dateValue.value) return '';
  const date = dateValue.value.toDate(getLocalTimeZone());
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  if (props.showTime) {
    return `${year}-${month}-${day} ${timeValue.value}`;
  }
  return `${year}-${month}-${day}`;
});

// 监听日期变化
function handleDateChange(value: DateValue | undefined) {
  dateValue.value = value;
  if (!props.showTime && value) {
    updateModelValue();
    open.value = false;
  }
}

// 更新 modelValue
function updateModelValue() {
  const newValue = displayValue.value || undefined;
  modelValue.value = newValue;
  emit('change', newValue);
}

// 确认选择（带时间时使用）
function handleConfirm() {
  updateModelValue();
  open.value = false;
}

// 清除值
function handleClear(e: Event) {
  e.stopPropagation();
  dateValue.value = undefined;
  timeValue.value = '00:00:00';
  modelValue.value = undefined;
  emit('change', undefined);
}

// 初始化：从 modelValue 解析日期
function parseModelValue() {
  if (modelValue.value) {
    const parts = modelValue.value.split(' ');
    const datePart = parts[0];
    const timePart = parts[1] || '00:00:00';

    const [year, month, day] = datePart!.split('-').map(Number);
    if (year && month && day) {
      dateValue.value = new CalendarDate(year, month, day);
      timeValue.value = timePart;
    }
  }
}

// 初始化
parseModelValue();
</script>

<template>
  <div :class="cn('relative', props.class)">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
            variant="outline"
            :disabled="disabled"
            :class="cn(
            'w-full justify-start text-left font-normal',
            !dateValue && 'text-muted-foreground',
            clearable && dateValue && 'pr-8'
          )"
        >
          <CalendarIcon class="mr-2 h-4 w-4"/>
          {{ displayValue || placeholder }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <Calendar
            :model-value="dateValue"
            :default-placeholder="defaultPlaceholder"
            layout="month-and-year"
            locale="zh-CN"
            initial-focus
            @update:model-value="handleDateChange"
            class="w-full"
        />
        <div v-if="showTime" class="border-t p-3 space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-sm text-muted-foreground w-12">时间:</span>
            <Input
                v-model="timeValue"
                type="time"
                step="1"
                class="flex-1"
            />
          </div>
          <div class="flex justify-end gap-2">
            <Button size="sm" variant="outline" @click="open = false">取消</Button>
            <Button size="sm" @click="handleConfirm">确定</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
    <button
        v-if="clearable && dateValue && !disabled"
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-sm hover:bg-muted"
        @click="handleClear"
    >
      <X class="h-3.5 w-3.5 text-muted-foreground"/>
    </button>
  </div>
</template>