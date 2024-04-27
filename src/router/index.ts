import { createRouter, createWebHistory } from 'vue-router'
import ProblemsetView from '@/views/ProblemsetView.vue'
import HomeLayout from '@/layouts/HomeLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeLayout,
      children: [
        {
          path: '',
          name: 'home_problemset',
          component: () => import('@/views/ProblemsetView.vue')
        },
        {
          path: 'problemset',
          name: 'problemset',
          component: () => import('@/views/ProblemsetView.vue')
        },
        {
          path: 'problem/:id',
          name: 'problem',
          component: () => import('@/views/ProblemView.vue')
        },
        {
          path: 'course',
          name: 'course',
          component: () => import('@/views/CourseView.vue')
        },
        {
          path: 'learn/:id',
          name: 'learn',
          component: () => import('@/views/LearnView.vue')
        },
        {
          path: 'exam',
          name: 'exam_list',
          component: () => import('@/views/ExamListView.vue')
        },
        {
          path: 'exam/:id',
          name: 'exam',
          component: () => import('@/views/ExamView.vue')
        },
        {
          path: 'job',
          name: 'job_list',
          component: () => import('@/views/JobListView.vue')
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      children: [
        {
          path: 'add-problem',
          name: 'add_problem',
          component: () => import('@/components/admin/add_problem/AddProblem.vue')
        },
        {
          path: 'add-choice-problem',
          name: 'add_choice_problem',
          component: () => import('@/components/admin/add_choice_problem/AddChoiceProblem.vue')
        },
        {
          path: 'add-exam',
          name: 'add_exam',
          component: () => import('@/components/admin/exam/AddExam.vue')
        },
        {
          path: 'add-course',
          name: 'add_course',
          component: () => import('@/components/admin/course/AddCourse.vue')
        },
        {
          path: 'edit-course',
          name: 'edit_course',
          component: () => import('@/components/admin/course/EditCourse.vue')
        },
        {
          path: 'add-job',
          name: 'add_job',
          component: () => import('@/components/admin/job/AddJob.vue')
        },
        {
          path: 'edit-job',
          name: 'edit_job',
          component: () => import('@/components/admin/job/EditJob.vue')
        }
      ]
    }
  ]
})

export default router
