import { createRouter, createWebHistory } from 'vue-router'
import ChatList from '../pages/ChatList.vue'
import Chat from '../pages/Chat.vue'
import Profile from '../pages/Profile.vue' 
import SearchPage from '../pages/SearchPage.vue'


const routes = [
  { path: '/', redirect: '/profile' }, 
  { path: '/profile', component: Profile },
  { path: '/chat', component: ChatList },
  { path: '/chat/:id', component: Chat, props: true },
  { path: '/search', component: SearchPage } 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
