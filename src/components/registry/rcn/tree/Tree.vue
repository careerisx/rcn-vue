<script setup lang="ts">
import {watch, ref} from 'vue';
import TreeNodeItem from './TreeNode.vue';
import type {TreeNode} from './types.ts';
import Empty from '@/components/registry/rcn/empty/Empty.vue';
import {Skeleton} from '@/components/ui/skeleton';
import {cn} from '@/lib/utils';

const props = withDefaults(defineProps<{
  class?: string;
  data: TreeNode[];
  loading?: boolean;
  defaultExpandedKeys?: string[];
  loadChildren?: (node: TreeNode) => Promise<TreeNode[]>;
  checkOnNodeClick?: boolean;
  /**
   * 前端节点过滤器，仅影响节点展示和批量勾选范围。
   */
  nodeFilter?: (node: TreeNode) => boolean;
}>(), {
  class: '',
  loading: false,
  defaultExpandedKeys: () => [],
  checkOnNodeClick: true,
});

const emit = defineEmits<{
  (e: 'update:checkedNodes', nodes: TreeNode[]): void;
  (e: 'node-click', node: TreeNode): void;
}>();

const checkedKeys = defineModel<string[]>('checkedKeys', {default: () => []});

/**
 * 已勾选节点映射，用于向业务组件返回完整节点信息。
 */
const checkedNodes = ref<Map<string, TreeNode>>(new Map());

watch(checkedKeys, (keys) => {
  let changed = false;
  for (const key of Array.from(checkedNodes.value.keys())) {
    if (!keys.includes(key)) {
      checkedNodes.value.delete(key);
      changed = true;
    }
  }
  if (syncCheckedNodesFromLoadedData()) {
    changed = true;
  }
  if (changed) {
    emit('update:checkedNodes', Array.from(checkedNodes.value.values()));
  }
}, {deep: true});

watch(() => props.data, () => {
  if (syncCheckedNodesFromLoadedData()) {
    emit('update:checkedNodes', Array.from(checkedNodes.value.values()));
  }
}, {deep: true});

/**
 * 勾选或取消勾选节点。
 *
 * @param nodes 本次需要切换状态的节点
 * @param checked 是否勾选
 */
function toggleCheck(nodes: TreeNode[], checked: boolean) {
  const keySet = new Set(checkedKeys.value);
  nodes.forEach(node => {
    if (checked) {
      keySet.add(node.id);
      checkedNodes.value.set(node.id, node);
    } else {
      keySet.delete(node.id);
      checkedNodes.value.delete(node.id);
    }
  });
  syncParentCheckedKeys(props.data, keySet);
  for (const key of Array.from(checkedNodes.value.keys())) {
    if (!keySet.has(key)) {
      checkedNodes.value.delete(key);
    }
  }
  checkedKeys.value = Array.from(keySet);
  syncCheckedNodesFromLoadedData();
  emit('update:checkedNodes', Array.from(checkedNodes.value.values()));
}

watch(() => props.nodeFilter, () => {
  const keySet = new Set(checkedKeys.value);
  syncParentCheckedKeys(props.data, keySet);
  const normalizedKeys = Array.from(keySet);
  if (normalizedKeys.length === checkedKeys.value.length
      && normalizedKeys.every(key => checkedKeys.value.includes(key))) {
    return;
  }
  checkedKeys.value = normalizedKeys;
});

/**
 * 按已加载的叶子节点状态同步父级节点键。
 *
 * <p>懒加载树的父级不能只依赖各层组件的局部加载状态，否则祖先组件可能在
 * 子分支已经加载并全选后仍保留未选状态。这里基于共享树数据自底向上统一计算。</p>
 *
 * @param nodes 当前层节点
 * @param keySet 已勾选节点键集合
 * @returns 当前层是否包含可勾选节点、是否全部勾选以及是否全部加载
 */
function syncParentCheckedKeys(nodes: TreeNode[], keySet: Set<string>): {
  checkable: boolean;
  checked: boolean;
  loaded: boolean;
} {
  const visibleNodes = props.nodeFilter ? nodes.filter(props.nodeFilter) : nodes;
  const states = visibleNodes.map(node => {
    if (node.leaf) {
      return {
        checkable: !node.disabled,
        checked: !!node.disabled || keySet.has(node.id),
        loaded: true,
      };
    }

    const childrenLoaded = node.children !== undefined;
    const childState = syncParentCheckedKeys(node.children ?? [], keySet);
    const nodeChecked = childrenLoaded && childState.checkable && childState.checked && childState.loaded;
    if (nodeChecked) {
      keySet.add(node.id);
    } else {
      keySet.delete(node.id);
    }
    return {
      checkable: childState.checkable,
      checked: nodeChecked,
      loaded: childrenLoaded && childState.loaded,
    };
  });

  const checkableStates = states.filter(state => state.checkable);
  return {
    checkable: checkableStates.length > 0,
    checked: checkableStates.length > 0 && checkableStates.every(state => state.checked),
    loaded: states.every(state => state.loaded),
  };
}

/**
 * 根据当前已加载的树节点和外部 checkedKeys 补齐 checkedNodes。
 *
 * @returns checkedNodes 是否发生变化
 */
function syncCheckedNodesFromLoadedData(): boolean {
  const keySet = new Set(checkedKeys.value);
  let changed = false;
  walkTree(props.data, node => {
    if (keySet.has(node.id) && !checkedNodes.value.has(node.id)) {
      checkedNodes.value.set(node.id, node);
      changed = true;
    }
  });
  return changed;
}

/**
 * 遍历已加载的树节点。
 *
 * @param nodes 节点列表
 * @param visitor 节点访问函数
 */
function walkTree(nodes: TreeNode[], visitor: (node: TreeNode) => void) {
  nodes.forEach(node => {
    visitor(node);
    if (node.children?.length) {
      walkTree(node.children, visitor);
    }
  });
}
</script>

<template>
  <div :class="cn('flex h-full min-h-0 flex-col overflow-hidden', props.class)">
    <div v-if="loading" class="flex flex-col gap-2 p-2">
      <Skeleton v-for="i in 6" :key="i" class="h-8 w-full"/>
    </div>
    <div v-else-if="data.length === 0" class="flex flex-1">
      <Empty title="暂无树节点" description="请切换项目或刷新后重试" :show-action="false"/>
    </div>
    <div v-else class="flex-1 overflow-auto py-1">
      <TreeNodeItem
          v-for="node in data"
          :key="node.id"
          :node="node"
          :checked-keys="checkedKeys"
          :default-expanded-keys="defaultExpandedKeys"
          :load-children="loadChildren"
          :check-on-node-click="checkOnNodeClick"
          :node-filter="nodeFilter"
          @toggle-check="toggleCheck"
          @node-click="node => emit('node-click', node)"/>
    </div>
  </div>
</template>
