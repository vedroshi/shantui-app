import { dateConversionMixin } from "./dateConversionMixin"

export const validationMixin = {
    mixins : [dateConversionMixin],
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

        endDateValidation(value, start_date, message){
            if( this.getDateObject(this.convertDDMMYYYYToYYYYMMDD(value)) > this.getDateObject(this.convertDDMMYYYYToYYYYMMDD(start_date))){
                return true
            }else{
                return message
            }
        },

        numberCheckValidation(value){
            return /^\d+$/.test(value) || "Invalid Input"
        },

        isDateValid(value){
            return /^\d{2}\/\d{2}\/\d{4}$/.test(value) || "Date must be DD/MM/YYYY"
        },

        isValueDate(value){
            return !isNaN(Date.parse(this.convertDDMMYYYYToYYYYMMDD(value))) || "Invalid Date"
        },

        isDifferentValue(value, oldValue){
            return value !== oldValue || "Input Different Value"
        },
    },
}