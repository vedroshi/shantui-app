<template>
  <div>
    <div class="karyawan-header">
      <v-row justify="end" dense>
        <!-- Search -->
        <v-col cols="3">
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

        <v-col cols="2">
          <v-text-field
            hide-details
            variant="underlined"
            density="compact"
            class="shrink"
            placeholder="Akhir Kontrak"
            readonly
            append-inner-icon="mdi-calendar"
            @click="togglerHandler.isEndContractFilterOpen = !togglerHandler.isEndContractFilterOpen"
            v-model="getEndContractRange"
          >
          </v-text-field>
        </v-col>

        <!-- Filter Join Date -->
        <v-col cols="2">
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

        <!-- Add New Employee -->
        <v-col cols="auto" align-self="center">
          <v-btn
            rounded
            style="background-color: var(--primary)"
            @click="this.$router.push('karyawan/create')"
          >
            <span class="material-symbols-outlined"> add </span>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div class="karyawan-contents">
      <div class="karyawan-table">

        <!-- Karyawan Data table -->
        <v-data-table
          :headers="headers"
          :items="filteredEmployees"
          :search="search"
          class="elavation-1"
          density="compact"
          item-key="NIK"
          height="73vh"
          @click:row="expandKaryawanDialog"
          clearable
          hover
        >

          <template v-slot:[`item.Status.Start`]="{ value }">
            {{ value ? moment(getDateObj(value)).format('DD MMMM YYYY') : '' }}
          </template>
          
          <template v-slot:[`item.Status.End`]="{ value }">
            {{ value ? moment(getDateObj(value)).format('DD MMMM YYYY') : '' }}
          </template>

          <template v-slot:[`item.Status.Status`]="{ value }">
            <v-chip :color="getColor(value)" variant="flat" style="margin: 5px">
              {{ value }}
            </v-chip>
          </template>
          
          <template v-slot:[`item.Application.Application_Status`]="{ value, item }">
            {{
              value && item.Application.Application_Type != "Return"
                ? `Ajukan ${item.Application.Application_Type} (${item.Application.Application_Status})`
                : item.Status.Status == 'Cuti' ||
                  item.Status.Status == 'Resign' ||
                  item.Status.Status == 'Cut Off'
                ? `${item.Status.Status} tanggal ${moment(getDateObj(item.Status.Start)).format('DD MMMM YYYY')}`
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
            <v-toolbar-title>{{ selectedKaryawan.Name }}</v-toolbar-title>
          </v-toolbar>
          <v-sheet class="karyawan-details">
            <v-row style="margin: 1rem">
              <!-- KTP Image -->
              <v-card width="300" height="150"> 
                <v-img
                  :src="karyawanURL + '/karyawan/getKTP/' + selectedKaryawan.KTP"
                  contain
                  class="height-100 width-100"
                > 
                </v-img>
              </v-card>
              <!-- Header Profile -->
              <v-col align-self="start">
                <v-row>
                  <v-list-item>
                    <v-list-item-subtitle>NIK</v-list-item-subtitle>
                    <v-list-item-title>{{ selectedKaryawan.NIK }}</v-list-item-title>
                  </v-list-item>
                </v-row>
                <v-row>
                  <v-list-item>
                    <v-list-item-subtitle>Nama</v-list-item-subtitle>
                    <v-list-item-title>{{ selectedKaryawan.Name }}</v-list-item-title>
                  </v-list-item>
                </v-row>
                <v-row>
                  <v-list-item>
                    <v-list-item-subtitle>Posisi</v-list-item-subtitle>
                    <v-list-item-title>{{ selectedKaryawan.Position.Name }}</v-list-item-title>
                  </v-list-item>
                  <div v-if="selectedKaryawan.Position.Tonnage">
                    <v-list-item>
                      <v-list-item-subtitle>Tonase</v-list-item-subtitle>
                      <v-list-item-title
                        >{{ selectedKaryawan.Position.Name == "Operator Excavator" ? 'PC' : ''}} 
                        {{ selectedKaryawan.Position.Tonnage }} 
                        {{ selectedKaryawan.Position.Name == "Operator Excavator" ? '' : 'Ton'}}
                      </v-list-item-title>
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
                <v-row justify="end" style="margin-bottom: 1rem" v-if="selectedKaryawan.Status.Status == 'Active' ">
                  <v-btn @click="downloadContract">
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
                  >{{ selectedKaryawan.POB }},
                  {{ formatDate(selectedKaryawan.DOB) }}</v-list-item-title
                >
              </v-list-item>

              <v-list-item>
                <v-list-item-subtitle>Alamat</v-list-item-subtitle>
                <v-list-item-title>{{ selectedKaryawan.Address }}</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <v-list-item-subtitle>Penempatan</v-list-item-subtitle>
                <v-list-item-title>{{ selectedKaryawan.Company.Site.Name }}</v-list-item-title>
              </v-list-item>

              <!-- Join Date -->
              <v-list-item>
                <v-list-item-subtitle>Tanggal Join</v-list-item-subtitle>
                <v-list-item-title>{{ formatDate(selectedKaryawan.Join_Date) }}</v-list-item-title>
              </v-list-item>

              <!-- Contract Date -->
              <v-row align="center" style="margin: 0.05rem">
                <v-list-item>
                  <v-list-item-subtitle
                    >
                    {{
                      selectedKaryawan.Status.Status == 'Cuti' ? 'Mulai Cuti':
                      selectedKaryawan.Status.Status == 'Resign' ? 'Tanggal Resign':
                      selectedKaryawan.Status.Status == 'Cut Off' ? 'Tanggal Cut Off':
                      'Mulai Kontrak'
                    }}</v-list-item-subtitle
                  >
                  <v-list-item-title>{{
                    formatDate(selectedKaryawan.Status.Start)
                  }}</v-list-item-title>
                </v-list-item>
                <div v-if="selectedKaryawan.Status.End" style="display: flex; align-items: center">
                  Sampai
                  <v-list-item>
                    <v-list-item-subtitle
                      >Akhir {{ selectedKaryawan.Status.Status == 'Cuti' ? 'Cuti' : 'Kontrak' }}
                    </v-list-item-subtitle>
                    <v-list-item-title>{{
                      formatDate(selectedKaryawan.Status.End)
                    }}</v-list-item-title>
                  </v-list-item>
                </div>
              </v-row>

              <v-row align="center" style="margin: 0.05rem">
                <!-- Employee Status -->
                <v-list-item>
                  <v-list-item-subtitle>Status</v-list-item-subtitle>
                  <v-chip
                    :color="getColor(selectedKaryawan.Status.Status)"
                    variant="flat"
                    style="margin-top: 5px"
                  >
                    {{ selectedKaryawan.Status.Status }}
                  </v-chip>
                </v-list-item>

                <!-- Application Status -->
                <div v-if="selectedKaryawan.Status.Status != 'Cuti'">
                  <v-list-item>
                    <v-list-item-subtitle>Status Pengajuan</v-list-item-subtitle>
                    {{
                      selectedKaryawan.Application.Application_Type &&
                      selectedKaryawan.Application.Application_Status
                        ? `Ajukan ${selectedKaryawan.Application.Application_Type} (${selectedKaryawan.Application.Application_Status})`
                        : '-'
                    }}
                  </v-list-item>
                </div>

                <!-- Show the Application Date -->
                <div
                  v-if="selectedKaryawan.Application.Application_Type == 'Kompensasi'"
                  style="display: flex"
                >
                  <v-list-item>
                    <v-list-item-subtitle>Tanggal Lanjut Kontrak</v-list-item-subtitle>
                    {{ formatDate(selectedKaryawan.Application.Start) }} -
                    {{ formatDate(selectedKaryawan.Application.End) }}
                  </v-list-item>
                </div>

                <div
                  v-if="selectedKaryawan.Application.Application_Type == 'Cuti'"
                  style="display: flex"
                >
                  <v-list-item>
                    <v-list-item-subtitle>Tanggal Mulai Cuti</v-list-item-subtitle>
                    {{ formatDate(selectedKaryawan.Application.Start) }}
                  </v-list-item>
                  <v-list-item v-if="selectedKaryawan.Application.End">
                    <v-list-item-subtitle>Tanggal Akhir Cuti</v-list-item-subtitle>
                    {{ formatDate(selectedKaryawan.Application.End) }}
                  </v-list-item>
                  <v-list-item v-if="selectedKaryawan.Application.Depart">
                    <v-list-item-subtitle>Keberangkatan</v-list-item-subtitle>
                    {{ selectedKaryawan.Application.Depart }}
                  </v-list-item>
                  <v-list-item v-if="selectedKaryawan.Application.Arrival">
                    <v-list-item-subtitle>Kedatangan</v-list-item-subtitle>
                    {{ selectedKaryawan.Application.Arrival }}
                  </v-list-item>
                </div>

                <div
                  v-if="selectedKaryawan.Application.Application_Type == 'Resign'"
                  style="display: flex"
                >
                  <v-list-item>
                    <v-list-item-subtitle>Tanggal Resign</v-list-item-subtitle>
                    {{ formatDate(selectedKaryawan.Application.Start) }}
                  </v-list-item>
                </div>

                <!-- Depart and Arrival when employee is 'Cuti' -->
                <div
                  style="display: flex"
                  v-else-if="
                    selectedKaryawan.Status.Status == 'Cuti' &&
                    selectedKaryawan.Application.Depart &&
                    selectedKaryawan.Application.Arrival
                  "
                >
                  <v-list-item>
                    <v-list-item-subtitle> Keberangkatan </v-list-item-subtitle>
                    {{ selectedKaryawan.Application.Depart }}
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-subtitle> Tujuan </v-list-item-subtitle>
                    {{ selectedKaryawan.Application.Arrival }}
                  </v-list-item>
                </div>
              </v-row>
            </div>

            <div class="karyawan-actions">
              <v-row v-if="selectedKaryawan.Application.Application_Status == 'Pending'"
                style="margin: 1rem"
              >
                <v-col cols="auto">
                  <v-btn @click="approveForm"> Pengajuan Disetujui </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn @click="rejectForm"> Pengajuan Ditolak </v-btn>
                </v-col>
                <v-col cols="auto" @click="openEditPengajuanDialog">
                  <v-btn> Edit Form </v-btn>
                </v-col>
              </v-row>
              <v-row style="margin: 1rem" v-else-if="selectedKaryawan.Status.Status == 'Cuti'">
                <v-col cols="auto">
                  <v-btn @click="openReturnDateDialog">
                    {{ selectedKaryawan.Status.End ? 'Ubah Balik Cuti' : 'Atur Balik Cuti' }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row
                v-else-if="
                  ( !selectedKaryawan.Application.Application_Status && selectedKaryawan.Status.Status != 'Resign' && selectedKaryawan.Status.Status != 'Cut Off')
                "
                style="margin: 1rem"
              >
                <v-col cols="auto">
                  <v-btn
                    @click="
                      this.$router.push({
                        name: 'Pengajuan',
                        query: { name: selectedKaryawan.Name }
                      })
                    "
                  >
                    Ajukan Form
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn @click="togglerHandler.isCutOffDialogOpen = true">
                    Cut Off
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-sheet>
        </v-dialog>

        <!-- Log Karyawan Dialog -->
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
                    <b> Nama : {{ selectedKaryawan.Name }} </b>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col>
                    <b> Jabatan : {{ selectedKaryawan.Position.Name }} </b>
                  </v-col>
                </v-row>
              </v-card>
            </v-img>

            <v-card-text style="overflow-y: scroll; padding: 0rem">
              <v-list>
                <v-list-item v-for="date in getLogDates(selectedKaryawan.Logs)" :key="date">
                  <div class="font-weight-bold ms-1 mb-2">{{ date }}</div>
                  <v-timeline density="compact" align="start" line-inset="0">
                    <v-timeline-item
                      v-for="log in selectedKaryawan.Logs.filter((log) => revertDate(log.CreatedAt) == date).reverse()"
                      :key="log.CreatedAt"
                      :dot-color="
                        log.Type == 'Contract' ? 'green' : 
                        log.Type == 'Cuti' ? 'yellow' :
                        log.Type == 'Apply' ? 'blue-lighten-1' : 
                        log.Type == 'Resign' ? 'black' : 
                        log.Type == 'Edit' ? 'blue' :
                        log.Type == 'Accept' ? 'green-lighten-3' : 
                        log.Type == 'Reject' ? 'red' :
                        'grey'
                      "
                      size="x-small"
                    >
                      <div class="mb-4">
                        <div>{{ log.Message }}</div>
                        <div class="font-weight-normal" v-if="log.Type == 'Contract'">
                          <strong
                            >{{ log.Start ? revertDate(log.Start) : '' }} {{ log.End ? '-' : '' }}
                            {{ log.End ? revertDate(log.End) : '' }}
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

        <!-- Edit Application Dialog -->
        <v-dialog persistent v-model="togglerHandler.isEditPengajuanOpen" width="auto">
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
                    v-model="editFormData.Application_Type"
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
                  <v-col v-if="editFormData.Application_Type == 'Kompensasi'">
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
                          v-model="editFormData.Start_Contract"
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
                          v-model="editFormData.End_Contract"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col v-else-if="editFormData.Application_Type == 'Cuti'">
                    <v-row dense>
                      <v-col v-click-outside="closeStartCutiDatePicker">
                        <v-list-item-title>Tanggal Cuti</v-list-item-title>
                        <v-list-item-subtitle> <i> Leave Date </i> </v-list-item-subtitle>
                        <v-text-field
                          v-model="editFormData.Start_Cuti"
                          variant="underlined"
                          density="compact"
                          append-inner-icon="mdi-calendar"
                          @click:appendInner="openStartCutiDatePicker"
                          placeholder="DD/MM/YYYY"
                          clearable
                          required
                          :rules="[
                            (value) => this.required(value),
                            (value) => this.isDateValid(value),
                            (value) => this.endDateValidation(value, this.revertDate(this.selectedKaryawan.Status.Start))
                          ]"
                        ></v-text-field>
                        <VDatePicker
                          v-model.string="editFormData.Start_Cuti"
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
                          v-model="editFormData.End_Cuti"
                          variant="underlined"
                          density="compact"
                          append-inner-icon="mdi-calendar"
                          @click:appendInner="openEndCutiDatePicker(editFormData.Start_Cuti)"
                          placeholder="DD/MM/YYYY"
                          clearable
                          required
                          :rules="[
                            (value) => this.required(value),
                            (value) => this.isDateValid(value),
                            (value) => this.endDateValidation(value, editFormData.Start_Cuti),
                            (value) => this.isDifferentValue(value)
                          ]"
                        ></v-text-field>
                        <VDatePicker
                          v-model.string="editFormData.End_Cuti"
                          mode="date"
                          @dayclick="closeEndCutiDatePicker"
                          :masks="dateFormat"
                          :min-date="getDateObj(convertDate(editFormData.Start_Cuti))"
                          v-if="togglerHandler.isEndCutiDatePickerOpen"
                        >
                        </VDatePicker>
                      </v-col>
                      <!-- End Cuti Checkbox -->
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
                          v-model="editFormData.Depart"
                          :rules="[(value) => this.required(value)]"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col v-if="togglerHandler.isDepart">
                        <v-list-item-title> Kedatangan </v-list-item-title>
                        <v-list-item-subtitle> <i> Arrival </i> </v-list-item-subtitle>
                        <v-text-field
                          variant="underlined"
                          placeholder="Jakarta"
                          v-model="editFormData.Arrival"
                          :rules="[
                            (value) => this.required(value),
                            (value) => this.isSameValidation(value, editFormData.Depart)
                          ]"
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
                  <v-col v-else-if="editFormData.Application_Type == 'Resign'">
                    <v-row dense>
                      <v-col cols="5" v-click-outside="closeResignDatePicker">
                        <v-list-item-title>Tanggal Resign</v-list-item-title>
                        <v-list-item-subtitle> <i> Resign Date </i> </v-list-item-subtitle>
                        <v-text-field
                          v-model="editFormData.Resign_Date"
                          variant="underlined"
                          density="compact"
                          append-inner-icon="mdi-calendar"
                          @click:appendInner="openResignDatePicker"
                          placeholder="DD/MM/YYYY"
                          clearable
                          required
                          :rules="[
                            (value) => this.required(value),
                            (value) => this.isDateValid(value)
                          ]"
                        ></v-text-field>
                        <VDatePicker
                          v-model.string="editFormData.Resign_Date"
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

        <!-- Edit Return Date Dialog -->
        <v-dialog persistent v-model="togglerHandler.isReturnDateOpen" width="auto">
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
                <v-row>
                  <v-radio-group
                    v-model="setReturnData.Type"
                    density="compact"
                    style="margin-top: 10px; margin-left: 10px"
                    inline
                  >
                    <v-radio label="Balik Cuti" value="Return" style="margin-right: 1rem"></v-radio>
                    <v-radio label="Cut Off" value="Cut Off" style="margin-right: 1rem"></v-radio>
                  </v-radio-group>
                </v-row>
                <v-row dense>
                  <v-col v-click-outside="closeEndCutiDatePicker">
                    <v-list-item-title> Tanggal {{ setReturnData.Type == 'Return' ? 'Balik Cuti' : 'Cut Off' }} </v-list-item-title>
                    <v-list-item-subtitle> <i> {{setReturnData.Type == "Return" ? "Return Date" : "Cut Off Date"}} </i> </v-list-item-subtitle>
                    <v-text-field
                      v-model="setReturnData.Date"
                      variant="underlined"
                      density="compact"
                      append-inner-icon="mdi-calendar"
                      @click:appendInner="
                        openEndCutiDatePicker(revertDate(selectedKaryawan.Status.Start))
                      "
                      placeholder="DD/MM/YYYY"
                      clearable
                      required
                      :rules="[
                        (value) => this.required(value),
                        (value) => this.isDateValid(value),
                        (value) => this.endDateValidation(value, revertDate(selectedKaryawan.Status.Start))
                      ]"
                    ></v-text-field>
                    <VDatePicker
                      v-model.string="setReturnData.Date"
                      mode="date"
                      @dayclick="closeEndCutiDatePicker"
                      :masks="dateFormat"
                      :min-date="getDateObj(selectedKaryawan.Status.Start)"
                      v-if="togglerHandler.isEndCutiDatePickerOpen"
                    >
                    </VDatePicker>
                  </v-col>
                </v-row>
                <v-row dense v-if="selectedKaryawan.Application.Depart">
                  <v-col>
                    <v-list-item-title> Keberangkatan </v-list-item-title>
                    <v-list-item-subtitle> <i> Departure </i> </v-list-item-subtitle>
                    <v-text-field
                      variant="underlined"
                      placeholder="Jakarta"
                      v-model="selectedKaryawan.Application.Arrival"
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
                      v-model="selectedKaryawan.Application.Depart"
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
              <v-btn color="blue-darken-1" variant="text" @click="setReturnDate"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

         <!-- Cut Off Dialog -->
         <v-dialog v-model="togglerHandler.isCutOffDialogOpen" width="auto">
          <v-card width="700">
            <v-toolbar color="rgba(0, 0, 0, 0)" theme="light">
                <v-toolbar-title class="text-h6"> Cut Off </v-toolbar-title>
                <template v-slot:append>
                  <v-btn @click="closeCutOffDialog" icon="Close">
                    <span class="material-symbols-outlined"> close </span>
                  </v-btn>
                </template>
            </v-toolbar>
            <v-container>
              <v-form ref="cutoffForm" lazy-validate>
                <v-row>
                  <v-col>
                    <v-list-item-title>Tanggal Cut Off</v-list-item-title>
                    <v-list-item-subtitle> <i>Date of Cut Off</i> </v-list-item-subtitle>
                    <v-text-field
                      v-model="cutOffFormData.Date"
                      variant="underlined"
                      density="compact"
                      append-inner-icon="mdi-calendar"
                      @click:appendInner="
                        togglerHandler.isCutOffDatePickerOpen = true
                      "
                      placeholder="DD/MM/YYYY"
                      clearable
                      required
                      :rules="[
                        (value) => this.required(value),
                        (value) => this.isDateValid(value),
                      ]"
                    ></v-text-field>
                    <VDatePicker
                      v-model.string="cutOffFormData.Date"
                      mode="date"
                      @dayclick="togglerHandler.isCutOffDatePickerOpen = false"
                      :masks="dateFormat"
                      v-if="togglerHandler.isCutOffDatePickerOpen"
                    >
                    </VDatePicker>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeCutOffDialog">
                Close
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="submitCutOffForm"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Filter Join Date Dialog -->
        <v-dialog v-model="togglerHandler.isJoinDateFilterOpen" width="auto">
          <v-date-picker v-model.range="joinDateRange">
            <template #footer>
              <v-btn
                style="background-color: var(--secondary); width: auto; margin: 1rem"
                @click="clearJoinDateRange"
              >
                Clear
              </v-btn>
            </template>
          </v-date-picker>
        </v-dialog>

        <!-- Filter End Contract Dialog -->
        <v-dialog v-model="togglerHandler.isEndContractFilterOpen" width="auto">
          <v-date-picker v-model.range="endContractRange">
            <template #footer>
              <v-btn
                style="background-color: var(--secondary); width: auto; margin: 1rem"
                @click="clearEndContractRange"
              >
                Clear
              </v-btn>
            </template>
          </v-date-picker>
        </v-dialog>
        
      </div>
    </div>
    
    <SnackbarView
      v-model:snackbarAttribute="snackbarAttribute"
      @update:snackbarAttribute="updateSnackbarAttribute"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import moment from 'moment'
