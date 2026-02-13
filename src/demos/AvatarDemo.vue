<script setup lang="ts">
import Avatar from '@/components/registry/rcn/avatar/Avatar.vue'
import CodePreview from '@/components/demo/CodePreview.vue'
import InstallCommand from '@/components/demo/InstallCommand.vue'
import ApiTable, {type ApiItem} from '@/components/demo/ApiTable.vue'

const propsItems: ApiItem[] = [
  {name: 'src', type: 'string', default: '—', description: '头像图片地址'},
  {name: 'alt', type: 'string', default: "'Avatar'", description: '替代文本'},
  {name: 'fallback', type: 'string', default: "'U'", description: '图片加载失败时显示的文字（取前 2 个字符大写）'},
  {name: 'size', type: "'xs' | 'sm' | 'default' | 'lg' | 'xl'", default: "'default'", description: '头像尺寸'},
  {name: 'shape', type: "'circle' | 'square'", default: "'circle'", description: '头像形状'},
  {name: 'class', type: 'string', default: '—', description: '自定义 CSS 类'},
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Avatar</h1>
      <p class="text-muted-foreground mt-1">头像组件，支持图片、文字回退、多种尺寸和形状。</p>
    </div>

    <InstallCommand component-name="avatar"/>

    <h2 id="section-examples" data-toc-id="section-examples" data-toc-text="示例" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">示例</h2>

    <CodePreview title="基本用法" :code="`<Avatar src=&quot;https://github.com/shadcn.png&quot; alt=&quot;shadcn&quot; />
<Avatar fallback=&quot;CN&quot; />`">
      <div class="flex items-center gap-4">
        <Avatar src="https://github.com/shadcn.png" alt="shadcn"/>
        <Avatar fallback="CN"/>
      </div>
    </CodePreview>

    <CodePreview title="尺寸" :code="`<Avatar size=&quot;xs&quot; fallback=&quot;XS&quot; />
<Avatar size=&quot;sm&quot; fallback=&quot;SM&quot; />
<Avatar size=&quot;default&quot; fallback=&quot;DF&quot; />
<Avatar size=&quot;lg&quot; fallback=&quot;LG&quot; />
<Avatar size=&quot;xl&quot; fallback=&quot;XL&quot; />`">
      <div class="flex items-end gap-4">
        <Avatar size="xs" fallback="XS"/>
        <Avatar size="sm" fallback="SM"/>
        <Avatar size="default" fallback="DF"/>
        <Avatar size="lg" fallback="LG"/>
        <Avatar size="xl" fallback="XL"/>
      </div>
    </CodePreview>

    <CodePreview title="形状" :code="`<Avatar shape=&quot;circle&quot; fallback=&quot;圆&quot; size=&quot;lg&quot; />
<Avatar shape=&quot;square&quot; fallback=&quot;方&quot; size=&quot;lg&quot; />`">
      <div class="flex items-center gap-4">
        <Avatar shape="circle" fallback="圆" size="lg"/>
        <Avatar shape="square" fallback="方" size="lg"/>
      </div>
    </CodePreview>

    <CodePreview title="头像组" :code="`<div class=&quot;flex -space-x-3&quot;>
  <Avatar src=&quot;https://i.pravatar.cc/40?img=1&quot; class=&quot;border-2 border-background&quot; />
  <Avatar src=&quot;https://i.pravatar.cc/40?img=2&quot; class=&quot;border-2 border-background&quot; />
  <Avatar fallback=&quot;+3&quot; class=&quot;border-2 border-background&quot; />
</div>`">
      <div class="flex -space-x-3">
        <Avatar src="https://i.pravatar.cc/40?img=1" class="border-2 border-background"/>
        <Avatar src="https://i.pravatar.cc/40?img=2" class="border-2 border-background"/>
        <Avatar src="https://i.pravatar.cc/40?img=3" class="border-2 border-background"/>
        <Avatar fallback="+3" class="border-2 border-background"/>
      </div>
    </CodePreview>

    <h2 id="section-api" data-toc-id="section-api" data-toc-text="API 参考" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">API 参考</h2>

    <ApiTable title="Props" :items="propsItems" type="props"/>
  </div>
</template>
