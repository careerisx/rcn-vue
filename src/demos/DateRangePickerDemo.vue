<script setup lang="ts">
import {ref} from 'vue'
import DateRangePicker from '@/components/registry/rcn/date-range-picker/DateRangePicker.vue'
import type {DateRangePreset, DateRangeValue} from '@/components/registry/rcn/date-range-picker/DateRangePicker.vue'
import CodePreview from '@/components/demo/CodePreview.vue'
import InstallCommand from '@/components/demo/InstallCommand.vue'
import ApiTable, {type ApiItem} from '@/components/demo/ApiTable.vue'

// 各示例独立保存范围，避免预览之间互相影响。
const range1 = ref<DateRangeValue>()
const range2 = ref<DateRangeValue>()
const presetRange = ref<DateRangeValue>()
const calendarRange = ref<DateRangeValue>()
// 指定快捷候选子集，实际展示顺序仍由组件内置顺序决定。
const customPresets: DateRangePreset[] = ['last30Minutes', 'last1Hour', 'last1Day', 'last1Week']
// 初始一小时间隔用于演示前后平移与事件时机。
const shiftRange = ref<DateRangeValue>({start: '2026-01-01 09:00:00', end: '2026-01-01 10:00:00'})
const lastChange = ref<DateRangeValue>()
const changeCount = ref(0)

/**
 * 保存最近一次 change 的快照，与选择过程中的实时绑定值区分。
 *
 * @param value 弹层关闭或清除时发送的日期范围
 */
function handleChange(value: DateRangeValue | undefined) {
  lastChange.value = value ? {...value} : undefined
  changeCount.value += 1
}

