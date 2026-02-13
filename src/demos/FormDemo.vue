<script setup lang="ts">
import {ref} from 'vue'
import {toTypedSchema} from '@vee-validate/zod'
import * as z from 'zod'
import Form from '@/components/registry/rcn/form/Form.vue'
import type {FormFieldItem} from '@/components/registry/rcn/form/Form.vue'
import CodePreview from '@/components/demo/CodePreview.vue'
import InstallCommand from '@/components/demo/InstallCommand.vue'
import ApiTable, {type ApiItem} from '@/components/demo/ApiTable.vue'

// ========== 示例 1: 基本表单 ==========
const basicForm = ref({username: '', email: ''})

const basicSchema = toTypedSchema(z.object({
  username: z.string().min(2, '用户名至少 2 个字符'),
  email: z.string().email('邮箱格式不正确'),
}))

const basicFields: FormFieldItem[] = [
  {name: 'username', label: '用户名', placeholder: '请输入用户名'},
  {name: 'email', label: '邮箱', type: 'email', placeholder: 'name@example.com'},
]

const basicSubmitted = ref('')

function onBasicSubmit(values: any) {
  basicSubmitted.value = JSON.stringify(values, null, 2)
  setTimeout(() => basicSubmitted.value = '', 3000)
}

// ========== 示例 2: 多列布局 ==========
const layoutForm = ref({firstName: '', lastName: '', email: '', phone: '', address: ''})

const layoutFields: FormFieldItem[] = [
  {name: 'firstName', label: '名', placeholder: '名'},
  {name: 'lastName', label: '姓', placeholder: '姓'},
  {name: 'email', label: '邮箱', type: 'email', placeholder: 'name@example.com'},
  {name: 'phone', label: '电话', placeholder: '13800138000'},
  {name: 'address', label: '地址', placeholder: '详细地址', span: 2},
]

// ========== 示例 3: 字段类型 ==========
const typesForm = ref({name: '', age: 0, role: '', birthday: '', bio: ''})

const typesFields: FormFieldItem[] = [
  {name: 'name', label: '姓名', placeholder: '请输入姓名'},
  {name: 'age', label: '年龄', type: 'number', numberFieldOptions: {min: 0, max: 150, step: 1}},
  {
    name: 'role', label: '角色', type: 'select',
    selectFieldOptions: {
      clearable: true,
      selections: [
        {label: '管理员', value: 'admin'},
        {label: '编辑', value: 'editor'},
        {label: '用户', value: 'user'},
      ],
    },
  },
  {name: 'birthday', label: '生日', type: 'datePicker', placeholder: '选择日期'},
  {name: 'bio', label: '简介', type: 'textarea', placeholder: '介绍一下自己...', span: 2},
]

// ========== 示例 4: 条件显隐 ==========
const conditionalForm = ref({needInvoice: '', invoiceTitle: '', taxNumber: ''})

const conditionalFields: FormFieldItem[] = [
  {
    name: 'needInvoice', label: '是否需要发票', type: 'select',
    selectFieldOptions: {
      selections: [
        {label: '是', value: 'yes'},
        {label: '否', value: 'no'},
      ],
    },
  },
  {
    name: 'invoiceTitle', label: '发票抬头', placeholder: '公司名称',
    hidden: (values: any) => values.needInvoice !== 'yes',
  },
  {
    name: 'taxNumber', label: '税号', placeholder: '纳税人识别号',
    hidden: (values: any) => values.needInvoice !== 'yes',
  },
]

// ========== 示例 5: 带 tooltip ==========
const descForm = ref({apiKey: '', webhookUrl: ''})

const descFields: FormFieldItem[] = [
  {name: 'apiKey', label: 'API Key', placeholder: 'sk-xxxxxxxx', description: '从设置页面中获取你的 API 密钥'},
  {name: 'webhookUrl', label: 'Webhook URL', placeholder: 'https://...', description: '事件通知的回调地址，需要支持 POST 请求'},
]

