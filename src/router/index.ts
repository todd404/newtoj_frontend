import { createRouter, createWebHistory } from 'vue-router'
import ProblemsetView from '@/views/ProblemsetView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ProblemsetView,
      children: [
        {
          path: '/',
          name: 'index',
          component: () => import('@/views/ProblemsetView.vue')
        },
        {
          path: '/problemset',
          name: 'problemset',
          component: () => import('@/views/ProblemsetView.vue')
        }
      ]
    }
  ]
})

export default router
