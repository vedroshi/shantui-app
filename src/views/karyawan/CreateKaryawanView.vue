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
            <v-text-field v-model="formData.nik" variant="underlined" density="compact" :rules="nikRules" required></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3">
            <v-list-item-title>Nama</v-list-item-title>
            <v-list-item-subtitle> <i> Name </i> </v-list-item-subtitle>
            <v-text-field v-model="formData.name" variant="underlined" density="compact" type="text" :rules="nameRules" required></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3">
            <v-list-item-title>Tempat Lahir</v-list-item-title>
            <v-list-item-subtitle> <i> Place of Birth </i> </v-list-item-subtitle>
            <v-text-field v-model="formData.pob" variant="underlined" density="compact" :rules="pobRules" required></v-text-field>
          </v-col>
          <v-col cols="3" v-click-outside="closeDobDatePicker">
            <v-list-item-title>Tanggal Lahir</v-list-item-title>
            <v-list-item-subtitle> <i> Date of Birth </i> </v-list-item-subtitle>
            <v-text-field
              v-model="formData.dob"
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
              v-model.string="formData.dob"
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
          <v-col cols="5">
            <v-list-item-title>Alamat</v-list-item-title>
            <v-list-item-subtitle> <i> Address </i> </v-list-item-subtitle>
            <v-text-field v-model="formData.address" variant="underlined" density="compact" type="text" :rules="addressRules" required></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-list-item-title>RT</v-list-item-title>
            <v-list-item-subtitle> <i> RT </i> </v-list-item-subtitle>
            <v-text-field v-model="formData.rt" variant="underlined" density="compact" type="text"></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-list-item-title>RW</v-list-item-title>
            <v-list-item-subtitle> <i> RW </i> </v-list-item-subtitle>
            <v-text-field v-model="formData.rw" variant="underlined" density="compact" type="text"></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-list-item-title>Kecamatan</v-list-item-title>
            <v-list-item-subtitle> <i> Subdistrict </i> </v-list-item-subtitle>
            <v-text-field v-model="formData.subdistrict" variant="underlined" density="compact" type="text"></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-list-item-title>Kelurahan</v-list-item-title>
            <v-list-item-subtitle> <i> Village </i> </v-list-item-subtitle>
            <v-text-field v-model="formData.village" variant="underlined" density="compact" type="text"></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3">
            <v-list-item-title> Agama </v-list-item-title>
            <v-list-item-subtitle> <i> Religion </i> </v-list-item-subtitle>
            <v-text-field v-model="formData.religion" :rules="religionRules" variant="underlined" density="compact" required></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3">
            <v-list-item-title> Jabatan </v-list-item-title>
            <v-list-item-subtitle> <i> Position </i> </v-list-item-subtitle>
            <v-combobox
              v-model="formData.selectedPosition"
              label="Select a Position"
              density="compact"
              :items="positionItems"
              item-title="position"
              single-line
              clearable
              :rules ="positionRules"
              required
            >
          
            </v-combobox>
          </v-col>
          <v-col cols="3" v-if="formData.selectedPosition && formData.selectedPosition.position === 'Operator Crane'">
            <v-list-item-title> Tonase </v-list-item-title>
            <v-list-item-subtitle> <i> Tonnage </i> </v-list-item-subtitle>
            <v-combobox
              v-model="formData.selectedPosition.selectedTonnage"
              label="Select a Tonnage"
              density="compact"
              :items="positionItems[0].tonnage"
              single-line
              suffix="Ton"
            ></v-combobox>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3" v-click-outside="closeJoinDatePicker">
            <v-list-item-title>Tanggal Join</v-list-item-title>
            <v-list-item-subtitle> <i> Join Date </i> </v-list-item-subtitle>
            <v-text-field
              v-model="formData.join_date"
              variant="underlined"
              density="compact"
              append-inner-icon="mdi-calendar"
              @click:appendInner="openJoinDatePicker"
              placeholder="DD/MM/YYYY"
              clearable
              required
            ></v-text-field>
            <VDatePicker
              v-model.string="formData.join_date"
              mode="date"
              @dayclick="closeJoinDatePicker"
              :masks="dateFormat"
              :max-date="new Date()"
              v-if="isJoinDatePickerOpen"
            >
            </VDatePicker>
          </v-col>
          <v-col cols="3">
            <v-list-item-title>Penempatan</v-list-item-title>
            <v-list-item-subtitle> <i> Site </i> </v-list-item-subtitle>
            <v-text-field
              v-model="formData.site"
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
              v-model="formData.ktp"
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
    <v-snackbar v-model="isSnackbarOpen" color="success" bottom :timeout="2000">
      Karyawan is Added 
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="isSnackbarOpen = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import moment from 'moment'
</script>

<script>
export default {
  data: () => ({
    isDobDatePickerOpen: ref(false),
    isJoinDatePickerOpen: ref(false),

    isSnackbarOpen : ref(false),

    dateFormat: ref({
      modelValue: 'DD/MM/YYYY'
    }),

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
      },
    ],
    
    nikRules : [
      value => !!value || "NIK is Required",
      value => (value && value.length == 16) || "Length of NIK must be 16"   
    ],
    nameRules : [
      value => !!value || "Name is Required",
    ],
    uploadKTPRules: [
      value => !!value || "KTP is Required",
      value => (value && value[0].size < 2000000) || 'Avatar size should be less than 2 MB!',
    ],
    pobRules : [
      value => !!value || "Place of Birth is Required",
    ],
    dobRules : [
      value => !!value || "Date of Birth is Required",
    ],
    addressRules : [
      value => !!value || "Address is Required",
    ],
    religionRules : [
      value => !!value || "Religion is Required",
    ],
    siteRules : [
      value => !!value || "Site is Required",
    ],
    positionRules : [
      value => (!!value &&!!value.position) || "Position is Required",
    ],
  
    formData : {
      nik : ref(null),
      name : ref(null),
      pob : ref(null),
      dob : ref(null),
      address : ref(null),
      rt : ref(null),
      rw : ref(null),
      village : ref(null),
      subdistrict : ref(null),
      join_date : ref(moment(new Date()).format('DD/MM/YYYY')),
      religion : ref(null),
      selectedPosition : ref(null),
      site: ref(null),
      ktp : ref(null)
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


    async addKaryawan(){
      const { valid } = await this.$refs.form.validate()
      if (valid){
        this.isSnackbarOpen = true;
        console.log(this.formData)
      }
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
