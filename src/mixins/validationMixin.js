import { karyawanMixin } from "./karyawanMixin"

export const validationMixin = {
    mixins : [karyawanMixin],
    methods : {
        required(value){
            return !!value || "*Required"
        },
        
        isSameValidation(value, other_value){
            return value !== other_value || "Choose Different Destination"
        },

        lengthEqualValidation(value, value_len){
            return value.length == value_len || `Length must be equal to ${value_len}`
        },

        endDateValidation(value, start_date){
            return this.getDateObj(this.convertDate(value)) > this.getDateObj(this.convertDate(start_date)) || "Invalid End Cuti"
        },

        numberCheckValidation(value){
            return /^\d+$/.test(value) || "Only Consist of Number"
        },

        isDateValid(value){
            return /^\d{2}\/\d{2}\/\d{4}$/.test(value) || "Date must be DD/MM/YYYY"
        }

    },
}