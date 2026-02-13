# rcn-vue

基于 [shadcn-vue](https://www.shadcn-vue.com) 的自定义组件注册表，封装常用业务组件，通过 CLI 一键安装到项目中。

📖 **[在线文档](https://careerisx.github.io/rcn-vue/)**

## 可用组件

| 组件 | 说明 |
|------|------|
| `button` | 增强按钮，支持 loading 状态 |
| `card` | 增强卡片，支持插槽自定义 |
| `confirm` | 确认对话框 |
| `table` | 数据表格，基于 TanStack Table，支持分页/排序/筛选 |
| `date-picker` | 日期选择器 |
| `date-range-picker` | 日期范围选择器 |
| `dialog` | 对话框，支持插槽自定义 |
| `dropdown-menu` | 下拉菜单 |
| `empty` | 空状态 |
| `form` | 表单组件 |
| `selector` | 选择器，支持单选/多选 |
| `sheet` | 底部弹出层 |
| `title` | 自定义标题样式 |
| `avatar` | 头像组件 |

## 安装组件

目标项目需先初始化 shadcn-vue（有 `components.json` 即可）。

### 使用 @lwenh/rcn CLI（推荐）

```bash
# pnpm
pnpm dlx @lwenh/rcn add button

# npm
npx @lwenh/rcn add button

# bun
bunx --bun @lwenh/rcn add button

# 安装多个
pnpm dlx @lwenh/rcn add button table dialog

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

# 启动开发服务器（组件文档）
pnpm dev

# 构建 registry
pnpm registry:build

# 构建文档站点
pnpm build
```

## 项目结构

```
├── registry.json                                # 组件注册表
├── src/
│   ├── components/registry/rcn/                 # 组件源码
│   │   ├── button/Button.vue
│   │   ├── card/Card.vue
│   │   ├── table/Table.vue
│   │   └── ...
│   ├── demos/                                   # 组件文档页面
│   ├── pages/                                   # 介绍和安装页面
│   └── components/demo/                         # 文档辅助组件
├── public/r/                                    # registry build 输出（自动生成）
├── packages/cli/                                # @lwenh/rcn CLI
├── .github/workflows/deploy.yml                 # 自动部署到 GitHub Pages
└── src/components/ui/                           # shadcn-vue 基础组件
```

## 部署

推送到 `main` 分支时会自动触发 GitHub Pages 部署，同时部署：

- **组件文档站点** — `https://careerisx.github.io/rcn-vue/`
- **Registry JSON** — `https://careerisx.github.io/rcn-vue/r/<component>.json`

也可在 GitHub Actions 页面手动触发 `workflow_dispatch`。
