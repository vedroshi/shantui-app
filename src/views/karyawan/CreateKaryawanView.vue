<template>
  <div class="karyawan-form-container">
    <div class="karyawan-form-header">
      <h3>Tambah Karyawan</h3>
    </div>
    <div class="karyawan-form-content">
      <v-form ref="form" lazy-validation>
        <v-row dense>
          <v-col cols="3">
            <v-list-item-title>NIK</v-list-item-title>
            <v-list-item-subtitle> <i> Identity Number </i> </v-list-item-subtitle>
            <v-text-field
              v-model="formData.NIK"
              variant="underlined"
              density="compact"
              :rules="nikRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-list-item-title>Nama</v-list-item-title>
            <v-list-item-subtitle> <i> Name </i> </v-list-item-subtitle>
            <v-text-field
              v-model="formData.Name"
              variant="underlined"
              density="compact"
              type="text"
              :rules="nameRules"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3">
            <v-list-item-title>Tempat Lahir</v-list-item-title>
            <v-list-item-subtitle> <i> Place of Birth </i> </v-list-item-subtitle>
            <v-text-field
              v-model="formData.POB"
              variant="underlined"
              density="compact"
              :rules="pobRules"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="3" v-click-outside="closeDobDatePicker">
            <v-list-item-title>Tanggal Lahir</v-list-item-title>
            <v-list-item-subtitle> <i> Date of Birth </i> </v-list-item-subtitle>
            <v-text-field
              v-model="formData.DOB"
              variant="underlined"
              density="compact"
              append-inner-icon="mdi-calendar"
              @click:appendInner="openDobDatePicker"
              placeholder="DD/MM/YYYY"
              clearable
              required
              :rules="dobRules"
            ></v-text-field>
            <VDatePicker
              v-model.string="formData.DOB"
              mode="date"
              @dayclick="closeDobDatePicker"
              :masks="dateFormat"
              :max-date="new Date()"
              v-if="isDobDatePickerOpen"
            >
            </VDatePicker>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-list-item-title>Alamat</v-list-item-title>
            <v-list-item-subtitle> <i> Address </i> </v-list-item-subtitle>
            <v-text-field
              v-model="formData.Address"
              variant="underlined"
              density="compact"
              type="text"
              :rules="addressRules"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3">
            <v-list-item-title> Agama </v-list-item-title>
            <v-list-item-subtitle> <i> Religion </i> </v-list-item-subtitle>
            <v-text-field
              v-model="formData.Religion"
              :rules="religionRules"
              variant="underlined"
              density="compact"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3">
            <v-list-item-title> Jabatan </v-list-item-title>
            <v-list-item-subtitle> <i> Position </i> </v-list-item-subtitle>
            <v-combobox
              v-model="selectedPosition"
              label="Select a Position"
              density="compact"
              variant="underlined"
              :items="positionItems"
              item-value="position"
              item-title="position"
              single-line
              clearable
              :rules="positionRules"
              required
            >
            </v-combobox>
          </v-col>
          <v-col cols="3" v-if="selectedPosition && selectedPosition.tonnage">
            <v-list-item-title> Tonase </v-list-item-title>
            <v-list-item-subtitle> <i> Tonnage </i> </v-list-item-subtitle>
            <v-combobox
              v-model="formData.Position.Tonnage"
              label="Select a Tonnage"
              density="compact"
              :items="selectedPosition.tonnage"
              single-line
              variant="underlined"
              :rules="tonnageRules"
              suffix="Ton"
            ></v-combobox>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3" v-click-outside="closeJoinDatePicker">
            <v-list-item-title>Tanggal Join</v-list-item-title>
            <v-list-item-subtitle> <i> Join Date </i> </v-list-item-subtitle>
            <v-text-field
              v-model="formData.Join_Date"
              variant="underlined"
              density="compact"
              append-inner-icon="mdi-calendar"
              @click:appendInner="openJoinDatePicker"
              placeholder="DD/MM/YYYY"
              clearable
              required
              :rules="joinRules"
            ></v-text-field>
            <VDatePicker
              v-model.string="formData.Join_Date"
              mode="date"
              @dayclick="closeJoinDatePicker"
              :masks="dateFormat"
              :max-date="new Date()"
              v-if="isJoinDatePickerOpen"
            >
            </VDatePicker>
          </v-col>
          <v-col cols="3">
            <v-list-item-title>Perusahaan</v-list-item-title>
            <v-list-item-subtitle> <i> Company </i> </v-list-item-subtitle>
            <v-text-field
              v-model="formData.Company.Name"
              variant="underlined"
              density="compact"
              :rules="companyRules"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-list-item-title>Penempatan</v-list-item-title>
            <v-list-item-subtitle> <i> Site </i> </v-list-item-subtitle>
            <v-text-field
              v-model="formData.Company.Site"
              variant="underlined"
              density="compact"
              :rules="siteRules"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3">
            <v-file-input
              :rules="uploadKTPRules"
              accept="image/png, image/jpeg, image/bmp"
              placeholder="Upload KTP"
              label="Upload KTP"
              prepend-icon="mdi-card-account-details-outline"
              variant="underlined"
              show-size
              v-model="formData.KTP"
              required
            ></v-file-input>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3">
            <v-btn style="background-color: var(--secondary)" @click="addKaryawan">Submit</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
    <v-dialog v-model="addKaryawanProgressOpen" width="300" persistent align="center" justify="center" max-height="500">
      <v-card style="padding : 2rem">
        <v-row align="center" justify="center">
          <v-col dense style>
            <v-card-title class="mb-5"> Adding Karyawan </v-card-title>

            <v-progress-circular
              color="dark-blue"
              indeterminate
              :size="70"
              :width="7"
            ></v-progress-circular>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbarAttribute.isSnackbarOpen" :color="snackbarAttribute.isSuccess ? 'success' : 'red'" bottom :timeout="2000">
      {{snackbarAttribute.message}}
      <template v-slot:actions>
        <v-btn variant="text" @click="isSnackbarOpen = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import moment from 'moment'
