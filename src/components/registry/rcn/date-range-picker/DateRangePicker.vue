<script setup lang="ts">
import {computed, nextTick, onBeforeUnmount, ref, watch} from 'vue';
import type {DateValue} from '@internationalized/date';
import {CalendarDate, getLocalTimeZone, today} from '@internationalized/date';
import {CalendarIcon, ChevronsLeft, ChevronsRight, Clock, X} from '@lucide/vue';
import {useMediaQuery} from '@vueuse/core';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {RangeCalendar} from '@/components/ui/range-calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import type {DateRange} from 'reka-ui';

/**
 * 日期范围值类型
 */
export interface DateRangeValue {
  start: string;
  end: string;
}

export type DateRangePreset =
    | 'last5Minutes'
    | 'last10Minutes'
    | 'last30Minutes'
    | 'last1Hour'
    | 'last2Hours'
    | 'last6Hours'
    | 'last12Hours'
    | 'last1Day'
    | 'last2Days'
    | 'last3Days'
    | 'last1Week'
    | 'last2Weeks'
    | 'last1Month'
    | 'last3Months'
    | 'last6Months';

type TimeTarget = 'start' | 'end';
type TimePart = 'hour' | 'minute' | 'second';

interface DateRangePresetOption {
  /**
   * 快捷时间值。
   */
  value: DateRangePreset;
  /**
   * 快捷时间显示名称。
   */
  label: string;
  /**
   * 回退数量。
   */
  amount: number;
  /**
   * 回退单位。
   */
  unit: 'minute' | 'hour' | 'day' | 'week' | 'month';
}

interface TimeColumn {
  /**
   * 时间片段字段。
   */
  part: TimePart;
  /**
   * 时间片段标题。
   */
  label: string;
  /**
   * 当前列可选值。
   */
  options: string[];
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
  /**
   * 快捷时间候选项，空数组表示不显示快捷选择。
   */
  presets?: DateRangePreset[];
}

const defaultPresetOptions: DateRangePresetOption[] = [
  {value: 'last5Minutes', label: '最近5分钟', amount: 5, unit: 'minute'},
  {value: 'last10Minutes', label: '最近10分钟', amount: 10, unit: 'minute'},
  {value: 'last30Minutes', label: '最近30分钟', amount: 30, unit: 'minute'},
  {value: 'last1Hour', label: '最近1小时', amount: 1, unit: 'hour'},
  {value: 'last2Hours', label: '最近2小时', amount: 2, unit: 'hour'},
  {value: 'last6Hours', label: '最近6小时', amount: 6, unit: 'hour'},
  {value: 'last12Hours', label: '最近12小时', amount: 12, unit: 'hour'},
  {value: 'last1Day', label: '最近1天', amount: 1, unit: 'day'},
  {value: 'last2Days', label: '最近2天', amount: 2, unit: 'day'},
  {value: 'last3Days', label: '最近3天', amount: 3, unit: 'day'},
  {value: 'last1Week', label: '最近1周', amount: 1, unit: 'week'},
  {value: 'last2Weeks', label: '最近2周', amount: 2, unit: 'week'},
  {value: 'last1Month', label: '最近1个月', amount: 1, unit: 'month'},
  {value: 'last3Months', label: '最近3个月', amount: 3, unit: 'month'},
  {value: 'last6Months', label: '最近6个月', amount: 6, unit: 'month'},
];
const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择日期范围',
  showTime: false,
  clearable: false,
  disabled: false,
  separator: ' ~ ',
  presets: () => [
    'last5Minutes',
    'last10Minutes',
    'last30Minutes',
    'last1Hour',
    'last2Hours',
    'last6Hours',
    'last12Hours',
    'last1Day',
    'last2Days',
    'last3Days',
    'last1Week',
    'last2Weeks',
    'last1Month',
    'last3Months',
    'last6Months',
  ],
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
// 当前打开的时间选择面板
const activeTimePicker = ref<TimeTarget>();
// 右侧日历和时间区域容器
const rightContentRef = ref<HTMLElement>();
// 右侧区域高度，用于限制快捷候选列高度
const rightContentHeight = ref(0);
// 默认占位符
const defaultPlaceholder = today(getLocalTimeZone());
// 小时选项
const hourOptions = createNumberOptions(0, 23);
// 分钟选项
const minuteOptions = createNumberOptions(0, 59);
// 秒选项
const secondOptions = createNumberOptions(0, 59);
// 时间下拉列配置
const timeColumns: TimeColumn[] = [
  {
    part: 'hour',
    label: '时',
    options: hourOptions,
  },
  {
    part: 'minute',
    label: '分',
    options: minuteOptions,
  },
  {
    part: 'second',
    label: '秒',
    options: secondOptions,
  },
];

