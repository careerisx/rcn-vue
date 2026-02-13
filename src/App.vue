<script setup lang="ts">
import {computed, ref, watch, onMounted} from 'vue'
import {useRoute, RouterLink, RouterView} from 'vue-router'
import {demoRoutes, guideRoutes} from './router'
import {Sun, Moon, Github, Menu, X} from 'lucide-vue-next'
import TableOfContents from '@/components/demo/TableOfContents.vue'

const route = useRoute()

const componentNav = computed(() =>
    demoRoutes.map(r => ({
      name: r.name as string,
      path: r.path,
      label: (r.name as string).replace('Demo', ''),
    }))
)

// 主题切换
const isDark = ref(false)

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
      || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  applyTheme()
})

function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme()
}

function applyTheme() {
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// 移动端菜单
const mobileMenuOpen = ref(false)

// 路由切换时关闭菜单
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col">
    <!-- 顶部标题栏 -->
    <header class="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div class="flex items-center justify-between h-12 px-3 md:px-5">
        <!-- 左侧 -->
        <div class="flex items-center gap-2">
          <!-- 移动端汉堡菜单 -->
          <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors md:hidden"
              title="菜单"
          >
            <X v-if="mobileMenuOpen" class="w-5 h-5"/>
            <Menu v-else class="w-5 h-5"/>
          </button>

          <!-- Logo -->
          <RouterLink to="/" class="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="rcn-vue" class="w-6 h-6 rounded-md"/>
            <span class="text-sm font-semibold tracking-tight">rcn-vue</span>
          </RouterLink>
        </div>

        <!-- 右侧操作 -->
        <div class="flex items-center gap-1">
          <button
              @click="toggleTheme"
              class="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              :title="isDark ? '切换亮色' : '切换暗色'"
          >
            <Sun v-if="isDark" class="w-4 h-4"/>
            <Moon v-else class="w-4 h-4"/>
          </button>
          <a
              href="https://github.com/careerisx/rcn-vue"
              target="_blank"
              class="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="GitHub"
          >
            <Github class="w-4 h-4"/>
          </a>
        </div>
      </div>
    </header>

    <!-- 移动端遮罩 -->
    <Transition name="fade">
      <div
          v-if="mobileMenuOpen"
          class="fixed inset-0 z-30 bg-black/40 md:hidden"
          @click="mobileMenuOpen = false"
      />
    </Transition>

    <!-- 主体 -->
    <div class="flex flex-1 min-h-0 md:px-2">
      <!-- 左侧导航 -->
      <aside :class="[
        'fixed md:sticky top-12 z-40 h-[calc(100vh-3rem)] w-60 md:w-52 shrink-0',
        'bg-background md:bg-transparent border-r border-border/60',
        'transition-transform duration-200 ease-in-out',
        'md:translate-x-0',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      ]">
        <nav class="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 h-full">

          <!-- 快速开始组 -->
          <div class="space-y-0.5">
            <div class="px-3 pb-1">
              <span class="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">快速开始</span>
            </div>
            <RouterLink
                v-for="item in guideRoutes"
                :key="item.path"
                :to="item.path"
                :class="[
                'group flex items-center gap-2 px-3 py-1.5 text-[13px] rounded-md transition-all duration-150',
                route.path === item.path
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              ]"
            >
              <span :class="[
                'w-1 h-1 rounded-full transition-all duration-150',
                route.path === item.path ? 'bg-primary scale-150' : 'bg-muted-foreground/30 group-hover:bg-muted-foreground/60'
              ]"/>
              {{ item.label }}
            </RouterLink>
          </div>

          <!-- 组件组 -->
          <div class="space-y-0.5">
            <div class="px-3 pb-1">
              <span class="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">组件</span>
            </div>
            <RouterLink
                v-for="item in componentNav"
                :key="item.path"
                :to="item.path"
                :class="[
                'group flex items-center gap-2 px-3 py-1.5 text-[13px] rounded-md transition-all duration-150',
                route.path === item.path
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              ]"
            >
              <span :class="[
                'w-1 h-1 rounded-full transition-all duration-150',
                route.path === item.path ? 'bg-primary scale-150' : 'bg-muted-foreground/30 group-hover:bg-muted-foreground/60'
              ]"/>
              {{ item.label }}
            </RouterLink>
          </div>

        </nav>
      </aside>

      <!-- 中间内容 -->
      <main class="flex-1 min-w-0 overflow-y-auto">
        <div class="max-w-4xl mx-auto px-4 md:px-10 py-6 md:py-8">
          <RouterView/>
        </div>
      </main>

      <!-- 右侧目录 -->
      <aside class="w-48 shrink-0 sticky top-12 h-[calc(100vh-3rem)] overflow-y-auto hidden lg:block">
        <div class="pt-6 pr-4">
          <TableOfContents/>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
