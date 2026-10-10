<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import {Check, ChevronRight, Loader, Minus} from '@lucide/vue';
import {Checkbox} from '@/components/ui/checkbox';
import {cn} from '@/lib/utils';
import type {TreeNode} from './types.ts';

defineOptions({
  name: 'TreeNode',
});

const props = withDefaults(defineProps<{
  node: TreeNode;
  level?: number;
  checkedKeys: string[];
  defaultExpandedKeys?: string[];
  loadChildren?: (node: TreeNode) => Promise<TreeNode[]>;
  checkOnNodeClick?: boolean;
  /**
   * 前端节点过滤器，仅影响当前层级子节点展示。
   */
  nodeFilter?: (node: TreeNode) => boolean;
}>(), {
  level: 0,
  defaultExpandedKeys: () => [],
  checkOnNodeClick: true,
});

const emit = defineEmits<{
  (e: 'toggle-check', nodes: TreeNode[], checked: boolean): void;
  (e: 'node-click', node: TreeNode): void;
}>();

const expanded = ref(false);
const loading = ref(false);
const loaded = ref(props.node.children !== undefined || !!props.node.leaf);
const children = ref<TreeNode[]>(props.node.children ?? []);
const loadedNodeIds = ref<Set<string>>(new Set());

const hasChildren = computed(() => !props.node.leaf);
/**
 * 懒加载可能由任一祖先节点触发；优先读取共享节点上的 children，避免子组件保留旧缓存。
 */
const nodeChildren = computed(() => props.node.children ?? children.value);
const visibleChildren = computed(() => filterVisibleNodes(nodeChildren.value));
const checkboxDisabled = computed(() => !!props.node.disabled || loading.value);
const checked = computed(() => {
  if (props.node.leaf) {
    return props.checkedKeys.includes(props.node.id);
  }
  if (props.checkedKeys.includes(props.node.id)) {
    return true;
  }
  if (hasUnloadedBranch(props.node, visibleChildren.value)) {
    return false;
  }
  const checkableNodes = getLoadedCheckableNodes(props.node, visibleChildren.value);
  return checkableNodes.length > 0 && checkableNodes.every(node => props.checkedKeys.includes(node.id));
});
const indeterminate = computed(() => {
  if (props.node.leaf) {
    return false;
  }
  return !checked.value && hasCheckedDescendant(visibleChildren.value);
});
const checkboxValue = computed(() => indeterminate.value ? 'indeterminate' : checked.value);
const showCheckedStyle = computed(() => !props.node.hideCheckbox && (checked.value || indeterminate.value));

onMounted(async () => {
  if (props.defaultExpandedKeys.includes(props.node.id)) {
    await expandNode();
  }
});

watch(() => props.node.children, (value) => {
  children.value = value ?? [];
  if (value !== undefined || props.node.leaf || loadedNodeIds.value.has(props.node.id)) {
    loaded.value = true;
  }
}, {deep: true});

async function toggleExpand() {
  if (!hasChildren.value) return;
  expanded.value = !expanded.value;
  await loadNodeChildren();
}

async function expandNode() {
  if (!hasChildren.value) return;
  expanded.value = true;
  await loadNodeChildren();
}

async function loadNodeChildren() {
  if (!expanded.value || loaded.value || nodeChildren.value.length > 0 || !props.loadChildren) return;
  loading.value = true;
  try {
    children.value = await props.loadChildren(props.node);
    props.node.children = children.value;
    loadedNodeIds.value.add(props.node.id);
    loaded.value = true;
  } finally {
    loading.value = false;
  }
}

function getLoadedCheckableNodes(node: TreeNode, nodeChildren: TreeNode[]): TreeNode[] {
  if (node.leaf) {
    return node.disabled ? [] : [node];
  }
  return nodeChildren.flatMap(child => getLoadedCheckableNodes(child, child.children ?? []));
}

function hasUnloadedBranch(node: TreeNode, nodeChildren: TreeNode[]): boolean {
  if (node.leaf) {
    return false;
  }
  if (nodeChildren.length === 0) {
    return node.children === undefined && !loadedNodeIds.value.has(node.id);
  }
  return nodeChildren.some(child => !child.leaf && hasUnloadedBranch(child, child.children ?? []));
}

