import moment from 'moment';
import {ref} from 'vue';
import {clone} from 'lodash';
import {dateConversionMixin} from './dateConversionMixin';
import axios from 'axios';

export const karyawanMixin = {
    mixins : [dateConversionMixin],
    data(){
        return{
            karyawanURL : this.$store.state.karyawanURL,
            selectedKaryawan : this.$store.state.selectedKaryawan,
        }
    },
    methods : {
        // Set v-chip color on "status" table
        getColor(status) {
            if (status == 'Warning') return 'orange'
            else if (status == 'Close Project') return 'red'
            else if (status == 'Cuti') return 'yellow'
            else if (status == 'Resign') return 'black'
            else if (status == 'Cut Off') return 'brown'
            else return 'green'
        },

        // Set Up Form Data in Edit Application
        getCurrentApplication() {
            if (this.selectedKaryawan && this.selectedKaryawan.Application && this.selectedKaryawan.Application.Application_Status) {
            return clone(this.selectedKaryawan.Application)
        }
            return null
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

        resetCutOffForm(formData){
            formData.Date = null;
        },

        async showKaryawanPosition(list) {
            await axios.get(`${this.karyawanURL}/position/`)
              .then((response) => {
                if(response.status == 200){   
                  // Change PositionList Format
                  response.data.forEach((item) => {
                    let existingPosition = list.find((position) => position.Name === item.Name);
                    
                    if (!existingPosition) {
                      let newPosition = {
                        Name: item.Name,
                        Tonnages: item.Tonnage !== null ? [item.Tonnage] : null
                      };
                      list.push(newPosition);
                    } else if (item.Tonnage !== null) {
                      existingPosition.Tonnages.push(item.Tonnage);
                    }

                    return list
                  });

                }
              }).catch((error) => {
                console.error(error)
              })
          }
    },
    computed : {
       
        // Get the Init Start Contract Date (Kompensasi)
        setStartContractDate(){
            if(this.selectedKaryawan){
                const endDate = this.getDateObject(this.selectedKaryawan.Status.End);
                endDate.setDate(endDate.getDate() + 1);
                return moment(endDate).format('DD/MM/YYYY');
            }
            return null;
        },
  
        // Get the Init End Contract Date (Kompensasi)
        setEndContractDate(){
            if(this.selectedKaryawan){
                const startDate = moment(this.setStartContractDate, 'DD/MM/YYYY').format('yyyy-MM-DD')
                const endDate = this.getDateObject(startDate);
                endDate.setMonth(endDate.getMonth() + 6);
                return moment(endDate).format('DD/MM/YYYY');
            }
            return null;
        },

    }
}