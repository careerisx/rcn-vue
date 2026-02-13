<script setup lang="ts">
import Card from '@/components/registry/rcn/card/Card.vue'
import Button from '@/components/registry/rcn/button/Button.vue'
import CodePreview from '@/components/demo/CodePreview.vue'
import InstallCommand from '@/components/demo/InstallCommand.vue'
import ApiTable, {type ApiItem} from '@/components/demo/ApiTable.vue'
import {Settings} from 'lucide-vue-next'

const propsItems: ApiItem[] = [
  {name: 'title', type: 'string', default: "''", description: '卡片标题'},
  {name: 'description', type: 'string', default: "''", description: '卡片描述'},
  {name: 'icon', type: 'Component', default: '—', description: '标题图标组件'},
  {name: 'showHeader', type: 'boolean', default: 'true', description: '是否显示头部区域'},
  {name: 'showFooter', type: 'boolean', default: 'false', description: '是否显示底部区域'},
  {name: 'class', type: 'string', default: '—', description: '自定义 CSS 类'},
]

const slotsItems: ApiItem[] = [
  {name: 'default', binding: '—', type: '—', description: '卡片内容区域'},
  {name: 'header', binding: '—', type: '—', description: '自定义头部内容（覆盖 title/description）'},
  {name: 'action', binding: '—', type: '—', description: '头部右侧操作区域'},
  {name: 'footer', binding: '—', type: '—', description: '底部区域内容'},
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Card</h1>
      <p class="text-muted-foreground mt-1">增强卡片，支持标题、描述、图标和插槽自定义。</p>
    </div>

    <InstallCommand component-name="card"/>

    <h2 id="section-examples" data-toc-id="section-examples" data-toc-text="示例" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">示例</h2>

    <CodePreview title="基本用法" :code="`<Card title=&quot;卡片标题&quot; description=&quot;这是一段描述文字&quot;>
  <p>卡片内容区域</p>
</Card>`">
      <Card title="卡片标题" description="这是一段描述文字">
        <p>卡片内容区域，可放置任意内容。</p>
      </Card>
    </CodePreview>

    <CodePreview title="带图标和操作" :code="`<Card title=&quot;设置&quot; description=&quot;管理你的偏好设置&quot; :icon=&quot;Settings&quot;>
  <template #action>
    <Button size=&quot;sm&quot; variant=&quot;outline&quot;>编辑</Button>
  </template>
  <p>内容...</p>
</Card>`">
      <Card title="设置" description="管理你的偏好设置" :icon="Settings">
        <template #action>
          <Button size="sm" variant="outline">编辑</Button>
        </template>
        <p>这里是设置相关的内容。</p>
      </Card>
    </CodePreview>

    <CodePreview title="带底部" :code="`<Card title=&quot;统计&quot; :show-footer=&quot;true&quot;>
  <p>今日访问量：1,234</p>
  <template #footer>
    <Button variant=&quot;ghost&quot; size=&quot;sm&quot;>查看详情</Button>
  </template>
</Card>`">
      <Card title="统计" :show-footer="true">
        <p>今日访问量：1,234</p>
        <template #footer>
          <Button variant="ghost" size="sm">查看详情</Button>
        </template>
      </Card>
    </CodePreview>

    <h2 id="section-api" data-toc-id="section-api" data-toc-text="API 参考" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">API 参考</h2>

    <ApiTable title="Props" :items="propsItems" type="props"/>
    <ApiTable title="Slots" :items="slotsItems" type="slots"/>
  </div>
</template>
