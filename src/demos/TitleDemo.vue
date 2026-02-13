<script setup lang="ts">
import Title from '@/components/registry/rcn/title/Title.vue'
import Button from '@/components/registry/rcn/button/Button.vue'
import CodePreview from '@/components/demo/CodePreview.vue'
import InstallCommand from '@/components/demo/InstallCommand.vue'
import ApiTable, {type ApiItem} from '@/components/demo/ApiTable.vue'

const propsItems: ApiItem[] = [
  {name: 'title', type: 'string', default: '—', description: '页面标题（必传）'},
  {name: 'subtitle', type: 'string', default: "''", description: '副标题'},
  {name: 'class', type: 'string', default: '—', description: '自定义 CSS 类'},
]

const slotsItems: ApiItem[] = [
  {name: 'title', binding: '—', type: '—', description: '自定义标题内容（覆盖 title prop）'},
  {name: 'subtitle', binding: '—', type: '—', description: '自定义副标题（覆盖 subtitle prop）'},
  {name: 'actions', binding: '—', type: '—', description: '右侧操作按钮区域'},
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Title</h1>
      <p class="text-muted-foreground mt-1">页面标题组件，支持副标题和操作区域。</p>
    </div>

    <InstallCommand component-name="title"/>

    <h2 id="section-examples" data-toc-id="section-examples" data-toc-text="示例" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">示例</h2>

    <CodePreview title="基本用法" :code="`<Title title=&quot;页面标题&quot; />`">
      <Title title="页面标题"/>
    </CodePreview>

    <CodePreview title="带副标题" :code="`<Title title=&quot;用户管理&quot; subtitle=&quot;管理系统中的所有用户&quot; />`">
      <Title title="用户管理" subtitle="管理系统中的所有用户"/>
    </CodePreview>

    <CodePreview title="带操作按钮" :code="`<Title title=&quot;报表列表&quot;>
  <template #actions>
    <Button size=&quot;sm&quot;>导出</Button>
  </template>
</Title>`">
      <Title title="报表列表">
        <template #actions>
          <Button size="sm">导出</Button>
        </template>
      </Title>
    </CodePreview>

    <h2 id="section-api" data-toc-id="section-api" data-toc-text="API 参考" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">API 参考</h2>

    <ApiTable title="Props" :items="propsItems" type="props"/>
    <ApiTable title="Slots" :items="slotsItems" type="slots"/>
  </div>
</template>
