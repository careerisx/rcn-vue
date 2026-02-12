# 封装组件教程

本指南详细说明如何在 rcn-vue 注册表中封装自定义组件。

## 核心概念

rcn-vue 使用 shadcn-vue 的 **Registry 系统**。你编写组件源码 → 在 `registry.json` 中声明 → 运行 `pnpm registry:build` 生成 JSON → 部署后其他项目就能通过 CLI 安装。

```
编写组件 → registry.json 声明 → build 生成 JSON → 部署 → 其他项目 add 安装
```

## 第一步：创建组件

### 目录规范

所有组件放在 `registry/rcn/` 下，每个组件一个目录：

```
registry/
└── rcn/
    └── <组件名>/            # 如: button
        ├── 组件.vue          # 主组件
        ├── 子组件.vue        # 可选：子组件
        └── useXxx.ts        # 可选：composable
```

### 命名规范

| 类别 | 规范 | 示例 |
|------|------|------|
| 目录名 | kebab-case | `button` |
| 组件文件名 | PascalCase | `Button.vue` |
| composable 文件名 | camelCase，加 `use` 前缀 | `useTable.ts` |

### 编写组件

组件内部可以自由引用 shadcn-vue 基础组件和项目的工具函数：

```vue
<script setup lang="ts">
// ✅ 引用 shadcn-vue 基础组件（使用 @ 别名）
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// ✅ 引用项目工具函数
import { cn } from '@/lib/utils'

// ✅ 引用外部 npm 包
import { Loader2 } from 'lucide-vue-next'
</script>

<template>
  <Button>
    <Loader2 class="mr-2 h-4 w-4 animate-spin" />
    自定义按钮
  </Button>
</template>
```

> **重要**：import 路径必须使用 `@/` 别名（如 `@/components/ui/button`），CLI 安装时会自动转换为目标项目的路径。

### 多文件组件

如果组件较复杂，可拆分为多个文件：

```
registry/
└── rcn/
    └── data-table/
        ├── DataTable.vue              # 主组件
        ├── DataTablePagination.vue     # 分页子组件
        ├── DataTableToolbar.vue        # 工具栏子组件
        └── useDataTable.ts             # composable
```

子组件之间的引用使用**相对路径**：

```vue
<script setup lang="ts">
// 同目录下的子组件用相对路径
import RDataTablePagination from './RDataTablePagination.vue'
import { useRDataTable } from './useRDataTable'
</script>
```

---

## 第二步：注册到 registry.json

在项目根目录的 `registry.json` 的 `items` 数组中添加组件定义。

### 基本结构

```json
{
  "name": "button",
  "type": "registry:block",
  "title": "Button",
  "description": "基于 shadcn-vue Button 的增强按钮组件，支持 loading 状态",
  "dependencies": ["lucide-vue-next"],
  "registryDependencies": ["button"],
  "files": [
    {
      "path": "registry/rcn/button/Button.vue",
      "type": "registry:component"
    }
  ]
}
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | ✅ | 组件名，kebab-case，用于 CLI 安装和生成 JSON 文件名 |
| `type` | ✅ | 固定为 `"registry:block"` |
| `title` | 建议 | 人类可读的组件标题 |
| `description` | ✅ | 组件描述 |
| `dependencies` | 按需 | 需要安装的 **npm 包**（如 `@tanstack/vue-table`） |
| `registryDependencies` | 按需 | 依赖的 **shadcn-vue 基础组件**（如 `button`、`input`、`table`） |
| `files` | ✅ | 组件文件列表 |

### `files` 中的 type 类型

| type | 说明 | 安装位置 |
|------|------|---------|
| `registry:component` | Vue 组件 | `components/` 目录 |
| `registry:hook` | composable/hook | `composables/` 目录 |
| `registry:lib` | 工具库 | `lib/` 目录 |
| `registry:ui` | UI 基础组件 | `components/ui/` 目录 |
| `registry:page` | 页面（需设 `target`） | 指定的 `target` 路径 |
| `registry:file` | 任意文件（需设 `target`） | 指定的 `target` 路径 |

### 多文件组件示例

```json
{
  "name": "data-table",
  "type": "registry:block",
  "title": "Data Table",
  "description": "增强数据表格，支持分页、排序、筛选",
  "dependencies": ["@tanstack/vue-table"],
  "registryDependencies": ["table", "button", "input", "select"],
  "files": [
    {
      "path": "registry/rcn/data-table/DataTable.vue",
      "type": "registry:component"
    },
    {
      "path": "registry/rcn/data-table/DataTablePagination.vue",
      "type": "registry:component"
    },
    {
      "path": "registry/rcn/data-table/DataTableToolbar.vue",
      "type": "registry:component"
    },
    {
      "path": "registry/rcn/data-table/useDataTable.ts",
      "type": "registry:hook"
    }
  ]
}
```

### 带 CSS 变量的组件

如果组件需要自定义 CSS 变量：

```json
{
  "name": "theme-card",
  "type": "registry:block",
  "title": "R Theme Card",
  "description": "带品牌主题色的卡片组件",
  "registryDependencies": ["card"],
  "cssVars": {
    "light": {
      "brand": "220 90% 56%",
      "brand-foreground": "0 0% 100%"
    },
    "dark": {
      "brand": "220 90% 66%",
      "brand-foreground": "0 0% 100%"
    }
  },
  "files": [
    {
      "path": "registry/rcn/theme-card/ThemeCard.vue",
      "type": "registry:component"
    }
  ]
}
```

---

## 第三步：构建和验证

### 构建

```bash
pnpm registry:build
```

构建后会在 `public/r/` 目录下生成对应的 JSON 文件：

```
public/r/
├── button.json
├── data-table.json
└── registry.json
```

### 本地验证

启动开发服务器后，可以在本地测试安装：

```bash
# 启动本地服务器
pnpm dev

