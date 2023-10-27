<template>
  <div>
    <div class="karyawan-header">
      <v-row justify="end" dense>
        <v-col cols="4">
          <v-text-field
            prepend-inner
            clearable
            hide-details
            variant="underlined"
            density="compact"
            clear-icon="$cancel"
            class="shrink"
            v-model="search"
          >
            <span class="material-symbols-outlined mr-3 mt-1"> search </span>
          </v-text-field>
        </v-col>
        <v-col cols="auto" align-self="center">
          <v-btn
            rounded
            style="background-color: var(--primary)"
            @click="this.$router.push('karyawan/create')"
          >
            <span class="material-symbols-outlined"> add </span>
            Add Employee
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div class="karyawan-contents">
      <div class="karyawan-table">
        <v-data-table
          :headers="headers"
          :items="employees"
          :search="search"
          class="elavation-1"
          density="compact"
          item-key="nik"
          height="70vh"
          @click:row="expandKaryawanDialog"
          hover
        >
          <template v-slot:[`item.status`]="{ value }">
            <v-chip :color="getColor(value)" style="margin: 5px">
              {{ value }}
            </v-chip>
          </template>
        </v-data-table>
        <v-dialog
          v-model="karyawanExpand"
          fullscreen
          scrollable
          :scrim="false"
          transition="dialog-bottom-transition"
        >
          <v-toolbar dark style="background-color: var(--primary)">
            <v-btn icon dark @click="shrinkKaryawanDialog">
              <span class="material-symbols-outlined"> close </span>
            </v-btn>
            <v-toolbar-title>{{ selectedKaryawan.name }}</v-toolbar-title>
          </v-toolbar>
          <v-sheet class="karyawan-details">
            <v-row style="margin: 1rem">
              <!-- KTP Image -->
              <v-card width="300" height="150"> KTP </v-card>
              <!-- Header Profile -->
              <v-col align-self="start">
                <v-row>
                  <v-list-item>
                    <v-list-item-subtitle>NIK</v-list-item-subtitle>
                    <v-list-item-title>{{ selectedKaryawan.nik }}</v-list-item-title>
                  </v-list-item>
                </v-row>
                <v-row>
                  <v-list-item>
                    <v-list-item-subtitle>Nama</v-list-item-subtitle>
                    <v-list-item-title>{{ selectedKaryawan.name }}</v-list-item-title>
                  </v-list-item>
                </v-row>
                <v-row>
                  <v-list-item>
                    <v-list-item-subtitle>Posisi</v-list-item-subtitle>
                    <v-list-item-title>{{ selectedKaryawan.position }}</v-list-item-title>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-subtitle>Tonase</v-list-item-subtitle>
                    <v-list-item-title>{{
                      selectedKaryawan.position == 'Operator Crane' ? '80T' : '-'
                    }}</v-list-item-title>
                  </v-list-item>
                </v-row>
              </v-col>
              <v-col>
                <v-row justify="end" style="margin-bottom: 1rem">
                  <v-btn @click="openLogKaryawanDialog">
                    <span class="material-symbols-outlined mr-1"> timeline </span>
                    Log Karyawan
                  </v-btn>
                </v-row>
                <v-row justify="end" style="margin-bottom: 1rem">
                  <v-btn>
                    <span class="material-symbols-outlined mr-1"> download </span>
                    Download PKWT
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>

            <div class="karyawan-profile">
              <v-list-item>
                <v-list-item-subtitle>Tempat, Tanggal Lahir</v-list-item-subtitle>
                <v-list-item-title
                  >{{ selectedKaryawan.pob }}, {{ selectedKaryawan.dob }}</v-list-item-title
                >
              </v-list-item>

              <v-list-item>
                <v-list-item-subtitle>Alamat</v-list-item-subtitle>
                <v-list-item-title>{{ selectedKaryawan.address }}</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <v-list-item-subtitle>Penempatan</v-list-item-subtitle>
                <v-list-item-title>{{ selectedKaryawan.site }}</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <v-list-item-subtitle>Join Date</v-list-item-subtitle>
                <v-list-item-title>{{ selectedKaryawan.join_date }}</v-list-item-title>
              </v-list-item>

              <v-row align="center" style="margin: 0.05rem">
                <v-list-item>
                  <v-list-item-subtitle>Mulai Kontrak</v-list-item-subtitle>
                  <v-list-item-title>{{ selectedKaryawan.start_contract }}</v-list-item-title>
                </v-list-item>
                Sampai
                <v-list-item>
                  <v-list-item-subtitle>Akhir Kontrak</v-list-item-subtitle>
                  <v-list-item-title>{{ selectedKaryawan.end_contract }}</v-list-item-title>
                </v-list-item>
              </v-row>

              <v-row align="center" style="margin: 0.05rem">
                <v-list-item>
                  <v-list-item-subtitle>Status</v-list-item-subtitle>
                  <v-chip :color="getColor(selectedKaryawan.status)" style="margin-top: 5px">
                    {{ selectedKaryawan.status }}
                  </v-chip>
                </v-list-item>
                <v-list-item>
                  <v-list-item-subtitle>Status Pengajuan</v-list-item-subtitle>
                  {{
                    selectedKaryawan.application_type &&
                    selectedKaryawan.application_status == 'Pending'
                      ? `Ajukan ${selectedKaryawan.application_type} (${selectedKaryawan.application_status})`
                      : '-'
                  }}
                </v-list-item>
              </v-row>
            </div>

            <div class="karyawan-actions">
              <v-row style="margin: 1rem" v-if="selectedKaryawan.application_status == 'Pending'">
                <v-col cols="auto">
                  <v-btn> Setujui Pengajuan </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn> Tolak Pengajuan </v-btn>
                </v-col>
                <v-col cols="auto" @click="openEditPengajuanDialog">
                  <v-btn> Edit Form </v-btn>
                </v-col>
              </v-row>
              <v-row style="margin: 1rem" v-else>
                <v-col cols="auto">
                  <v-btn
                    @click="
                      this.$router.push({
                        name: 'Pengajuan',
                        query: { name: selectedKaryawan.name }
                      })
                    "
                  >
                    Ajukan Form
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-sheet>
        </v-dialog>
        <v-dialog v-model="isLogKaryawanOpen" width="auto">
          <v-card width="400">
            <v-img height="200" :src="card_bg" cover class="text-white">
              <v-toolbar color="rgba(0, 0, 0, 0)" theme="light">
                <v-toolbar-title class="text-h6"> Log Karyawan </v-toolbar-title>
                <template v-slot:append>
                  <v-btn @click="closeLogKaryawanDialog" icon="Close">
                    <span class="material-symbols-outlined"> close </span>
                  </v-btn>
                </template>
              </v-toolbar>
              <v-card
                style="padding: 1rem; position: absolute; bottom: 0"
                color="rgba(0, 0, 0, 0)"
                variant="flat"
              >
                <v-row dense>
                  <v-col>
                    <b> Name : {{ selectedKaryawan.name }} </b>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col>
                    <b> Position : {{ selectedKaryawan.position }} </b>
                  </v-col>
                </v-row>
              </v-card>
            </v-img>

            <v-card-text style="overflow-y: scroll; padding: 0rem">
              <v-list>
                <v-list-item v-for="date in getLogDates(messages)" :key="date">
                  <div class="font-weight-bold ms-1 mb-2">{{ date }}</div>
                  <v-timeline density="compact" align="start" line-inset="0">
                    <v-timeline-item
                      v-for="message in messages.filter((message) => message.date == date)"
                      :key="message.date"
                      :dot-color="message.color"
                      size="x-small"
                    >
                      <div class="mb-4">
                        <div>{{ message.message }}</div>
                        <div class="font-weight-normal">
                          <strong
                            >{{ message.start ? message.start : '' }} {{ message.end ? '-' : '' }}
                            {{ message.end ? message.end : '' }}
                          </strong>
                        </div>
                      </div>
                    </v-timeline-item>
                  </v-timeline>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="isEditPengajuanOpen" width="auto">
          <v-card width="400">
            <v-toolbar color="rgba(0, 0, 0, 0)" theme="light">
              <v-toolbar-title class="text-h6"> Edit Pengajuan </v-toolbar-title>
              <template v-slot:append>
                <v-btn @click="closeEditPengajuanDialog" icon="Close">
                  <span class="material-symbols-outlined"> close </span>
                </v-btn>
              </template>
            </v-toolbar>
            <v-container>
            <v-row dense>
              <v-col>
                <v-list-item-title>
                  Pengajuan
                </v-list-item-title>
                <v-list-item-subtitle>
                  <i> Apply </i> 
                </v-list-item-subtitle>
              </v-col>
            </v-row> 
            <v-row dense>
              {{console.log(getCurrentApplicationType)}}
              <v-radio-group 
                  v-model="getCurrentApplicationType.application_type"
                  density="compact"
                  style="margin-top: 10px;"
                  inline
                >
                  <v-radio label="Kompensasi" value="kompensasi" style="margin-right : 1rem" ></v-radio>
                  <v-radio label="Cuti" value="cuti" style="margin-right : 1rem" ></v-radio>
                  <v-radio label="Resign" value="resign" style="margin-right : 1rem" ></v-radio>
                </v-radio-group>
            </v-row>
            <v-col v-if="getCurrentApplicationType.application_type == 'Kompensasi'">
              <v-row dense>
                <v-col cols="3">
                  <v-list-item-title> Mulai Kontrak </v-list-item-title>
                  <v-list-item-subtitle>
                    <i> Start Contract </i>
                  </v-list-item-subtitle>
                  <v-text-field readonly variant="underlined" density="compact">
                    27/10/2023
                  </v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-list-item-title> Akhir Kontrak </v-list-item-title>
                  <v-list-item-subtitle>
                    <i> End Contract </i>
                  </v-list-item-subtitle>
                  <v-text-field readonly variant="underlined" density="compact">
                    27/04/2024
                  </v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-else-if="getCurrentApplicationType.application_type == 'Cuti'">
              <v-row dense>
                <v-col cols="3" v-click-outside="closeStartCutiDatePicker">
                  <v-list-item-title>Tanggal Cuti</v-list-item-title>
                  <v-list-item-subtitle> <i> Leave Date </i> </v-list-item-subtitle>
                  <v-text-field
                    v-model="applyData.start_cuti"
                    variant="underlined"
                    density="compact"
                    append-inner-icon="mdi-calendar"
                    @click:appendInner="openStartCutiDatePicker"
                    placeholder="DD/MM/YYYY"
                    clearable
                    required
                    :rules="applyRules"
                  ></v-text-field>
                  <VDatePicker
                    v-model.string="applyData.start_cuti"
                    mode="date"
                    @dayclick="closeStartCutiDatePicker"
                    :masks="dateFormat"
                    :max-date="new Date()"
                    v-if="togglerHandler.isStartCutiDatePickerOpen"
                  >
                  </VDatePicker>
                </v-col>
                <v-col cols="3" v-click-outside="closeEndCutiDatePicker" v-if="isEndCuti">
                  <v-list-item-title>Tanggal Balik Cuti</v-list-item-title>
                  <v-list-item-subtitle> <i> Return Date </i> </v-list-item-subtitle>
                  <v-text-field
                    v-model="applyData.end_cuti"
                    variant="underlined"
                    density="compact"
                    append-inner-icon="mdi-calendar"
                    @click:appendInner="openEndCutiDatePicker"
                    placeholder="DD/MM/YYYY"
                    clearable
                    required
                    :rules="applyRules"
                  ></v-text-field>
                  <VDatePicker
                    v-model.string="applyData.end_cuti"
                    mode="date"
                    @dayclick="closeEndCutiDatePicker"
                    :masks="dateFormat"
                    :max-date="new Date()"
                    v-if="togglerHandler.isEndCutiDatePickerOpen"
                  >
                  </VDatePicker>
                </v-col>
                <v-col align-self="start" cols="3">
                  <v-checkbox label="Balik Cuti" v-model="isEndCuti"></v-checkbox>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="3" v-if="isDepart">
                  <v-list-item-title> Keberangkatan </v-list-item-title>
                  <v-list-item-subtitle> Departure </v-list-item-subtitle>
                  <v-text-field variant="underlined" placeholder="Kendari"> </v-text-field>
                </v-col>
                <v-col cols="3" v-if="isDepart">
                  <v-list-item-title> Kedatangan </v-list-item-title>
                  <v-list-item-subtitle> Arrival </v-list-item-subtitle>
                  <v-text-field variant="underlined" placeholder="Jakarta"> </v-text-field>
                </v-col>
                <v-col align-self="center">
                  <v-checkbox label="Berangkat" v-model="isDepart"></v-checkbox>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-else-if="getCurrentApplicationType.application_type == 'Resign'">
              <v-row dense>
                <v-col cols="3" v-click-outside="closeResignDatePicker">
                  <v-list-item-title>Tanggal Resign</v-list-item-title>
                  <v-list-item-subtitle> <i> Resign Date </i> </v-list-item-subtitle>
                  <v-text-field
                    v-model="EditResignDate"
                    variant="underlined"
                    density="compact"
                    append-inner-icon="mdi-calendar"
                    @click:appendInner="openResignDatePicker"
                    placeholder="DD/MM/YYYY"
                    clearable
                    required
                  ></v-text-field>
                  <VDatePicker
                    v-model.string="editResignDate"
                    mode="date"
                    @dayclick="closeResignDatePicker"
                    :masks="dateFormat"
                    :min-date="new Date()"
                    v-if="togglerHandler.isResignDatePickerOpen"
                  >
                  </VDatePicker>
                </v-col>
              </v-row>
            </v-col>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeEditPengajuanDialog">
                Close
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="closeEditPengajuanDialog">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import card_bg from '../../assets/crane_card_bg.jpg'
</script>

