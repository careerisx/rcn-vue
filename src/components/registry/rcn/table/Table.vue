<script setup lang="ts" generic="TData, TValue">
import {computed, h, ref, watch} from 'vue';
import type {ColumnDef, RowSelectionState} from '@tanstack/vue-table';
import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Checkbox} from '@/components/ui/checkbox';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Empty, {type EmptyProps} from '@/components/registry/rcn/empty/Empty.vue';
import {Skeleton} from '@/components/ui/skeleton';
import type {AcceptableValue} from 'reka-ui';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';

export interface MDataTableProps<TData, TValue> {
  /**
   * 额外的类名
   */
  class?: string;
  /**
   * 列定义
   */
  columns: ColumnDef<TData, TValue>[];
  /**
   * 表格数据
   */
  data: TData[];
  /**
   * 是否显示分页
   */
  showPagination?: boolean;
  /**
   * 是否显示选择列
   */
  showSelection?: boolean;
  /**
   * 每页显示条数选项
   */
  pageSizeOptions?: number[];
  /**
   * 默认每页显示条数
   */
  defaultPageSize?: number;
  /**
   * 总数据条数（用于服务端分页）
   */
  total?: number;
  /**
   * 当前页码（用于服务端分页，从1开始）
   */
  currentPage?: number;
  /**
   * 是否使用服务端分页
   */
  serverSide?: boolean;
  /**
   * 加载状态
   */
  loading?: boolean;
  /**
   * 行唯一标识字段
   */
  rowKey?: string;
  /**
   * 空数据组件配置
   */
  emptyProps?: EmptyProps;

}

const props = withDefaults(defineProps<MDataTableProps<TData, TValue>>(), {
  class: '',
  showPagination: true,
  showSelection: false,
  pageSizeOptions: () => [10, 20, 30, 50],
  defaultPageSize: 20,
  total: 0,
  currentPage: 1,
  serverSide: false,
  loading: false,
  rowKey: 'id',
  emptyProps: () => ({
    title: '暂无数据',
    description: '请添加数据或刷新列表',
    iconSize: 'md',
    showAction: true,
  }),
});

const emit = defineEmits<{
  (e: 'update:selection', selection: TData[]): void;
  (e: 'page-change', page: number): void;
  (e: 'page-size-change', pageSize: number): void;
  (e: 'empty-action'): void;
}>();

// 双向绑定选中的 ID 列表
const selectedIds = defineModel<(string | number)[]>('selectedIds', {default: () => []});

// 行选择状态
const rowSelection = ref<RowSelectionState>({});

// 生成带选择列的列定义
const columnsWithSelection = computed<ColumnDef<TData, TValue>[]>(() => {
  if (!props.showSelection) {
    return props.columns;
  }

  const selectionColumn: ColumnDef<TData, TValue> = {
    id: 'select',
    header: ({table}) => h(Checkbox, {
      'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
      'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': '全选',
    }),
    cell: ({row}) => h(Checkbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
      'ariaLabel': '选择行',
    }),
    enableSorting: false,
    enableHiding: false,
    size: 80,
    meta: {
      class: 'w-20',
    },
  };

  return [selectionColumn, ...props.columns];
});

// 创建表格实例
const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return columnsWithSelection.value;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: (props.serverSide || !props.showPagination) ? undefined : getPaginationRowModel(),
  onRowSelectionChange: (updaterOrValue) => {
    rowSelection.value = typeof updaterOrValue === 'function'
        ? updaterOrValue(rowSelection.value)
        : updaterOrValue;
  },
  getRowId: (row) => {
    return String((row as Record<string, unknown>)[props.rowKey] ?? '');
  },
  state: {
    get rowSelection() {
      return rowSelection.value;
    },
  },
  initialState: {
    pagination: {
      pageSize: props.defaultPageSize,
    },
  },
});

// 每页条数
const pageSize = ref(props.defaultPageSize);

// 当前页（服务端分页模式）
const internalPage = ref(props.currentPage);

// 监听选择变化
watch(rowSelection, () => {
  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
  emit('update:selection', selectedRows);

  // 同步更新 selectedIds
  const newIds = selectedRows.map(row => (row as Record<string, unknown>)[props.rowKey] as string | number);

  // 比较是否有变化，避免不必要的更新
  const currentIds = selectedIds.value || [];
  if (newIds.length !== currentIds.length || !newIds.every((id, index) => id === currentIds[index])) {
    selectedIds.value = newIds;
  }
}, {deep: true});

// 监听外部 currentPage 变化
watch(() => props.currentPage, (val) => {
  internalPage.value = val;
});

// 监听 selectedIds 变化，初始化选中状态
watch(selectedIds, (ids) => {
  if (!ids || ids.length === 0) {
    if (Object.keys(rowSelection.value).length > 0) {
      rowSelection.value = {};
    }
    return;
  }

  const newSelection: RowSelectionState = {};
  ids.forEach(id => {
    newSelection[String(id)] = true;
  });

  // 比较是否有变化，避免不必要的更新
  const currentKeys = Object.keys(rowSelection.value).filter(k => rowSelection.value[k]);
  const newKeys = Object.keys(newSelection);
  if (currentKeys.length !== newKeys.length || !newKeys.every(k => rowSelection.value[k])) {
    rowSelection.value = newSelection;
  }
}, {immediate: true});

