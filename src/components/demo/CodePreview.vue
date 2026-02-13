<script setup lang="ts">
import {ref, computed} from 'vue'
import {cn} from '@/lib/utils'
import {Code2, Eye, Copy, Check} from 'lucide-vue-next'

interface Props {
  code: string
  title?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '示例',
})

const anchorId = computed(() => 'example-' + props.title.replace(/\s+/g, '-').toLowerCase())

const activeTab = ref<'preview' | 'code'>('preview')
const copied = ref(false)

async function copyCode() {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<template>
  <div :id="anchorId" :data-toc-id="anchorId" :data-toc-text="title" data-toc-level="2" class="space-y-3 scroll-mt-16">
    <h3 class="text-sm font-semibold text-foreground/90">{{ title }}</h3>
    <div :class="cn('border border-border/60 rounded-xl overflow-hidden', props.class)">
      <!-- 头部 -->
      <div class="flex items-center justify-between border-b border-border/60 bg-muted/20 px-4 h-10">
        <div class="flex items-center bg-muted/60 rounded-md p-0.5">
          <button
              :class="[
              'flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-all duration-150',
              activeTab === 'preview'
                ? 'bg-background shadow-sm text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            ]"
              @click="activeTab = 'preview'"
          >
            <Eye class="w-3 h-3"/>
            预览
          </button>
          <button
              :class="[
              'flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-all duration-150',
              activeTab === 'code'
                ? 'bg-background shadow-sm text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            ]"
              @click="activeTab = 'code'"
          >
            <Code2 class="w-3 h-3"/>
            代码
          </button>
        </div>
        <button
            v-if="activeTab === 'code'"
            class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted/60 transition-all duration-150"
            @click="copyCode"
        >
          <component :is="copied ? Check : Copy" class="w-3 h-3"/>
          {{ copied ? '已复制' : '复制' }}
        </button>
      </div>

      <!-- 预览 -->
      <div v-show="activeTab === 'preview'" class="p-6 bg-background">
        <slot/>
      </div>

      <!-- 代码 -->
      <div v-show="activeTab === 'code'">
        <pre
            class="p-4 text-[13px] leading-relaxed overflow-auto max-h-[500px] bg-zinc-950 text-zinc-300 font-mono"><code>{{ code }}</code></pre>
      </div>
    </div>
  </div>
</template>