// ========== API 文档 ==========
const propsItems: ApiItem[] = [
  {name: 'modelValue', type: 'T', binding: 'v-model', default: '—', description: '表单数据双向绑定'},
  {name: 'schema', type: 'TypedSchema<T>', default: '—', description: '验证 schema（toTypedSchema(z.object(...))）'},
  {name: 'fields', type: 'FormFieldItem[]', default: '[]', description: '字段配置列表'},
  {name: 'initialValues', type: 'Record<string, any>', default: '—', description: '表单初始值'},
  {name: 'cols', type: '1 | 2 | 3 | 4 | 5 | 6', default: '1', description: '栅格列数'},
  {name: 'gap', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: '字段间距'},
  {name: 'labelPosition', type: "'top' | 'left'", default: "'top'", description: '标签位置'},
  {name: 'labelWidth', type: 'string', default: "'4rem'", description: '标签宽度（labelPosition=left 时）'},
  {name: 'showSubmit', type: 'boolean', default: 'true', description: '显示提交按钮'},
  {name: 'submitText', type: 'string', default: "'提交'", description: '提交按钮文本'},
  {name: 'showCancel', type: 'boolean', default: 'false', description: '显示取消按钮'},
  {name: 'cancelText', type: 'string', default: "'取消'", description: '取消按钮文本'},
  {name: 'showReset', type: 'boolean', default: 'false', description: '显示重置按钮'},
  {name: 'resetText', type: 'string', default: "'重置'", description: '重置按钮文本'},
  {name: 'loading', type: 'boolean', default: 'false', description: '提交加载状态'},
  {name: 'disabled', type: 'boolean', default: 'false', description: '禁用整个表单'},
  {name: 'class', type: 'string', default: '—', description: '外层自定义 CSS 类'},
  {name: 'formClass', type: 'string', default: '—', description: '表单容器自定义 CSS 类'},
]

const fieldItems: ApiItem[] = [
  {name: 'name', type: 'string', default: '—', description: '字段名（对应 schema key，必传）'},
  {name: 'label', type: 'string', default: '—', description: '标签文本'},
  {name: 'type', type: "'text' | 'password' | 'email' | 'number' | 'textarea' | 'select' | 'datePicker'", default: "'text'", description: '字段类型'},
  {name: 'placeholder', type: 'string', default: '—', description: '占位符'},
  {name: 'description', type: 'string', default: '—', description: '描述文本（tooltip 形式显示）'},
  {name: 'span', type: 'number', default: '1', description: '栅格列跨度'},
  {name: 'hidden', type: '(values) => boolean | Ref<boolean>', default: '—', description: '条件隐藏'},
  {name: 'numberFieldOptions', type: '{ min?, max?, step? }', default: '—', description: 'type=number 时的配置'},
  {name: 'selectFieldOptions', type: '{ selections, clearable? }', default: '—', description: 'type=select 时的配置'},
  {name: 'datePickerOptions', type: '{ showTime?, clearable? }', default: '—', description: 'type=datePicker 时的配置'},
  {name: 'class', type: 'string', default: '—', description: '字段自定义 CSS 类'},
]

const slotsItems: ApiItem[] = [
  {name: 'field-{name}', binding: '{ field, item, form }', type: 'componentField, FormFieldItem, FormContext', description: '自定义某个字段的渲染'},
  {name: 'header', binding: '—', type: '—', description: '表单顶部区域'},
  {name: 'extra', binding: '{ form }', type: 'FormContext', description: '字段列表后的额外内容'},
  {name: 'actions', binding: '{ form }', type: 'FormContext', description: '自定义操作按钮区域'},
]

const eventsItems: ApiItem[] = [
  {name: 'submit', binding: 'values', type: 'T', description: '验证通过后触发'},
  {name: 'cancel', binding: '—', type: 'void', description: '取消按钮点击'},
  {name: 'reset', binding: '—', type: 'void', description: '重置按钮点击'},
]

const exposeItems: ApiItem[] = [
  {name: 'form', binding: '—', type: 'FormContext', description: 'vee-validate useForm 实例'},
  {name: 'validate()', binding: '—', type: '() => Promise', description: '手动触发验证'},
  {name: 'resetForm()', binding: '—', type: '() => void', description: '重置表单'},
  {name: 'setValues()', binding: 'values', type: '(values: T) => void', description: '设置表单值'},
  {name: 'setFieldValue()', binding: 'name, value', type: '(name, value) => void', description: '设置单个字段值'},
]

