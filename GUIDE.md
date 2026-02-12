# 开发文档

## 添加新组件

### 1. 创建组件源码

在 `src/components/registry/rcn/` 下新建目录，每个组件一个目录：

```
src/components/registry/rcn/
└── <组件名>/
    └── <组件名>.vue
```

**命名规范：**

| 类别 | 格式 | 示例 |
|------|------|------|
| 目录名 | kebab-case | `date-picker` |
| 组件文件 | PascalCase | `DatePicker.vue` |
| composable | camelCase + `use` 前缀 | `useDataTable.ts` |

### 2. 编写组件

组件中可引用 shadcn-vue 基础组件和工具函数：

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-vue-next'
</script>
```

> **import 路径必须使用 `@/` 别名**，安装时 shadcn-vue 会自动转换为目标项目的路径。

### 3. 注册到 registry.json

在 `registry.json` 的 `items` 数组中添加：

```json
{
  "name": "my-component",
  "type": "registry:block",
  "title": "My Component",
  "description": "组件描述",
  "author": "Rui Li",
  "dependencies": ["lucide-vue-next"],
  "registryDependencies": ["button"],
  "files": [
    {
      "type": "registry:component",
      "path": "src/components/registry/rcn/my-component/MyComponent.vue",
      "target": "src/components/registry/rcn/my-component/MyComponent.vue"
    }
  ]
}
```

**字段说明：**

| 字段 | 说明 |
|------|------|
| `name` | 组件名（kebab-case），CLI 安装时使用 |
| `dependencies` | 需要安装的 npm 包 |
| `registryDependencies` | 依赖的 shadcn-vue 基础组件（如 `button`） |
| `path` | 源码文件路径（相对项目根目录） |
| `target` | 安装到目标项目的路径 |

**引用其他 rcn 组件作为依赖：**

```json
{
  "registryDependencies": [
    "button",
    "https://careerisx.github.io/rcn-vue/r/empty.json"
  ]
}
```

### 4. 构建验证

```bash
pnpm registry:build
```

构建后在 `public/r/` 下会生成对应 JSON 文件。

### 5. 本地测试

```bash
# 启动本地服务器
pnpm dev

# 在另一个项目中测试（假设 5173 端口）
pnpm dlx shadcn-vue@latest add http://localhost:5173/r/my-component.json
```

### 6. 推送部署

```bash
git add .
git commit -m "feat: add my-component"
git push origin main
```

GitHub Actions 会自动构建并部署到 GitHub Pages。

---

## CLI 开发

CLI 源码在 `packages/cli/`，发布为 `@lwenh/rcn`。

**核心逻辑：** 将组件名拼接为 registry URL，然后调用 `npx shadcn-vue@latest add <url>`。

**发布：**

```bash
cd packages/cli
npm publish
```

---

## GitHub Actions

workflow 文件：`.github/workflows/deploy.yml`

**触发条件：**
- 推送到 `main` 且修改了 `src/components/registry/**`、`registry.json` 或 `.github/workflows/deploy.yml`
- 手动触发（workflow_dispatch）

**流程：** install → `pnpm registry:build` → 部署 `public/` 到 GitHub Pages
