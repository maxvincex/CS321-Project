import { createRouter, createWebHistory } from 'vue-router';

import Login from '../pages/Login.vue';
import CreateAccount from '../pages/CreateAccount.vue';
import Profile from '../pages/Profile.vue';
import ChatList from '../pages/ChatList.vue';
import Chat from '../pages/Chat.vue';
import SearchPage from '../pages/SearchPage.vue';
import ClassesForm from '../pages/ClassesForm.vue';
import TimeAvailabilityForm from '../pages/TimeAvailabilityForm.vue';

const routes = [
  {
    path: '/',
    redirect: () => {
      return localStorage.getItem("firstName") ? '/profile' : '/login';
    }
  },
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: CreateAccount },
  { path: '/profile', component: Profile },
  { path: '/edit-classes', component: ClassesForm },
  { path: '/edit-availability', component: TimeAvailabilityForm },
  { path: '/chat', component: ChatList },
  { path: '/chat/:id', component: Chat, props: true },
  { path: '/search', component: SearchPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;