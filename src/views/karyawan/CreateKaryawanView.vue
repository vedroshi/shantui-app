<template>
  <div class="karyawan-form-container">
    <div class="karyawan-form-header">
      <h3>Tambah Karyawan</h3>
    </div>
    <div class="karyawan-form-content">
      <v-form ref="form" lazy-validation>
        <v-row dense>
          <!-- NIK -->
          <v-col>
            <v-list-item-title>NIK</v-list-item-title>
            <v-list-item-subtitle> <i> Identity Number </i> </v-list-item-subtitle>
            <v-text-field v-model="formData.NIK" variant="underlined" density="compact" :rules="[
              (value) => this.required(value),
              (value) => this.lengthEqualValidation(value, 16),
              (value) => this.numberCheckValidation(value)
            ]" required></v-text-field>
          </v-col>
          <!-- Name -->
          <v-col>
            <v-list-item-title>Nama</v-list-item-title>
            <v-list-item-subtitle> <i> Name </i> </v-list-item-subtitle>
            <v-text-field v-model="formData.Name" variant="underlined" density="compact" type="text" :rules="[
              (value) => this.required(value)
            ]" required></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <!-- Tempat Lahir -->
          <v-col>
            <v-list-item-title>Tempat Lahir</v-list-item-title>
            <v-list-item-subtitle> <i> Place of Birth </i> </v-list-item-subtitle>
            <v-text-field v-model="formData.POB" variant="underlined" density="compact" :rules="[
              (value) => this.required(value),
            ]" required></v-text-field>
          </v-col>
          <!-- Tanggal Lahir -->
          <v-col v-click-outside="closeDobDatePicker">
            <v-list-item-title>Tanggal Lahir</v-list-item-title>
            <v-list-item-subtitle> <i> Date of Birth </i> </v-list-item-subtitle>
            <v-text-field v-model="formData.DOB" variant="underlined" density="compact" append-inner-icon="mdi-calendar"
              @click:appendInner="openDobDatePicker" placeholder="DD/MM/YYYY" clearable required :rules="[
              (value) => this.required(value),
              (value) => this.isDateValid(value)
            ]"></v-text-field>
            <VDatePicker v-model.string="formData.DOB" mode="date" @dayclick="closeDobDatePicker" :masks="dateFormat"
              :max-date="new Date()" v-if="isDobDatePickerOpen">
            </VDatePicker>
          </v-col>
          <!-- Agama -->
          <v-col>
            <v-list-item-title> Agama </v-list-item-title>
            <v-list-item-subtitle> <i> Religion </i> </v-list-item-subtitle>
            <!-- <v-text-field v-model="formData.Religion" variant="underlined" density="compact" required :rules="[
              (value) => this.required(value)
            ]"></v-text-field> -->
            <v-radio-group v-model="formData.Religion" inline :rules="[
              (value) => this.required(value)
            ]">
              <v-radio label="Islam" value="Islam"></v-radio>
              <v-radio label="Kristen" value="Kristen"></v-radio>
              <v-radio label="Katholik" value="Katholik"></v-radio>
              <v-radio label="Budha" value="Budha"></v-radio>
              <v-radio label="Hindu" value="Hindu"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row dense>
          <!-- Tanggal Join -->
          <v-col cols="4" v-click-outside="closeJoinDatePicker">
            <v-list-item-title>Tanggal Join</v-list-item-title>
            <v-list-item-subtitle> <i> Join Date </i> </v-list-item-subtitle>
            <v-text-field v-model="formData.Join_Date" variant="underlined" density="compact"
              append-inner-icon="mdi-calendar" @click:appendInner="openJoinDatePicker" placeholder="DD/MM/YYYY"
              clearable required :rules="[
              (value) => this.required(value),
              (value) => this.isDateValid(value)
            ]"></v-text-field>
            <VDatePicker v-model.string="formData.Join_Date" mode="date" @dayclick="closeJoinDatePicker"
              :masks="dateFormat" :max-date="new Date()" v-if="isJoinDatePickerOpen">
            </VDatePicker>
          </v-col>
          <!-- Jabatan -->
          <v-col cols="4">
            <v-list-item-title> Jabatan </v-list-item-title>
            <v-list-item-subtitle> <i> Position </i> </v-list-item-subtitle>
            <v-combobox v-model="selectedPosition" label="Select a Position" density="compact" variant="underlined"
              :items="positionList" item-value="Name" item-title="Name" single-line clearable :rules="[
              (value) => (!!value && !!value.Name) || 'Position is Required',

            ]" required>
            </v-combobox>
          </v-col>
          <!-- Tonase -->
          <v-col cols="4" v-if="selectedPosition && selectedPosition.Tonnages">
            <v-list-item-title> Tonase </v-list-item-title>
            <v-list-item-subtitle> <i> Tonnage </i> </v-list-item-subtitle>
            <v-combobox v-model="formData.Position.Tonnage" label="Select a Tonnage" density="compact"
              :items="selectedPosition.Tonnages" single-line variant="underlined" :rules="[
              (value) => this.required(value)
            ]" 
            :suffix="selectedPosition.Name == 'Operator Crane' || selectedPosition.Name == 'Operator Loader' ? 'Ton' : null"
            :prefix="selectedPosition.Name == 'Operator Excavator' ? 'PC' : null"
            ></v-combobox>
          </v-col>
        </v-row>
        <v-row dense>
          <!-- User -->
          <v-col cols="4">
            <v-list-item-title> User </v-list-item-title>
            <v-list-item-subtitle> <i> User </i> </v-list-item-subtitle>
            <v-text-field v-model="formData.Company.Name" variant="underlined" density="compact" :rules="[
              (value) => this.required(value)
            ]"></v-text-field>
          </v-col>
          <!-- Site -->
          <v-col cols="4">
            <v-list-item-title>Penempatan</v-list-item-title>
            <v-list-item-subtitle> <i> Site </i> </v-list-item-subtitle>
            <v-text-field v-model="formData.Company.Site" variant="underlined" density="compact" :rules="[
              (value) => this.required(value),
            ]"></v-text-field>
          </v-col>
          <!-- Upload KTP -->
          <v-col cols="4">
            <v-list-item-title> Upload KTP </v-list-item-title>
            <v-list-item-subtitle> <i> Upload ID Card </i> </v-list-item-subtitle>
            <v-file-input accept="image/png, image/jpeg, image/bmp" :prepend-icon="null"
              variant="underlined" density="compact" show-size v-model="formData.KTP" required :rules="[
              (value) => this.required(value)
            ]"></v-file-input>
          </v-col>
        </v-row>
        <v-row dense>
          <!-- Alamat -->
          <v-col>
            <v-list-item-title>Alamat</v-list-item-title>
            <v-list-item-subtitle> <i> Address </i> </v-list-item-subtitle>
            <v-text-field v-model="formData.Address" variant="underlined" density="compact" type="text" :rules="[
              (value) => this.required(value)
            ]" required></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3">
            <v-btn style="background-color: var(--secondary)" @click="addKaryawan">Submit</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>

    <!-- Loading -->
    <v-dialog v-model="addKaryawanProgressOpen" width="300" persistent align="center" justify="center" max-height="500">
      <v-card style="padding : 2rem">
        <v-row align="center" justify="center">
          <v-col dense style>
            <v-card-title class="mb-5"> Adding Karyawan </v-card-title>
            <v-progress-circular color="dark-blue" indeterminate :size="70" :width="7"></v-progress-circular>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <SnackbarView v-model:snackbarAttribute="snackbarAttribute"> </SnackbarView>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import moment from 'moment'
