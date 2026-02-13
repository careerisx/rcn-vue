<script setup lang="ts">
import {ref} from 'vue'
import Dialog from '@/components/registry/rcn/dialog/Dialog.vue'
import Button from '@/components/registry/rcn/button/Button.vue'
import CodePreview from '@/components/demo/CodePreview.vue'
import InstallCommand from '@/components/demo/InstallCommand.vue'
import ApiTable, {type ApiItem} from '@/components/demo/ApiTable.vue'

const confirmLoading = ref(false)

function handleConfirm() {
  confirmLoading.value = true
  setTimeout(() => {
    confirmLoading.value = false
  }, 1500)
}

const propsItems: ApiItem[] = [
  {name: 'open', type: 'boolean', binding: 'v-model', default: 'false', description: '控制对话框打开/关闭'},
  {name: 'title', type: 'string', default: "'编辑'", description: '对话框标题'},
  {name: 'description', type: 'string', default: "'修改相关信息后，点击保存按钮进行保存'", description: '对话框描述'},
  {name: 'footer', type: 'boolean', default: 'true', description: '是否显示底部按钮区域'},
  {name: 'confirmText', type: 'string', default: "'保存'", description: '确认按钮文本'},
  {name: 'cancelText', type: 'string', default: "'取消'", description: '取消按钮文本'},
  {name: 'confirmLoading', type: 'boolean', default: 'false', description: '确认按钮加载状态'},
  {name: 'class', type: 'string', default: '—', description: '内容区域自定义 CSS 类'},
]

const slotsItems: ApiItem[] = [
  {name: 'trigger', binding: '—', type: '—', description: '触发器元素（as-child）'},
  {name: 'header', binding: '—', type: '—', description: '自定义头部（覆盖 title/description）'},
  {name: 'default', binding: '—', type: '—', description: '对话框内容'},
  {name: 'footer', binding: '—', type: '—', description: '自定义底部按钮区域'},
]

const eventsItems: ApiItem[] = [
  {name: 'confirm', binding: '—', type: 'void', description: '点击确认按钮时触发'},
  {name: 'cancel', binding: '—', type: 'void', description: '点击取消按钮时触发'},
]

const exposeItems: ApiItem[] = [
  {name: 'open()', binding: '—', type: '() => void', description: '手动打开对话框'},
  {name: 'close()', binding: '—', type: '() => void', description: '手动关闭对话框'},
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Dialog</h1>
      <p class="text-muted-foreground mt-1">增强对话框，支持标题、描述、底部按钮和加载状态。</p>
    </div>

    <InstallCommand component-name="dialog"/>

    <h2 id="section-examples" data-toc-id="section-examples" data-toc-text="示例" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">示例</h2>

    <CodePreview title="基本用法" :code="`<Dialog title=&quot;编辑用户&quot; description=&quot;修改用户信息后点击保存&quot; @confirm=&quot;handleConfirm&quot;>
  <template #trigger>
    <Button>打开 Dialog</Button>
  </template>
  <p>这里放表单或其他内容。</p>
</Dialog>`">
      <Dialog title="编辑用户" description="修改用户信息后点击保存" @confirm="handleConfirm">
        <template #trigger>
          <Button>打开 Dialog</Button>
        </template>
        <p>这里放表单或其他内容。</p>
      </Dialog>
    </CodePreview>

    <CodePreview title="确认按钮 Loading" :code="`<Dialog
  title=&quot;提交表单&quot;
  :confirm-loading=&quot;confirmLoading&quot;
  @confirm=&quot;handleConfirm&quot;
>
  <template #trigger>
    <Button variant=&quot;outline&quot;>带 Loading</Button>
  </template>
  <p>点击保存后模拟异步提交。</p>
</Dialog>`">
      <Dialog title="提交表单" :confirm-loading="confirmLoading" @confirm="handleConfirm">
        <template #trigger>
          <Button variant="outline">带 Loading</Button>
        </template>
        <p>点击保存后模拟异步提交。</p>
      </Dialog>
    </CodePreview>

    <CodePreview title="隐藏底部" :code="`<Dialog title=&quot;纯展示&quot; :footer=&quot;false&quot;>
  <template #trigger>
    <Button variant=&quot;secondary&quot;>无底部</Button>
  </template>
  <p>只展示内容，不带操作按钮。</p>
</Dialog>`">
      <Dialog title="纯展示" :footer="false">
        <template #trigger>
          <Button variant="secondary">无底部</Button>
        </template>
        <p>只展示内容，不带操作按钮。</p>
      </Dialog>
    </CodePreview>

    <h2 id="section-api" data-toc-id="section-api" data-toc-text="API 参考" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">API 参考</h2>

    <ApiTable title="Props" :items="propsItems" type="props"/>
    <ApiTable title="Slots" :items="slotsItems" type="slots"/>
    <ApiTable title="Events" :items="eventsItems" type="events"/>
    <ApiTable title="Expose" :items="exposeItems" type="events"/>
  </div>
</template>
