import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue';
import CalendarView from '../views/CalendarView.vue';
import KaryawanView from '../views/KaryawanView.vue';

import KaryawanListView from '../views/karyawan/KaryawanListView.vue';
import CreateKaryawanView from '../views/karyawan/CreateKaryawanView.vue';


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
      component : KaryawanView,
      children : [
        {
          name : 'KaryawanList',
          path : '',
          component : KaryawanListView,
          alias : ['/list', 'list']
        },
        {
          name : 'AddKaryawan',
          path : 'create',
          component : CreateKaryawanView,
        }
      ]
    }
  ]
})

export default router
