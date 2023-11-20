import moment from 'moment';
import {ref} from 'vue';

export const karyawanMixin = {
    data(){
        return{
            karyawanURL : this.$store.state.karyawanURL,
            selectedKaryawan : this.$store.state.selectedKaryawan,
           
           
            dateFormat: ref({
                modelValue: 'DD/MM/YYYY'
              })
        }
    },
    methods : {
        // Set the date string to date
        getDateObj(dateString){
            const [year, month, date] = dateString.split('-');
            if (date && month && year) {
              return new Date(year, month - 1, date);
            } else {
              throw new Error('Invalid date format');
            }
        },

        // Format DD/MM/YYYY to YYYY-MM-DD
        convertDate(date){
            const formattedDate = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            return formattedDate
        },

        revertDate(date){
            const revertDate = moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY')
            return revertDate
        },

        // Format YYYY-MM-DD to DD MMMM YYYY
        formatDate(date){
            const formattedDate = moment(date, 'YYYY-MM-DD').format('DD MMMM YYYY')
            return formattedDate
        },
        
        // Check if Date is Null and Convert it to 'YYYY-MM-DD'
        isDateNullAndConvert(val){
            const value = val == null ? null : this.convertDate(val)
            return value
        },

        // Check if Date is Null and Convert it to 'DD/MM/YYYY'
        isDateNullAndRevert(val){
            const value = val == null ? null : this.revertDate(val)
            return value
        },

        resetApplicationForm (formData, toggler, newType, oldType) {
            // Reset values based on the new application type
            if (oldType === 'Cuti') {
              this.resetCutiValues(formData, toggler)
            } else if (oldType === 'Resign') {
              // Clear values for Resign type
              this.resetResignValues(formData)
            }
        },

        resetCutiValues(formData, toggler) {
            // Clear values for Cuti type
            formData.Start_Cuti = null;
            formData.End_Cuti = null;
            formData.Depart = null;
            formData.Arrival = null;
            // Reset checkboxes
            toggler.isEndCuti = false;
            toggler.isDepart = false;
        },

        resetResignValues(formData) {
        // Clear values for Resign type
            formData.Resign_Date = null;
        },

    },
    computed : {
       
        // Get the Init Start Contract Date (Kompensasi)
        setStartContractDate(){
            if(this.selectedKaryawan){
                const endDate = this.getDateObj(this.selectedKaryawan.Status.End);
                endDate.setDate(endDate.getDate() + 1);
                return moment(endDate).format('DD/MM/YYYY');
            }
            return null;
        },
  
        // Get the Init End Contract Date (Kompensasi)
        setEndContractDate(){
            if(this.selectedKaryawan){
                const startDate = moment(this.setStartContractDate, 'DD/MM/YYYY').format('yyyy-MM-DD')
                const endDate = this.getDateObj(startDate);
                endDate.setMonth(endDate.getMonth() + 6);
                return moment(endDate).format('DD/MM/YYYY');
            }
            return null;
        },

      
    }
}