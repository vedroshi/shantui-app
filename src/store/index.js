import {createStore} from 'vuex';

const KaryawanAPIEndpoint = import.meta.env.VITE_APP_KARYAWAN_ENDPOINT
const RentLeasingAPIEndpoint = import.meta.env.VITE_APP_RENTLEASING_ENDPOINT

const store = createStore({
    state: {
      // Your application's global state goes here
      selectedKaryawan : {},
      karyawanURL : KaryawanAPIEndpoint,
      rentLeasingURL : RentLeasingAPIEndpoint,
      sidebarExpand : false
    },
    mutations: {
      // Mutations to modify the state go here
      selectKaryawan(state, karyawan) {
        state.selectedKaryawan = karyawan
      },

      expandSidebar(state){
        state.sidebarExpand = !state.sidebarExpand
      },
      
      shrinkSidebar(state){
        state.sidebarExpand = false
      }
    },
    actions: {
      // Actions to perform asynchronous tasks go here
    },
    getters: {
      // Getters to retrieve and compute state go here
      getSelectedKaryawan(){
        return this.selectedKaryawan;
      },
     
      getSidebarExpend(){
        return this.sidebarExpand;
      }
    },
  });
  
export default store