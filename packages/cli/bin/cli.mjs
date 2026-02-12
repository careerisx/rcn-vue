#!/usr/bin/env node

/**
 * @lwenh/rcn CLI
 *
 * 用法:
 *   npx @lwenh/rcn add <component-name> [component-name...]
 *   npx @lwenh/rcn list
 *
 * 示例:
 *   npx @lwenh/rcn add button
 *   npx @lwenh/rcn add button table
 *   npx @lwenh/rcn list
 */

import { execSync } from 'node:child_process'

const REGISTRY_BASE_URL = 'https://careerisx.github.io/rcn-vue/r'

const args = process.argv.slice(2)
const command = args[0]

function printHelp() {
    console.log(`
  @lwenh/rcn CLI - 自定义组件注册表

  用法:
    npx @lwenh/rcn add <component> [component...]   安装组件到当前项目
    npx @lwenh/rcn list                              列出所有可用组件
    npx @lwenh/rcn help                              显示帮助信息

  示例:
    npx @lwenh/rcn add button
    npx @lwenh/rcn add button table
  `)
}

async function listComponents() {
    try {
        const response = await fetch(`${REGISTRY_BASE_URL}/registry.json`)
        if (!response.ok) {
            console.error(`❌ 无法获取组件列表: HTTP ${response.status}`)
            process.exit(1)
        }
        const registry = await response.json()
        console.log('\n📦 可用组件:\n')
        for (const item of registry.items) {
            console.log(`  ${item.name.padEnd(25)} ${item.description || ''}`)
        }
        console.log(`\n共 ${registry.items.length} 个组件\n`)
    } catch (err) {
        console.error('❌ 无法连接到 registry，请检查网络或 REGISTRY_BASE_URL 配置')
        process.exit(1)
    }
}

function addComponents(components) {
    if (components.length === 0) {
        console.error('❌ 请指定要安装的组件名称')
        console.error('   用法: npx @lwenh/rcn add <component-name>')
        process.exit(1)
    }

    const urls = components.map(name => {
        // 如果用户传入的是完整 URL，直接使用
        if (name.startsWith('http://') || name.startsWith('https://')) {
            return name
        }
        // 否则拼接 registry URL
        return `${REGISTRY_BASE_URL}/${name}.json`
    })

    const cmd = `npx shadcn-vue@latest add ${urls.join(' ')}`
    console.log(`\n🚀 正在安装组件: ${components.join(', ')}\n`)
    console.log(`   执行命令: ${cmd}\n`)

    try {
        execSync(cmd, { stdio: 'inherit' })
    } catch {
        process.exit(1)
    }
}

switch (command) {
    case 'add':
        addComponents(args.slice(1))
        break
    case 'list':
    case 'ls':
        listComponents()
        break
    case 'help':
    case '--help':
    case '-h':
    case undefined:
        printHelp()
        break
    default:
        console.error(`❌ 未知命令: ${command}`)
        printHelp()
        process.exit(1)
}
