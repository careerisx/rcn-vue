<script setup lang="ts">
import {h, ref} from 'vue'
import type {ColumnDef} from '@tanstack/vue-table'
import DataTable from '@/components/registry/rcn/table/Table.vue'
import Button from '@/components/registry/rcn/button/Button.vue'
import CodePreview from '@/components/demo/CodePreview.vue'
import InstallCommand from '@/components/demo/InstallCommand.vue'
import ApiTable, {type ApiItem} from '@/components/demo/ApiTable.vue'

// ---------- 数据类型 ----------
interface User {
  id: number
  name: string
  email: string
  role: string
  status: '启用' | '禁用'
}

// ---------- 模拟数据 ----------
function generateUsers(count: number): User[] {
  const roles = ['管理员', '编辑', '用户', '访客']
  const statuses: ('启用' | '禁用')[] = ['启用', '禁用']
  return Array.from({length: count}, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length]!,
    status: statuses[i % 3 === 0 ? 1 : 0]!,
  }))
}

const data = ref(generateUsers(56))
const loading = ref(false)

// ---------- 列定义 ----------
const columns: ColumnDef<User, any>[] = [
  {accessorKey: 'id', header: 'ID', meta: {class: 'w-16'}},
  {accessorKey: 'name', header: '姓名'},
  {accessorKey: 'email', header: '邮箱'},
  {accessorKey: 'role', header: '角色'},
  {
    accessorKey: 'status', header: '状态',
    cell: ({row}) => {
      const status = row.getValue('status') as string
      return h('span', {
        class: status === '启用'
            ? 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
            : 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800',
      }, status)
    },
  },
]

const simpleColumns: ColumnDef<User, any>[] = [
  {accessorKey: 'id', header: 'ID', meta: {class: 'w-16'}},
  {accessorKey: 'name', header: '姓名'},
  {accessorKey: 'email', header: '邮箱'},
  {accessorKey: 'role', header: '角色'},
]

// ---------- 选择 ----------
const selectedIds = ref<number[]>([])

// ---------- 服务端分页 ----------
const serverData = ref<User[]>([])
const serverLoading = ref(false)
const serverPage = ref(1)
const serverTotal = ref(200)

function loadServerData(page: number) {
  serverLoading.value = true
  serverPage.value = page
  setTimeout(() => {
    serverData.value = generateUsers(20).map((u, i) => ({
      ...u,
      id: (page - 1) * 20 + i + 1,
      name: `用户 ${(page - 1) * 20 + i + 1}`,
      email: `user${(page - 1) * 20 + i + 1}@example.com`,
    }))
    serverLoading.value = false
  }, 800)
}

loadServerData(1)

function simulateLoading() {
  loading.value = true
  setTimeout(() => loading.value = false, 1500)
}

// ---------- API 文档 ----------
const propsItems: ApiItem[] = [
  {name: 'columns', type: 'ColumnDef<TData, TValue>[]', default: '—', description: '列定义（必传，TanStack Table ColumnDef）'},
  {name: 'data', type: 'TData[]', default: '—', description: '表格数据（必传）'},
  {name: 'showPagination', type: 'boolean', default: 'true', description: '是否显示分页'},
  {name: 'showSelection', type: 'boolean', default: 'false', description: '是否显示行选择列'},
  {name: 'selectedIds', type: '(string | number)[]', binding: 'v-model', default: '[]', description: '选中行的 ID 列表'},
  {name: 'defaultPageSize', type: 'number', default: '20', description: '默认每页条数'},
  {name: 'pageSizeOptions', type: 'number[]', default: '[10,20,30,50]', description: '每页条数选项'},
  {name: 'serverSide', type: 'boolean', default: 'false', description: '是否使用服务端分页'},
  {name: 'total', type: 'number', default: '0', description: '总条数（服务端分页时）'},
  {name: 'currentPage', type: 'number', default: '1', description: '当前页码（服务端分页时，从 1 开始）'},
  {name: 'loading', type: 'boolean', default: 'false', description: '加载状态（显示骨架屏）'},
  {name: 'rowKey', type: 'string', default: "'id'", description: '行唯一标识字段名'},
  {name: 'emptyProps', type: 'EmptyProps', default: '—', description: '空数据组件配置'},
  {name: 'class', type: 'string', default: '—', description: '自定义 CSS 类'},
]

const slotsItems: ApiItem[] = [
  {name: 'cell-{columnId}', binding: '{ row, value, cell }', type: 'TData, any, Cell', description: '自定义某列的单元格内容'},
  {name: 'batch-actions', binding: '{ selection, count }', type: 'TData[], number', description: '选中行时显示的批量操作区域'},
  {name: 'empty', binding: '—', type: '—', description: '自定义空数据状态'},
]

