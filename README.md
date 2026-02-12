# rcn-vue

基于 [shadcn-vue](https://www.shadcn-vue.com) 的自定义组件注册表（Registry），通过 CLI 将组件源码下载到本地使用。

## 使用方式

```bash
# pnpm
pnpm dlx @lwenh/rcn add r-button

# npm
npx @lwenh/rcn add r-button

# yarn
npx @lwenh/rcn add r-button

# bun
bunx --bun @lwenh/rcn add r-button
```

查看所有可用组件：

```bash
pnpm dlx @lwenh/rcn list
# 或
npx @lwenh/rcn list
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器（预览组件）
pnpm dev

# 构建 registry JSON 文件
pnpm registry:build
```

## 添加新组件

请参阅 [GUIDE.md](./GUIDE.md) 查看详细的组件封装教程。

## 项目结构

```
├── registry.json                    # 注册表定义（所有组件的元数据）
├── registry/rcn/
│   └── r-button/                    # 组件源码目录
│       └── RButton.vue
├── public/r/                        # build 生成的 JSON（部署到 GitHub Pages）
├── packages/cli/                    # @lwenh/rcn CLI 包装工具
├── .github/workflows/deploy.yml     # GitHub Pages 自动部署
└── src/                             # 本地开发/预览用
```
