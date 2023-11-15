import {createStore} from 'vuex';

const KaryawanAPIEndpoint = import.meta.env.VITE_APP_KARYAWAN_ENDPOINT

const store = createStore({
    state: {
      // Your application's global state goes here
      selectedKaryawan : {},
      karyawanURL : KaryawanAPIEndpoint
    },
    mutations: {
      // Mutations to modify the state go here
      selectKaryawan(state, karyawan) {
        state.selectedKaryawan = karyawan
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
     
    },
  });
  
export default store