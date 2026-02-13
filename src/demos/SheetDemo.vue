<script setup lang="ts">
import {ref} from 'vue'
import Sheet from '@/components/registry/rcn/sheet/Sheet.vue'
import Button from '@/components/registry/rcn/button/Button.vue'
import CodePreview from '@/components/demo/CodePreview.vue'
import InstallCommand from '@/components/demo/InstallCommand.vue'
import ApiTable, {type ApiItem} from '@/components/demo/ApiTable.vue'

const loading = ref(false)

function handleConfirm() {
  loading.value = true
  setTimeout(() => loading.value = false, 1500)
}

const propsItems: ApiItem[] = [
  {name: 'open', type: 'boolean', binding: 'v-model', default: 'false', description: '控制抽屉打开/关闭'},
  {name: 'title', type: 'string', default: "''", description: '抽屉标题'},
  {name: 'description', type: 'string', default: "''", description: '抽屉描述'},
  {name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'right'", description: '弹出方向'},
  {name: 'showFooter', type: 'boolean', default: 'true', description: '是否显示底部按钮区域'},
  {name: 'confirmText', type: 'string', default: "'保存'", description: '确认按钮文本'},
  {name: 'cancelText', type: 'string', default: "'取消'", description: '取消按钮文本'},
  {name: 'confirmLoading', type: 'boolean', default: 'false', description: '确认按钮加载状态'},
  {name: 'class', type: 'string', default: '—', description: '内容区域自定义 CSS 类'},
]

const slotsItems: ApiItem[] = [
  {name: 'trigger', binding: '—', type: '—', description: '触发器元素（as-child）'},
  {name: 'header', binding: '—', type: '—', description: '自定义头部（覆盖 title/description）'},
  {name: 'default', binding: '—', type: '—', description: '抽屉内容'},
  {name: 'footer', binding: '—', type: '—', description: '自定义底部按钮区域'},
]

const eventsItems: ApiItem[] = [
  {name: 'confirm', binding: '—', type: 'void', description: '点击确认按钮时触发'},
  {name: 'cancel', binding: '—', type: 'void', description: '点击取消按钮时触发'},
]

const exposeItems: ApiItem[] = [
  {name: 'open()', binding: '—', type: '() => void', description: '手动打开抽屉'},
  {name: 'close()', binding: '—', type: '() => void', description: '手动关闭抽屉'},
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Sheet</h1>
      <p class="text-muted-foreground mt-1">侧边抽屉面板，支持四个方向弹出，带底部操作按钮。</p>
    </div>

    <InstallCommand component-name="sheet"/>

    <h2 id="section-examples" data-toc-id="section-examples" data-toc-text="示例" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">示例</h2>

    <CodePreview title="基本用法（右侧弹出）" :code="`<Sheet title=&quot;编辑用户&quot; description=&quot;修改用户信息&quot; @confirm=&quot;handleConfirm&quot;>
  <template #trigger>
    <Button>打开 Sheet</Button>
  </template>
  <div>Sheet 内容...</div>
</Sheet>`">
      <Sheet
          title="编辑用户"
          description="修改用户信息"
          :confirm-loading="loading"
          @confirm="handleConfirm"
      >
        <template #trigger>
          <Button>打开 Sheet</Button>
        </template>
        <div class="space-y-4">
          <p>这里可以放置表单或任意内容。</p>
          <p class="text-sm text-muted-foreground">修改完成后点击保存。</p>
        </div>
      </Sheet>
    </CodePreview>

    <CodePreview title="四个方向" :code="`<Sheet title=&quot;左侧&quot; side=&quot;left&quot; :show-footer=&quot;false&quot;>...</Sheet>
<Sheet title=&quot;底部&quot; side=&quot;bottom&quot; :show-footer=&quot;false&quot;>...</Sheet>
<Sheet title=&quot;顶部&quot; side=&quot;top&quot; :show-footer=&quot;false&quot;>...</Sheet>`">
      <div class="flex gap-3 flex-wrap">
        <Sheet title="导航菜单" side="left" :show-footer="false">
          <template #trigger>
            <Button variant="outline">左侧</Button>
          </template>
          <div>菜单内容</div>
        </Sheet>
        <Sheet title="底部面板" side="bottom" :show-footer="false">
          <template #trigger>
            <Button variant="outline">底部</Button>
          </template>
          <div>底部内容</div>
        </Sheet>
        <Sheet title="顶部面板" side="top" :show-footer="false">
          <template #trigger>
            <Button variant="outline">顶部</Button>
          </template>
          <div>顶部内容</div>
        </Sheet>
      </div>
    </CodePreview>

    <h2 id="section-api" data-toc-id="section-api" data-toc-text="API 参考" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">API 参考</h2>

    <ApiTable title="Props" :items="propsItems" type="props"/>
    <ApiTable title="Slots" :items="slotsItems" type="slots"/>
    <ApiTable title="Events" :items="eventsItems" type="events"/>
    <ApiTable title="Expose" :items="exposeItems" type="events"/>
  </div>
</template>
