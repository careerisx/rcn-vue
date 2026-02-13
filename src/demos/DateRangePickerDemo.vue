<script setup lang="ts">
import {ref} from 'vue'
import DateRangePicker from '@/components/registry/rcn/date-range-picker/DateRangePicker.vue'
import type {DateRangeValue} from '@/components/registry/rcn/date-range-picker/DateRangePicker.vue'
import CodePreview from '@/components/demo/CodePreview.vue'
import InstallCommand from '@/components/demo/InstallCommand.vue'
import ApiTable, {type ApiItem} from '@/components/demo/ApiTable.vue'

const range1 = ref<DateRangeValue>()
const range2 = ref<DateRangeValue>()

const propsItems: ApiItem[] = [
  {name: 'modelValue', type: 'DateRangeValue', binding: 'v-model', default: '—', description: '选中的日期范围 { start: string, end: string }'},
  {name: 'placeholder', type: 'string', default: "'请选择日期范围'", description: '占位符文本'},
  {name: 'showTime', type: 'boolean', default: 'false', description: '是否显示时分秒选择'},
  {name: 'clearable', type: 'boolean', default: 'false', description: '是否允许清除'},
  {name: 'disabled', type: 'boolean', default: 'false', description: '是否禁用'},
  {name: 'separator', type: 'string', default: "' ~ '", description: '日期范围分隔符'},
  {name: 'class', type: 'string', default: '—', description: '自定义 CSS 类'},
]

const eventsItems: ApiItem[] = [
  {name: 'change', binding: 'value', type: 'DateRangeValue | undefined', description: '日期范围变化时触发'},
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">DateRangePicker</h1>
      <p class="text-muted-foreground mt-1">日期范围选择器，支持双月历、时间选择和清除功能。</p>
    </div>

    <InstallCommand component-name="date-range-picker"/>

    <h2 id="section-examples" data-toc-id="section-examples" data-toc-text="示例" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">示例</h2>

    <CodePreview title="基本用法" :code="`<DateRangePicker v-model=&quot;range&quot; />`">
      <div class="space-y-2">
        <DateRangePicker v-model="range1"/>
        <p class="text-sm text-muted-foreground">选中值：{{ range1 ? `${range1.start} ~ ${range1.end}` : '无' }}</p>
      </div>
    </CodePreview>

    <CodePreview title="带时间和清除" :code="`<DateRangePicker v-model=&quot;range&quot; show-time clearable />`">
      <div class="space-y-2">
        <DateRangePicker v-model="range2" show-time clearable/>
        <p class="text-sm text-muted-foreground">选中值：{{ range2 ? `${range2.start} ~ ${range2.end}` : '无' }}</p>
      </div>
    </CodePreview>

    <CodePreview title="禁用" :code="`<DateRangePicker disabled />`">
      <DateRangePicker disabled/>
    </CodePreview>

    <h2 id="section-api" data-toc-id="section-api" data-toc-text="API 参考" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">API 参考</h2>

    <ApiTable title="Props" :items="propsItems" type="props"/>
    <ApiTable title="Events" :items="eventsItems" type="events"/>
  </div>
</template>
