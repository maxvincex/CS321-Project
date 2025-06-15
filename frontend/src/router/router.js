// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import ClassesForm from './components/ClassesForm.vue'
import TimeAvailabilityForm from './components/TimeAvailabilityForm.vue'

const routes = [
  { path: '/', redirect: '/classes' },
  { path: '/classes', component: ClassesForm },
  { path: '/availability', component: TimeAvailabilityForm }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