/**
 * 判断当前节点下是否存在已勾选的可见后代。
 *
 * <p>父节点可能仍有未加载分支，此时不能只统计已加载的叶子节点。级联同步已经
 * 写入的中间节点键同样表示该分支已选中，应据此让更上层节点进入半选状态。</p>
 *
 * @param nodeChildren 当前节点的子节点
 * @returns 是否存在已勾选后代
 */
function hasCheckedDescendant(nodeChildren: TreeNode[]): boolean {
  return filterVisibleNodes(nodeChildren).some(child =>
      props.checkedKeys.includes(child.id)
      || hasCheckedDescendant(child.children ?? []));
}

/**
 * 按当前过滤器返回可显示的节点。
 *
 * @param nodes 原始节点列表
 * @returns 可显示节点列表
 */
function filterVisibleNodes(nodes: TreeNode[]): TreeNode[] {
  if (!props.nodeFilter) {
    return nodes;
  }
  return nodes.filter(props.nodeFilter);
}

async function collectCheckableNodes(node: TreeNode, nodeChildren: TreeNode[]): Promise<TreeNode[]> {
  if (node.leaf) {
    return node.disabled ? [] : [node];
  }
  let currentChildren = nodeChildren;
  // 展开时得到的空列表可能已经过期；用户勾选非叶子节点时重新查询一次，
  // 避免三级分支被空的懒加载缓存永久锁成无法选中。
  if (currentChildren.length === 0 && props.loadChildren) {
    currentChildren = await props.loadChildren(node);
    node.children = currentChildren;
    loadedNodeIds.value.add(node.id);
    if (node.id === props.node.id) {
      children.value = currentChildren;
      loaded.value = true;
    }
  }
  currentChildren = filterVisibleNodes(currentChildren);
  const nodes = await Promise.all(currentChildren.map(child => collectCheckableNodes(child, child.children ?? [])));
  return nodes.flat();
}

async function updateCheck(value: boolean) {
  if (checkboxDisabled.value) return;
  loading.value = true;
  try {
    if (!props.node.leaf && !loaded.value) {
      expanded.value = true;
    }
    emit('toggle-check', await collectCheckableNodes(props.node, nodeChildren.value), value);
  } finally {
    loading.value = false;
  }
}

async function handleNodeClick() {
  emit('node-click', props.node);
  if (!props.checkOnNodeClick || props.node.hideCheckbox) return;
  await updateCheck(!checked.value);
}
</script>

<template>
  <div>
    <div :class="cn(
          'flex h-8 w-max min-w-full items-center gap-2 rounded-md px-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-default',
          showCheckedStyle ? 'text-primary' : '',
        )"
         :style="{ paddingLeft: `${(level??0) * 16 + 8}px` }"
         @click="handleNodeClick">
      <button
          type="button"
          class="grid size-5 shrink-0 place-items-center rounded-sm hover:bg-muted"
          :disabled="node.leaf"
          @click.stop="toggleExpand">
        <Loader v-if="loading" class="size-4 animate-spin"/>
        <ChevronRight v-else
                      :class="cn('size-4 transition-transform', expanded ? 'rotate-90' : '', node.leaf ? 'opacity-0' : '')"/>
      </button>
      <Checkbox
          v-if="!node.hideCheckbox"
          :model-value="checkboxValue"
          :disabled="checkboxDisabled"
          @update:model-value="updateCheck(!!$event)"
          @click.stop>
        <Minus v-if="indeterminate" class="size-3.5"/>
        <Check v-else class="size-3.5"/>
      </Checkbox>
      <span class="whitespace-nowrap" :title="node.label">{{ node.label }}</span>
    </div>
    <div v-if="expanded" class="flex flex-col">
      <TreeNode
          v-for="child in visibleChildren"
          :key="child.id"
          :node="child"
          :level="(level??0) + 1"
          :checked-keys="checkedKeys"
          :default-expanded-keys="defaultExpandedKeys"
          :load-children="loadChildren"
          :check-on-node-click="checkOnNodeClick"
          :node-filter="nodeFilter"
          @toggle-check="(nodes, value) => emit('toggle-check', nodes, value)"
          @node-click="node => emit('node-click', node)"/>
      <div v-if="!loading && loaded && visibleChildren.length === 0"
           class="py-2 text-xs text-muted-foreground"
           :style="{ paddingLeft: `${((level??0) + 1) * 16 + 36}px` }">
        暂无子节点
      </div>
    </div>
  </div>
</template>
