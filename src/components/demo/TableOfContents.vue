<script setup lang="ts">
import {ref, watch, onMounted, onUnmounted, nextTick} from 'vue'
import {useRoute} from 'vue-router'

interface TocItem {
  id: string
  text: string
  level: number  // 1 = section, 2 = sub-item
}

const route = useRoute()
const items = ref<TocItem[]>([])
const activeId = ref('')

function scanSections() {
  const sections: TocItem[] = []
  document.querySelectorAll('[data-toc-id]').forEach(el => {
    const id = el.getAttribute('data-toc-id')!
    const text = el.getAttribute('data-toc-text') || el.textContent?.trim() || ''
    const level = parseInt(el.getAttribute('data-toc-level') || '1')
    sections.push({id, text, level})
  })
  items.value = sections
  if (sections.length > 0) {
    activeId.value = sections[0]!.id
  }
}

let observer: IntersectionObserver | null = null

function setupObserver() {
  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id
          }
        }
      },
      {rootMargin: '-80px 0px -60% 0px', threshold: 0}
  )

  document.querySelectorAll('[data-toc-id]').forEach(el => {
    observer!.observe(el)
  })
}

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({behavior: 'smooth', block: 'start'})
    activeId.value = id
  }
}

watch(() => route.path, async () => {
  activeId.value = ''
  await nextTick()
  setTimeout(() => {
    scanSections()
    setupObserver()
  }, 100)
})

onMounted(() => {
  setTimeout(() => {
    scanSections()
    setupObserver()
  }, 200)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <nav v-if="items.length > 0" class="space-y-0.5">
    <p class="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider mb-2">目录</p>
    <button
        v-for="item in items"
        :key="item.id"
        @click="scrollTo(item.id)"
        :class="[
          'block w-full text-left text-[12px] leading-snug py-1 border-l-2 transition-all duration-150 truncate',
          item.level === 1 ? 'pl-3' : 'pl-6',
          item.level === 1 ? 'font-medium' : '',
          activeId === item.id
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground/70 hover:text-foreground hover:border-border',
        ]"
        :title="item.text"
    >
      {{ item.text }}
    </button>
  </nav>
</template>
