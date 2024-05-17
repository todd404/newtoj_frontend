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
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue')
        },
        {
          path: 'whisper',
          name: 'whisper',
          component: () => import('@/views/WhisperView.vue')
        },
        {
          path: 'competition',
          name: 'competition',
          component: () => import('@/views/CopetitionView.vue')
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      children: [
        {
          path: 'edit-user',
          name: 'admin_edit_user',
          component: () => import('@/components/admin/user/UserEdit.vue')
        },
        {
          path: 'add-problem',
          name: 'admin_add_problem',
          component: () => import('@/components/admin/add_problem/AddProblem.vue')
        },
        {
          path: 'add-choice-problem',
          name: 'admin_add_choice_problem',
          component: () => import('@/components/admin/add_choice_problem/AddChoiceProblem.vue')
        },
        {
          path: 'add-exam',
          name: 'admin_add_exam',
          component: () => import('@/components/admin/exam/AddExam.vue')
        },
        {
          path: 'add-course',
          name: 'admin_add_course',
          component: () => import('@/components/admin/course/AddCourse.vue')
        },
        {
          path: 'edit-course',
          name: 'admin_edit_course',
          component: () => import('@/components/admin/course/EditCourse.vue')
        },
        {
          path: 'add-job',
          name: 'admin_add_job',
          component: () => import('@/components/admin/job/AddJob.vue')
        },
        {
          path: 'edit-job',
          name: 'admin_edit_job',
          component: () => import('@/components/admin/job/EditJob.vue')
        }
      ]
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: () => import('@/layouts/TeacherLayout.vue'),
      children: [
        {
          path: 'add-choice-problem',
          name: 'teacher_add_choice_problem',
          component: () => import('@/components/admin/add_choice_problem/AddChoiceProblem.vue')
        },
        {
          path: 'add-exam',
          name: 'teacher_add_exam',
          component: () => import('@/components/admin/exam/AddExam.vue')
        },
        {
          path: 'edit-exam',
          name: 'teacher_edit_exam',
          component: () => import('@/components/admin/exam/EditExam.vue')
        },
        {
          path: 'add-course',
          name: 'teacher_add_course',
          component: () => import('@/components/admin/course/AddCourse.vue')
        },
        {
          path: 'edit-course',
          name: 'teacher_edit_course',
          component: () => import('@/components/admin/course/EditCourse.vue')
        }
      ]
    }
  ]
})

export default router
