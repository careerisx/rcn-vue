<script setup lang="ts">
import {computed, ref} from 'vue'
import Tree from '@/components/registry/rcn/tree/Tree.vue'
import type {TreeNode} from '@/components/registry/rcn/tree/types'
import {Button} from '@/components/ui/button'
import CodePreview from '@/components/demo/CodePreview.vue'
import InstallCommand from '@/components/demo/InstallCommand.vue'
import ApiTable, {type ApiItem} from '@/components/demo/ApiTable.vue'

// 基础示例独立保存节点数据，避免懒加载示例写回 children 时影响其他预览。
const basicData: TreeNode[] = [
  {id: 'team', label: '研发团队', children: [
    {id: 'frontend', label: '前端组', children: [
      {id: 'vue', label: 'Vue 项目', leaf: true},
      {id: 'react', label: 'React 项目', leaf: true},
    ]},
    {id: 'backend', label: '后端组', leaf: true},
  ]},
]
// 分别回显选中键和组件返回的完整节点。
const checkedKeys = ref<string[]>([])
const checkedNodes = ref<TreeNode[]>([])
// 交互示例展示禁用、隐藏复选框和节点点击事件。
const interactionData: TreeNode[] = [
  {id: 'projects', label: '项目目录', hideCheckbox: true, children: [
    {id: 'active', label: '进行中的项目', leaf: true},
    {id: 'archived', label: '已归档项目（禁用）', leaf: true, disabled: true},
    {id: 'overview', label: '项目概览（隐藏复选框）', leaf: true, hideCheckbox: true},
  ]},
]
const interactionKeys = ref<string[]>([])
const clickedNode = ref<TreeNode>()
// 懒加载保留响应式数据，组件会将加载结果写回节点 children。
const lazyData = ref<TreeNode[]>([{id: 'devices', label: '设备分组'}])
const lazyKeys = ref<string[]>([])
// 过滤示例只过滤叶子，始终保留可展开的父级。
const filterData: TreeNode[] = [
  {id: 'files', label: '项目文件', children: [
    {id: 'source', label: '源代码', leaf: true},
    {id: 'docs', label: '使用文档', leaf: true},
    {id: 'cache', label: '缓存文件', leaf: true, type: 'temporary'},
  ]},
]
const filterKeys = ref<string[]>([])
const hideTemporary = ref(true)
const nodeFilter = computed(() => {
  const hide = hideTemporary.value
  return (node: TreeNode) => !hide || node.type !== 'temporary'
})

/**
 * 模拟异步加载两层设备节点，供展开和父级批量勾选演示使用。
 *
 * @param node 需要加载子节点的分组
 * @returns 当前分组的子节点
 */
async function loadChildren(node: TreeNode): Promise<TreeNode[]> {
  await new Promise(resolve => setTimeout(resolve, 600))
  if (node.id === 'devices') {
    return [
      {id: 'workshop', label: '生产车间'},
      {id: 'warehouse', label: '仓库传感器', leaf: true},
    ]
  }
  if (node.id === 'workshop') {
    return [
      {id: 'motor', label: '电机传感器', leaf: true},
      {id: 'pump', label: '水泵传感器', leaf: true},
    ]
  }
  return []
}

