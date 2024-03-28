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
            try{
                return this.getDateObj(this.convertDate(value)) > this.getDateObj(this.convertDate(start_date))
            }catch(error){
                return error.message
            }
        },

        numberCheckValidation(value){
            return /^\d+$/.test(value) || "Invalid Input"
        },

        isDateValid(value){
            return /^\d{2}\/\d{2}\/\d{4}$/.test(value) || "Date must be DD/MM/YYYY"
        },

        isValueDate(value){
            return !isNaN(Date.parse(this.convertDate(value))) || "Invalid Date"
        },

        isDifferentValue(value, oldValue){
            return value !== oldValue || "Input Different Value"
        }

    },
}