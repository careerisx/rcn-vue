<script setup lang="ts" generic="T extends Record<string, any>">
import {computed, type CSSProperties, type HTMLAttributes, type MaybeRefOrGetter, provide, toValue, watch} from 'vue';
import type {TypedSchema} from 'vee-validate';
import {useForm} from 'vee-validate';
import {CircleHelp} from 'lucide-vue-next';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Spinner} from '@/components/ui/spinner';
import {Input} from '@/components/ui/input';
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import {Textarea} from '@/components/ui/textarea';
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field';
import Selector, {type SelectOption} from '../selector/Selector.vue';
import DatePicker from '../date-picker/DatePicker.vue';

/**
 * 表单字段配置项
 */
export interface FormFieldItem {
  /**
   * 字段名称（对应 schema 中的 key）
   */
  name: string;
  /**
   * 标签文本
   */
  label?: string;
  /**
   * 占位符
   */
  placeholder?: string;
  /**
   * 描述文本
   */
  description?: string;
  /**
   * 输入类型
   */
  type?: 'text' | 'password' | 'email' | 'number' | 'textarea' | 'select' | 'datePicker';
  /**
   * 栅格列数（用于布局）
   */
  span?: number;
  /**
   * 是否隐藏（可以是布尔值、ref或接收表单值的函数）
   */
  hidden?: MaybeRefOrGetter<boolean> | ((values: any) => boolean);
  /**
   * 额外的 CSS 类
   */
  class?: HTMLAttributes['class'];
  /**
   * NumberField 特有配置（type 为 number 时使用）
   */
  numberFieldOptions?: {
    /**
     * 最小值
     */
    min?: number;
    /**
     * 最大值
     */
    max?: number;
    /**
     * 步长，默认为 1
     */
    step?: number;
    /**
     * 格式化选项，如 { useGrouping: false } 禁用千位符
     */
    formatOptions?: Intl.NumberFormatOptions;
  };
  /**
   * Select 选项（type 为 select 时使用）
   */
  selectFieldOptions?: {
    /**
     * Select 是否允许清除值（type 为 select 时使用）
     */
    clearable?: boolean;
    /**
     * 选项列表
     */
    selections: MaybeRefOrGetter<SelectOption[]>;
  };
  /**
   * DatePicker 选项（type 为 datePicker 时使用）
   */
  datePickerOptions?: {
    /**
     * 是否显示时分秒
     */
    showTime?: boolean;
    /**
     * 是否允许清除
     */
    clearable?: boolean;
  };
}

interface Props {
  /**
   * 表单值（v-model 绑定）
   */
  modelValue?: T;
  /**
   * 额外的 CSS 类
   */
  class?: HTMLAttributes['class'];
  /**
   * 表单容器的 CSS 类
   */
  formClass?: HTMLAttributes['class'];
  /**
   * 表单验证 schema（使用 toTypedSchema 转换后的 zod schema）
   */
  schema?: TypedSchema<T>;
  /**
   * 表单初始值
   */
  initialValues?: Record<string, any>;
  /**
   * 表单字段配置
   */
  fields?: FormFieldItem[];
  /**
   * 布局列数
   */
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * 字段间距
   */
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * 标签位置
   */
  labelPosition?: 'top' | 'left';
  /**
   * 标签宽度（labelPosition 为 left 时生效）
   */
  labelWidth?: string;
  /**
   * 是否显示提交按钮
   */
  showSubmit?: boolean;
  /**
   * 提交按钮文本
   */
  submitText?: string;
  /**
   * 是否显示取消按钮
   */
  showCancel?: boolean;
  /**
   * 取消按钮文本
   */
  cancelText?: string;
  /**
   * 是否显示重置按钮
   */
  showReset?: boolean;
  /**
   * 重置按钮文本
   */
  resetText?: string;
  /**
   * 是否正在加载中
   */
  loading?: boolean;
  /**
   * 是否禁用表单
   */
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  fields: () => [],
  cols: 1,
  gap: 'md',
  labelPosition: 'top',
  labelWidth: '4rem',
  showSubmit: true,
  submitText: '提交',
  showCancel: false,
  cancelText: '取消',
  showReset: false,
  resetText: '重置',
  loading: false,
  disabled: false,
});

const emit = defineEmits<{
  (event: 'update:modelValue', values: T): void;
  (event: 'submit', values: T): void;
  (event: 'cancel'): void;
  (event: 'reset'): void;
}>();

// 使用 vee-validate 的 useForm
const form = useForm({
  validationSchema: props.schema,
  initialValues: props.modelValue || props.initialValues,
});

// 提交表单处理
const onSubmit = form.handleSubmit((values: T) => {
  if (!props.disabled && !props.loading) {
    // 合并 modelValue 中的非表单字段和表单提交的值
    // 这样可以保留 modelValue 中存在但表单中没有定义的字段（如 id、projectId 等）
    const mergedValues = props.modelValue
        ? { ...props.modelValue, ...values }
        : values;

    // 更新 v-model 和触发 submit 事件
    emit('update:modelValue', mergedValues as T);
    emit('submit', mergedValues as T);
  }
});

// 取消处理
function handleCancel() {
  emit('cancel');
}

// 重置表单
function handleReset() {
  form.resetForm();
  emit('reset');
}

// 计算布局类
const gridClass = computed(() => {
  const colsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
  };
  const gapMap = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };
  return `grid ${colsMap[props.cols]} ${gapMap[props.gap]} items-start content-start`;
});

// 计算字段 span 类
function getSpanClass(span?: number) {
  if (!span || span === 1) return '';
  const spanMap: Record<number, string> = {
    2: 'md:col-span-2',
    3: 'md:col-span-2 lg:col-span-3',
    4: 'md:col-span-2 lg:col-span-4',
  };
  return spanMap[span] || '';
}