// ---------- 代码字符串 ----------
const basicCode = `const schema = toTypedSchema(z.object({
  username: z.string().min(2, '用户名至少 2 个字符'),
  email: z.string().email('邮箱格式不正确'),
}))

const fields: FormFieldItem[] = [
  { name: 'username', label: '用户名', placeholder: '请输入用户名' },
  { name: 'email', label: '邮箱', type: 'email', placeholder: 'name@example.com' },
]

<Form v-model="formData" :schema="schema" :fields="fields" @submit="onSubmit" />`

const layoutCode = `const fields: FormFieldItem[] = [
  { name: 'firstName', label: '名' },
  { name: 'lastName', label: '姓' },
  { name: 'email', label: '邮箱', type: 'email' },
  { name: 'phone', label: '电话' },
  { name: 'address', label: '地址', span: 2 },  // 占两列
]

<Form v-model="form" :fields="fields" :cols="2" show-reset show-cancel />`

const typesCode = `const fields: FormFieldItem[] = [
  { name: 'name', label: '姓名' },
  { name: 'age', label: '年龄', type: 'number',
    numberFieldOptions: { min: 0, max: 150, step: 1 } },
  { name: 'role', label: '角色', type: 'select',
    selectFieldOptions: {
      clearable: true,
      selections: [
        { label: '管理员', value: 'admin' },
        { label: '编辑', value: 'editor' },
      ],
    } },
  { name: 'birthday', label: '生日', type: 'datePicker' },
  { name: 'bio', label: '简介', type: 'textarea', span: 2 },
]`

const conditionalCode = `const fields: FormFieldItem[] = [
  { name: 'needInvoice', label: '是否需要发票', type: 'select', ... },
  // hidden 接受 (values) => boolean
  { name: 'invoiceTitle', label: '发票抬头',
    hidden: (values) => values.needInvoice !== 'yes' },
  { name: 'taxNumber', label: '税号',
    hidden: (values) => values.needInvoice !== 'yes' },
]`

const descCode = `const fields: FormFieldItem[] = [
  { name: 'apiKey', label: 'API Key',
    description: '从设置页面中获取你的 API 密钥' },
  { name: 'webhookUrl', label: 'Webhook URL',
    description: '事件通知的回调地址' },
]`
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Form</h1>
      <p class="text-muted-foreground mt-1">
        通用表单组件，基于 vee-validate + zod，支持声明式字段配置、多种字段类型、栅格布局、验证和条件显隐。
      </p>
    </div>

    <InstallCommand component-name="form"/>

    <h2 id="section-examples" data-toc-id="section-examples" data-toc-text="示例" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">示例</h2>

    <!-- 基本用法 -->
    <CodePreview title="基本用法 + Zod 验证" :code="basicCode">
      <div class="max-w-md">
        <Form v-model="basicForm" :schema="basicSchema" :fields="basicFields" @submit="onBasicSubmit"/>
        <pre v-if="basicSubmitted"
             class="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">{{ basicSubmitted }}</pre>
      </div>
    </CodePreview>

    <!-- 多列布局 -->
    <CodePreview title="多列布局 + span 跨列" :code="layoutCode">
      <Form v-model="layoutForm" :fields="layoutFields" :cols="2" show-reset show-cancel @submit="() => {}"/>
    </CodePreview>

    <!-- 字段类型 -->
    <CodePreview title="所有字段类型" :code="typesCode">
      <Form v-model="typesForm" :fields="typesFields" :cols="2" :show-submit="false"/>
    </CodePreview>

    <!-- 条件显隐 -->
    <CodePreview title="条件显隐" :code="conditionalCode">
      <div class="max-w-md">
        <Form v-model="conditionalForm" :fields="conditionalFields" submit-text="保存" @submit="() => {}"/>
      </div>
    </CodePreview>

    <!-- 描述 tooltip -->
    <CodePreview title="字段描述 Tooltip" :code="descCode">
      <div class="max-w-md">
        <Form v-model="descForm" :fields="descFields" :show-submit="false"/>
      </div>
    </CodePreview>

    <h2 id="section-api" data-toc-id="section-api" data-toc-text="API 参考" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">API 参考</h2>

    <ApiTable title="Props" :items="propsItems" type="props"/>
    <ApiTable title="FormFieldItem 字段配置" :items="fieldItems" type="props"/>
    <ApiTable title="Slots" :items="slotsItems" type="slots"/>
    <ApiTable title="Events" :items="eventsItems" type="events"/>
    <ApiTable title="Expose" :items="exposeItems" type="events"/>
  </div>
</template>
