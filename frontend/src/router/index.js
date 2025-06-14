import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Profile from '../pages/Profile.vue'
import CreateAccount from '../pages/CreateAccount.vue'
import Homepage from '../pages/Homepage.vue'

const routes = [
  { path: '/', 
    name: 'Home',
    component: Homepage },
  { path: '/profile', component: Profile },
  { path: '/create-account',
    name: 'CreateAccount',
    component: CreateAccount
  }

]

export default createRouter({
  history: createWebHistory(),
  routes,
})