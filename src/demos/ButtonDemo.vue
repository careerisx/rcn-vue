<script setup lang="ts">
import {ref} from 'vue'
import Button from '@/components/registry/rcn/button/Button.vue'
import CodePreview from '@/components/demo/CodePreview.vue'
import InstallCommand from '@/components/demo/InstallCommand.vue'
import ApiTable, {type ApiItem} from '@/components/demo/ApiTable.vue'

const loading = ref(false)

function simulateLoading() {
  loading.value = true
  setTimeout(() => loading.value = false, 2000)
}

const propsItems: ApiItem[] = [
  {name: 'loading', type: 'boolean', default: 'false', description: '是否处于加载状态'},
  {name: 'loadingText', type: 'string', default: '—', description: '加载时显示的文本，不传则显示默认 slot 内容'},
  {name: 'variant', type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'", default: "'default'", description: '按钮样式变体'},
  {name: 'size', type: "'default' | 'sm' | 'lg' | 'icon'", default: "'default'", description: '按钮尺寸'},
  {name: 'disabled', type: 'boolean', default: 'false', description: '是否禁用'},
  {name: 'class', type: 'string', default: '—', description: '自定义 CSS 类'},
]

const slotsItems: ApiItem[] = [
  {name: 'default', type: 'any', description: '按钮内容'},
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Button</h1>
      <p class="text-muted-foreground mt-1">增强按钮，支持 loading 状态和多种样式变体。</p>
    </div>

    <InstallCommand component-name="button"/>

    <h2 id="section-examples" data-toc-id="section-examples" data-toc-text="示例" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">示例</h2>

    <CodePreview title="基本用法" :code="`<Button>默认按钮</Button>
<Button variant=&quot;outline&quot;>Outline</Button>
<Button variant=&quot;secondary&quot;>Secondary</Button>
<Button variant=&quot;destructive&quot;>Destructive</Button>
<Button variant=&quot;ghost&quot;>Ghost</Button>
<Button variant=&quot;link&quot;>Link</Button>`">
      <div class="flex flex-wrap gap-3">
        <Button>默认按钮</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </CodePreview>

    <CodePreview title="尺寸" :code="`<Button size=&quot;sm&quot;>Small</Button>
<Button>Default</Button>
<Button size=&quot;lg&quot;>Large</Button>`">
      <div class="flex flex-wrap items-center gap-3">
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
      </div>
    </CodePreview>

    <CodePreview title="Loading 状态" :code="`<Button :loading=&quot;loading&quot; @click=&quot;simulateLoading&quot;>点击加载</Button>
<Button loading loading-text=&quot;提交中...&quot;>提交</Button>`">
      <div class="flex flex-wrap gap-3">
        <Button :loading="loading" @click="simulateLoading">点击加载</Button>
        <Button loading loading-text="提交中...">提交</Button>
      </div>
    </CodePreview>

    <CodePreview title="禁用状态" :code="`<Button disabled>禁用按钮</Button>
<Button variant=&quot;outline&quot; disabled>禁用 Outline</Button>`">
      <div class="flex flex-wrap gap-3">
        <Button disabled>禁用按钮</Button>
        <Button variant="outline" disabled>禁用 Outline</Button>
      </div>
    </CodePreview>

    <h2 id="section-api" data-toc-id="section-api" data-toc-text="API 参考" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">API 参考</h2>

    <ApiTable title="Props" :items="propsItems" type="props"/>
    <ApiTable title="Slots" :items="slotsItems" type="slots"/>
  </div>
</template>
