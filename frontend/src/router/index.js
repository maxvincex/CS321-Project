import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Profile from '../pages/Profile.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/profile', component: Profile },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})