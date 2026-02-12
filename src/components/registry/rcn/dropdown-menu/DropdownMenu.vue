<script setup lang="ts">
import type {HTMLAttributes, Component} from 'vue';
import {cn} from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {MoreHorizontal} from 'lucide-vue-next';

/**
 * 菜单项配置
 */
export interface MenuItem {
  /**
   * 菜单项唯一标识，同时作为插槽名（插槽名格式为 menu-${name}）
   */
  name: string;
  /**
   * 显示文本
   */
  label?: string;
  /**
   * 图标组件
   */
  icon?: Component;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 样式变体
   */
  variant?: 'default' | 'destructive';
  /**
   * 快捷键提示
   */
  shortcut?: string;
}

/**
 * 菜单组配置
 */
export interface MenuGroup {
  /**
   * 分组标题
   */
  label?: string;
  /**
   * 菜单项列表
   */
  items: MenuItem[];
}

interface Props {
  /**
   * 自定义类名
   */
  class?: HTMLAttributes['class'];
  /**
   * 菜单项列表（简单模式，不分组）
   */
  items?: MenuItem[];
  /**
   * 菜单分组列表（分组模式）
   */
  groups?: MenuGroup[];
  /**
   * 内容对齐方式
   */
  align?: 'start' | 'center' | 'end';
  /**
   * 内容弹出方向
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * 内容宽度
   */
  contentClass?: HTMLAttributes['class'];
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 其他自定义数据
   */
  meta?: any;
}

const props = withDefaults(defineProps<Props>(), {
  align: 'end',
  side: 'bottom',
  disabled: false,
});

const emit = defineEmits<{
  (e: 'select', name: string, meta?: any): void;
}>();

// 处理菜单项点击
function handleSelect(item: MenuItem) {
  if (!item.disabled) {
    emit('select', item.name, props.meta);
  }
}
</script>

<template>
  <DropdownMenu :class="cn('', props.class)">
    <DropdownMenuTrigger as-child :disabled="disabled">
      <slot>
        <MoreHorizontal :stroke-width="1" />
      </slot>
    </DropdownMenuTrigger>
    <DropdownMenuContent :align="align" :side="side" :class="cn('min-w-40', contentClass)">
      <!-- 简单模式：直接渲染 items -->
      <template v-if="items && items.length > 0">
        <DropdownMenuItem
            v-for="item in items"
            :key="item.name"
            :disabled="item.disabled"
            :variant="item.variant"
            @select="handleSelect(item)"
        >
          <slot :name="`menu-${item.name}`" :item="item">
            <component :is="item.icon" v-if="item.icon" class="mr-2 h-4 w-4"/>
            <span>{{ item.label }}</span>
            <span v-if="item.shortcut" class="ml-auto text-xs text-muted-foreground">{{ item.shortcut }}</span>
          </slot>
        </DropdownMenuItem>
      </template>

      <!-- 分组模式：渲染 groups -->
      <template v-else-if="groups && groups.length > 0">
        <template v-for="(group, groupIndex) in groups" :key="groupIndex">
          <DropdownMenuSeparator v-if="groupIndex > 0"/>
          <DropdownMenuGroup>
            <DropdownMenuLabel v-if="group.label">{{ group.label }}</DropdownMenuLabel>
            <DropdownMenuItem
                v-for="item in group.items"
                :key="item.name"
                :disabled="item.disabled"
                :variant="item.variant"
                @select="handleSelect(item)"
            >
              <slot :name="`menu-${item.name}`" :item="item">
                <component :is="item.icon" v-if="item.icon" class="mr-2 h-4 w-4"/>
                <span>{{ item.label }}</span>
                <span v-if="item.shortcut" class="ml-auto text-xs text-muted-foreground">{{ item.shortcut }}</span>
              </slot>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </template>
      </template>

      <!-- 自定义内容插槽 -->
      <slot name="content"/>
    </DropdownMenuContent>
  </DropdownMenu>
</template>