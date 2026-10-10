<script setup lang="ts">
import {ref} from 'vue'
import {Copy, Check} from '@lucide/vue'

const managers = ['pnpm', 'npm', 'yarn', 'bun'] as const
type PM = typeof managers[number]
const active = ref<PM>('pnpm')
const copied = ref<string>('')

const steps = [
  {
    title: '创建项目',
    commands: {
      pnpm: 'pnpm create vite my-app -- --template vue-ts',
      npm: 'npm create vite@latest my-app -- --template vue-ts',
      yarn: 'yarn create vite my-app --template vue-ts',
      bun: 'bun create vite my-app --template vue-ts',
    },
  },
  {
    title: '安装 Tailwind CSS v4',
    commands: {
      pnpm: 'pnpm add tailwindcss @tailwindcss/vite',
      npm: 'npm install tailwindcss @tailwindcss/vite',
      yarn: 'yarn add tailwindcss @tailwindcss/vite',
      bun: 'bun add tailwindcss @tailwindcss/vite',
    },
  },
  {
    title: '初始化 shadcn-vue',
    commands: {
      pnpm: 'pnpm dlx shadcn-vue@latest init',
      npm: 'npx shadcn-vue@latest init',
      yarn: 'npx shadcn-vue@latest init',
      bun: 'bunx --bun shadcn-vue@latest init',
    },
  },
  {
    title: '安装 rcn-vue 组件（示例）',
    commands: {
      pnpm: 'pnpm dlx @lwenh/rcn add button',
      npm: 'npx @lwenh/rcn add button',
      yarn: 'npx @lwenh/rcn add button',
      bun: 'bunx --bun @lwenh/rcn add button',
    },
  },
]

async function copyCommand(id: string, text: string) {
  await navigator.clipboard.writeText(text)
  copied.value = id
  setTimeout(() => copied.value = '', 2000)
}
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">安装</h1>
      <p class="text-muted-foreground mt-1">
        从零开始安装 shadcn-vue 和 rcn-vue 组件。完整的官方文档请参考
        <a href="https://www.shadcn-vue.com/docs/installation/vite" target="_blank"
           class="text-primary underline underline-offset-4 hover:text-primary/80"
        >shadcn-vue 安装指南（Vite）</a>。
      </p>
    </div>

    <!-- 包管理器切换 -->
    <div class="flex items-center gap-0.5 bg-muted/40 w-fit rounded-lg p-0.5">
      <button
          v-for="pm in managers"
          :key="pm"
          @click="active = pm"
          :class="[
            'px-3 py-1.5 text-xs rounded-md transition-all duration-150',
            active === pm
              ? 'bg-background shadow-sm text-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground'
          ]"
      >
        {{ pm }}
      </button>
    </div>

    <!-- 安装步骤 -->
    <div class="space-y-6">
      <div v-for="(step, i) in steps" :key="i" class="space-y-2">
        <h3 class="text-sm font-semibold flex items-center gap-2">
          <span class="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold">
            {{ i + 1 }}
          </span>
          {{ step.title }}
        </h3>
        <div class="border border-border/60 rounded-xl overflow-hidden">
          <div class="flex items-center justify-between bg-muted/20 border-b border-border/60 px-3 h-9">
            <span class="text-[11px] text-muted-foreground font-mono">{{ active }}</span>
            <button
                class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-0.5 rounded-md hover:bg-muted/60 transition-all"
                @click="copyCommand(`step-${i}`, step.commands[active])"
            >
              <component :is="copied === `step-${i}` ? Check : Copy" class="w-3 h-3"/>
              {{ copied === `step-${i}` ? '已复制' : '复制' }}
            </button>
          </div>
          <div class="bg-zinc-950 px-4 py-3 overflow-x-auto">
            <code class="text-[13px] text-zinc-300 font-mono whitespace-nowrap">{{ step.commands[active] }}</code>
          </div>
        </div>
      </div>
    </div>

    <!-- 补充说明 -->
    <div class="border border-border/60 rounded-xl p-5 bg-muted/10 space-y-3">
      <h3 class="text-sm font-semibold">📖 说明</h3>
      <ul class="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
        <li>
          rcn-vue 组件依赖 <strong class="text-foreground">shadcn-vue</strong> 的基础组件和主题系统，请确保项目中已正确初始化 shadcn-vue。
        </li>
        <li>
          安装 rcn-vue 组件时，CLI 会自动安装所需的 shadcn-vue 基础依赖（如 Button、Dialog 等），无需手动安装。
        </li>
        <li>
          组件源码会被复制到你的 <code class="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">src/components/</code> 目录中，你可以自由修改。
        </li>
        <li>
          更多配置选项请参考
          <a href="https://www.shadcn-vue.com/docs/installation/vite" target="_blank"
             class="text-primary underline underline-offset-4 hover:text-primary/80">
            shadcn-vue 官方文档
          </a>。
        </li>
      </ul>
    </div>
  </div>
</template>