// 事件示例给出完整状态和处理函数，便于复制后观察绑定值与事件值的差异。
const shiftCode = `<script setup lang="ts">
import {ref} from 'vue'
import DateRangePicker from '@/components/registry/rcn/date-range-picker/DateRangePicker.vue'
import type {DateRangeValue} from '@/components/registry/rcn/date-range-picker/DateRangePicker.vue'

const range = ref<DateRangeValue>({start: '2026-01-01 09:00:00', end: '2026-01-01 10:00:00'})
const lastChange = ref<DateRangeValue>()
const changeCount = ref(0)

/** 保存弹层关闭或清除时的范围快照。 */
function handleChange(value: DateRangeValue | undefined) {
  lastChange.value = value ? {...value} : undefined
  changeCount.value += 1
}
<\/script>

<template>
  <DateRangePicker v-model="range" show-time clearable @change="handleChange" />
  <p>实时绑定值：{{ range }}</p>
  <p>最近 change：{{ lastChange }}</p>
  <p>change 次数：{{ changeCount }}</p>
</template>`
// Props 和事件说明对应当前实现，change 不再表示每次编辑都会发送。
const propsItems: ApiItem[] = [
  {name: 'modelValue', type: 'DateRangeValue | undefined', binding: 'v-model', default: 'undefined', description: '选中的完整日期范围；清除后为 undefined'},
  {name: 'placeholder', type: 'string', default: "'请选择日期范围'", description: '占位符文本'},
  {name: 'showTime', type: 'boolean', default: 'false', description: '是否显示时、分、秒三列时间选择'},
  {name: 'clearable', type: 'boolean', default: 'false', description: '是否允许清除'},
  {name: 'disabled', type: 'boolean', default: 'false', description: '是否禁用'},
  {name: 'separator', type: 'string', default: "' ~ '", description: '触发按钮中显示的日期范围分隔符，不改变绑定值格式'},
  {name: 'presets', type: 'DateRangePreset[]', default: '全部 15 项', description: '筛选内置快捷时间候选项；[] 隐藏快捷区和区间平移按钮，显示顺序按内置顺序'},
  {name: 'class', type: 'string', default: '—', description: '自定义 CSS 类'},
]
const eventsItems: ApiItem[] = [
  {name: 'change', binding: 'value', type: 'DateRangeValue | undefined', description: '日期弹层由打开变为关闭时发送当前值（即使值未改变）；清除时立即发送 undefined'},
]
const valueItems: ApiItem[] = [
  {name: 'start', type: 'string', default: '必填', description: '开始日期；日期模式为 YYYY-MM-DD，时间模式为 YYYY-MM-DD HH:mm:ss'},
  {name: 'end', type: 'string', default: '必填', description: '结束日期；日期模式为 YYYY-MM-DD，时间模式为 YYYY-MM-DD HH:mm:ss'},
]
const presetItems: ApiItem[] = [
  {name: 'last5Minutes', type: 'DateRangePreset', description: '最近 5 分钟'},
  {name: 'last10Minutes', type: 'DateRangePreset', description: '最近 10 分钟'},
  {name: 'last30Minutes', type: 'DateRangePreset', description: '最近 30 分钟'},
  {name: 'last1Hour', type: 'DateRangePreset', description: '最近 1 小时'},
  {name: 'last2Hours', type: 'DateRangePreset', description: '最近 2 小时'},
  {name: 'last6Hours', type: 'DateRangePreset', description: '最近 6 小时'},
  {name: 'last12Hours', type: 'DateRangePreset', description: '最近 12 小时'},
  {name: 'last1Day', type: 'DateRangePreset', description: '最近 1 天'},
  {name: 'last2Days', type: 'DateRangePreset', description: '最近 2 天'},
  {name: 'last3Days', type: 'DateRangePreset', description: '最近 3 天'},
  {name: 'last1Week', type: 'DateRangePreset', description: '最近 1 周'},
  {name: 'last2Weeks', type: 'DateRangePreset', description: '最近 2 周'},
  {name: 'last1Month', type: 'DateRangePreset', description: '最近 1 个月，月底回退时自动限制到目标月的最后一天'},
  {name: 'last3Months', type: 'DateRangePreset', description: '最近 3 个月，月底回退时自动限制到目标月的最后一天'},
  {name: 'last6Months', type: 'DateRangePreset', description: '最近 6 个月，月底回退时自动限制到目标月的最后一天'},
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">DateRangePicker</h1>
      <p class="text-muted-foreground mt-1">日期范围选择器，支持快捷时间、时分秒选择、区间平移和清除；桌面端双月历，移动端单月历。</p>
    </div>

    <InstallCommand component-name="date-range-picker"/>

    <h2 id="section-examples" data-toc-id="section-examples" data-toc-text="示例" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">示例</h2>

    <CodePreview title="基本用法" :code="`<DateRangePicker v-model=&quot;range&quot; />`">
      <div class="space-y-2">
        <DateRangePicker v-model="range1"/>
        <p class="text-sm text-muted-foreground">选中值：{{ range1 ? `${range1.start} ~ ${range1.end}` : '无' }}</p>
      </div>
    </CodePreview>

    <CodePreview title="带时间和清除" :code="`<DateRangePicker v-model=&quot;range&quot; show-time clearable />`">
      <div class="space-y-2">
        <DateRangePicker v-model="range2" show-time clearable/>
        <p class="text-sm text-muted-foreground">点击开始或结束时间，通过时、分、秒三列选择时间，无需点击确认按钮。</p>
        <p class="text-sm text-muted-foreground">选中值：{{ range2 ? `${range2.start} ~ ${range2.end}` : '无' }}</p>
      </div>
    </CodePreview>

    <CodePreview title="自定义快捷候选项" :code="`<DateRangePicker v-model=&quot;range&quot; show-time clearable
  :presets=&quot;['last30Minutes', 'last1Hour', 'last1Day', 'last1Week']&quot; />`">
      <div class="space-y-2">
        <DateRangePicker v-model="presetRange" show-time clearable :presets="customPresets"/>
        <p class="text-sm text-muted-foreground">仅显示最近 30 分钟、1 小时、1 天和 1 周；选择时以当前本地时间为结束时间。</p>
        <p class="text-sm text-muted-foreground">选中值：{{ presetRange ? `${presetRange.start} ~ ${presetRange.end}` : '无' }}</p>
      </div>
    </CodePreview>

    <CodePreview title="隐藏快捷选择" :code="`<DateRangePicker v-model=&quot;range&quot; :presets=&quot;[]&quot; clearable />`">
      <div class="space-y-2">
        <DateRangePicker v-model="calendarRange" :presets="[]" clearable/>
        <p class="text-sm text-muted-foreground">传入空数组只显示日历，同时隐藏快捷区顶部的前后平移按钮。</p>
      </div>
    </CodePreview>

    <CodePreview title="区间平移与 change 事件" :code="shiftCode">
      <div class="space-y-2">
        <DateRangePicker v-model="shiftRange" show-time clearable @change="handleChange"/>
        <p class="text-sm text-muted-foreground">打开弹层后，使用快捷区顶部的箭头按当前区间长度前后平移。初始范围为 1 小时。</p>
        <p class="text-sm text-muted-foreground">实时绑定值：{{ shiftRange ? `${shiftRange.start} ~ ${shiftRange.end}` : '无' }}</p>
        <p class="text-sm text-muted-foreground">最近 change：{{ changeCount ? (lastChange ? `${lastChange.start} ~ ${lastChange.end}` : '已清除') : '尚未触发' }}</p>
        <p class="text-sm text-muted-foreground">change 次数：{{ changeCount }}。关闭日期弹层时发送当前值，清除时立即发送。</p>
      </div>
    </CodePreview>

    <CodePreview title="禁用" :code="`<DateRangePicker disabled />`">
      <DateRangePicker disabled/>
    </CodePreview>

    <h2 id="section-usage" data-toc-id="section-usage" data-toc-text="使用说明" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">使用说明</h2>
    <ul class="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
      <li>日期模式输出 <code>YYYY-MM-DD</code>，时间模式输出 <code>YYYY-MM-DD HH:mm:ss</code>，使用本地时区，不包含时区后缀。</li>
      <li>形成完整起止范围后更新 <code>v-model</code>；只选择开始日期不会向外发布不完整范围。时间编辑会更新完整范围的绑定值。</li>
      <li>纯日期模式通过日历选完起止日期后自动关闭；时间模式和快捷选择不会自动关闭，可点击弹层外部结束选择。</li>
      <li><code>change</code> 在日期弹层关闭时触发，而不是每次编辑时触发；关闭时即使值未改变也会发送。清除会立即发送 <code>undefined</code>。</li>
      <li>快捷候选项默认全部显示，传入数组用于筛选而非排序；分钟、小时范围建议配合 <code>show-time</code> 使用，日期模式不会输出时间部分。</li>
      <li>前后平移使用当前内部起止时间差，仅在间隔大于零时执行。将 <code>presets</code> 设为 <code>[]</code> 也会隐藏平移入口。</li>
      <li>视口宽度不超过 640px 时日历显示单月；窄屏下弹层限制宽度并支持横向滚动。</li>
    </ul>

    <h2 id="section-api" data-toc-id="section-api" data-toc-text="API 参考" data-toc-level="1" class="text-lg font-semibold scroll-mt-16">API 参考</h2>
    <ApiTable title="Props" :items="propsItems" type="props"/>
    <ApiTable title="Events" :items="eventsItems" type="events"/>
    <ApiTable title="DateRangeValue" :items="valueItems" type="props"/>
    <ApiTable title="DateRangePreset" :items="presetItems" type="props"/>
  </div>
</template>