<script>
export default {
  data: () => ({
    karyawanExpand: ref(false),
    isLogKaryawanOpen: ref(false),
    isEditPengajuanOpen: ref(false),

    togglerHandler : {
      isStartCutiDatePickerOpen : ref(false),
      isEndCutiDatePickerOpen : ref(false),
      isResignDatePickerOpen : ref(false)
    },

    
    selectedKaryawan: {},
    search: ref(''),

    employees: [
      {
        nik: '1200012232500021',
        name: 'Andy',
        dob: '13/10/1998',
        pob: 'Jakarta',
        address: 'Jl. ',
        position: 'Operator Mixer',
        site: 'PT',
        join_date: '19/10/2020',
        status: 'Active',
        start_contract: '20/07/2023',
        end_contract: '20/01/2024',
        application_status: null,
        application_type: null,
      },
      {
        nik: '1200012232500021',
        name: 'Bob',
        dob: '11/04/1994',
        pob: 'Makassar',
        address: 'Jl. ',
        position: 'Operator Crane',
        site: 'PT',
        join_date: '19/10/2020',
        status: 'Close Project',
        start_contract: '13/03/2023',
        end_contract: '13/09/2023',
        application_status: null,
        application_type: null,
      },
      {
        nik: '1200012232500021',
        name: 'Alice',
        dob: '12/9/1994',
        pob: 'Tangerang',
        address: 'Jl. ',
        position: 'Jubir',
        site: 'PT',
        join_date: '19/10/2020',
        status: 'Warning',
        start_contract: '27/04/2023',
        end_contract: '27/10/2024',
        application_status: 'Pending',
        application_type: 'Resign',
      }
    ],
    headers: [
      {
        title: 'NIK',
        align: 'start',
        sortable: false,
        key: 'nik'
      },
      {
        title: 'Name',
        align: 'start',
        key: 'name'
      },
      {
        title: 'Jabatan',
        align: 'center',
        key: 'position'
      },
      {
        title: 'Penempatan',
        align: 'center',
        key: 'site'
      },
      {
        title: 'Tanggal Join',
        align: 'center',
        key: 'join_date'
      },
      {
        title: 'Status',
        align: 'center',
        key: 'status'
      }
    ],

    messages: [
      {
        date: '10/10/2023',
        start: '24/10/2023',
        end: '24/10/2023',
        message: `Ajukan Kompensasi`,
        color: 'deep-purple-lighten-1'
      },
      {
        date: '15/10/2023',
        message: `Ajukan Kompensasi Disetujui`,
        color: 'green'
      },
      {
        date: '24/10/2023',
        message: `Lanjut Kontrak`,
        color: 'blue-lighten-1'
      }
    ]
  }),
  methods: {
    getColor(status) {
      if (status == 'Warning') return 'orange'
      else if (status == 'Close Project') return 'red'
      else if (status == 'Cuti') return 'brown'
      else if (status == 'Resign') return 'black'
      else return 'green'
    },

    expandKaryawanDialog(item, row) {
      this.selectedKaryawan = row.item
      this.$store.commit('selectKaryawan', this.selectedKaryawan)
      this.karyawanExpand = true
    },

    // Karyawan Details
    shrinkKaryawanDialog() {
      this.$store.commit('selectKaryawan', {})
      this.karyawanExpand = false
    },

    openLogKaryawanDialog() {
      this.isLogKaryawanOpen = true
    },
    closeLogKaryawanDialog() {
      this.isLogKaryawanOpen = false
    },

    openEditPengajuanDialog() {
      this.isEditPengajuanOpen = true
    },
    closeEditPengajuanDialog() {
      this.isEditPengajuanOpen = false
    },

    getLogDates(messages) {
      const uniqueDates = [...new Set(messages.map((message) => message.date))]

      // Sort the unique dates in ascending order
      uniqueDates.sort((a, b) => {
        const dateA = new Date(a.split('/').reverse().join('/'))
        const dateB = new Date(b.split('/').reverse().join('/'))
        return dateB - dateA
      })

      return uniqueDates
    }
  },
  computed : {
    getCurrentApplicationType(){
      const editKaryawanFormData = {
        application_type : this.selectedKaryawan.application_type,
      }
     return editKaryawanFormData;
    },
  }
}
</script>

<style lang="scss" scoped>
.karyawan-header {
  @apply m-3;
}

.karyawan-contents {
  width: 100%;
}
</style>
