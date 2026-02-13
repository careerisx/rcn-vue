<script setup lang="ts">
import {ref} from 'vue'
import DropdownMenu from '@/components/registry/rcn/dropdown-menu/DropdownMenu.vue'
import Button from '@/components/registry/rcn/button/Button.vue'
import CodePreview from '@/components/demo/CodePreview.vue'
import InstallCommand from '@/components/demo/InstallCommand.vue'
import ApiTable, {type ApiItem} from '@/components/demo/ApiTable.vue'
import {Edit, Copy, Trash2, Share, Download} from 'lucide-vue-next'

const selected = ref('')

function handleSelect(name: string) {
  selected.value = name
}

const propsItems: ApiItem[] = [
  {name: 'items', type: 'MenuItem[]', default: '—', description: '菜单项列表（简单模式）{ name, label, icon?, disabled?, variant?, shortcut? }'},
  {name: 'groups', type: 'MenuGroup[]', default: '—', description: '分组菜单列表 { label?, items: MenuItem[] }'},
  {name: 'align', type: "'start' | 'center' | 'end'", default: "'end'", description: '弹出对齐方式'},
  {name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'bottom'", description: '弹出方向'},
  {name: 'contentClass', type: 'string', default: '—', description: '内容区域自定义类'},
  {name: 'disabled', type: 'boolean', default: 'false', description: '是否禁用'},
  {name: 'meta', type: 'any', default: '—', description: '自定义数据，select 事件中回传'},
  {name: 'class', type: 'string', default: '—', description: '自定义 CSS 类'},
]

const slotsItems: ApiItem[] = [
  {name: 'default', binding: '—', type: '—', description: '触发器元素（as-child）'},
  {name: 'menu-{name}', binding: '{ item }', type: 'MenuItem', description: '自定义某个菜单项内容'},
  {name: 'content', binding: '—', type: '—', description: '追加自定义内容到菜单末尾'},
]

const eventsItems: ApiItem[] = [
  {name: 'select', binding: 'name, meta?', type: 'string, any', description: '菜单项点击时触发'},
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">DropdownMenu</h1>
      <p class="text-muted-foreground mt-1">下拉菜单，支持简单列表和分组模式，可自定义图标和变体。</p>
    </div>

    <InstallCommand component-name="dropdown-menu"/>

    <h2 id="section-examples" data-toc-id="section-examples" data-toc-text="示例" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">示例</h2>

    <CodePreview title="简单模式" :code="`<DropdownMenu
  :items=&quot;[
    { name: 'edit', label: '编辑', icon: Edit },
    { name: 'copy', label: '复制', icon: Copy },
    { name: 'delete', label: '删除', icon: Trash2, variant: 'destructive' },
  ]&quot;
  @select=&quot;handleSelect&quot;
>
  <Button variant=&quot;outline&quot;>操作</Button>
</DropdownMenu>`">
      <div class="flex items-center gap-4">
        <DropdownMenu
            :items="[
            { name: 'edit', label: '编辑', icon: Edit },
            { name: 'copy', label: '复制', icon: Copy },
            { name: 'delete', label: '删除', icon: Trash2, variant: 'destructive' },
          ]"
            @select="handleSelect"
        >
          <Button variant="outline">操作</Button>
        </DropdownMenu>
        <span v-if="selected" class="text-sm text-muted-foreground">选中：{{ selected }}</span>
      </div>
    </CodePreview>

    <CodePreview title="分组模式" :code="`<DropdownMenu
  :groups=&quot;[
    { label: '编辑', items: [
      { name: 'edit', label: '编辑', icon: Edit },
      { name: 'copy', label: '复制', icon: Copy },
    ] },
    { label: '其他', items: [
      { name: 'share', label: '分享', icon: Share },
      { name: 'download', label: '下载', icon: Download },
    ] },
  ]&quot;
  @select=&quot;handleSelect&quot;
>
  <Button>更多操作</Button>
</DropdownMenu>`">
      <DropdownMenu
          :groups="[
          { label: '编辑', items: [
            { name: 'edit', label: '编辑', icon: Edit },
            { name: 'copy', label: '复制', icon: Copy },
          ] },
          { label: '其他', items: [
            { name: 'share', label: '分享', icon: Share },
            { name: 'download', label: '下载', icon: Download },
          ] },
        ]"
          @select="handleSelect"
      >
        <Button>更多操作</Button>
      </DropdownMenu>
    </CodePreview>

    <h2 id="section-api" data-toc-id="section-api" data-toc-text="API 参考" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">API 参考</h2>

    <ApiTable title="Props" :items="propsItems" type="props"/>
    <ApiTable title="Slots" :items="slotsItems" type="slots"/>
    <ApiTable title="Events" :items="eventsItems" type="events"/>
  </div>
</template>