import axios from 'axios'
import { cloneDeep } from 'lodash'

import { karyawanMixin } from '../../mixins/karyawanMixin'
</script>

<script>
export default {
  mixins: [karyawanMixin],
  data: () => ({
    isDobDatePickerOpen: ref(false),
    isJoinDatePickerOpen: ref(false),

    addKaryawanProgressOpen: ref(false),
    snackbarAttribute: {
      isSnackbarOpen : ref(false),
      isSuccess : ref(null),
      message : ref(null),
    },

    selectedPosition: ref(null),

    positionItems: [
      {
        position: 'Operator Crane',
        tonnage: [50, 55, 80]
      },
      {
        position: 'Operator Excavator',
        tonnage: [50, 55, 80]
      },
      {
        position: 'Driver Trailer'
      },
      {
        position: 'Driver Mixer'
      },
      {
        position: 'Jubir'
      },
      {
        position: 'Helper'
      },
      {
        position: 'Mekanik'
      }
    ],

    nikRules: [
      (value) => !!value || 'NIK is Required',
      (value) => (value && value.length == 16) || 'Length of NIK must be 16'
    ],
    nameRules: [(value) => !!value || 'Name is Required'],
    uploadKTPRules: [
      (value) => !!value || 'KTP is Required',
      (value) => (value && value[0].size < 2000000) || 'KTP image size should be less than 2 MB!'
    ],
    pobRules: [(value) => !!value || 'Place of Birth is Required'],
    dobRules: [(value) => !!value || 'Date of Birth is Required'],
    addressRules: [(value) => !!value || 'Address is Required'],
    religionRules: [(value) => !!value || 'Religion is Required'],
    joinRules: [(value) => !!value || 'Join Date is Required'],
    siteRules: [(value) => !!value || 'Site is Required'],
    companyRules: [(value) => !!value || 'Company is Required'],
    positionRules: [(value) => (!!value && !!value.position) || 'Position is Required'],
    tonnageRules: [(value) => !!value || 'Tonnage is Required'],

    formData: {
      NIK: ref(null),
      Name: ref(null),
      POB: ref(null),
      DOB: ref(null),
      Address: ref(null),
      Join_Date: ref(moment(new Date()).format('DD/MM/YYYY')),
      Religion: ref(null),
      Position: {
        Name: ref(null),
        Tonnage: ref(null)
      },
      Company: {
        Name: ref(null),
        Site: ref(null)
      },
      KTP: ref(null)
    }
  }),
  methods: {
    openDobDatePicker() {
      this.isDobDatePickerOpen = true
    },
    closeDobDatePicker() {
      // this.dob = moment(this.dob).format('DD/MM/YYYY')
      this.isDobDatePickerOpen = false
    },

    openJoinDatePicker() {
      this.isJoinDatePickerOpen = true
    },
    closeJoinDatePicker() {
      // this.join_date = moment(this.join_date).format('DD/MM/YYYY')
      this.isJoinDatePickerOpen = false
    },

    openSnackbar(response, isSuccess){
      this.addKaryawanProgressOpen = false
      this.snackbarAttribute.isSnackbarOpen = true
      this.snackbarAttribute.isSuccess = isSuccess
      this.snackbarAttribute.message = response.data.message
    },

    async addKaryawan() {
      const { valid } = await this.$refs.form.validate()
      
      if (valid) {
        this.addKaryawanProgressOpen = true
        // set Position Name
        const newKaryawanData = cloneDeep(this.formData)

        newKaryawanData.Position.Name = this.setPositionName
        newKaryawanData.DOB =  moment(newKaryawanData.DOB, 'DD/MM/YYYY').format('YYYY-MM-DD');
        newKaryawanData.Join_Date = moment(newKaryawanData.Join_Date, 'DD/MM/YYYY').format('YYYY-MM-DD');

        newKaryawanData.KTP = newKaryawanData.KTP[0]

        await axios.post(`${this.karyawanURL}/karyawan/create`, newKaryawanData, {
            headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then((response)=>{
          if(response.status == 200)
            this.openSnackbar(response, true)
            this.$refs.form.reset();
        }).catch((error)=>{
          this.openSnackbar(error.response, false)
          console.log(error)
        })
      }
    }
  },
  computed: {
    setPositionName() {
      const positionName = this.selectedPosition.position
      return positionName
    }
  }
}
</script>

<style lang="scss" scoped>
$defaultSpacing: 1rem;
.karyawan-form-container {
  padding: $defaultSpacing;
  flex: 1;
  & .karyawan-form-header {
    & h3 {
      font-size: 30px;
    }
  }

  & .karyawan-form-content {
    @apply my-3;
  }
}
</style>
