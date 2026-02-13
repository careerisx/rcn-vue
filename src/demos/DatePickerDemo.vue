<script setup lang="ts">
import {ref} from 'vue'
import DatePicker from '@/components/registry/rcn/date-picker/DatePicker.vue'
import CodePreview from '@/components/demo/CodePreview.vue'
import InstallCommand from '@/components/demo/InstallCommand.vue'
import ApiTable, {type ApiItem} from '@/components/demo/ApiTable.vue'

const date1 = ref<string>()
const date2 = ref<string>()

const propsItems: ApiItem[] = [
  {name: 'modelValue', type: 'string', binding: 'v-model', default: '—', description: '选中的日期值（格式：YYYY-MM-DD）'},
  {name: 'placeholder', type: 'string', default: "'请选择日期'", description: '占位符文本'},
  {name: 'showTime', type: 'boolean', default: 'false', description: '是否显示时分秒选择'},
  {name: 'clearable', type: 'boolean', default: 'false', description: '是否允许清除'},
  {name: 'disabled', type: 'boolean', default: 'false', description: '是否禁用'},
  {name: 'format', type: 'string', default: "'YYYY-MM-DD'", description: '日期格式'},
  {name: 'class', type: 'string', default: '—', description: '自定义 CSS 类'},
]

const eventsItems: ApiItem[] = [
  {name: 'change', binding: 'value', type: 'string | undefined', description: '日期变化时触发'},
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">DatePicker</h1>
      <p class="text-muted-foreground mt-1">日期选择器，支持时间选择和清除功能。</p>
    </div>

    <InstallCommand component-name="date-picker"/>

    <h2 id="section-examples" data-toc-id="section-examples" data-toc-text="示例" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">示例</h2>

    <CodePreview title="基本用法" :code="`<DatePicker v-model=&quot;date&quot; />`">
      <div class="max-w-xs space-y-2">
        <DatePicker v-model="date1"/>
        <p class="text-sm text-muted-foreground">选中值：{{ date1 ?? '无' }}</p>
      </div>
    </CodePreview>

    <CodePreview title="带时间选择" :code="`<DatePicker v-model=&quot;date&quot; show-time clearable />`">
      <div class="max-w-xs space-y-2">
        <DatePicker v-model="date2" show-time clearable/>
        <p class="text-sm text-muted-foreground">选中值：{{ date2 ?? '无' }}</p>
      </div>
    </CodePreview>

    <CodePreview title="禁用" :code="`<DatePicker disabled />`">
      <div class="max-w-xs">
        <DatePicker disabled/>
      </div>
    </CodePreview>

    <h2 id="section-api" data-toc-id="section-api" data-toc-text="API 参考" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">API 参考</h2>

    <ApiTable title="Props" :items="propsItems" type="props"/>
    <ApiTable title="Events" :items="eventsItems" type="events"/>
  </div>
</template>
