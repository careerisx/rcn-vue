<script setup lang="ts">
import {computed} from 'vue'

export interface ApiItem {
  name: string
  type: string
  binding?: string
  default?: string
  description: string
}

interface Props {
  title: string
  items: ApiItem[]
  type?: 'props' | 'slots' | 'events'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'props',
})

const anchorId = computed(() => 'api-' + props.title.replace(/\s+/g, '-').toLowerCase())

const headers = {
  props: ['属性', '类型', '双向绑定', '默认值', '说明'],
  slots: ['插槽名', '参数', '类型', '说明'],
  events: ['事件名', '参数', '类型', '说明'],
}
</script>

<template>
  <div :id="anchorId" :data-toc-id="anchorId" :data-toc-text="title" data-toc-type="api" class="space-y-3 scroll-mt-16">
    <h3 class="text-sm font-semibold text-foreground/90">{{ title }}</h3>
    <div class="border border-border/60 rounded-xl overflow-hidden">
      <table class="w-full text-[13px]">
        <thead>
        <tr class="border-b border-border/60 bg-muted/20">
          <th v-for="h in headers[type]" :key="h"
              class="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground/80 uppercase tracking-wider">
            {{ h }}
          </th>
        </tr>
        </thead>
        <tbody>
        <template v-if="type === 'props'">
          <tr v-for="(item, i) in items" :key="item.name"
              :class="['transition-colors hover:bg-muted/30', i < items.length - 1 ? 'border-b border-border/40' : '']">
            <td class="px-4 py-2.5">
              <code class="text-xs font-mono px-1.5 py-0.5 rounded bg-primary/8 text-primary">{{ item.name }}</code>
            </td>
            <td class="px-4 py-2.5">
              <code class="text-xs font-mono text-muted-foreground">{{ item.type }}</code>
            </td>
            <td class="px-4 py-2.5">
              <span v-if="item.binding"
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {{ item.binding }}
              </span>
              <span v-else class="text-muted-foreground/40">—</span>
            </td>
            <td class="px-4 py-2.5">
              <code v-if="item.default && item.default !== '—'" class="text-xs font-mono text-muted-foreground">{{
                  item.default
                }}</code>
              <span v-else class="text-muted-foreground/40">—</span>
            </td>
            <td class="px-4 py-2.5 text-muted-foreground">{{ item.description }}</td>
          </tr>
        </template>
        <template v-else>
          <tr v-for="(item, i) in items" :key="item.name"
              :class="['transition-colors hover:bg-muted/30', i < items.length - 1 ? 'border-b border-border/40' : '']">
            <td class="px-4 py-2.5">
              <code class="text-xs font-mono px-1.5 py-0.5 rounded bg-primary/8 text-primary">{{ item.name }}</code>
            </td>
            <td class="px-4 py-2.5">
              <code v-if="item.binding && item.binding !== '—'" class="text-xs font-mono text-muted-foreground">{{
                  item.binding
                }}</code>
              <span v-else class="text-muted-foreground/40">—</span>
            </td>
            <td class="px-4 py-2.5">
              <code class="text-xs font-mono text-muted-foreground">{{ item.type }}</code>
            </td>
            <td class="px-4 py-2.5 text-muted-foreground">{{ item.description }}</td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
