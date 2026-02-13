<script setup lang="ts">
import Selector from '@/components/registry/rcn/selector/Selector.vue'
import CodePreview from '@/components/demo/CodePreview.vue'
import InstallCommand from '@/components/demo/InstallCommand.vue'
import ApiTable, {type ApiItem} from '@/components/demo/ApiTable.vue'
import {ref} from 'vue'

const value1 = ref()
const value2 = ref()

const options = [
  {label: 'Vue', value: 'vue'},
  {label: 'React', value: 'react'},
  {label: 'Angular', value: 'angular'},
  {label: 'Svelte', value: 'svelte', disabled: true},
]

const propsItems: ApiItem[] = [
  {name: 'modelValue', type: 'any', binding: 'v-model', default: '—', description: '选中的值'},
  {name: 'options', type: 'SelectOption[]', default: '[]', description: '选项列表 { label, value, disabled? }'},
  {name: 'placeholder', type: 'string', default: '—', description: '占位符文本'},
  {name: 'clearable', type: 'boolean', default: 'false', description: '是否允许清除选中值'},
  {name: 'disabled', type: 'boolean', default: 'false', description: '是否禁用'},
  {name: 'class', type: 'string', default: '—', description: '自定义 CSS 类'},
]

const eventsItems: ApiItem[] = [
  {name: 'change', binding: 'value', type: 'any', description: '选中值变化时触发'},
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Selector</h1>
      <p class="text-muted-foreground mt-1">选择器组件，支持可清除和禁用选项。</p>
    </div>

    <InstallCommand component-name="selector"/>

    <h2 id="section-examples" data-toc-id="section-examples" data-toc-text="示例" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">示例</h2>

    <CodePreview title="基本用法" :code="`<Selector
  v-model=&quot;value&quot;
  placeholder=&quot;选择框架&quot;
  :options=&quot;options&quot;
/>`">
      <div class="max-w-xs space-y-2">
        <Selector v-model="value1" placeholder="选择框架" :options="options"/>
        <p class="text-sm text-muted-foreground">选中值：{{ value1 ?? '无' }}</p>
      </div>
    </CodePreview>

    <CodePreview title="可清除" :code="`<Selector
  v-model=&quot;value&quot;
  placeholder=&quot;选择框架&quot;
  :options=&quot;options&quot;
  clearable
/>`">
      <div class="max-w-xs space-y-2">
        <Selector v-model="value2" placeholder="选择框架" :options="options" clearable/>
        <p class="text-sm text-muted-foreground">选中值：{{ value2 ?? '无' }}</p>
      </div>
    </CodePreview>

    <CodePreview title="禁用" :code="`<Selector placeholder=&quot;禁用状态&quot; :options=&quot;options&quot; disabled />`">
      <div class="max-w-xs">
        <Selector placeholder="禁用状态" :options="options" disabled/>
      </div>
    </CodePreview>

    <h2 id="section-api" data-toc-id="section-api" data-toc-text="API 参考" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">API 参考</h2>

    <ApiTable title="Props" :items="propsItems" type="props"/>
    <ApiTable title="Events" :items="eventsItems" type="events"/>
  </div>
</template>
