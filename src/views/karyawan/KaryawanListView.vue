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
          <v-btn rounded style="background-color: var(--primary)" @click="this.$router.push('karyawan/create')">
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
                  <v-btn>
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
                <v-col cols="auto">
                  <v-btn> Edit Form </v-btn>
                </v-col>
              </v-row>
              <v-row style="margin: 1rem" v-else>
                <v-col cols="auto">
                    <v-btn
                      @click="this.$router.push({name : 'Pengajuan' , query : {name : selectedKaryawan.name}})"
                    > Ajukan Form </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-sheet>
        </v-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
</script>

<script>
export default {
  data: () => ({
    karyawanExpand: ref(false),
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
        application_type: null,
        application_status: null
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
        application_type: 'Kompensasi',
        application_status: 'Pending'
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
        application_type: 'Resign',
        application_status: 'Pending'
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
      this.$store.commit('selectKaryawan' , {})
      this.karyawanExpand = false
    }
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
