# rcn-vue

基于 [shadcn-vue](https://www.shadcn-vue.com) 的自定义组件注册表，封装常用业务组件，通过 CLI 一键安装到项目中。

## 可用组件

| 组件 | 说明 |
|------|------|
| `button` | 增强按钮，支持 loading 状态 |
| `card` | 增强卡片，支持插槽自定义 |
| `confirm` | 确认对话框 |
| `data-table` | 数据表格，基于 TanStack Table，支持分页/排序/筛选 |
| `date-picker` | 日期选择器 |
| `date-range-picker` | 日期范围选择器 |
| `dialog` | 对话框，支持插槽自定义 |
| `dropdown-menu` | 下拉菜单 |
| `empty` | 空状态 |
| `form` | 表单组件 |
| `selector` | 选择器，支持单选/多选 |
| `sheet` | 底部弹出层 |
| `title` | 自定义标题样式 |

## 安装组件

目标项目需先初始化 shadcn-vue（有 `components.json` 即可）。

### 使用 @lwenh/rcn CLI

```bash
# pnpm
pnpm dlx @lwenh/rcn add button

# npm
npx @lwenh/rcn add button

# bun
bunx --bun @lwenh/rcn add button

# 安装多个
pnpm dlx @lwenh/rcn add button data-table dialog

# 查看可用组件
pnpm dlx @lwenh/rcn list
```

### 直接使用 shadcn-vue CLI

```bash
pnpm dlx shadcn-vue@latest add https://careerisx.github.io/rcn-vue/r/button.json
```

## 组件安装位置

安装后组件会放在目标项目的：

```
src/components/registry/rcn/<组件名>/
```

例如安装 `button` 后：

```
src/components/registry/rcn/button/Button.vue
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建 registry
pnpm registry:build
```

## 项目结构

```
├── registry.json                                # 组件注册表
├── src/components/registry/rcn/                 # 组件源码
│   ├── button/Button.vue
│   ├── card/Card.vue
│   ├── confirm/Confirm.vue
│   ├── data-table/DataTable.vue
│   ├── ...
│   └── sheet/Sheet.vue
├── public/r/                                    # build 输出（自动生成）
├── packages/cli/                                # @lwenh/rcn CLI
├── .github/workflows/deploy.yml                 # 自动部署到 GitHub Pages
└── src/components/ui/                           # shadcn-vue 基础组件
```

## 部署

推送到 `main` 分支时，修改了 `src/components/registry/`、`registry.json` 或 `.github/workflows/deploy.yml` 会自动触发 GitHub Pages 部署。

也可在 GitHub Actions 页面手动触发 `workflow_dispatch`。
