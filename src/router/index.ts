import { createRouter, createWebHistory } from 'vue-router'

const demos = import.meta.glob('../demos/*.vue')

const demoRoutes = Object.entries(demos).map(([path, component]) => {
  const name = path.match(/\.\.\/demos\/(.+)\.vue$/)![1]
  return {
    path: `/${name?.replace('Demo', '').toLowerCase()}`,
    name,
    component,
  }
})

// 快速开始路由
const guideRoutes = [
  {
    path: '/introduction',
    name: 'Introduction',
    label: '介绍',
    component: () => import('../pages/IntroductionPage.vue'),
  },
  {
    path: '/installation',
    name: 'Installation',
    label: '安装',
    component: () => import('../pages/InstallationPage.vue'),
  },
]

const index = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/introduction',
    },
    ...guideRoutes,
    ...demoRoutes,
  ],
})

export default index
export { demoRoutes, guideRoutes }