// 计算总页数
const totalPages = computed(() => {
  if (props.serverSide) {
    return Math.ceil(props.total / pageSize.value);
  }
  return table.getPageCount();
});

// 计算当前页码
const currentPageIndex = computed(() => {
  if (props.serverSide) {
    return internalPage.value;
  }
  return table.getState().pagination.pageIndex + 1;
});

// 处理页码变化
function handlePageChange(page: number) {
  if (props.serverSide) {
    internalPage.value = page;
    emit('page-change', page);
  } else {
    table.setPageIndex(page - 1);
  }
}

// 处理每页条数变化
function handlePageSizeChange(size: AcceptableValue) {
  const newSize = Number(size);
  pageSize.value = newSize;
  if (props.serverSide) {
    internalPage.value = 1;
    emit('page-size-change', newSize);
    emit('page-change', 1);
  } else {
    table.setPageSize(newSize);
  }
}

// 计算选中行数
const selectedCount = computed(() => {
  return Object.keys(rowSelection.value).filter(key => rowSelection.value[key]).length;
});

// 计算总数
const totalCount = computed(() => {
  return props.serverSide ? props.total : props.data.length;
});

// 清空选择
function clearSelection() {
  rowSelection.value = {};
}

// 暴露方法和状态
defineExpose({
  table,
  clearSelection,
  selectedRows: computed(() => table.getFilteredSelectedRowModel().rows.map(row => row.original)),
  selectedCount,
});
</script>

<template>
  <div :class="cn('w-full flex flex-col gap-1 overflow-hidden', props.class)">
    <!-- 选择信息提示 -->
    <div v-if="showSelection && selectedCount > 0"
         class="flex justify-between items-center gap-4 py-1 text-sm text-muted-foreground">
      <div class="flex items-center gap-1 sm:gap-2">
        <!-- 批量操作插槽 -->
        <slot name="batch-actions" :selection="table.getFilteredSelectedRowModel().rows.map(row => row.original)"
              :count="selectedCount"/>
      </div>
      <div class="flex items-center gap-1">
        <Button variant="link" size="sm" @click="clearSelection">清空</Button>
        <span class="hidden sm:block">已选择</span>
        <span>{{ selectedCount }} 项</span>
      </div>
    </div>

    <!-- 表格 -->
    <div class="flex-1 min-h-0">
      <Table>
        <TableHeader class="sticky top-0 bg-secondary z-10">
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id"
                       :class="(header.column.columnDef.meta as any)?.class"
                       :style="(header.column.columnDef.meta as any)?.style">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                          :props="header.getContext()"/>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="loading">
            <TableRow v-for="i in 5" :key="i">
              <TableCell v-for="col in columnsWithSelection.length" :key="col">
                <Skeleton class="h-5 w-full"/>
              </TableCell>
            </TableRow>
          </template>
          <template v-else-if="table.getRowModel().rows?.length">
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id"
                      :data-state="row.getIsSelected() ? 'selected' : undefined">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id"
                         :class="(cell.column.columnDef.meta as any)?.class"
                         :style="(cell.column.columnDef.meta as any)?.style"
                         :title="cell.getContext().getValue()">
                <!-- 支持插槽自定义列内容，插槽名称为 cell-{columnId} -->
                <slot :name="`cell-${cell.column.id}`" :row="row.original" :value="cell.getValue()" :cell="cell">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()"/>
                </slot>
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columnsWithSelection.length" class="h-48">
                <slot name="empty">
                  <Empty v-bind="emptyProps" @action="emit('empty-action')"/>
                </slot>
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- 分页 -->
    <div v-if="showPagination" class="flex items-center flex-col sm:flex-row justify-end px-2 pt-1 gap-1">
      <Pagination v-slot="{ page }" :items-per-page="pageSize" :total="totalCount" :default-page="currentPageIndex"
                  :page="currentPageIndex" @update:page="handlePageChange" class="justify-end">
        <PaginationContent v-slot="{ items }">
          <PaginationFirst :disabled="currentPageIndex <= 1"/>
          <PaginationPrevious :disabled="currentPageIndex <= 1"/>
          <template v-for="(item, index) in items" :key="index">
            <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page"/>
            <PaginationEllipsis v-else-if="item.type === 'ellipsis'" :index="index"/>
          </template>
          <PaginationNext :disabled="currentPageIndex >= totalPages"/>
          <PaginationLast :disabled="currentPageIndex >= totalPages"/>
        </PaginationContent>
      </Pagination>
      <div class="flex w-full items-center sm:w-auto justify-end gap-2 text-sm text-muted-foreground">
        <span class="text-nowrap">每页</span>
        <Select :model-value="String(pageSize)" @update:model-value="handlePageSizeChange">
          <SelectTrigger class="h-8 w-17">
            <SelectValue/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="size in pageSizeOptions" :key="size" :value="String(size)">
              {{ size }}
            </SelectItem>
          </SelectContent>
        </Select>
        <span>条</span>
        <span class="mx-2">|</span>
        <span class="text-nowrap">共 {{ totalCount }} 条</span>
      </div>
    </div>
  </div>
</template>