// 代码示例包含数据定义，复制后即可按展示方式接入组件。
const basicCode = `<script setup lang="ts">
import {ref} from 'vue'
import Tree from '@/components/registry/rcn/tree/Tree.vue'
import type {TreeNode} from '@/components/registry/rcn/tree/types'

const checkedKeys = ref<string[]>([])
const checkedNodes = ref<TreeNode[]>([])
const data: TreeNode[] = [
  {id: 'team', label: '研发团队', children: [
    {id: 'frontend', label: '前端组', children: [
      {id: 'vue', label: 'Vue 项目', leaf: true},
      {id: 'react', label: 'React 项目', leaf: true},
    ]},
    {id: 'backend', label: '后端组', leaf: true},
  ]},
]
<\/script>

<template>
  <Tree v-model:checked-keys="checkedKeys" :data="data"
        :default-expanded-keys="['team', 'frontend']"
        class="h-56" @update:checked-nodes="checkedNodes = $event" />
  <p>选中键：{{ checkedKeys }}</p>
  <p>选中节点：{{ checkedNodes.map(node => node.label).join('、') }}</p>
</template>`
const interactionCode = `<script setup lang="ts">
import {ref} from 'vue'
import Tree from '@/components/registry/rcn/tree/Tree.vue'
import type {TreeNode} from '@/components/registry/rcn/tree/types'

const checkedKeys = ref<string[]>([])
const clickedNode = ref<TreeNode>()
const data: TreeNode[] = [
  {id: 'projects', label: '项目目录', hideCheckbox: true, children: [
    {id: 'active', label: '进行中的项目', leaf: true},
    {id: 'archived', label: '已归档项目（禁用）', leaf: true, disabled: true},
    {id: 'overview', label: '项目概览（隐藏复选框）', leaf: true, hideCheckbox: true},
  ]},
]
<\/script>

<template>
  <Tree v-model:checked-keys="checkedKeys" :data="data"
        :default-expanded-keys="['projects']" :check-on-node-click="false"
        class="h-44" @node-click="clickedNode = $event" />
  <p>最近点击：{{ clickedNode?.label || '无' }}</p>
</template>`
const lazyCode = `<script setup lang="ts">
import {ref} from 'vue'
import Tree from '@/components/registry/rcn/tree/Tree.vue'
import type {TreeNode} from '@/components/registry/rcn/tree/types'

const checkedKeys = ref<string[]>([])
const data = ref<TreeNode[]>([{id: 'devices', label: '设备分组'}])

/** 模拟加载分组，实际业务中可替换为接口请求。 */
async function loadChildren(node: TreeNode): Promise<TreeNode[]> {
  await new Promise(resolve => setTimeout(resolve, 600))
  if (node.id === 'devices') {
    return [
      {id: 'workshop', label: '生产车间'},
      {id: 'warehouse', label: '仓库传感器', leaf: true},
    ]
  }
  if (node.id === 'workshop') {
    return [
      {id: 'motor', label: '电机传感器', leaf: true},
      {id: 'pump', label: '水泵传感器', leaf: true},
    ]
  }
  return []
}
<\/script>

<template>
  <Tree v-model:checked-keys="checkedKeys" :data="data"
        :load-children="loadChildren" class="h-56" />
</template>`
const filterCode = `<script setup lang="ts">
import {computed, ref} from 'vue'
import Tree from '@/components/registry/rcn/tree/Tree.vue'
import type {TreeNode} from '@/components/registry/rcn/tree/types'
import {Button} from '@/components/ui/button'

const checkedKeys = ref<string[]>([])
const hideTemporary = ref(true)
const nodeFilter = computed(() => {
  const hide = hideTemporary.value
  return (node: TreeNode) => !hide || node.type !== 'temporary'
})
const data: TreeNode[] = [
  {id: 'files', label: '项目文件', children: [
    {id: 'source', label: '源代码', leaf: true},
    {id: 'docs', label: '使用文档', leaf: true},
    {id: 'cache', label: '缓存文件', leaf: true, type: 'temporary'},
  ]},
]
<\/script>

<template>
  <Button variant="outline" size="sm" @click="hideTemporary = !hideTemporary">
    {{ hideTemporary ? '显示缓存文件' : '隐藏缓存文件' }}
  </Button>
  <Tree v-model:checked-keys="checkedKeys" :data="data" :node-filter="nodeFilter"
        :default-expanded-keys="['files']" class="h-44" />
</template>`
// API 表以当前组件定义为准，不为业务扩展字段赋予额外渲染行为。
const propsItems: ApiItem[] = [
  {name: 'data', type: 'TreeNode[]', default: '必填', description: '树节点列表，节点 id 应在整棵树内唯一'},
  {name: 'checkedKeys', type: 'string[]', binding: 'v-model:checkedKeys', default: '[]', description: '选中节点键，级联全选后可包含父节点键'},
  {name: 'loading', type: 'boolean', default: 'false', description: '是否显示整棵树的加载骨架屏'},
  {name: 'defaultExpandedKeys', type: 'string[]', default: '[]', description: '节点挂载时默认展开的键；深层节点的祖先也需展开'},
  {name: 'loadChildren', type: '(node: TreeNode) => Promise<TreeNode[]>', default: '—', description: '展开未加载节点或批量勾选时加载子节点，结果写回节点 children'},
  {name: 'checkOnNodeClick', type: 'boolean', default: 'true', description: '点击节点行时切换勾选；隐藏复选框的节点不通过行点击切换'},
  {name: 'nodeFilter', type: '(node: TreeNode) => boolean', default: '—', description: '过滤子节点展示和批量勾选范围，不提供自动保留祖先的递归搜索'},
  {name: 'class', type: 'string', default: "''", description: '容器类名，可指定高度以启用内部滚动'},
]
const eventsItems: ApiItem[] = [
  {name: 'update:checkedNodes', binding: 'nodes', type: 'TreeNode[]', description: '同步选中节点信息，包含已选中且已加载的叶子和父级节点'},
  {name: 'node-click', binding: 'node', type: 'TreeNode', description: '点击节点行时触发，与是否允许行点击勾选独立'},
]
const nodeItems: ApiItem[] = [
  {name: 'id', type: 'string', default: '必填', description: '全树唯一节点键'},
  {name: 'label', type: 'string', default: '必填', description: '节点显示文字'},
  {name: 'leaf', type: 'boolean', default: '—', description: '叶子节点必须显式设置 true；未设置时按分支节点处理'},
  {name: 'children', type: 'TreeNode[]', default: '—', description: '子节点；undefined 表示尚未加载，[] 表示已加载但没有子节点'},
  {name: 'disabled', type: 'boolean', default: '—', description: '禁用当前节点的勾选；禁用叶子不参与父节点批量勾选'},
  {name: 'hideCheckbox', type: 'boolean', default: '—', description: '隐藏当前节点复选框，不等同于 disabled，仍可能参与父级级联勾选'},
  {name: 'type', type: 'string', default: '—', description: '业务节点类型，可用于过滤等业务逻辑'},
  {name: 'value', type: 'string', default: '—', description: '可选业务值'},
  {name: 'hasVibPoint', type: 'boolean', default: '—', description: '可选业务标记，组件不会据此改变展示'},
  {name: 'data', type: 'Record<string, unknown>', default: '—', description: '附加业务数据'},
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Tree</h1>
      <p class="text-muted-foreground mt-1">树形选择组件，支持级联勾选、半选状态、默认展开、异步加载和节点过滤。</p>
    </div>

    <InstallCommand component-name="tree"/>

    <h2 id="section-examples" data-toc-id="section-examples" data-toc-text="示例" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">示例</h2>

    <CodePreview title="级联勾选与默认展开" :code="basicCode">
      <div class="w-full max-w-lg space-y-3">
        <Tree v-model:checked-keys="checkedKeys" :data="basicData" :default-expanded-keys="['team', 'frontend']" class="h-56 rounded-md border" @update:checked-nodes="checkedNodes = $event"/>
        <p class="text-sm text-muted-foreground break-all">选中键：{{ checkedKeys.length ? checkedKeys.join('、') : '无' }}</p>
        <p class="text-sm text-muted-foreground">选中节点：{{ checkedNodes.map(node => node.label).join('、') || '无' }}</p>
      </div>
    </CodePreview>

    <CodePreview title="节点交互" :code="interactionCode">
      <div class="w-full max-w-lg space-y-3">
        <p class="text-sm text-muted-foreground">关闭行点击勾选后，点击文字只触发节点事件；复选框仍可勾选。</p>
        <Tree v-model:checked-keys="interactionKeys" :data="interactionData" :default-expanded-keys="['projects']" :check-on-node-click="false" class="h-44 rounded-md border" @node-click="clickedNode = $event"/>
        <p class="text-sm text-muted-foreground">最近点击：{{ clickedNode?.label || '无' }}</p>
      </div>
    </CodePreview>

    <CodePreview title="异步加载" :code="lazyCode">
      <div class="w-full max-w-lg space-y-3">
        <p class="text-sm text-muted-foreground">点击展开按钮加载下一层；勾选父节点会加载其后代并批量勾选可选叶子。</p>
        <Tree v-model:checked-keys="lazyKeys" :data="lazyData" :load-children="loadChildren" class="h-56 rounded-md border"/>
        <p class="text-sm text-muted-foreground break-all">选中键：{{ lazyKeys.length ? lazyKeys.join('、') : '无' }}</p>
      </div>
    </CodePreview>

    <CodePreview title="节点过滤" :code="filterCode">
      <div class="w-full max-w-lg space-y-3">
        <Button variant="outline" size="sm" @click="hideTemporary = !hideTemporary">{{ hideTemporary ? '显示缓存文件' : '隐藏缓存文件' }}</Button>
        <Tree v-model:checked-keys="filterKeys" :data="filterData" :node-filter="nodeFilter" :default-expanded-keys="['files']" class="h-44 rounded-md border"/>
        <p class="text-sm text-muted-foreground">此示例保留父级，仅过滤缓存叶子。过滤不会自动清除隐藏叶子的已选键。</p>
        <p class="text-sm text-muted-foreground break-all">选中键：{{ filterKeys.length ? filterKeys.join('、') : '无' }}</p>
      </div>
    </CodePreview>

    <CodePreview title="加载与空状态" :code="`<Tree :data=&quot;[]&quot; loading class=&quot;h-56&quot; />
<Tree :data=&quot;[]&quot; class=&quot;h-56&quot; />`">
      <div class="grid w-full gap-4 sm:grid-cols-2">
        <Tree :data="[]" loading class="h-56 rounded-md border"/>
        <Tree :data="[]" class="h-56 rounded-md border"/>
      </div>
    </CodePreview>

    <h2 id="section-usage" data-toc-id="section-usage" data-toc-text="使用说明" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">使用说明</h2>
    <ul class="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
      <li>叶子节点显式设置 <code>leaf: true</code>。父节点勾选会级联处理可选叶子，部分选中时显示半选状态。</li>
      <li>懒加载会修改传入节点的 <code>children</code>，建议使用响应式、可变的业务数据；不同树实例不要共享需要独立加载的节点对象。</li>
      <li><code>nodeFilter</code> 用于子节点显示与批量勾选范围。隐藏某个子分支也会隐藏其后代；根节点仍由 <code>data</code> 控制，需要筛选根节点时先处理传入数据。</li>
      <li><code>defaultExpandedKeys</code> 在节点挂载时生效，不是受控展开状态；需要展开深层节点时同时提供祖先键。</li>
      <li>组件内部支持滚动，建议通过 <code>class</code> 设置容器高度；选中键可包含级联同步的父节点。</li>
    </ul>

    <h2 id="section-api" data-toc-id="section-api" data-toc-text="API 参考" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">API 参考</h2>
    <ApiTable title="Props" :items="propsItems" type="props"/>
    <ApiTable title="Events" :items="eventsItems" type="events"/>
    <ApiTable title="TreeNode" :items="nodeItems" type="props"/>
  </div>
</template>
