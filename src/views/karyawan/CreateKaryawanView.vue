<template>
  <div class="karyawan-form-container">
    <div class="karyawan-form-header">
      <h3>Tambah Karyawan</h3>
    </div>
    <div class="karyawan-form-content">
      <v-form>
        <v-row dense>
          <v-col cols="3">
            <v-list-item-title>NIK</v-list-item-title>
            <v-list-item-subtitle> <i> Identity Number </i> </v-list-item-subtitle>
            <v-text-field variant="underlined" density="compact"></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3">
            <v-list-item-title>Nama</v-list-item-title>
            <v-list-item-subtitle> <i> Name </i> </v-list-item-subtitle>
            <v-text-field variant="underlined" density="compact" type="text"></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3">
            <v-list-item-title>Tempat Lahir</v-list-item-title>
            <v-list-item-subtitle> <i> Place of Birth </i> </v-list-item-subtitle>
            <v-text-field variant="underlined" density="compact"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-list-item-title>Tanggal Lahir</v-list-item-title>
            <v-list-item-subtitle> <i> Date of Birth </i> </v-list-item-subtitle>
            <v-text-field
              v-model="dob"
              variant="underlined"
              density="compact"
              append-inner-icon="mdi-calendar"
              @click:appendInner="openDobDatePicker"
              placeholder="DD/MM/YYYY"
            ></v-text-field>
            <VDatePicker
              v-model="dob"
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
          <v-col cols="3">
            <v-list-item-title>Alamat</v-list-item-title>
            <v-list-item-subtitle> <i> Address </i> </v-list-item-subtitle>
            <v-text-field variant="underlined" density="compact" type="text"></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-list-item-title>RT</v-list-item-title>
            <v-list-item-subtitle> <i> RT </i> </v-list-item-subtitle>
            <v-text-field variant="underlined" density="compact" type="text"></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-list-item-title>RW</v-list-item-title>
            <v-list-item-subtitle> <i> RW </i> </v-list-item-subtitle>
            <v-text-field variant="underlined" density="compact" type="text"></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-list-item-title>Kecamatan</v-list-item-title>
            <v-list-item-subtitle> <i> Subdistrict </i> </v-list-item-subtitle>
            <v-text-field variant="underlined" density="compact" type="text"></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-list-item-title>Kelurahan</v-list-item-title>
            <v-list-item-subtitle> <i> Village </i> </v-list-item-subtitle>
            <v-text-field variant="underlined" density="compact" type="text"></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3">
            <v-list-item-title> Agama </v-list-item-title>
            <v-list-item-subtitle> <i> Religion </i> </v-list-item-subtitle>
            <v-text-field variant="underlined" density="compact"></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3">
            <v-list-item-title> Agama </v-list-item-title>
            <v-list-item-subtitle> <i> Religion </i> </v-list-item-subtitle>
            <v-text-field variant="underlined" density="compact"></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3">
            <v-list-item-title>Tanggal Join</v-list-item-title>
            <v-list-item-subtitle> <i> Join Date </i> </v-list-item-subtitle>
            <v-text-field
              v-model="join_date"
              variant="underlined"
              density="compact"
              append-inner-icon="mdi-calendar"
              @click:appendInner="openJoinDatePicker"
              placeholder="DD/MM/YYYY"
            ></v-text-field>
            <VDatePicker
              v-model="join_date"
              mode="date"
              @dayclick="closeJoinDatePicker"
              :masks="dateFormat"
              :max-date="new Date()"
              v-if="isJoinDatePickerOpen"
            >
            </VDatePicker>
          </v-col>
        </v-row>
      </v-form>
    </div>
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

    dob: ref(null),
    join_date : ref(null),

    dateFormat: ref({
      modelValue: 'DD/MM/YYYY'
    })
  }),

  methods: {
    openDobDatePicker() {
      this.isDobDatePickerOpen = true
    },
    closeDobDatePicker() {
      this.dob = moment(this.dob).format('DD/MM/YYYY')
      this.isDobDatePickerOpen = false
    },

    openJoinDatePicker() {
      this.isJoinDatePickerOpen = true
    },
    closeJoinDatePicker() {
      this.join_date = moment(this.join_date).format('DD/MM/YYYY')
      this.isJoinDatePickerOpen = false
    },
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
