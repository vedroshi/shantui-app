import moment from 'moment';
import {ref} from 'vue';

export const karyawanMixin = {
    data(){
        return{
            selectedKaryawan : this.$store.state.selectedKaryawan,
            applicationStatus : {
                1 : "Accepted",
                0 : "Rejected",
                "-1" : "Pending",
                null : ''
            },
            karyawanStatus : {
                1 : 'Active',
                2 : 'Warning',
                3 : 'Cuti',
                4 : 'Close Project',
                5 : 'Resign',
                6 : 'Cut Off'
            },
            dateFormat: ref({
                modelValue: 'DD/MM/YYYY'
              })
        }
    },
    methods : {

        // Set the date string to date
        getDateObj(dateString){
            const [date, month, year] = dateString.split('/');
            if (date && month && year) {
              return new Date(year, month - 1, date);
            } else {
              throw new Error('Invalid date format');
            }
        },
    },
    computed : {
        getApplicationStatus(){
            const status = this.applicationStatus[this.selectedKaryawan.application_status]
            return status;
        },
        // Get the Init Start Contract Date (Kompensasi)
        setStartContractDate(){
            if(this.selectedKaryawan){
                const endDate = this.getDateObj(this.selectedKaryawan.end_contract);
                endDate.setDate(endDate.getDate() + 1);
                return moment(endDate).format('DD/MM/YYYY');
            }
            return null;
        },
  
        // Get the Init End Contract Date (Kompensasi)
        setEndContractDate(){
            if(this.selectedKaryawan){
                const endDate = this.getDateObj(this.setStartContractDate);
                endDate.setMonth(endDate.getMonth() + 6);
                return moment(endDate).format('DD/MM/YYYY');
            }
            return null;
        },

      
    }
}