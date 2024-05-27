import moment from 'moment';
import { ref } from 'vue';

export const dateConversionMixin = {
    data() {
        return{
            dateFormat: ref({
                modelValue: 'DD/MM/YYYY'
            })
        }
    },
    methods: {
        // Convert DateString (yyyy-MM-DD) to Date Object
        getDateObject(dateString) {
            try{
                const [year, month, date] = dateString.split('-');
                if (date && month && year) {
                    return new Date(year, month - 1, date);
                } 
            }catch(err){
                throw new Error("Invalid Date")
            }
        },

        // Format DD/MM/YYYY to YYYY-MM-DD
        convertDDMMYYYYToYYYYMMDD(date) {
            const formattedDate = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            return formattedDate
        },

        // Convert Date Object to DD/MM/YYYY
        convertToDDMMYYYY(date) {
            const formattedDate = moment(date).format('DD/MM/YYYY')
            return formattedDate
        },

        // Format YYYY-MM-DD to DD/MM/YYYY
        convertYYYYMMDDToDDMMYYYY(date) {
            const formattedDate = moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY')
            return formattedDate
        },

        // Format YYYY-MM-DD to DD MMMM YYYY
        convertYYYYMMDDToDDMMMMYYYY(date) {
            const formattedDate = moment(date, 'YYYY-MM-DD').format('DD MMMM YYYY')
            return formattedDate
        },

        // Check if Date is Null and Convert it to 'YYYY-MM-DD'
        isDateNullAndConvert(val) {
            const value = val == null ? null : this.convertDDMMYYYYToYYYYMMDD(val)
            return value
        },

        // Check if Date is Null and Convert it to 'DD/MM/YYYY'
        isDateNullAndRevert(val) {
            const value = val == null ? null : this.convertYYYYMMDDToDDMMYYYY(val)
            return value
        },
    }
}