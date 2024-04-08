import { createRouter, createWebHistory } from 'vue-router'
import ProblemsetView from '@/views/ProblemsetView.vue'
import HomeLayout from '@/layouts/HomeLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeLayout,
      children: [
        {
          path: '/',
          name: 'home_problemset',
          component: () => import('@/views/ProblemsetView.vue')
        },
        {
          path: '/problemset',
          name: 'problemset',
          component: () => import('@/views/ProblemsetView.vue')
        },
        {
          path: '/problem/:id',
          name: 'problem',
          component: () => import('@/views/ProblemView.vue')
        }
      ]
    }
  ]
})

export default router