import axios from 'axios'
import { cloneDeep } from 'lodash'

import { karyawanMixin } from '../../mixins/karyawanMixin'
import { validationMixin } from '../../mixins/validationMixin'

import SnackbarView from '../../components/SnackbarView.vue'
</script>

<script>
export default {
  mixins: [karyawanMixin, validationMixin],
  components: {
    SnackbarView
  },
  data: () => ({
    isDobDatePickerOpen: ref(false),
    isJoinDatePickerOpen: ref(false),

    addKaryawanProgressOpen: ref(false),

    snackbarAttribute: {
      isSnackbarOpen: ref(false),
      isSuccess: ref(null),
      message: ref(null),
    },

    positionList: ref([]),
    selectedPosition: ref(null),

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

    openSnackbar(response, isSuccess) {
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
        newKaryawanData.DOB = moment(newKaryawanData.DOB, 'DD/MM/YYYY').format('YYYY-MM-DD');
        newKaryawanData.Join_Date = moment(newKaryawanData.Join_Date, 'DD/MM/YYYY').format('YYYY-MM-DD');

        newKaryawanData.KTP = newKaryawanData.KTP[0]

        await axios.post(`${this.karyawanURL}/karyawan/create`, newKaryawanData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then((response) => {
          if (response.status == 200){
            this.openSnackbar(response, true)
            this.$refs.form.reset();
            this.formData.Join_Date = moment(new Date()).format('DD/MM/YYYY');
          }
        }).catch((error) => {
          this.openSnackbar(error.response, false)
          console.error(error)
        })
      }
    },

    
  },
  mounted() {
    this.showKaryawanPosition(this.positionList)
  },
  computed: {
    setPositionName() {
      const positionName = this.selectedPosition.Name
      return positionName
    }
  },
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
