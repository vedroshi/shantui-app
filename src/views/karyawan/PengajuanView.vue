<template>
  <div class="pengajuan-container">
    <div class="pengajuan-header">
      <h3>Ajukan form</h3>
    </div>
    <div class="pengajuan-form">
      <v-form ref="form" lazy-validation>
        <v-row dense>
          <!-- Apply Date -->
          <v-col cols="3" v-click-outside="closeApplyDatePicker">
            <v-list-item-title>Tanggal Pengajuan</v-list-item-title>
            <v-list-item-subtitle> <i> Apply Date </i> </v-list-item-subtitle>
            <v-text-field v-model="applyData.Apply_Date" variant="underlined" density="compact"
              append-inner-icon="mdi-calendar" @click:appendInner="openApplyDatePicker" placeholder="DD/MM/YYYY"
              clearable required :rules="[
            (value) => this.required(value),
            (value) => this.isDateValid(value)
          ]"></v-text-field>
            <VDatePicker v-model.string="applyData.Apply_Date" mode="date" @dayclick="closeApplyDatePicker"
              :masks="dateFormat" :max-date="new Date()" v-if="togglerHandler.isApplyDatePickerOpen">
            </VDatePicker>
          </v-col>
        </v-row>
        <v-row dense>
          <!-- Name -->
          <v-col>
            <v-list-item-title> Nama </v-list-item-title>
            <v-list-item-subtitle> <i> Name </i> </v-list-item-subtitle>
            <v-text-field variant="underlined" readonly density="compact">
              {{ this.selectedKaryawan.Name }}
            </v-text-field>
          </v-col>
          <!-- Position -->
          <v-col>
            <v-list-item-title> Jabatan </v-list-item-title>
            <v-list-item-subtitle> <i> Position </i> </v-list-item-subtitle>
            <v-text-field variant="underlined" readonly density="compact">
              {{ selectedKaryawan.Position.Name }}
            </v-text-field>
          </v-col>
          <!-- Tonnage -->
          <v-col v-if="selectedKaryawan.Position.Tonnage">
            <v-list-item-title> Tonase </v-list-item-title>
            <v-list-item-subtitle> <i> Tonnage </i> </v-list-item-subtitle>
            <v-text-field variant="underlined" readonly density="compact" suffix="Ton">
              {{ selectedKaryawan.Position.Tonnage }}
            </v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <!-- Join Date -->
          <v-col>
            <v-list-item-title> Tanggal Join </v-list-item-title>
            <v-list-item-subtitle> <i>Join Date</i> </v-list-item-subtitle>
            <v-text-field variant="underlined" readonly density="compact">
              {{ moment(this.selectedKaryawan.Join_Date, 'yyyy-MM-DD').format('DD/MM/YYYY') }}
            </v-text-field>
          </v-col>
          <!-- Department -->
          <v-col>
            <v-list-item-title> Departement </v-list-item-title>
            <v-list-item-subtitle> <i> Department </i> </v-list-item-subtitle>
            <v-text-field variant="underlined" readonly density="compact"> Plant </v-text-field>
          </v-col>
          <!-- Site -->
          <v-col>
            <v-list-item-title> Penempatan </v-list-item-title>
            <v-list-item-subtitle> <i> Site </i> </v-list-item-subtitle>
            <v-text-field variant="underlined" readonly density="compact">
              {{ this.selectedKaryawan.Company.Site.Name }}
            </v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <!-- Start Contract -->
          <v-col>
            <v-list-item-title> Mulai Kontrak </v-list-item-title>
            <v-list-item-subtitle> <i> Start Contract </i> </v-list-item-subtitle>
            <v-text-field variant="underlined" readonly density="compact">
              {{ convertYYYYMMDDToDDMMYYYY(selectedKaryawan.Status.Start) }}
            </v-text-field>
          </v-col>
          <!-- End Contract -->
          <v-col v-if="selectedKaryawan.Status.End">
            <v-list-item-title> Akhir Kontrak </v-list-item-title>
            <v-list-item-subtitle> <i> End Contract </i> </v-list-item-subtitle>
            <v-text-field variant="underlined" readonly density="compact">
              {{ convertYYYYMMDDToDDMMYYYY(selectedKaryawan.Status.End) }}
            </v-text-field>
          </v-col>
        </v-row>
        <!-- Application -->
        <v-row dense>
          <!-- Application Type Radio -->
          <v-col>
            <v-list-item-title> Tipe Pengajuan </v-list-item-title>
            <v-list-item-subtitle>
              <i> Application Type </i>
            </v-list-item-subtitle>
            <v-radio-group v-model="applyData.Application_Type" density="compact" style="margin-top: 10px" inline
              :rules="[
            (value) => this.required(value)
          ]">
              <v-radio label="Kompensasi" value="Kompensasi" class="radio-item"></v-radio>
              <v-radio label="Cuti" value="Cuti" class="radio-item"></v-radio>
              <v-radio label="Resign" value="Resign" class="radio-item"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row dense>
          <!-- Application Form -->
          <v-col v-if="applyData.Application_Type == 'Kompensasi'">
            <v-row dense>
              <v-col cols="3">
                <v-list-item-title> Mulai Kontrak </v-list-item-title>
                <v-list-item-subtitle>
                  <i> Start Contract </i>
                </v-list-item-subtitle>
                <v-text-field v-model="applyData.Start_Contract" :readonly="!togglerHandler.isEditExtendDate" variant="underlined" density="compact"
                  :rules="[
                    (value) => this.required(value),
                    (value) => this.isDateValid(value),
                    (value) => this.endDateValidation(value, convertYYYYMMDDToDDMMYYYY(selectedKaryawan.Status.End), 'Tanggal Awal kontrak lebih kecil dari Akhir Kontrak sebelumnya')
                  ]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="3">
                <v-list-item-title> Akhir Kontrak </v-list-item-title>
                <v-list-item-subtitle>
                  <i> End Contract </i>
                </v-list-item-subtitle>
                <v-text-field v-model="setEndContract" readonly variant="underlined" density="compact">
                </v-text-field>
              </v-col>
              <v-col>
                <v-checkbox label="Ganti Tanggal" v-model="togglerHandler.isEditExtendDate">

                </v-checkbox>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-else-if="applyData.Application_Type == 'Cuti'">
            <v-row dense>
              <!-- Tanggal Cuti -->
              <v-col cols="3" v-click-outside="closeStartCutiDatePicker">
                <v-list-item-title>Tanggal Cuti</v-list-item-title>
                <v-list-item-subtitle> <i> Leave Date </i> </v-list-item-subtitle>
                <v-text-field v-model="applyData.Start_Cuti" variant="underlined" density="compact"
                  append-inner-icon="mdi-calendar" @click:appendInner="openStartCutiDatePicker" placeholder="DD/MM/YYYY"
                  clearable required :rules="[
            (value) => this.required(value),
            (value) => this.isDateValid(value),
            (value) => this.endDateValidation(value, this.convertYYYYMMDDToDDMMYYYY(this.selectedKaryawan.Status.Start), 'Tanggal Cuti lebih besar dari tanggal awal kontrak')
          ]"></v-text-field>
                <VDatePicker v-model.string="applyData.Start_Cuti" mode="date" @dayclick="closeStartCutiDatePicker"
                  :masks="dateFormat" v-if="togglerHandler.isStartCutiDatePickerOpen">
                </VDatePicker>
              </v-col>
              <!-- Balik Cuti -->
              <v-col cols="3" v-click-outside="closeEndCutiDatePicker" v-if="togglerHandler.isEndCuti">
                <v-list-item-title>Tanggal Balik Cuti</v-list-item-title>
                <v-list-item-subtitle> <i> Return Date </i> </v-list-item-subtitle>
                <v-text-field v-model="applyData.End_Cuti" variant="underlined" density="compact"
                  append-inner-icon="mdi-calendar" @click:appendInner="openEndCutiDatePicker" placeholder="DD/MM/YYYY"
                  clearable required :rules="[
            (value) => this.required(value),
            (value) => this.isDateValid(value),
            (value) => this.endDateValidation(value, applyData.Start_Cuti, 'Tanggal balik cuti lebih besar dari Tanggal awal cuti')
          ]"></v-text-field>
                <VDatePicker v-model.string="applyData.End_Cuti" mode="date" @dayclick="closeEndCutiDatePicker"
                  :masks="dateFormat" :min-date="getDateObj(convertDDMMYYYYToYYYYMMDD(applyData.Start_Cuti))"
                  v-if="togglerHandler.isEndCutiDatePickerOpen">
                </VDatePicker>
              </v-col>
              <v-col align-self="start" cols="3">
                <v-checkbox label="Balik Cuti" v-model="togglerHandler.isEndCuti"></v-checkbox>
              </v-col>
            </v-row>
            <v-row dense>
              <!-- Depart -->
              <v-col cols="3" v-if="togglerHandler.isDepart">
                <v-list-item-title> Keberangkatan </v-list-item-title>
                <v-list-item-subtitle> Departure </v-list-item-subtitle>
                <v-text-field v-model="applyData.Depart" variant="underlined" :rules="[
            (value) => this.required(value)
          ]">
                </v-text-field>
              </v-col>
              <!-- Arrival -->
              <v-col cols="3" v-if="togglerHandler.isDepart">
                <v-list-item-title> Kedatangan </v-list-item-title>
                <v-list-item-subtitle> Arrival </v-list-item-subtitle>
                <v-text-field variant="underlined" v-model="applyData.Arrival" :rules="[
            (value) => this.required(value),
            (value) => this.isSameValidation(value, applyData.Depart)
          ]">
                </v-text-field>
              </v-col>
              <v-col align-self="center">
                <v-checkbox label="Tiket Pesawat" v-model="togglerHandler.isDepart"></v-checkbox>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-else-if="applyData.Application_Type == 'Resign'">
            <v-row dense>
              <v-col cols="3" v-click-outside="closeResignDatePicker">
                <v-list-item-title>Tanggal Resign</v-list-item-title>
                <v-list-item-subtitle> <i> Resign Date </i> </v-list-item-subtitle>
                <v-text-field v-model="applyData.Resign_Date" variant="underlined" density="compact"
                  append-inner-icon="mdi-calendar" @click:appendInner="openResignDatePicker" placeholder="DD/MM/YYYY"
                  clearable required :rules="[
            (value) => this.required(value),
            (value) => this.isDateValid(value)
          ]"></v-text-field>
                <VDatePicker v-model.string="applyData.Resign_Date" mode="date" @dayclick="closeResignDatePicker"
                  :masks="dateFormat" :min-date="new Date()" v-if="togglerHandler.isResignDatePickerOpen">
                </VDatePicker>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row dense>
          <v-btn style="background-color: var(--secondary)" @click="applyForm"> Apply </v-btn>
        </v-row>
      </v-form>
    </div>
    <SnackbarView v-model:snackbarAttribute="snackbarAttribute"></SnackbarView>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import moment from 'moment'