# 在另一个项目中测试安装（假设 dev server 在 5173 端口）
pnpm dlx @lwenh/rcn add button
```

---

## 第四步：部署

推送到 `main` 分支后，GitHub Actions 会自动：

1. 安装依赖
2. 运行 `pnpm registry:build`
3. 将 `public/r/` 部署到 GitHub Pages

> **首次部署前**，你需要在 GitHub 仓库的 Settings → Pages 中将 Source 设置为 **GitHub Actions**。

---

## 完整示例：封装一个新组件

假设你要封装一个确认对话框组件 `r-confirm-dialog`：

### 1. 安装基础组件依赖

先确保本项目中有用到的 shadcn-vue 基础组件：

```bash
pnpm dlx shadcn-vue@latest add dialog button
```

### 2. 创建组件文件

```
registry/rcn/confirm-dialog/ConfirmDialog.vue
```

```vue
<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Props {
  open: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '确认操作',
  description: '你确定要执行此操作吗？',
  confirmText: '确认',
  cancelText: '取消',
  destructive: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
  cancel: []
}>()

function handleConfirm() {
  emit('confirm')
  emit('update:open', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" @click="handleCancel">
          {{ cancelText }}
        </Button>
        <Button
          :variant="destructive ? 'destructive' : 'default'"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
```

### 3. 注册到 registry.json

在 `registry.json` 的 `items` 数组末尾添加：

```json
{
  "name": "confirm-dialog",
  "type": "registry:block",
  "title": "R Confirm Dialog",
  "description": "确认对话框组件，支持普通和危险操作两种模式",
  "registryDependencies": ["dialog", "button"],
  "files": [
    {
      "path": "registry/rcn/confirm-dialog/ConfirmDialog.vue",
      "type": "registry:component"
    }
  ]
}
```

### 4. 构建并验证

```bash
pnpm registry:build
```

### 5. 推送部署

```bash
git add .
git commit -m "feat: add confirm-dialog component"
git push origin main
```

GitHub Actions 自动部署后，其他项目即可安装：

```bash
# pnpm
pnpm dlx @lwenh/rcn add confirm-dialog
# npm
npx @lwenh/rcn add confirm-dialog
# bun
bunx --bun @lwenh/rcn add confirm-dialog
```

---

## 常见问题

### Q: 怎么引用其他自定义组件作为依赖？

在 `registryDependencies` 中使用完整 URL：

```json
{
  "registryDependencies": [
    "button",
    "https://careerisx.github.io/rcn-vue/button.json"
  ]
}
```

### Q: 组件需要安装指定版本的 npm 包？

在 `dependencies` 中使用 `name@version` 格式：

```json
{
  "dependencies": ["@tanstack/vue-table@^8.20.0", "zod@^3.20.0"]
}
```

### Q: 如何给组件添加安装后的提示信息？

使用 `docs` 字段：

```json
{
  "docs": "安装后请在 .env 中添加 VITE_API_URL 环境变量。"
}
```
