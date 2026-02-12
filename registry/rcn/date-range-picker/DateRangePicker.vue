<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import type {DateValue} from '@internationalized/date';
import {getLocalTimeZone, today, CalendarDate} from '@internationalized/date';
import {CalendarIcon, X} from 'lucide-vue-next';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {RangeCalendar} from '@/components/ui/range-calendar';
import {Input} from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type {DateRange} from 'reka-ui';

/**
 * 日期范围值类型
 */
export interface DateRangeValue {
  start: string;
  end: string;
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
   * 分隔符
   */
  separator?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择日期范围',
  showTime: false,
  clearable: false,
  disabled: false,
  separator: ' ~ ',
});

const emit = defineEmits<{
  (e: 'change', value: DateRangeValue | undefined): void;
}>();

// 日期范围值
const dateRange = ref<DateRange>();
// 开始时间
const startTime = ref('00:00:00');
// 结束时间
const endTime = ref('23:59:59');
// 弹出框打开状态
const open = ref(false);
// 默认占位符
const defaultPlaceholder = today(getLocalTimeZone());

// 双向绑定
const modelValue = defineModel<DateRangeValue>();

// 格式化日期
function formatDate(date: DateValue): string {
  const d = date.toDate(getLocalTimeZone());
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 格式化显示
const displayValue = computed(() => {
  if (!dateRange.value?.start || !dateRange.value?.end) return '';

  const startStr = formatDate(dateRange.value.start);
  const endStr = formatDate(dateRange.value.end);

  if (props.showTime) {
    return `${startStr} ${startTime.value}${props.separator}${endStr} ${endTime.value}`;
  }
  return `${startStr}${props.separator}${endStr}`;
});

// 监听日期范围变化
function handleRangeChange(value: DateRange) {
  dateRange.value = value;
  if (!props.showTime && value.start && value.end) {
    updateModelValue();
    open.value = false;
  }
}

// 更新 modelValue
function updateModelValue() {
  if (!dateRange.value?.start || !dateRange.value?.end) {
    modelValue.value = undefined;
    emit('change', undefined);
    return;
  }

  const startStr = formatDate(dateRange.value.start);
  const endStr = formatDate(dateRange.value.end);

  const newValue: DateRangeValue = props.showTime
      ? {
        start: `${startStr} ${startTime.value}`,
        end: `${endStr} ${endTime.value}`,
      }
      : {
        start: startStr,
        end: endStr,
      };

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
  dateRange.value = undefined;
  startTime.value = '00:00:00';
  endTime.value = '23:59:59';
  modelValue.value = undefined;
  emit('change', undefined);
}

// 初始化：从 modelValue 解析日期
function parseModelValue() {
  if (modelValue.value) {
    const {start, end} = modelValue.value;

    const startParts = start.split(' ');
    const endParts = end.split(' ');

    const [startYear, startMonth, startDay] = startParts[0]!.split('-').map(Number);
    const [endYear, endMonth, endDay] = endParts[0]!.split('-').map(Number);

    if (startYear && startMonth && startDay && endYear && endMonth && endDay) {
      dateRange.value = {
        start: new CalendarDate(startYear, startMonth, startDay),
        end: new CalendarDate(endYear, endMonth, endDay),
      };
      startTime.value = startParts[1] || '00:00:00';
      endTime.value = endParts[1] || '23:59:59';
    }
  }
}

// 初始化
parseModelValue();

// 监听外部 modelValue 变化
watch(() => modelValue.value, () => {
  parseModelValue();
}, {deep: true});
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
            !dateRange?.start && 'text-muted-foreground',
            clearable && dateRange?.start && 'pr-8'
          )"
        >
          <CalendarIcon class="mr-2 h-4 w-4 shrink-0"/>
          <span class="truncate">{{ displayValue || placeholder }}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <RangeCalendar
            :model-value="dateRange"
            :default-placeholder="defaultPlaceholder"
            locale="zh-CN"
            initial-focus
            :number-of-months="2"
            @update:model-value="handleRangeChange"
        />
        <div v-if="showTime" class="border-t p-3 space-y-3">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="text-sm text-muted-foreground w-16">开始时间:</span>
              <Input
                  v-model="startTime"
                  type="time"
                  step="1"
                  class="w-32"
              />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-muted-foreground w-16">结束时间:</span>
              <Input
                  v-model="endTime"
                  type="time"
                  step="1"
                  class="w-32"
              />
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <Button size="sm" variant="outline" @click="open = false">取消</Button>
            <Button size="sm" @click="handleConfirm">确定</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
    <button
        v-if="clearable && dateRange?.start && !disabled"
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-sm hover:bg-muted"
        @click="handleClear"
    >
      <X class="h-3.5 w-3.5 text-muted-foreground"/>
    </button>
  </div>
</template>