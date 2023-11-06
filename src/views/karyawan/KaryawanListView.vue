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
        <v-col cols="3">
          <v-text-field
            hide-details
            variant="underlined"
            density="compact"
            class="shrink"
            placeholder="Tanggal Join"
            readonly
            append-inner-icon="mdi-calendar"
            @click="togglerHandler.isJoinDateFilterOpen = !togglerHandler.isJoinDateFilterOpen"
            v-model="getJoinDateRange"
          >
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
          :items="filteredEmployees"
          :search="search"
          class="elavation-1"
          density="compact"
          item-key="nik"
          height="70vh"
          @click:row="expandKaryawanDialog"
          clearable
          hover
        >
          <template v-slot:[`item.join_date`]="{ value }">
            {{ value ? moment(getDateObj(value)).format('DD MMMM YYYY') : '' }}
          </template>

          <template v-slot:[`item.status`]="{ value }">
            <v-chip :color="getColor(value)" variant="flat" style="margin: 5px">
              {{ value }}
            </v-chip>
          </template>
          <template v-slot:[`item.application_status`]="{ value, item }">
            {{
              value
                ? `Ajukan ${item.application.application_type} (${this.applicationStatus[value]})`
                : item.status == 'Cuti' || item.status == 'Resign' || item.status == 'Cut Off'
                ? item.status
                : 'Belum Ajukan Form'
            }}
          </template>
        </v-data-table>

        <!-- Karyawan Details Dialog  -->
        <v-dialog
          v-model="togglerHandler.karyawanExpand"
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
                  <div v-if="selectedKaryawan.position == 'Operator Crane'">
                    <v-list-item>
                      <v-list-item-subtitle>Tonase</v-list-item-subtitle>
                      <v-list-item-title>{{
                        selectedKaryawan.tonnage ? `${selectedKaryawan.tonnage} T` : '-'
                      }}</v-list-item-title>
                    </v-list-item>
                  </div>
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
                  <v-list-item-subtitle
                    >Mulai
                    {{
                      selectedKaryawan.status == 'Cuti' ? 'Cuti' : 'Kontrak'
                    }}</v-list-item-subtitle
                  >
                  <v-list-item-title>{{ selectedKaryawan.start_contract }}</v-list-item-title>
                </v-list-item>
                <div
                  v-if="selectedKaryawan.end_contract"
                  style="display: flex; align-items: center"
                >
                  Sampai
                  <v-list-item>
                    <v-list-item-subtitle
                      >Akhir {{ selectedKaryawan.status == 'Cuti' ? 'Cuti' : 'Kontrak' }}
                    </v-list-item-subtitle>
                    <v-list-item-title>{{ selectedKaryawan.end_contract }}</v-list-item-title>
                  </v-list-item>
                </div>
              </v-row>

              <v-row align="center" style="margin: 0.05rem">
                <v-list-item>
                  <v-list-item-subtitle>Status</v-list-item-subtitle>
                  <v-chip
                    :color="getColor(selectedKaryawan.status)"
                    variant="flat"
                    style="margin-top: 5px"
                  >
                    {{ selectedKaryawan.status }}
                  </v-chip>
                </v-list-item>

                <div v-if="selectedKaryawan.status != 'Cuti'">
                  <v-list-item>
                    <v-list-item-subtitle>Status Pengajuan</v-list-item-subtitle>
                    {{
                      selectedKaryawan.application.application_type &&
                      selectedKaryawan.application_status
                        ? `Ajukan ${selectedKaryawan.application.application_type} (${this.getApplicationStatus})`
                        : '-'
                    }}
                  </v-list-item>
                </div>
                <div
                  style="display: flex"
                  v-else-if="
                    selectedKaryawan.status == 'Cuti' &&
                    selectedKaryawan.application.depart &&
                    selectedKaryawan.application.arrival
                  "
                >
                  <v-list-item>
                    <v-list-item-subtitle> Keberangkatan </v-list-item-subtitle>
                    {{ selectedKaryawan.application.depart }}
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-subtitle> Tujuan </v-list-item-subtitle>
                    {{ selectedKaryawan.application.arrival }}
                  </v-list-item>
                </div>
              </v-row>
            </div>

            <div class="karyawan-actions">
              <v-row style="margin: 1rem" v-if="getApplicationStatus == 'Pending'">
                <v-col cols="auto">
                  <v-btn> Pengajuan Disetujui </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn> Pengajuan Ditolak </v-btn>
                </v-col>
                <v-col cols="auto" @click="openEditPengajuanDialog">
                  <v-btn> Edit Form </v-btn>
                </v-col>
              </v-row>
              <v-row style="margin: 1rem" v-else-if="selectedKaryawan.status == 'Cuti'">
                <v-col cols="auto">
                  <v-btn @click="openReturnDateDialog">
                    {{ selectedKaryawan.end_contract ? 'Edit Return Date' : 'Set Return Date' }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row
                style="margin: 1rem"
                v-else-if="
                  (!selectedKaryawan.application_status && selectedKaryawan.status != 'Resign') ||
                  selectedKaryawan.status == 'Cut Off'
                "
              >
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

        <!-- Form Dialog -->
        <v-dialog v-model="togglerHandler.isLogKaryawanOpen" width="auto">
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

        <v-dialog v-model="togglerHandler.isEditPengajuanOpen" width="auto">
          <v-card width="700">
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
                  <v-list-item-title> Pengajuan </v-list-item-title>
                  <v-list-item-subtitle>
                    <i> Apply </i>
                  </v-list-item-subtitle>
                </v-col>
              </v-row>
              <v-form ref="editForm" lazy-validation>
                <v-row dense>
                  <v-radio-group
                    v-model="editFormData.application_type"
                    density="compact"
                    style="margin-top: 10px"
                    inline
                  >
                    <v-radio
                      label="Kompensasi"
                      value="Kompensasi"
                      style="margin-right: 1rem"
                    ></v-radio>
                    <v-radio label="Cuti" value="Cuti" style="margin-right: 1rem"></v-radio>
                    <v-radio label="Resign" value="Resign" style="margin-right: 1rem"></v-radio>
                  </v-radio-group>
                </v-row>

                <v-row dense>
                  <v-col v-if="editFormData.application_type == 'Kompensasi'">
                    <v-row dense>
                      <v-col>
                        <v-list-item-title> Mulai Kontrak </v-list-item-title>
                        <v-list-item-subtitle>
                          <i> Start Contract </i>
                        </v-list-item-subtitle>
                        <v-text-field
                          readonly
                          variant="underlined"
                          density="compact"
                          v-model="editFormData.start_contract"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col>
                        <v-list-item-title> Akhir Kontrak </v-list-item-title>
                        <v-list-item-subtitle>
                          <i> End Contract </i>
                        </v-list-item-subtitle>
                        <v-text-field
                          readonly
                          variant="underlined"
                          density="compact"
                          v-model="editFormData.end_contract"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col v-else-if="editFormData.application_type == 'Cuti'">
                    <v-row dense>
                      <v-col v-click-outside="closeStartCutiDatePicker">
                        <v-list-item-title>Tanggal Cuti</v-list-item-title>
                        <v-list-item-subtitle> <i> Leave Date </i> </v-list-item-subtitle>
                        <v-text-field
                          v-model="editFormData.start_cuti"
                          variant="underlined"
                          density="compact"
                          append-inner-icon="mdi-calendar"
                          @click:appendInner="openStartCutiDatePicker"
                          placeholder="DD/MM/YYYY"
                          clearable
                          required
                          :rules="rules.applyRules"
                        ></v-text-field>
                        <VDatePicker
                          v-model.string="editFormData.start_cuti"
                          mode="date"
                          @dayclick="closeStartCutiDatePicker"
                          :masks="dateFormat"
                          v-if="togglerHandler.isStartCutiDatePickerOpen"
                        >
                        </VDatePicker>
                      </v-col>
                      <v-col
                        v-click-outside="closeEndCutiDatePicker"
                        v-if="togglerHandler.isEndCuti"
                      >
                        <v-list-item-title>Tanggal Balik Cuti</v-list-item-title>
                        <v-list-item-subtitle> <i> Return Date </i> </v-list-item-subtitle>
                        <v-text-field
                          v-model="editFormData.end_cuti"
                          variant="underlined"
                          density="compact"
                          append-inner-icon="mdi-calendar"
                          @click:appendInner="openEndCutiDatePicker"
                          placeholder="DD/MM/YYYY"
                          clearable
                          required
                          :rules="rules.applyRules"
                        ></v-text-field>
                        <VDatePicker
                          v-model.string="editFormData.end_cuti"
                          mode="date"
                          @dayclick="closeEndCutiDatePicker"
                          :masks="dateFormat"
                          :min-date="getDateObj(editFormData.start_cuti)"
                          v-if="togglerHandler.isEndCutiDatePickerOpen"
                        >
                        </VDatePicker>
                      </v-col>
                      <v-col align-self="start">
                        <v-checkbox
                          label="Balik Cuti"
                          v-model="togglerHandler.isEndCuti"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <v-col v-if="togglerHandler.isDepart">
                        <v-list-item-title> Keberangkatan </v-list-item-title>
                        <v-list-item-subtitle> <i> Departure </i> </v-list-item-subtitle>
                        <v-text-field
                          variant="underlined"
                          placeholder="Kendari"
                          v-model="editFormData.depart"
                          :rules="rules.applyRules"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col v-if="togglerHandler.isDepart">
                        <v-list-item-title> Kedatangan </v-list-item-title>
                        <v-list-item-subtitle> <i> Arrival </i> </v-list-item-subtitle>
                        <v-text-field
                          variant="underlined"
                          placeholder="Jakarta"
                          v-model="editFormData.arrival"
                          :rules="rules.applyRules"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col align-self="center">
                        <v-checkbox
                          label="Berangkat"
                          v-model="togglerHandler.isDepart"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col v-else-if="editFormData.application_type == 'Resign'">
                    <v-row dense>
                      <v-col cols="5" v-click-outside="closeResignDatePicker">
                        <v-list-item-title>Tanggal Resign</v-list-item-title>
                        <v-list-item-subtitle> <i> Resign Date </i> </v-list-item-subtitle>
                        <v-text-field
                          v-model="editFormData.resign_date"
                          variant="underlined"
                          density="compact"
                          append-inner-icon="mdi-calendar"
                          @click:appendInner="openResignDatePicker"
                          placeholder="DD/MM/YYYY"
                          clearable
                          required
                          :rules="rules.applyRules"
                        ></v-text-field>
                        <VDatePicker
                          v-model.string="editFormData.resign_date"
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
                </v-row>
              </v-form>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeEditPengajuanDialog">
                Close
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="editApplyForm"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="togglerHandler.isReturnDateOpen" width="auto">
          <v-card width="700">
            <v-toolbar color="rgba(0, 0, 0, 0)" theme="light">
              <v-toolbar-title class="text-h6"> Return Date </v-toolbar-title>
              <template v-slot:append>
                <v-btn @click="closeReturnDateDialog" icon="Close">
                  <span class="material-symbols-outlined"> close </span>
                </v-btn>
              </template>
            </v-toolbar>
            <v-container>
              <v-form ref="endCutiForm" lazy-validate>
                <v-row dense>
                  <v-col v-click-outside="closeEndCutiDatePicker">
                    <v-list-item-title>Tanggal Balik Cuti</v-list-item-title>
                    <v-list-item-subtitle> <i> Return Date </i> </v-list-item-subtitle>
                    <v-text-field
                      v-model="setReturnData.returnDate"
                      variant="underlined"
                      density="compact"
                      append-inner-icon="mdi-calendar"
                      @click:appendInner="openEndCutiDatePicker"
                      placeholder="DD/MM/YYYY"
                      clearable
                      required
                      :rules="rules.applyRules"
                    ></v-text-field>
                    <VDatePicker
                      v-model.string="setReturnData.returnDate"
                      mode="date"
                      @dayclick="closeEndCutiDatePicker"
                      :masks="dateFormat"
                      :min-date="getDateObj(selectedKaryawan.start_contract)"
                      v-if="togglerHandler.isEndCutiDatePickerOpen"
                    >
                    </VDatePicker>
                  </v-col>
                </v-row>
                <v-row dense v-if="selectedKaryawan.application.depart">
                  <v-col>
                    <v-list-item-title> Keberangkatan </v-list-item-title>
                    <v-list-item-subtitle> <i> Departure </i> </v-list-item-subtitle>
                    <v-text-field
                      variant="underlined"
                      placeholder="Jakarta"
                      v-model="selectedKaryawan.application.arrival"
                      readonly
                    >
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-list-item-title> Kedatangan </v-list-item-title>
                    <v-list-item-subtitle> <i> Arrival </i> </v-list-item-subtitle>
                    <v-text-field
                      variant="underlined"
                      placeholder="Kendari"
                      v-model="selectedKaryawan.application.depart"
                      readonly
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeReturnDateDialog">
                Close
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="closeReturnDateDialog">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="togglerHandler.isJoinDateFilterOpen" width="auto">
          <v-date-picker v-model.range="joinDateRange">
            <template #footer>
              <v-btn style="background-color: var(--secondary); width : auto ; margin : 1rem" @click="clearJoinDateRange"> 
                Clear 
              </v-btn>
            </template>
          </v-date-picker>
        </v-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import moment from 'moment'

import { cloneDeep, clone } from 'lodash'

import card_bg from '../../assets/crane_card_bg.jpg'

import { karyawanMixin } from '../../mixins/karyawanMixin'
</script>

<script>
export default {
  mixins: [karyawanMixin],
  data: () => ({
    togglerHandler: {
      karyawanExpand: ref(false),
      isLogKaryawanOpen: ref(false),
      isEditPengajuanOpen: ref(false),
      isReturnDateOpen: ref(false),
      isStartCutiDatePickerOpen: ref(false),
      isEndCutiDatePickerOpen: ref(false),
      isResignDatePickerOpen: ref(false),
      isEndCuti: ref(false),
      isDepart: ref(false),
      isJoinDateFilterOpen: ref(false)
    },

    selectedKaryawan: ref({}),
    editFormData: ref({}),
    setReturnData: ref({}),

    search: ref(''),

    joinDateRange: ref({
      start: ref(null),
      end: ref(null)
    }),

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
      },
      {
        title: 'Pengajuan',
        align: 'center',
        key: 'application_status'
      }
    ],

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
        application: {
          application_type: null,
          start_contract: null,
          end_contract: null,
          start_cuti: null,
          end_cuti: null,
          depart: null,
          arrival: null,
          resign_date: null
        }
      },
      {
        nik: '1200012232500021',
        name: 'Bob',
        dob: '11/04/1994',
        pob: 'Makassar',
        address: 'Jl. ',
        position: 'Operator Crane',
        tonnage: '80',
        site: 'PT',
        join_date: '19/10/2020',
        status: 'Close Project',
        start_contract: '13/03/2023',
        end_contract: '13/09/2023',
        application_status: -1,
        application: {
          application_type: 'Kompensasi',
          start_contract: '14/09/2023',
          end_contract: '14/03/2023',
          start_cuti: null,
          end_cuti: null,
          depart: null,
          arrival: null,
          resign_date: null
        }
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
        end_contract: '27/10/2023',
        application_status: -1,
        application: {
          application_type: 'Cuti',
          start_contract: null,
          end_contract: null,
          start_cuti: '28/10/2023',
          end_cuti: null,
          depart: null,
          arrival: null,
          resign_date: null
        }
      },
      {
        nik: '1200012232500021',
        name: 'Bobby',
        dob: '20/6/1994',
        pob: 'Denpasar',
        address: 'Jl. ',
        position: 'Mekanik Junior',
        site: 'PT',
        join_date: '19/10/2020',
        status: 'Cuti',
        start_contract: '27/04/2023',
        end_contract: null,
        application_status: null,
        application: {
          application_type: null,
          start_contract: null,
          end_contract: null,
          start_cuti: '27/04/2023',
          end_cuti: null,
          depart: null,
          arrival: null,
          resign_date: null
        }
      },
      {
        nik: '1200012232500021',
        name: 'Connie',
        dob: '10/5/1999',
        pob: 'Kendari',
        address: 'Jl. ',
        position: 'Admin',
        site: 'PT',
        join_date: '20/10/2023',
        status: 'Cuti',
        start_contract: '27/04/2023',
        end_contract: '10/05/2023',
        application_status: null,
        application: {
          application_type: null,
          start_contract: null,
          end_contract: null,
          start_cuti: '20/10/2023',
          end_cuti: '5/11/2023',
          depart: 'Kendari',
          arrival: 'Jakarta',
          resign_date: null
        }
      },
      {
        nik: '1200012232500021',
        name: 'Conrad',
        dob: '14/04/1989',
        pob: 'Manado',
        address: 'Jl. ',
        position: 'Tyreman',
        site: 'PT',
        join_date: '20/10/2019',
        status: 'Resign',
        start_contract: '30/04/2023',
        end_contract: null,
        application_status: null,
        application: {
          application_type: null,
          start_contract: null,
          end_contract: null,
          start_cuti: null,
          end_cuti: null,
          depart: null,
          arrival: null,
          resign_date: null
        }
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
    ],

    rules: {
      applyRules: [(value) => !!value || '*Required']
    }
  }),
  methods: {
    getColor(status) {
      if (status == 'Warning') return 'orange'
      else if (status == 'Close Project') return 'red'
      else if (status == 'Cuti') return 'yellow'
      else if (status == 'Resign') return 'black'
      else if (status == 'Cut Off') return 'brown'
      else return 'green'
    },

    // Clear Join Date Range
    clearJoinDateRange(){
      this.joinDateRange.start = null
      this.joinDateRange.end = null
      this.togglerHandler.isJoinDateFilterOpen = false
    },

    // Karyawan Details Dialog
    expandKaryawanDialog(item, row) {
      this.selectedKaryawan = row.item
      this.$store.commit('selectKaryawan', this.selectedKaryawan)
      this.togglerHandler.karyawanExpand = true
    },

    // Karyawan Details
    shrinkKaryawanDialog() {
      this.$store.commit('selectKaryawan', {})
      this.togglerHandler.karyawanExpand = false
    },

    // Log Karyawan Handler
    openLogKaryawanDialog() {
      this.togglerHandler.isLogKaryawanOpen = true
    },
    closeLogKaryawanDialog() {
      this.togglerHandler.isLogKaryawanOpen = false
    },

    // Edit Pengajuan Handler
    openEditPengajuanDialog() {
      this.editFormData = this.getCurrentApplication

      this.editFormData.start_contract = this.setStartContractDate
      this.editFormData.end_contract = this.setEndContractDate

      this.togglerHandler.isEditPengajuanOpen = true
    },
    closeEditPengajuanDialog() {
      this.togglerHandler.isEditPengajuanOpen = false
    },

    // Add Return Date Handler
    openReturnDateDialog() {
      this.setReturnData.returnDate = this.getReturnDate
      this.togglerHandler.isReturnDateOpen = true
    },
    closeReturnDateDialog() {
      this.togglerHandler.isReturnDateOpen = false
    },

    // Date Picker Handler
    openEndCutiDatePicker() {
      try {
        if (this.editFormData.start_cuti) {
          this.getDateObj(this.editFormData.start_cuti)
          this.togglerHandler.isEndCutiDatePickerOpen = true
        } else {
          throw new Error('Tanggal Cuti is Required')
        }
      } catch (err) {
        alert(err.message)
      }
    },

    closeEndCutiDatePicker() {
      this.togglerHandler.isEndCutiDatePickerOpen = false
    },

    openStartCutiDatePicker() {
      this.togglerHandler.isStartCutiDatePickerOpen = true
    },

    closeStartCutiDatePicker() {
      this.togglerHandler.isStartCutiDatePickerOpen = false
    },

    openResignDatePicker() {
      this.togglerHandler.isResignDatePickerOpen = true
    },

    closeResignDatePicker() {
      this.togglerHandler.isResignDatePickerOpen = false
    },

    // Get Log Dates to filter the log message
    getLogDates(messages) {
      const uniqueDates = [...new Set(messages.map((message) => message.date))]

      // Sort the unique dates in descending order
      uniqueDates.sort((a, b) => {
        const dateA = new Date(a.split('/').reverse().join('/'))
        const dateB = new Date(b.split('/').reverse().join('/'))
        return dateB - dateA
      })

      return uniqueDates
    },

    // Submit Edit Form
    async editApplyForm() {
      const { valid } = await this.$refs.editForm.validate()
      if (valid) {
        console.log('Edited')
        console.log(this.editFormData)
      }
    }
  },

  computed: {
    // Filter the Employees
    filteredEmployees(){
      const start = this.joinDateRange.start
      const end = this.joinDateRange.end
      if(start && end){
        return this.employees.filter((employee) =>{
          const joinDate = this.getDateObj(employee.join_date)
          return joinDate >= start && joinDate <= end;
        })
      }
      return this.employees
    },

    // Set Up Form Data in Edit Application
    getCurrentApplication() {
      if (this.selectedKaryawan) {
        const karyawan = this.selectedKaryawan
        if (karyawan && karyawan.application_status) {
          return cloneDeep(karyawan.application)
        }
      }
      return null
    },
    // Set Up return date (Cuti)
    getReturnDate() {
      if (this.selectedKaryawan.end_contract && this.selectedKaryawan.status == 'Cuti') {
        return clone(this.selectedKaryawan.end_contract)
      }
      return null
    },

    getJoinDateRange() {
      if(this.joinDateRange.start && this.joinDateRange.end){    
        return `${moment(this.joinDateRange.start).format('DD/MM/YYYY')} - ${moment(
          this.joinDateRange.end
        ).format('DD/MM/YYYY')}`
      }
      return null
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
