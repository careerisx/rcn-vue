<script setup lang="ts">
import {ref, computed} from 'vue'
import {Copy, Check} from 'lucide-vue-next'

interface Props {
  componentName: string
}

const props = defineProps<Props>()

type Mode = 'cli' | 'full'
const mode = ref<Mode>('cli')

const managers = ['pnpm', 'npm', 'yarn', 'bun'] as const
type PM = typeof managers[number]
const active = ref<PM>('pnpm')
const copied = ref(false)

const registryBaseUrl = 'https://careerisx.github.io/rcn-vue/r'

function getCliCommand(pm: PM): string {
  const base = `@lwenh/rcn add ${props.componentName}`
  switch (pm) {
    case 'pnpm': return `pnpm dlx ${base}`
    case 'npm': return `npx ${base}`
    case 'yarn': return `npx ${base}`
    case 'bun': return `bunx --bun ${base}`
  }
}

function getFullCommand(pm: PM): string {
  const url = `${registryBaseUrl}/${props.componentName}.json`
  const base = `shadcn-vue@latest add ${url}`
  switch (pm) {
    case 'pnpm': return `pnpm dlx ${base}`
    case 'npm': return `npx ${base}`
    case 'yarn': return `npx ${base}`
    case 'bun': return `bunx --bun ${base}`
  }
}

const currentCommand = computed(() =>
  mode.value === 'cli' ? getCliCommand(active.value) : getFullCommand(active.value)
)

async function copyCommand() {
  await navigator.clipboard.writeText(currentCommand.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<template>
  <div id="section-install" data-toc-id="section-install" data-toc-text="安装" data-toc-level="1" class="space-y-3 scroll-mt-16">
    <h2 class="text-lg font-semibold">安装</h2>
    <div class="border border-border/60 rounded-xl overflow-hidden">
      <!-- 头部 -->
      <div class="flex items-center justify-between border-b border-border/60 bg-muted/20 px-3 h-10">
        <div class="flex items-center gap-2">
          <!-- CLI / 完整命令切换 -->
          <div class="flex items-center bg-muted/60 rounded-md p-0.5">
            <button
                @click="mode = 'cli'"
                :class="[
                  'px-2 py-0.5 text-[11px] rounded transition-all duration-150',
                  mode === 'cli'
                    ? 'bg-background shadow-sm text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                ]"
            >CLI</button>
            <button
                @click="mode = 'full'"
                :class="[
                  'px-2 py-0.5 text-[11px] rounded transition-all duration-150',
                  mode === 'full'
                    ? 'bg-background shadow-sm text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                ]"
            >完整命令</button>
          </div>
          <!-- 分隔线 -->
          <div class="w-px h-4 bg-border/60"/>
          <!-- 包管理器切换 -->
          <div class="flex items-center gap-0.5">
            <button
                v-for="pm in managers"
                :key="pm"
                @click="active = pm"
                :class="[
                  'px-2 py-0.5 text-[11px] rounded-md transition-all duration-150',
                  active === pm
                    ? 'bg-background shadow-sm text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                ]"
            >
              {{ pm }}
            </button>
          </div>
        </div>
        <button
            class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted/60 transition-all duration-150"
            @click="copyCommand"
        >
          <component :is="copied ? Check : Copy" class="w-3 h-3"/>
          {{ copied ? '已复制' : '复制' }}
        </button>
      </div>
      <!-- 命令 -->
      <div class="bg-zinc-950 px-4 py-3 overflow-x-auto">
        <code class="text-[13px] text-zinc-300 font-mono whitespace-nowrap">{{ currentCommand }}</code>
      </div>
    </div>
  </div>
</template>
