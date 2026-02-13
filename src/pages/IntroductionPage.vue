<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">介绍</h1>
      <p class="text-muted-foreground mt-1">了解 rcn-vue 组件库的定位、设计理念和使用场景。</p>
    </div>

    <div class="space-y-6 text-[15px] leading-relaxed text-foreground/85">
      <section class="space-y-3">
        <h2 class="text-lg font-semibold text-foreground">什么是 rcn-vue？</h2>
        <p>
          <strong>rcn-vue</strong> 是一套基于
          <a href="https://www.shadcn-vue.com" target="_blank" class="text-primary underline underline-offset-4 hover:text-primary/80">shadcn-vue</a>
          的增强组件集合。它不是一个独立的 UI 框架，而是在 shadcn-vue 原子级基础组件之上，封装了
          <strong>更贴近实际业务场景</strong> 的高级组件。
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-semibold text-foreground">为什么需要它？</h2>
        <p>
          shadcn-vue 提供了风格一致、高度可定制的基础 UI 组件（Button、Dialog、Select 等），
          但在真实的中后台项目中，我们往往需要更高层次的封装：
        </p>
        <ul class="list-disc pl-6 space-y-1.5 text-muted-foreground">
          <li><strong class="text-foreground">DataTable</strong> — 基于 TanStack Table，内置分页、行选择、服务端数据、Loading 骨架屏、空状态</li>
          <li><strong class="text-foreground">Form</strong> — 基于 vee-validate + zod，声明式字段配置、多列栅格、条件显隐、多种字段类型</li>
          <li><strong class="text-foreground">Confirm / Dialog / Sheet</strong> — 统一的弹出层模式，内置 trigger、header、footer 插槽</li>
          <li><strong class="text-foreground">DatePicker / DateRangePicker</strong> — 开箱即用的日期选择，支持时间选择和清除</li>
          <li><strong class="text-foreground">DropdownMenu</strong> — 声明式菜单配置，支持分组、图标、快捷键提示</li>
        </ul>
        <p>
          这些组件直接复制到你的项目中（而非作为黑盒 npm 包），你拥有 <strong>完整的源码控制权</strong>，
          可以根据业务需求自由修改。
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-semibold text-foreground">设计原则</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="border border-border/60 rounded-xl p-4 space-y-1.5">
            <h3 class="font-medium text-sm">🧩 组合优于继承</h3>
            <p class="text-sm text-muted-foreground">每个组件都通过插槽暴露扩展点，你可以替换任何区域的渲染。</p>
          </div>
          <div class="border border-border/60 rounded-xl p-4 space-y-1.5">
            <h3 class="font-medium text-sm">📋 声明式配置</h3>
            <p class="text-sm text-muted-foreground">Table 的列定义、Form 的字段列表都采用 JSON 配置驱动，减少模板代码。</p>
          </div>
          <div class="border border-border/60 rounded-xl p-4 space-y-1.5">
            <h3 class="font-medium text-sm">🔓 源码即依赖</h3>
            <p class="text-sm text-muted-foreground">通过 CLI 将组件源码复制到你的项目中，无黑盒依赖，完全可控。</p>
          </div>
          <div class="border border-border/60 rounded-xl p-4 space-y-1.5">
            <h3 class="font-medium text-sm">🎨 风格一致</h3>
            <p class="text-sm text-muted-foreground">底层复用 shadcn-vue 的设计令牌和主题系统，与你现有的 shadcn-vue 组件无缝融合。</p>
          </div>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-semibold text-foreground">适用场景</h2>
        <ul class="list-disc pl-6 space-y-1.5 text-muted-foreground">
          <li>使用 <strong class="text-foreground">Vue 3 + shadcn-vue</strong> 构建的中后台管理系统</li>
          <li>需要快速搭建 <strong class="text-foreground">CRUD 页面</strong>（表格 + 表单 + 弹窗）的项目</li>
          <li>希望拥有 <strong class="text-foreground">完整源码控制权</strong>，而非依赖第三方组件库的团队</li>
          <li>需要 <strong class="text-foreground">统一的组件规范</strong> 来提升团队协作效率的场景</li>
        </ul>
      </section>
    </div>
  </div>
</template>
