<template>
  <div class="pengajuan-container">
    <div class="pengajuan-header">
      <h3>Ajukan form</h3>
    </div>
    <div class="pengajuan-form">
      <v-form ref="form" lazy-validation>
        <v-row dense>
          <v-col cols="3" v-click-outside="closeApplyDatePicker">
            <v-list-item-title>Tanggal Pengajuan</v-list-item-title>
            <v-list-item-subtitle> <i> Apply Date </i> </v-list-item-subtitle>
            <v-text-field
              v-model="applyData.apply_date"
              variant="underlined"
              density="compact"
              append-inner-icon="mdi-calendar"
              @click:appendInner="openApplyDatePicker"
              placeholder="DD/MM/YYYY"
              clearable
              required
              :rules="rules.applyRules"
            ></v-text-field>
            <VDatePicker
              v-model.string="applyData.apply_date"
              mode="date"
              @dayclick="closeApplyDatePicker"
              :masks="dateFormat"
              :max-date="new Date()"
              v-if="togglerHandler.isApplyDatePickerOpen"
            >
            </VDatePicker>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols=3>
            <v-list-item-title> Nama </v-list-item-title>
            <v-list-item-subtitle> <i> Name </i>  </v-list-item-subtitle>
            <v-text-field
              variant="underlined"
              readonly
              density="compact"
            >
              {{ this.karyawanData.name }}
            </v-text-field>
          </v-col>
          <v-col cols=3>
            <v-list-item-title> Tanggal Join </v-list-item-title>
            <v-list-item-subtitle> <i>Join Date</i> </v-list-item-subtitle>
            <v-text-field
              variant="underlined"
              readonly
              density="compact"
            >
              {{this.karyawanData.join_date}}
            </v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols=3>
            <v-list-item-title> Departement </v-list-item-title>
            <v-list-item-subtitle> <i> Department </i>  </v-list-item-subtitle>
            <v-text-field
              variant="underlined"
              readonly
              density="compact"
            >
              Plant
            </v-text-field>
          </v-col>
          <v-col cols=3>
            <v-list-item-title> Penempatan </v-list-item-title>
            <v-list-item-subtitle> <i> Site </i>  </v-list-item-subtitle>
            <v-text-field
              variant="underlined"
              readonly
              density="compact"
            >
              {{this.karyawanData.site}}
            </v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols=3>
            <v-list-item-title> Jabatan </v-list-item-title>
            <v-list-item-subtitle> <i> Position </i>  </v-list-item-subtitle>
            <v-text-field
              variant="underlined"
              readonly
              density="compact"
            >
              {{this.karyawanData.position}}
            </v-text-field>
          </v-col>
          <v-col cols=3>
            <v-list-item-title> Tonase </v-list-item-title>
            <v-list-item-subtitle> <i> Tonnage </i>  </v-list-item-subtitle>
            <v-text-field
              variant="underlined"
              readonly
              density="compact"
              suffix="Ton"
            >
              {{this.karyawanData.tonnage}}
            </v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-list-item-title>
              Pengajuan
            </v-list-item-title>
            <v-list-item-subtitle>
              <i> Apply </i> 
            </v-list-item-subtitle>
            <v-radio-group 
              v-model="applyData.application_type"
              density="compact"
              style="margin-top: 10px;"
              inline
              :rules="rules.applyRules"
            >
              <v-radio label="Kompensasi" value="Kompensasi" class="radio-item"></v-radio>
              <v-radio label="Cuti" value="Cuti" class="radio-item"></v-radio>
              <v-radio label="Resign" value="Resign" class="radio-item"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col v-if="applyData.application_type == 'Kompensasi'">
            <v-row dense>
              <v-col cols="3">
                <v-list-item-title>
                  Mulai Kontrak 
                </v-list-item-title>
                <v-list-item-subtitle>
                 <i> Start Contract </i> 
                </v-list-item-subtitle>
                <v-text-field
                  v-model="applyData.start_contract"
                  readonly
                  variant='underlined'
                  density="compact"
                >
                </v-text-field>
              </v-col>
              <v-col cols="3">
                <v-list-item-title>
                  Akhir Kontrak 
                </v-list-item-title>
                <v-list-item-subtitle>
                 <i> End Contract </i> 
                </v-list-item-subtitle>
                <v-text-field
                  v-model="applyData.end_contract"
                  readonly
                  variant='underlined'
                  density="compact"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-else-if="applyData.application_type == 'Cuti'">
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
                  :rules="rules.applyRules"
                ></v-text-field>
                <VDatePicker
                  v-model.string="applyData.start_cuti"
                  mode="date"
                  @dayclick="closeStartCutiDatePicker"
                  :masks="dateFormat"
                  v-if="togglerHandler.isStartCutiDatePickerOpen"
                >
                </VDatePicker>
              </v-col>
              <v-col cols="3" v-click-outside="closeEndCutiDatePicker" v-if="togglerHandler.isEndCuti">
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
                  :rules="rules.applyRules"
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
                <v-checkbox label="Balik Cuti" v-model="togglerHandler.isEndCuti"></v-checkbox>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="3" v-if="togglerHandler.isDepart">
                <v-list-item-title>
                  Keberangkatan
                </v-list-item-title>
                <v-list-item-subtitle>
                  Departure
                </v-list-item-subtitle>
                <v-text-field
                  variant='underlined'
                  placeholder="Kendari"
                  :rules="rules.travelRules"
                >
                </v-text-field>
              </v-col>
              <v-col cols="3" v-if="togglerHandler.isDepart">
                <v-list-item-title>
                  Kedatangan
                </v-list-item-title>
                <v-list-item-subtitle>
                  Arrival
                </v-list-item-subtitle>
                <v-text-field
                  variant='underlined'
                  placeholder="Jakarta"
                  :rules = "rules.travelRules"
                >
                </v-text-field>
              </v-col>
              <v-col align-self="center">
                <v-checkbox label="Berangkat" v-model="togglerHandler.isDepart"></v-checkbox>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-else-if="applyData.application_type == 'Resign'">
            <v-row dense>
              <v-col cols="3" v-click-outside="closeResignDatePicker">
              <v-list-item-title>Tanggal Resign</v-list-item-title>
              <v-list-item-subtitle> <i> Resign Date </i> </v-list-item-subtitle>
              <v-text-field
                v-model="applyData.resign_date"
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
                v-model.string="applyData.resign_date"
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
        <v-row dense>
          <v-btn style="background-color : var(--secondary)" @click="applyForm"> 
            Apply
          </v-btn>
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
    karyawanData : ref({}),

    togglerHandler : {
      isEndCuti : ref(false),
      isDepart : ref(true),

      isApplyDatePickerOpen: ref(false),
      isStartCutiDatePickerOpen: ref(false),
      isEndCutiDatePickerOpen: ref(false),
      isResignDatePickerOpen: ref(false),
    },


    // Application Form Data
    applyData: {
      application_type : ref(null),
      apply_date: ref(moment(new Date()).format('DD/MM/YYYY')),

      // Kompensasi
      start_contract : ref(null),
      end_contract : ref(null),
      // Cuti
      start_cuti : ref(null),
      end_cuti : ref(null),
      depart : ref(null),
      arrival : ref(null),
      // Resign
      resign_date : ref(null),
    },

    rules : {
      applyRules: [(value) => !!value || '*Required'],
 
      travelRules : [(value) => !!value && this.togglerHandler.isDepart || "* Required" ],
    },

    dateFormat: ref({
      modelValue: 'DD/MM/YYYY'
    })
  }),

  methods: {
    openApplyDatePicker() {
      this.togglerHandler.isApplyDatePickerOpen = true
    },
    closeApplyDatePicker() {
      this.togglerHandler.isApplyDatePickerOpen = false
    },

    openStartCutiDatePicker() {
      this.togglerHandler.isStartCutiDatePickerOpen = true
    },
    closeStartCutiDatePicker() {
      this.togglerHandler.isStartCutiDatePickerOpen = false
    },

    toogleEndCuti(){
      this.togglerHandler.isEndCuti = !this.togglerHandlerisEndCuti;
    },

    openEndCutiDatePicker() {
      this.togglerHandler.isEndCutiDatePickerOpen = true
    },
    closeEndCutiDatePicker() {
      this.togglerHandler.isEndCutiDatePickerOpen = false
    },

    openResignDatePicker() {
      this.togglerHandler.isResignDatePickerOpen = true
    },
    closeResignDatePicker() {
      this.togglerHandler.isResignDatePickerOpen = false
    },

    getDateObj(dateString){
      const [date, month, year] = dateString.split('/');
      return new Date(year, month - 1, date);
    },

    // Application Form Submit
    async applyForm(){
      const { valid } = await this.$refs.form.validate();
      if (valid){
        console.log(this.applyData)
        console.log("Applied")
      }
    }

  },
  mounted(){
    this.karyawanData = this.$store.state.selectedKaryawan;
    this.applyData.start_contract = this.getStartContractDate;
    this.applyData.end_contract = this.getEndContractDate;
  },

  computed: {
  // Get the Init Start Contract Date
    getStartContractDate(){
      if(this.karyawanData){
        const endDate = this.getDateObj(this.karyawanData.end_contract);
        endDate.setDate(endDate.getDate() + 1);
        return moment(endDate).format('DD/MM/YYYY');
      }
      return null;
    },
    // Get the Init End Contract Date
    getEndContractDate(){
      if(this.karyawanData){
        const endDate = this.getDateObj(this.applyData.start_contract);
        endDate.setMonth(endDate.getMonth() + 6);
        return moment(endDate).format('DD/MM/YYYY');
      }
      return null;
    },
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

    & .radio-item{
      margin-right: 1rem;
    }
  }
}
</style>
