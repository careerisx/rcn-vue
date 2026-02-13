<script setup lang="ts">
import Empty from '@/components/registry/rcn/empty/Empty.vue'
import Button from '@/components/registry/rcn/button/Button.vue'
import CodePreview from '@/components/demo/CodePreview.vue'
import InstallCommand from '@/components/demo/InstallCommand.vue'
import ApiTable, {type ApiItem} from '@/components/demo/ApiTable.vue'
import {AlertTriangle} from 'lucide-vue-next'

const propsItems: ApiItem[] = [
  {name: 'title', type: 'string', default: "'暂无数据'", description: '空状态标题'},
  {name: 'description', type: 'string', default: "''", description: '空状态描述'},
  {name: 'icon', type: 'Component', default: 'Inbox', description: '自定义图标组件'},
  {name: 'iconSize', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '图标尺寸'},
  {name: 'showAction', type: 'boolean', default: 'false', description: '是否显示操作按钮'},
  {name: 'actionVariant', type: "'default' | 'outline' | 'ghost' | 'secondary'", default: "'outline'", description: '操作按钮样式'},
  {name: 'class', type: 'string', default: '—', description: '自定义 CSS 类'},
]

const slotsItems: ApiItem[] = [
  {name: 'icon', binding: '—', type: '—', description: '自定义图标区域'},
  {name: 'title', binding: '—', type: '—', description: '自定义标题'},
  {name: 'description', binding: '—', type: '—', description: '自定义描述'},
  {name: 'action', binding: '—', type: '—', description: '自定义操作按钮'},
]

const eventsItems: ApiItem[] = [
  {name: 'action', binding: '—', type: 'void', description: '点击操作按钮时触发'},
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Empty</h1>
      <p class="text-muted-foreground mt-1">空状态组件，支持图标、标题、描述和操作按钮。</p>
    </div>

    <InstallCommand component-name="empty"/>

    <h2 id="section-examples" data-toc-id="section-examples" data-toc-text="示例" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">示例</h2>

    <CodePreview title="基本用法" :code="`<Empty />`">
      <Empty/>
    </CodePreview>

    <CodePreview title="自定义文本和描述" :code="`<Empty title=&quot;没有找到结果&quot; description=&quot;尝试调整筛选条件或搜索关键词&quot; />`">
      <Empty title="没有找到结果" description="尝试调整筛选条件或搜索关键词"/>
    </CodePreview>

    <CodePreview title="带操作按钮" :code="`<Empty
  title=&quot;加载失败&quot;
  description=&quot;请检查网络连接后重试&quot;
  :show-action=&quot;true&quot;
  @action=&quot;handleRefresh&quot;
/>`">
      <Empty title="加载失败" description="请检查网络连接后重试" :show-action="true"/>
    </CodePreview>

    <CodePreview title="自定义图标和操作" :code="`<Empty title=&quot;权限不足&quot; description=&quot;你没有访问该资源的权限&quot; :icon=&quot;AlertTriangle&quot;>
  <template #action>
    <Button size=&quot;sm&quot;>申请权限</Button>
  </template>
</Empty>`">
      <Empty title="权限不足" description="你没有访问该资源的权限" :icon="AlertTriangle" :show-action="true">
        <template #action>
          <Button size="sm">申请权限</Button>
        </template>
      </Empty>
    </CodePreview>

    <h2 id="section-api" data-toc-id="section-api" data-toc-text="API 参考" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">API 参考</h2>

    <ApiTable title="Props" :items="propsItems" type="props"/>
    <ApiTable title="Slots" :items="slotsItems" type="slots"/>
    <ApiTable title="Events" :items="eventsItems" type="events"/>
  </div>
</template>