import axios from 'axios'

import { clone } from 'lodash'
import { saveAs } from 'file-saver'

import card_bg from '../../assets/crane_card_bg.jpg'

import { karyawanMixin } from '../../mixins/karyawanMixin'
import { validationMixin } from '../../mixins/validationMixin'
import SnackbarView from '../../components/SnackbarView.vue'

</script>

<script>
export default {
  mixins: [karyawanMixin, validationMixin],
  data: () => ({

    togglerHandler: {
      karyawanExpand: ref(false),
      isLogKaryawanOpen: ref(false),
      isEditPengajuanOpen: ref(false),
      isReturnDateOpen: ref(false),
      isStartCutiDatePickerOpen: ref(false),
      isEndCutiDatePickerOpen: ref(false),
      isResignDatePickerOpen: ref(false),
      isReturnCutiDatePickerOpen : ref(false),
      isEndCuti: ref(false),
      isDepart: ref(false),
      isJoinDateFilterOpen: ref(false),
      isEndContractFilterOpen : ref(false),
      isCutOffDialogOpen : ref(false),
      isCutOffDatePickerOpen : ref(false)
    },

    snackbarAttribute: {
      isSnackbarOpen: ref(false),
      isSuccess: ref(null),
      message: ref(null)
    },

    selectedKaryawan: ref({}),

    editFormData: ref({}),
    setReturnData: ref({}),
    extendFormData: ref({}),
    cutOffFormData : ref({}),

    search: ref(''),

    joinDateRange: ref({
      start: ref(null),
      end: ref(null)
    }),

    endContractRange : ref({
      start:ref(null),
      end: ref(null)
    }),

    employees: ref([]),

    headers: [
      {
        title: 'NIK',
        align: 'start',
        sortable: false,
        key: 'NIK'
      },
      {
        title: 'Name',
        align: 'start',
        key: 'Name'
      },
      {
        title: 'Jabatan',
        align: 'center',
        key: 'Position.Name'
      },
      {
        title: 'Mulai Kontrak',
        align: 'center',
        key: 'Status.Start'
      },
      {
        title: 'Akhir Kontrak',
        align: 'center',
        key: 'Status.End'
      },
      {
        title: 'Status',
        align: 'center',
        key: 'Status.Status'
      },
      {
        title: 'Pengajuan',
        align: 'center',
        key: 'Application.Application_Status'
      }
    ],

  }),
  watch: {
    // Clear the form if "Application_Type" is changed
    'editFormData.Application_Type': function (newType, oldType) {
      this.resetApplicationForm(this.editFormData, this.togglerHandler, newType, oldType)
    }
  },
  methods: {
    getAllEmployees() {
      axios
        .get(`${this.karyawanURL}/karyawan/`)
        .then((response) => {
          if (response.status == 200) {
            // console.log(response.data)
            this.employees = response.data
          }
        })
        .catch((error) => {
          console.log('Error Fetching Data : ', error)
        })
    },

    // Clear Join Date Range
    clearJoinDateRange() {
      this.joinDateRange.start = null
      this.joinDateRange.end = null
      this.togglerHandler.isJoinDateFilterOpen = false
    },

    // Clear End Contract Range
    clearEndContractRange() {
      this.endContractRange.start = null
      this.endContractRange.end = null
      this.togglerHandler.isEndContractFilterOpen = false
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
      this.editFormData = this.getCurrentApplication()
      this.editFormData.Start_Contract = this.setStartContractDate
      this.editFormData.End_Contract = this.setEndContractDate
      this.editFormData.Start_Cuti = this.isDateNullAndRevert(this.editFormData.Start_Cuti)
      this.editFormData.End_Cuti = this.isDateNullAndRevert(this.editFormData.End_Cuti)
      this.editFormData.Resign_Date = this.isDateNullAndRevert(this.editFormData.Resign_Date)

      if (this.editFormData.Depart && this.editFormData.Arrival) {
        this.togglerHandler.isDepart = true
      }

      if (this.editFormData.End_Cuti){
        this.togglerHandler.isEndCuti = true
      }

      this.togglerHandler.isEditPengajuanOpen = true
    },

    closeEditPengajuanDialog() {
      this.$refs.editForm.reset()
      this.togglerHandler.isEditPengajuanOpen = false
    },

    // Add Return Date Handler
    openReturnDateDialog() {
      this.setReturnData.Date = this.isDateNullAndRevert(this.getReturnDate)
      this.togglerHandler.isReturnDateOpen = true
      this.setReturnData.Type = "Return"
    },

    closeReturnDateDialog() {
      this.togglerHandler.isReturnDateOpen = false
    },

    // Date Picker Handler
    openEndCutiDatePicker(start_cuti) {
      try {
        if (start_cuti) {
          this.getDateObj(this.convertDate(start_cuti))
          this.togglerHandler.isEndCutiDatePickerOpen = true
        } else {
          throw new Error('Tanggal Cuti is Required')
        }
      } catch (err) {
        alert(`${err.message}`)
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

    openReturnCutiDatePicker(){
      this.togglerHandler.isReturnCutiDatePickerOpen = true
    },

    closeReturnCutiDatePicker(){
      this.togglerHandler.isReturnCutiDatePickerOpen = false
    },

    closeCutOffDialog(){
      this.cutOffFormData.Date = null;
      this.togglerHandler.isCutOffDialogOpen = false;
    },

    // Get Log Dates to filter the log message
    getLogDates(messages) {
      const uniqueDates = [...new Set(messages.map((message) => this.revertDate(message.CreatedAt)))]
      // Sort the unique dates in descending order
      uniqueDates.sort((a, b) => {
        const dateA = new Date(a.split('/').reverse().join('/'))
        const dateB = new Date(b.split('/').reverse().join('/'))
        return dateB - dateA
      })

      return uniqueDates
    },

    openSnackbar(isSuccess, message) {
      this.snackbarAttribute.isSnackbarOpen = true
      this.snackbarAttribute.isSuccess = isSuccess
      this.snackbarAttribute.message = message
    },

    updateSnackbarAttribute(updatedAttribute) {
      this.snackbarAttribute = updatedAttribute
    },

    // Submit Edit Form
    async editApplyForm() {
      const { valid } = await this.$refs.editForm.validate()
      if (valid) {
        // Set up API Payload
        const editApplyData = {
          Application_Status : "Pending",
          Application_Type : this.editFormData.Application_Type
        }

        if(editApplyData.Application_Type == "Kompensasi"){
          editApplyData.Start = this.isDateNullAndConvert(this.editFormData.Start_Contract)
          editApplyData.End = this.isDateNullAndConvert(this.editFormData.End_Contract)
        }else if (editApplyData.Application_Type == "Cuti"){
          editApplyData.Start =  this.isDateNullAndConvert(this.editFormData.Start_Cuti)
          editApplyData.End = this.togglerHandler.isEndCuti ? this.isDateNullAndConvert(this.editFormData.End_Cuti) : null
          editApplyData.Depart = this.editFormData.Depart
          editApplyData.Arrival = this.editFormData.Arrival
        }else if (editApplyData.Application_Type == "Resign"){
          editApplyData.Start = this.isDateNullAndConvert(this.editFormData.Resign_Date)
        }

        if (!this.togglerHandler.isDepart || editApplyData.Application_Type != "Cuti") {
          editApplyData.Depart = null
          editApplyData.Arrival = null
        }


        await axios
          .post(`${this.karyawanURL}/apply/${this.selectedKaryawan.ID}`, editApplyData)
          .then((response) => {
            if (response.status == 200) {
              this.closeEditPengajuanDialog()
              this.selectedKaryawan.Application = response.data.application
              this.openSnackbar(true, 'Application Form Edited')

              this.selectedKaryawan.Logs.push(response.data.log)

            }
          })
          .catch((error) => {
            this.openSnackbar(false, error.response ? error.response.data.message : error.message)
          })
      }
    },

    // Submit Add Return Date
    async setReturnDate() {
      const { valid } = await this.$refs.endCutiForm.validate()

      if (valid) {
        this.setReturnData.Date = this.convertDate(this.setReturnData.Date)
        if(this.setReturnData.Type == "Return"){
          await axios.post(`${this.karyawanURL}/status/setendcuti/${this.selectedKaryawan.ID}`,
              this.setReturnData
          )
          .then((response) => {
            this.closeReturnDateDialog()
            this.selectedKaryawan.Status.End = response.data.end
            this.openSnackbar(true, response.data.message)
          })
          .catch((error) => {
            this.openSnackbar(false, error.data.message)
          })
        }

        if(this.setReturnData.Type == "Cut Off"){
          await axios.post(`${this.karyawanURL}/status/cutoff/${this.selectedKaryawan.ID}`,
          this.setReturnData
          ).then((response)=>{
            console.log(response)
            this.closeReturnDateDialog()
            this.selectedKaryawan.Status.Status = "Cut Off"
            this.selectedKaryawan.Status.Start = response.data.start
            this.selectedKaryawan.Status.End = null
            this.selectedKaryawan.Logs.push({
              CreatedAt : this.selectedKaryawan.Status.Start,
              Message : `Cut Off Tanggal ${this.formatDate(this.selectedKaryawan.Status.Start)}`,
              Type : "Cut Off",
            })
            this.openSnackbar(true, response.data.message)
          }).catch((error)=>{
            this.openSnackbar(false, error.data.message)
          })
        }
      }
    },

    async submitCutOffForm(){
      const { valid } = await this.$refs.cutoffForm.validate()

      if(valid){
        this.cutOffFormData.Date = this.convertDate(this.cutOffFormData.Date)
        // Cut Off
        await axios.post(`${this.karyawanURL}/status/cutoff/${this.selectedKaryawan.ID}`,
          this.cutOffFormData
          ).then((response)=>{
            this.closeCutOffDialog()
            this.selectedKaryawan.Status.Status = "Cut Off"
            this.selectedKaryawan.Status.Start = response.data.start
            this.selectedKaryawan.Status.End = null
            this.selectedKaryawan.Logs.push({
              CreatedAt : this.selectedKaryawan.Status.Start,
              Message : `Cut Off Tanggal ${this.formatDate(this.selectedKaryawan.Status.Start)}`,
              Type : "Cut Off",
            })
            this.openSnackbar(true, response.data.message)
          }).catch((error) =>{
            this.openSnackbar(false, error.data.message)
          })
      } 
    },

    async approveForm() {
      await axios
        .patch(`${this.karyawanURL}/apply/approve/${this.selectedKaryawan.ID}`)
        .then((response) => {
          if (response) {

            
            this.selectedKaryawan.Application.Application_Status = response.data.status ? response.data.status : null

      
            if (response.data.currentStatus) {
              this.selectedKaryawan.Application = {}
              this.selectedKaryawan.Status.Status = response.data.currentStatus.Status
              this.selectedKaryawan.Status.Start = response.data.currentStatus.Start
              this.selectedKaryawan.Status.End = response.data.currentStatus.End ? response.data.currentStatus.End : null
            }

            // update log immediately after application approved
            const formattedLogUpdates = response.data.logUpdates.map(update => ({
              ...update,
              Start : update.Start,
              End : update.End ? update.End : null
            }));

            this.selectedKaryawan.Logs = this.selectedKaryawan.Logs.concat(formattedLogUpdates)

            // Open Snackbar
            this.openSnackbar(true, response.data.currentStatus.message)
          }
        })
        .catch((error) => {
          console.log(error)
          this.openSnackbar(false, error.data.message)
        })
    },

    async rejectForm() {
      await axios
        .patch(`${this.karyawanURL}/apply/reject/${this.selectedKaryawan.ID}`)
        .then((response) => {
          if (response) {
            this.selectedKaryawan.Application.Application_Status = response.data.status
            this.selectedKaryawan.Logs.push({
                CreatedAt: moment().format('YYYY-MM-DD'),
                Message: "Pengajuan ditolak",
                Type: "Reject"
            })
            this.openSnackbar(false, response.data.message)
          }
        })
        .catch((error) => {
          console.log(error)
          this.openSnackbar(false, error.data.message)
        })
    },

    async submitExtendForm(){
      const {valid} = await this.$refs.extendForm.validate()
      if(valid){
        console.log("Extend Set")
      }
    },

    async downloadContract(){
      await axios.get(`${this.karyawanURL}/contract/generate/${this.selectedKaryawan.ID}`, {
        responseType : 'blob'
      })
      .then((response)=>{
       
        // Create a Blob object from the response data
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const fileName = `PKWT - ${this.selectedKaryawan.Name.toUpperCase()}.docx`
        saveAs(blob, fileName)

      }).catch((error)=>{
        console.log(error)
      })
    }
    
  },
  created() {
    this.getAllEmployees()
  },
  computed: {
    // Filter the Employees
    filteredEmployees() {
      const start = this.joinDateRange.start
      const end = this.joinDateRange.end

      const endContractStart = this.endContractRange.start
      const endContractEnd = this.endContractRange.end

      // Filter Join Date
      if (start && end) {
        return this.employees.filter((employee) => {
          const joinDate = this.getDateObj(employee.Join_Date)
          return joinDate >= start && joinDate <= end
        })
      }

      // Filter End Contract
      if (endContractStart && endContractEnd) {
        return this.employees.filter((employee) => {
          if (employee.Status.End === null) {
            return false; // Skip filtering for this employee
          }

          const endContract = this.getDateObj(employee.Status.End)
          return endContract >= endContractStart && endContract <= endContractEnd
        })
      }
      return this.employees
    },

    // Set Up return date (Cuti)
    getReturnDate() {
      if (this.selectedKaryawan.Status.End && this.selectedKaryawan.Status.Status == 'Cuti') {
        return clone(this.selectedKaryawan.Status.End)
      }
      return null
    },

    getJoinDateRange() {
      if (this.joinDateRange.start && this.joinDateRange.end) {
        return `${moment(this.joinDateRange.start).format('DD/MM/YYYY')} - ${moment(
          this.joinDateRange.end
        ).format('DD/MM/YYYY')}`
      }
      return null
    },
    
    getEndContractRange() {
      if (this.endContractRange.start && this.endContractRange.end) {
        return `${moment(this.endContractRange.start).format('DD/MM/YYYY')} - ${moment(
          this.endContractRange.end
        ).format('DD/MM/YYYY')}`
      }
      return null
    },

    getLastContract() {
      const lastContract = this.selectedKaryawan.Logs.find((item)=>
        item.Type == "Contract"
      )
      return lastContract
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