// 计算 FormItem 类（用于左侧标签布局）
const formItemClass = computed(() => {
  if (props.labelPosition === 'left') {
    return 'flex flex-row items-start gap-4';
  }
  return '';
});

// 计算 FormLabel 样式
const labelStyle = computed<CSSProperties>(() => {
  if (props.labelPosition === 'left') {
    return {
      display: 'flex',
      justifyContent: 'end',
      width: props.labelWidth,
      flexShrink: 0,
      paddingTop: '0.8rem',
    };
  }
  return {};
});

// 可见字段（依赖表单值以触发重新计算）
const visibleFields = computed(() => {
  // 访问 form.values 以建立响应式依赖
  const currentValues = form.values;
  return props.fields.filter(f => {
    if (!f.hidden) return true;
    // 如果 hidden 是函数且参数长度为1，传入表单值
    if (typeof f.hidden === 'function' && f.hidden.length === 1) {
      return !(f.hidden as (values: any) => boolean)(currentValues);
    }
    // 否则使用 toValue 处理
    return !toValue(f.hidden as MaybeRefOrGetter<boolean>);
  });
});

// 监听 modelValue 的变化，更新表单值
watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue) {
        form.setValues(newValue as any);
      }
    },
    {deep: true}
);

// 监听表单值的变化，更新 modelValue（实现双向绑定）
watch(
    () => form.values,
    (newValues) => {
      if (props.modelValue) {
        // 合并原有的 modelValue 和新的表单值
        emit('update:modelValue', { ...props.modelValue, ...newValues } as T);
      }
    },
    { deep: true }
);

// 向子组件提供 form 实例
provide('mForm', form);

// 暴露 form 实例供外部使用
defineExpose({
  form,
  validate: form.validate,
  resetForm: form.resetForm,
  setValues: form.setValues,
  setFieldValue: form.setFieldValue,
  setErrors: form.setErrors,
  values: form.values,
  errors: form.errors,
  isSubmitting: form.isSubmitting,
  isValidating: form.isValidating,
});
</script>

<template>
  <form :class="cn('w-full', props.class)" @submit="onSubmit">
    <slot name="header"/>
    <div :class="cn('p-1', props.formClass, gridClass, { 'opacity-60 pointer-events-none': disabled })">
      <!-- 根据配置渲染表单字段 -->
      <template v-for="field in visibleFields" :key="field.name">
        <FormField v-slot="{ componentField }" :name="field.name">
          <FormItem :class="cn(getSpanClass(field.span), formItemClass, field.class)">
            <FormLabel v-if="field.label" :style="labelStyle" class="inline-flex items-center gap-1">
              {{ field.label }}
              <TooltipProvider v-if="field.description">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <CircleHelp class="h-3.5 w-3.5 text-muted-foreground cursor-help"/>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p class="max-w-xs">{{ field.description }}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <div :class="{ 'flex-1': labelPosition === 'left' }">
              <FormControl>
                <!-- 自定义插槽 -->
                <slot :name="'field-' + field.name" :field="componentField" :item="field" :form="form">
                  <!-- 默认渲染 Input -->
                  <NumberField v-if="field.type==='number'" :min="field.numberFieldOptions?.min"
                               :max="field.numberFieldOptions?.max" :step="field.numberFieldOptions?.step ?? 1"
                               :format-options="field.numberFieldOptions?.formatOptions ?? { useGrouping: false }"
                               :model-value="componentField.modelValue"
                               @update:model-value="(val: any) => componentField['onUpdate:modelValue']?.(val)">
                    <NumberFieldContent>
                      <NumberFieldDecrement/>
                      <NumberFieldInput :placeholder="field.placeholder"/>
                      <NumberFieldIncrement/>
                    </NumberFieldContent>
                  </NumberField>
                  <Selector v-else-if="field.type==='select'" :model-value="componentField.modelValue"
                            @update:model-value="componentField['onUpdate:modelValue']" :placeholder="field.placeholder"
                            :options="field.selectFieldOptions?.selections"
                            :clearable="field.selectFieldOptions?.clearable"/>
                  <DatePicker v-else-if="field.type==='datePicker'" :model-value="componentField.modelValue"
                              @update:model-value="componentField['onUpdate:modelValue']"
                              :placeholder="field.placeholder"
                              :show-time="field.datePickerOptions?.showTime"
                              :clearable="field.datePickerOptions?.clearable"/>
                  <Textarea v-else-if="field.type==='textarea'" :placeholder="field.placeholder"
                            v-bind="componentField"/>
                  <Input v-else :type="field.type?? 'text'" :placeholder="field.placeholder"
                         v-bind="componentField"/>
                </slot>
              </FormControl>
              <FormMessage/>
            </div>
          </FormItem>
        </FormField>
      </template>

      <!-- 额外字段插槽 -->
      <slot name="extra" :form="form"/>
    </div>
    <!-- 表单操作按钮 -->
    <div v-if="showSubmit || showCancel || showReset || $slots.actions"
         class="flex items-center justify-end gap-3 pt-6">
      <slot name="actions" :form="form">
        <Button v-if="showCancel" type="button" variant="outline" :disabled="loading" @click="handleCancel">
          {{ cancelText }}
        </Button>
        <Button v-if="showReset" type="button" variant="ghost" :disabled="loading" @click="handleReset">
          {{ resetText }}
        </Button>
        <Button v-if="showSubmit" type="submit" :disabled="loading || disabled">
          <Spinner v-if="loading" class="mr-2"/>
          {{ submitText }}
        </Button>
      </slot>
    </div>
  </form>
</template>
