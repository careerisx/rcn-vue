<script setup lang="ts">
import Confirm from '@/components/registry/rcn/confirm/Confirm.vue'
import Button from '@/components/registry/rcn/button/Button.vue'
import CodePreview from '@/components/demo/CodePreview.vue'
import InstallCommand from '@/components/demo/InstallCommand.vue'
import ApiTable, {type ApiItem} from '@/components/demo/ApiTable.vue'
import {ref} from 'vue'
import {Trash2} from 'lucide-vue-next'

const result = ref('')

function handleConfirm() {
  result.value = '已确认！'
  setTimeout(() => result.value = '', 2000)
}

const propsItems: ApiItem[] = [
  {name: 'open', type: 'boolean', binding: 'v-model', default: 'false', description: '控制确认框打开/关闭'},
  {name: 'title', type: 'string', default: "'确认操作'", description: '确认框标题'},
  {name: 'description', type: 'string', default: "'此操作不可撤销，确定要继续吗？'", description: '确认框描述'},
  {name: 'icon', type: 'Component', default: '—', description: '描述前的图标'},
  {name: 'confirmText', type: 'string', default: "'确认'", description: '确认按钮文本'},
  {name: 'cancelText', type: 'string', default: "'取消'", description: '取消按钮文本'},
  {name: 'confirmVariant', type: "'default' | 'destructive' | ...", default: "'default'", description: '确认按钮样式'},
  {name: 'confirmDisabled', type: 'boolean', default: 'false', description: '是否禁用确认按钮'},
  {name: 'confirmData', type: 'any', default: '—', description: '确认时回传的数据'},
  {name: 'class', type: 'string', default: '—', description: '自定义 CSS 类'},
]

const slotsItems: ApiItem[] = [
  {name: 'trigger', binding: '—', type: '—', description: '触发按钮（as-child）'},
  {name: 'header', binding: '—', type: '—', description: '自定义头部（覆盖 title/description）'},
  {name: 'default', binding: '—', type: '—', description: '自定义内容'},
  {name: 'footer', binding: '—', type: '—', description: '自定义底部按钮区域'},
]

const eventsItems: ApiItem[] = [
  {name: 'confirm', binding: 'confirmData?', type: 'any', description: '点击确认按钮时触发，回传 confirmData'},
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Confirm</h1>
      <p class="text-muted-foreground mt-1">确认对话框，支持自定义标题、描述和按钮。</p>
    </div>

    <InstallCommand component-name="confirm"/>

    <h2 id="section-examples" data-toc-id="section-examples" data-toc-text="示例" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">示例</h2>

    <CodePreview title="基本用法" :code="`<Confirm @confirm=&quot;handleConfirm&quot;>
  <template #trigger>
    <Button variant=&quot;outline&quot;>打开确认框</Button>
  </template>
</Confirm>`">
      <div class="flex items-center gap-4">
        <Confirm @confirm="handleConfirm">
          <template #trigger>
            <Button variant="outline">打开确认框</Button>
          </template>
        </Confirm>
        <span v-if="result" class="text-sm text-green-600">{{ result }}</span>
      </div>
    </CodePreview>

    <CodePreview title="危险操作" :code="`<Confirm
  title=&quot;删除确认&quot;
  description=&quot;此操作将永久删除该记录，且无法恢复。&quot;
  confirm-variant=&quot;destructive&quot;
  confirm-text=&quot;删除&quot;
  :icon=&quot;Trash2&quot;
  @confirm=&quot;handleConfirm&quot;
>
  <template #trigger>
    <Button variant=&quot;destructive&quot;>删除</Button>
  </template>
</Confirm>`">
      <Confirm
          title="删除确认"
          description="此操作将永久删除该记录，且无法恢复。"
          confirm-variant="destructive"
          confirm-text="删除"
          :icon="Trash2"
          @confirm="handleConfirm"
      >
        <template #trigger>
          <Button variant="destructive">删除</Button>
        </template>
      </Confirm>
    </CodePreview>

    <h2 id="section-api" data-toc-id="section-api" data-toc-text="API 参考" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">API 参考</h2>

    <ApiTable title="Props" :items="propsItems" type="props"/>
    <ApiTable title="Slots" :items="slotsItems" type="slots"/>
    <ApiTable title="Events" :items="eventsItems" type="events"/>
  </div>
</template>