// 双向绑定
const modelValue = defineModel<DateRangeValue>();
// 当前显示的快捷时间候选项
const visiblePresetOptions = computed(() => defaultPresetOptions.filter(option => props.presets.includes(option.value)));
// 是否可以按当前区间前后平移时间
const canShiftRange = computed(() => Boolean(dateRange.value?.start && dateRange.value?.end));
// 是否为移动端布局
const isMobile = useMediaQuery('(max-width: 640px)');
// 日历显示月份数，移动端使用单月避免溢出。
const calendarMonthCount = computed(() => isMobile.value ? 1 : 2);
let rightContentResizeObserver: ResizeObserver | undefined;

// 格式化日期
function formatDate(date: DateValue): string {
  const d = date.toDate(getLocalTimeZone());
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化时间。
 *
 * @param date 日期
 * @returns 时分秒文本
 */
function formatTime(date: Date): string {
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${hour}:${minute}:${second}`;
}

/**
 * 转换为日历日期。
 *
 * @param date 日期
 * @returns 日历日期
 */
function toCalendarDate(date: Date): CalendarDate {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

/**
 * 合并日期和值中的时间。
 *
 * @param date 日期值
 * @param time 时间文本
 * @returns 完整时间
 */
function createDateTime(date: DateValue, time: string): Date {
  const result = date.toDate(getLocalTimeZone());
  const [hour = 0, minute = 0, second = 0] = time.split(':').map(Number);
  result.setHours(hour, minute, second, 0);
  return result;
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
  updateModelValue();
  if (!props.showTime && value.start && value.end) {
    open.value = false;
  }
}

watch(open, (value, oldValue) => {
  if (!value) {
    activeTimePicker.value = undefined;
    disconnectRightContentObserver();
  }
  if (oldValue && !value) {
    emit('change', modelValue.value);
  }
  if (value) {
    nextTick(() => {
      observeRightContentHeight();
    });
  }
});

watch([startTime, endTime], () => {
  if (props.showTime) {
    updateModelValue();
  }
});

// 更新 modelValue
function updateModelValue() {
  if (!dateRange.value?.start || !dateRange.value?.end) {
    return;
  }

  const startStr = formatDate(dateRange.value.start);
  const endStr = formatDate(dateRange.value.end);

  modelValue.value = props.showTime
      ? {
        start: `${startStr} ${startTime.value}`,
        end: `${endStr} ${endTime.value}`,
      }
      : {
        start: startStr,
        end: endStr,
      };
}

/**
 * 创建固定宽度数字选项。
 *
 * @param start 起始数字
 * @param end 结束数字
 * @returns 数字选项
 */
function createNumberOptions(start: number, end: number): string[] {
  return Array.from({length: end - start + 1}, (_, index) => String(start + index).padStart(2, '0'));
}

/**
 * 读取时间片段。
 *
 * @param value 时间文本
 * @param part 时间片段
 * @returns 时间片段值
 */
function getTimePart(value: string, part: TimePart): string {
  const [hour = '00', minute = '00', second = '00'] = value.split(':');
  if (part === 'hour') return hour;
  if (part === 'minute') return minute;
  return second;
}

/**
 * 获取目标时间值。
 *
 * @param target 时间目标
 * @returns 时间文本
 */
function getTimeValue(target: TimeTarget): string {
  return target === 'start' ? startTime.value : endTime.value;
}

/**
 * 更新时间片段。
 *
 * @param target 更新时间目标
 * @param part 时间片段
 * @param value 时间片段值
 */
function setTimePart(target: TimeTarget, part: TimePart, value: string) {
  const source = getTimeValue(target);
  const parts = source.split(':');
  const nextParts = [
    parts[0] || '00',
    parts[1] || '00',
    parts[2] || '00',
  ];
  if (part === 'hour') {
    nextParts[0] = value;
  } else if (part === 'minute') {
    nextParts[1] = value;
  } else {
    nextParts[2] = value;
  }
  const nextValue = nextParts.join(':');
  if (target === 'start') {
    startTime.value = nextValue;
    return;
  }
  endTime.value = nextValue;
}

/**
 * 更新时间选择面板打开状态。
 *
 * @param target 时间目标
 * @param value 是否打开
 */
function handleTimePickerOpen(target: TimeTarget, value: boolean) {
  activeTimePicker.value = value ? target : undefined;
  if (value) {
    nextTick(() => {
      scrollActiveTimeOptionsIntoView(target);
    });
  }
}

/**
 * 设置完整日期时间范围。
 *
 * @param startDate 开始时间
 * @param endDate 结束时间
 */
function setDateTimeRange(startDate: Date, endDate: Date) {
  dateRange.value = {
    start: toCalendarDate(startDate),
    end: toCalendarDate(endDate),
  };
  startTime.value = formatTime(startDate);
  endTime.value = formatTime(endDate);
  activeTimePicker.value = undefined;
  updateModelValue();
}

/**
 * 按当前时间间隔前后平移范围。
 *
 * @param direction 平移方向
 */
function shiftRange(direction: 'previous' | 'next') {
  if (!dateRange.value?.start || !dateRange.value?.end) {
    return;
  }
  const startDate = createDateTime(dateRange.value.start, startTime.value);
  const endDate = createDateTime(dateRange.value.end, endTime.value);
  const duration = endDate.getTime() - startDate.getTime();
  if (duration <= 0) {
    return;
  }
  const offset = direction === 'previous' ? -duration : duration;
  setDateTimeRange(new Date(startDate.getTime() + offset), new Date(endDate.getTime() + offset));
}

/**
 * 滚动时间列到当前选中值。
 *
 * @param target 时间目标
 */
function scrollActiveTimeOptionsIntoView(target: TimeTarget) {
  const picker = document.querySelector<HTMLElement>(`[data-time-picker="${target}"]`);
  picker?.querySelectorAll<HTMLElement>('[data-time-option-active="true"]').forEach(option => {
    const scrollContainer = option.parentElement;
    if (!scrollContainer) {
      return;
    }
    const optionTop = option.offsetTop - scrollContainer.offsetTop;
    scrollContainer.scrollTop = optionTop - (scrollContainer.clientHeight - option.clientHeight) / 2;
  });
}

/**
 * 同步右侧区域高度。
 */
function syncRightContentHeight() {
  rightContentHeight.value = rightContentRef.value?.offsetHeight || 0;
}

/**
 * 断开右侧区域高度监听。
 */
function disconnectRightContentObserver() {
  rightContentResizeObserver?.disconnect();
  rightContentResizeObserver = undefined;
}

/**
 * 监听右侧区域高度变化。
 */
function observeRightContentHeight() {
  disconnectRightContentObserver();
  syncRightContentHeight();
  if (!rightContentRef.value || typeof ResizeObserver === 'undefined') {
    return;
  }
  rightContentResizeObserver = new ResizeObserver(() => {
    syncRightContentHeight();
  });
  rightContentResizeObserver.observe(rightContentRef.value);
}

/**
 * 按月回退并处理月底溢出。
 *
 * @param date 基准时间
 * @param amount 回退月数
 * @returns 回退后的时间
 */
function subtractMonths(date: Date, amount: number): Date {
  const nextDate = new Date(date);
  const sourceDay = nextDate.getDate();
  nextDate.setDate(1);
  nextDate.setMonth(nextDate.getMonth() - amount);
  const lastDay = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
  nextDate.setDate(Math.min(sourceDay, lastDay));
  return nextDate;
}

/**
 * 根据快捷时间生成开始时间。
 *
 * @param option 快捷时间配置
 * @param endDate 结束时间
 * @returns 开始时间
 */
function createPresetStartDate(option: DateRangePresetOption, endDate: Date): Date {
  const startDate = new Date(endDate);
  if (option.unit === 'minute') {
    startDate.setMinutes(startDate.getMinutes() - option.amount);
  } else if (option.unit === 'hour') {
    startDate.setHours(startDate.getHours() - option.amount);
  } else if (option.unit === 'day') {
    startDate.setDate(startDate.getDate() - option.amount);
  } else if (option.unit === 'week') {
    startDate.setDate(startDate.getDate() - option.amount * 7);
  } else {
    return subtractMonths(endDate, option.amount);
  }
  return startDate;
}

/**
 * 应用快捷时间。
 *
 * @param preset 快捷时间值
 */
function applyPreset(preset: DateRangePreset) {
  const option = defaultPresetOptions.find(item => item.value === preset);
  if (!option) {
    return;
  }
  const endDate = new Date();
  const startDate = createPresetStartDate(option, endDate);
  setDateTimeRange(startDate, endDate);
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
  if (!modelValue.value) {
    dateRange.value = undefined;
    startTime.value = '00:00:00';
    endTime.value = '23:59:59';
    return;
  }

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

// 初始化
parseModelValue();

// 监听外部 modelValue 变化
watch(() => modelValue.value, () => {
  parseModelValue();
}, {deep: true});

onBeforeUnmount(() => {
  disconnectRightContentObserver();
});
</script>

<template>
  <div :class="cn('relative sm:w-88', props.class)">
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
          <CalendarIcon class="mr-1 h-4 w-4 shrink-0"/>
          <span class="truncate">{{ displayValue || placeholder }}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto max-w-[calc(100vw-1rem)] overflow-x-auto p-0" align="start">
        <div class="flex w-max items-start">
          <div
              v-if="visiblePresetOptions.length"
              class="date-range-presets flex w-24 flex-col overflow-hidden border-r bg-muted/10 sm:w-28"
              :style="rightContentHeight ? {'--date-range-right-height': `${rightContentHeight}px`} : undefined"
          >
            <div class="flex shrink-0 items-center justify-between gap-1 border-b bg-muted/30 px-2 py-1.5 sm:px-4">
              <Button
                  variant="ghost"
                  title="向前调整时间范围"
                  :disabled="!canShiftRange"
                  class="inline-flex h-7 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground hover:shadow-sm disabled:pointer-events-none disabled:opacity-50"
                  @click="shiftRange('previous')"
              >
                <ChevronsLeft class="h-3.5 w-3.5"/>
              </Button>
              <Button
                  variant="ghost"
                  title="向后调整时间范围"
                  :disabled="!canShiftRange"
                  class="inline-flex h-7 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground hover:shadow-sm disabled:pointer-events-none disabled:opacity-50"
                  @click="shiftRange('next')"
              >
                <ChevronsRight class="h-3.5 w-3.5"/>
              </Button>
            </div>
            <div class="min-h-0 flex-1 overflow-y-auto px-2 py-1.5">
              <button
                  v-for="preset in visiblePresetOptions"
                  :key="preset.value"
                  type="button"
                  class="flex h-8 w-full items-center whitespace-nowrap rounded-md px-2.5 text-left text-xs text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                  @click="applyPreset(preset.value)"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>
          <div ref="rightContentRef" class="flex shrink-0 flex-col">
            <RangeCalendar
                :model-value="dateRange"
                :default-placeholder="defaultPlaceholder"
                locale="zh-CN"
                initial-focus
                :number-of-months="calendarMonthCount"
                @update:model-value="handleRangeChange"
            />
            <div v-if="showTime" class="w-full min-w-0 border-t bg-muted/30 p-3">
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="flex min-w-0 items-center gap-2">
                  <span class="w-14 shrink-0 text-xs font-medium text-muted-foreground">开始时间</span>
                  <div class="relative min-w-0 flex-1">
                    <Popover
                        :open="activeTimePicker === 'start'"
                        @update:open="value => handleTimePickerOpen('start', value)"
                    >
                      <PopoverTrigger as-child>
                        <button
                            type="button"
                            class="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <span class="font-mono tabular-nums">{{ startTime }}</span>
                          <Clock class="h-4 w-4 text-muted-foreground"/>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                          class="grid w-60 grid-cols-3 overflow-hidden p-0"
                          align="start"
                          data-time-picker="start"
                      >
                        <div
                            v-for="column in timeColumns"
                            :key="column.part"
                            class="border-r last:border-r-0"
                        >
                          <div class="border-b px-2 py-1.5 text-center text-xs text-muted-foreground">{{
                              column.label
                            }}
                          </div>
                          <div class="max-h-48 overflow-y-auto p-1">
                            <button
                                v-for="option in column.options"
                                :key="option"
                                type="button"
                                :data-time-option-active="getTimePart(startTime, column.part) === option"
                                :class="cn(
                                'flex h-7 w-full items-center justify-center rounded-sm text-sm font-mono tabular-nums transition-colors hover:bg-accent hover:text-accent-foreground',
                                getTimePart(startTime, column.part) === option && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                              )"
                                @click="setTimePart('start', column.part, option)"
                            >
                              {{ option }}
                            </button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div class="flex min-w-0 items-center gap-2">
                  <span class="w-14 shrink-0 text-xs font-medium text-muted-foreground">结束时间</span>
                  <div class="relative min-w-0 flex-1">
                    <Popover
                        :open="activeTimePicker === 'end'"
                        @update:open="value => handleTimePickerOpen('end', value)"
                    >
                      <PopoverTrigger as-child>
                        <button
                            type="button"
                            class="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <span class="font-mono tabular-nums">{{ endTime }}</span>
                          <Clock class="h-4 w-4 text-muted-foreground"/>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                          class="grid w-60 grid-cols-3 overflow-hidden p-0"
                          align="end"
                          data-time-picker="end"
                      >
                        <div
                            v-for="column in timeColumns"
                            :key="column.part"
                            class="border-r last:border-r-0"
                        >
                          <div class="border-b px-2 py-1.5 text-center text-xs text-muted-foreground">{{
                              column.label
                            }}
                          </div>
                          <div class="max-h-48 overflow-y-auto p-1">
                            <button
                                v-for="option in column.options"
                                :key="option"
                                type="button"
                                :data-time-option-active="getTimePart(endTime, column.part) === option"
                                :class="cn(
                                'flex h-7 w-full items-center justify-center rounded-sm text-sm font-mono tabular-nums transition-colors hover:bg-accent hover:text-accent-foreground',
                                getTimePart(endTime, column.part) === option && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                              )"
                                @click="setTimePart('end', column.part, option)"
                            >
                              {{ option }}
                            </button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
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

<style scoped>
.date-range-presets {
  max-height: var(--date-range-right-height, 20rem);
}
</style>
