import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

import HomeView from '../views/HomeView.vue';
import CalendarView from '../views/CalendarView.vue';
import KaryawanView from '../views/KaryawanView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import RentLeasingView from '../views/RentLeasingView.vue';

import KaryawanListView from '../views/karyawan/KaryawanListView.vue';
import CreateKaryawanView from '../views/karyawan/CreateKaryawanView.vue';
import PengajuanView from '../views/karyawan/PengajuanView.vue';


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
      name : 'RentLeasing',
      path : '/rentleasing',
      component : RentLeasingView
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
        },
        {
          name : 'Pengajuan',
          path : 'apply',
          component : PengajuanView,
          // Middleware for Applying Page
          beforeEnter : (to, from, next) =>
          {
            const selectedKaryawan = store.state.selectedKaryawan
            const queryName = to.query.name;

            if (!selectedKaryawan || selectedKaryawan.Name !== queryName) {
              // If the conditions are not met, prevent access to the route
              next({name : 'KaryawanList'})
            } else {
              // Conditions are met, allow access to the route
              next();
            }
          }
        },
      ]
    },
    {
      name: 'NotFound', 
      path: '/:pathMatch(.*)*', 
      component: NotFoundView
    },
  ]
})

export default router