const eventsItems: ApiItem[] = [
  {name: 'update:selection', binding: 'selection', type: 'TData[]', description: '选中行变化时触发'},
  {name: 'page-change', binding: 'page', type: 'number', description: '页码变化（服务端分页时）'},
  {name: 'page-size-change', binding: 'pageSize', type: 'number', description: '每页条数变化'},
  {name: 'empty-action', binding: '—', type: 'void', description: '空数据操作按钮点击'},
]

// ---------- 代码字符串 ----------
const basicCode = `const columns: ColumnDef<User, any>[] = [
  { accessorKey: 'id', header: 'ID', meta: { class: 'w-16' } },
  { accessorKey: 'name', header: '姓名' },
  { accessorKey: 'email', header: '邮箱' },
  { accessorKey: 'role', header: '角色' },
]

<DataTable :columns="columns" :data="data" :default-page-size="5" />`

const customCellCode = `{
  accessorKey: 'status',
  header: '状态',
  cell: ({ row }) => {
    const status = row.getValue('status')
    return h('span', {
      class: status === '启用' ? '...green...' : '...red...',
    }, status)
  },
}

// 或用插槽:
// <template #cell-status="{ value }">
//   <Badge>{{ value }}</Badge>
// </template>`

const selectionCode = `<DataTable
  :columns="columns"
  :data="data"
  show-selection
  v-model:selected-ids="selectedIds"
  :default-page-size="5"
>
  <template #batch-actions="{ count }">
    <Button size="sm" variant="destructive">删除选中 ({{ count }})</Button>
  </template>
</DataTable>`

const serverCode = `<DataTable
  :columns="columns"
  :data="serverData"
  :loading="serverLoading"
  :total="200"
  :current-page="serverPage"
  server-side
  :default-page-size="20"
  @page-change="loadServerData"
/>`
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Table (DataTable)</h1>
      <p class="text-muted-foreground mt-1">
        基于 TanStack Table 的数据表格组件，支持分页、行选择、服务端分页、Loading 骨架屏和自定义列渲染。
      </p>
    </div>

    <InstallCommand component-name="table"/>

    <h2 id="section-examples" data-toc-id="section-examples" data-toc-text="示例" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">示例</h2>

    <!-- 基本用法 -->
    <CodePreview title="基本用法" :code="basicCode">
      <DataTable :columns="simpleColumns" :data="data" :default-page-size="5"/>
    </CodePreview>

    <!-- 自定义列渲染 -->
    <CodePreview title="自定义列渲染（状态标签）" :code="customCellCode">
      <DataTable :columns="columns" :data="data" :default-page-size="5"/>
    </CodePreview>

    <!-- Loading -->
    <CodePreview title="Loading 骨架屏" :code="`<DataTable :columns=&quot;columns&quot; :data=&quot;data&quot; loading />`">
      <div class="space-y-2">
        <Button size="sm" variant="outline" @click="simulateLoading">切换 Loading</Button>
        <DataTable :columns="simpleColumns" :data="data" :loading="loading" :default-page-size="5"/>
      </div>
    </CodePreview>

    <!-- 行选择 -->
    <CodePreview title="行选择 + 批量操作" :code="selectionCode">
      <div class="space-y-2">
        <DataTable
            :columns="simpleColumns"
            :data="data"
            show-selection
            v-model:selected-ids="selectedIds"
            :default-page-size="5"
        >
          <template #batch-actions="{ count }">
            <Button size="sm" variant="destructive">删除选中 ({{ count }})</Button>
          </template>
        </DataTable>
        <p class="text-sm text-muted-foreground">已选 ID：{{ selectedIds.length ? selectedIds.join(', ') : '无' }}</p>
      </div>
    </CodePreview>

    <!-- 服务端分页 -->
    <CodePreview title="服务端分页" :code="serverCode">
      <DataTable
          :columns="simpleColumns"
          :data="serverData"
          :loading="serverLoading"
          :total="serverTotal"
          :current-page="serverPage"
          server-side
          :default-page-size="20"
          @page-change="loadServerData"
      />
    </CodePreview>

    <!-- 空数据 -->
    <CodePreview title="空数据" :code="`<DataTable :columns=&quot;columns&quot; :data=&quot;[]&quot; />`">
      <DataTable :columns="simpleColumns" :data="[]"/>
    </CodePreview>

    <h2 id="section-api" data-toc-id="section-api" data-toc-text="API 参考" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">API 参考</h2>

    <ApiTable title="Props" :items="propsItems" type="props"/>
    <ApiTable title="Slots" :items="slotsItems" type="slots"/>
    <ApiTable title="Events" :items="eventsItems" type="events"/>
  </div>
</template>