import axios from 'axios'

import { karyawanMixin } from '../../mixins/karyawanMixin'
import { validationMixin } from '../../mixins/validationMixin'
import { dateConversionMixin } from '../../mixins/dateConversionMixin'

import SnackbarView from '../../components/SnackbarView.vue'
</script>

<script>
export default {
  mixins: [karyawanMixin, validationMixin, dateConversionMixin],
  components: {
    SnackbarView
  },
  data: () => ({

    togglerHandler: {
      isEndCuti: ref(false),
      isDepart: ref(false),

      isApplyDatePickerOpen: ref(false),
      isStartCutiDatePickerOpen: ref(false),
      isEndCutiDatePickerOpen: ref(false),
      isResignDatePickerOpen: ref(false),

      isEditExtendDate : ref(false)
    },

    snackbarAttribute: {
      isSnackbarOpen: ref(false),
      isSuccess: ref(false),
      message: ref(null),
    },

    // Application Form Data
    applyData: {
      Application_Type: ref(null),
      Apply_Date: ref(moment(new Date()).format('DD/MM/YYYY')),
      Application_Status: ref(null),
      // Kompensasi
      Start_Contract: ref(null),
      End_Contract: ref(null),
      // Cuti
      Start_Cuti: ref(null),
      End_Cuti: ref(null),
      Depart: ref(null),
      Arrival: ref(null),
      // Resign
      Resign_Date: ref(null),
    },

  }),
  watch: {
    'applyData.Application_Type': function (newType, oldType) {
      this.resetApplicationForm(this.applyData, this.togglerHandler, newType, oldType);
    },
  },
  methods: {

    // Apply Date Picker Handler
    openApplyDatePicker() {
      this.togglerHandler.isApplyDatePickerOpen = true
    },
    closeApplyDatePicker() {
      this.togglerHandler.isApplyDatePickerOpen = false
    },

    // Start Cuti Date Picker Handler
    openStartCutiDatePicker() {
      this.togglerHandler.isStartCutiDatePickerOpen = true
    },
    closeStartCutiDatePicker() {
      this.togglerHandler.isStartCutiDatePickerOpen = false
    },

    // End Cuti Date Picker Handler
    openEndCutiDatePicker() {
      try {
        if (this.applyData.Start_Cuti) {
          this.togglerHandler.isEndCutiDatePickerOpen = true
        } else {
          throw new Error("Tanggal Cuti is Required")
        }
      } catch (err) {
        alert(err.message)
      }
    },
    closeEndCutiDatePicker() {
      this.togglerHandler.isEndCutiDatePickerOpen = false
    },

    // Resign Date Picker Handler
    openResignDatePicker() {
      this.togglerHandler.isResignDatePickerOpen = true
    },
    closeResignDatePicker() {
      this.togglerHandler.isResignDatePickerOpen = false
    },

    // Snackbar Handler
    openSnackbar(isSuccess, message) {
      this.snackbarAttribute.isSnackbarOpen = true;
      this.snackbarAttribute.isSuccess = isSuccess;
      this.snackbarAttribute.message = message
    },

    // Application Form Submit
    async applyForm() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        // Convert the applyData (Vue) -> applyFormData (API Payload)
        const applyFormData = {
          Apply_Date: this.convertDDMMYYYYToYYYYMMDD(this.applyData.Apply_Date),
          Application_Status: 'Pending',
          Application_Type: this.applyData.Application_Type
        }

        if (applyFormData.Application_Type == "Kompensasi") {
          applyFormData.Start = this.isDateNullAndConvert(this.applyData.Start_Contract)
          this.applyData.End_Contract = this.setEndContract
          applyFormData.End = this.isDateNullAndConvert(this.applyData.End_Contract)

        } else if (applyFormData.Application_Type == "Cuti") {
          applyFormData.Start = this.isDateNullAndConvert(this.applyData.Start_Cuti)
          applyFormData.End = this.togglerHandler.isEndCuti ? this.isDateNullAndConvert(this.applyData.End_Cuti) : null
          applyFormData.Depart = this.applyData.Depart,
          applyFormData.Arrival = this.applyData.Arrival

          // Check if the employee is depart during "Cuti"
        } else if (applyFormData.Application_Type == "Resign") {
          applyFormData.Start = this.isDateNullAndConvert(this.applyData.Resign_Date)
        }
        
        if (!this.togglerHandler.isDepart || applyFormData.Application_Type != "Cuti") {
          applyFormData.Depart = null,
          applyFormData.Arrival = null
        }

        await axios.post(`${this.karyawanURL}/apply/${this.selectedKaryawan.ID}`, applyFormData)
          .then((response) => {
            if (response.status == 200) {
              this.openSnackbar(true, response.data.message)
              setTimeout(() => {
                this.$router.push({
                  name: "KaryawanList"
                })
              }, 1000);
            }
          }).catch((error) => {
            console.log(error)
            this.openSnackbar(false, error.message)
          })
      }
    }

  },
  mounted() {
    this.applyData.Start_Contract = this.setStartContractDate;
  },
  computed : {
    setEndContract(){
      try{
        if(/^\d{2}\/\d{2}\/\d{4}$/.test(this.applyData.Start_Contract)){
          const startDate = moment(this.applyData.Start_Contract, 'DD/MM/YYYY').format('yyyy-MM-DD')
          const endDate = this.getDateObject(startDate);
          endDate.setMonth(endDate.getMonth() + 6);
          return moment(endDate).format('DD/MM/YYYY');
        }
        return null
      }catch(error){
        throw error
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pengajuan-container {
  display: flex;
  flex-direction: column;

  & .pengajuan-header {
    padding: 1rem;

    & h3 {
      font-size: 30px;
    }
  }

  & .pengajuan-form {
    padding: 1rem;
    flex: 1;
    overflow-y: auto;

    & .radio-item {
      margin-right: 1rem;
    }
  }
}
</style>
