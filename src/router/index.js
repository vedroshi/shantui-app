import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue';
import CalendarView from '../views/CalendarView.vue';
import KaryawanView from '../views/KaryawanView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name : 'Home',
      path : '/',
      component : HomeView
    },
    {
      name : 'Calendar',
      path : '/calendar',
      component : CalendarView
    },
    {
      name : 'Karyawan',
      path : '/karyawan',
      component : KaryawanView
    }
  ]
})

export default router
