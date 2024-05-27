<template>
    <div class="px-3 py-3">
        <v-card-title>
            Sewa & Leasing
        </v-card-title>
        <v-tabs v-model="tab" bg-color="transparent" color="#C07F00">
            <v-tab v-for="item in tab_items" :key="item" :value="item">
                {{ item }}
            </v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item v-for="item in tab_items" :key="item" :value="item">
                <v-table fixed-header height="75vh">
                    <thead>
                        <tr>
                            <th>
                                Name
                            </th>
                            <th v-if="tab == 'Sewa'">
                                Site
                            </th>
                            <th width="25%">
                                Keterangan
                            </th>
                            <th>
                                Nominal
                            </th>
                            <th v-if="tab == 'Sewa'">
                                Awal Kontrak
                            </th>
                            <th v-if="tab == 'Sewa'">
                                Akhir Kontrak
                            </th>
                            <th>
                                Tanggal Jatuh Tempo
                            </th>
                            <th class="text-center">
                                <v-btn rounded style="background-color: var(--primary)" variant="tonal"
                                    @click="openDialog()">
                                    <span class="material-symbols-outlined"> add </span>
                                </v-btn>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in getData"
                        :style="{ backgroundColor: getStatus(item)
                            }">
                            <td>{{ item.Name }}</td>
                            <td v-if="tab == 'Sewa'">{{ item.Site }}</td>
                            <td>{{ item.Info }}</td>
                            <td>Rp. {{ item.Nominal.toLocaleString('en-US', {
                                style: 'decimal',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 3,
                            }) }}</td>
                            <td v-if="tab == 'Sewa'">{{ convertYYYYMMDDToDDMMMMYYYY(item.Start) }}</td>
                            <td v-if="tab == 'Sewa'">{{ convertYYYYMMDDToDDMMMMYYYY(item.End) }}</td>
                            <td>{{ convertYYYYMMDDToDDMMMMYYYY(item.Payment_Due) }}</td>
                            <td>
                                <v-row class="justify-center">
                                    <v-btn class="mx-3" variant='tonal' color="blue" @click="openDialog(item)">
                                        <span class="material-symbols-outlined">
                                            contract_edit
                                        </span>
                                    </v-btn>
                                    <v-btn class="mx-3" variant='tonal' color="red" @click="openDeleteDialog(item)">
                                        <span class="material-symbols-outlined">
                                            contract_delete
                                        </span>
                                    </v-btn>
                                </v-row>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-window-item>
        </v-window>

        <!-- Add new Rent or Leasing -->
        <v-dialog max-width="700" v-model="toggleHandler.dialogIsActive" persistent>
            <v-card>
                <v-toolbar color="rgba(0, 0, 0, 0)" theme="light">
                    <v-toolbar-title class="text-h6"> {{ this.editOrAdd }} {{ this.tab }} </v-toolbar-title>
                    <template v-slot:append>
                        <v-btn @click="closeDialog" icon="Close">
                            <span class="material-symbols-outlined"> close </span>
                        </v-btn>
                    </template>
                </v-toolbar>
                <v-form ref="rentLeasingForm" lazy-validation>
                    <v-row dense class="mx-3">
                        <v-col cols="5">
                            <v-list-item-title>
                                Nama
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <i>Name</i>
                            </v-list-item-subtitle>
                            <v-text-field variant="underlined" density="compact" v-model="formData.Name" :rules="[
            (value) => this.required(value),
        ]">
                            </v-text-field>
                        </v-col>
                        <v-col cols="5" v-if="this.tab == 'Sewa'">
                            <v-list-item-title>
                                Site
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <i>
                                    Site
                                </i>
                            </v-list-item-subtitle>
                            <v-text-field variant="underlined" density="compact" v-model="formData.Site" :rules="[
            (value) => this.required(value)
        ]">

                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense class="mx-3" v-if="tab == 'Sewa'">
                        <v-col cols="5">
                            <v-list-item-title>
                                Mulai Kontrak
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <i> Start Contract </i>
                            </v-list-item-subtitle>
                            <v-text-field v-model="formData.Start" variant="underlined" density="compact"
                                placeholder="DD/MM/YYYY" required :rules="[
            (value) => this.required(value),
            (value) => this.isDateValid(value),
            (value) => this.isValueDate(value),
        ]">
                            </v-text-field>
                        </v-col>
                        <v-col cols="5">
                            <v-list-item-title>
                                Akhir Kontrak
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <i> End Contract </i>
                            </v-list-item-subtitle>
                            <v-text-field v-model="formData.End" variant="underlined" density="compact"
                                placeholder="DD/MM/YYYY" required :rules="[
            (value) => this.required(value),
            (value) => this.isDateValid(value),
            (value) => this.endDateValidation(value, formData.Start, 'Tanggal Awal lebih besar dari Tanggal akhir'),
        ]">

                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense class="mx-3">
                        <v-col cols="5">
                            <v-list-item-title>
                                Tanggal Jatuh Tempo
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <i>Due Date</i>
                            </v-list-item-subtitle>
                            <v-text-field v-model="formData.Payment_Due" variant="underlined" density="compact"
                                placeholder="DD/MM/YYYY" :rules="[
            (value) => this.required(value),
            (value) => this.isDateValid(value),
            (value) => this.isValueDate(value),
        ]">
                            </v-text-field>
                        </v-col>
                        <v-col cols="5">
                            <v-list-item-title>
                                Nominal (Per bulan)
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <i>Nominal (Monthly) </i>
                            </v-list-item-subtitle>
                            <v-text-field v-model="formData.Nominal" variant="underlined" density="compact"
                                prefix="Rp. " :rules="[
            (value) => this.required(value),
            (value) => this.numberCheckValidation(value)
        ]">

                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense class="mx-3">
                        <v-col>
                            <v-list-item-title>
                                Keterangan
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <i>Additional Information</i>
                            </v-list-item-subtitle>
                            <v-textarea v-model="formData.Info" variant="underlined" rows="2" :rules="[
            (value) => this.required(value)
        ]"></v-textarea>
                        </v-col>
                    </v-row>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Close" color='red' @click="closeDialog"></v-btn>
                    <v-btn text="Save" color="blue-darken-1" @click="submitForm"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Delete Rent or Leasing Confirmation Dialog -->
        <v-dialog max-width="500" v-model="toggleHandler.isDeleteDialogActive">
            <v-card>
                <div style="padding : 1rem">
                    <div style="text-align: center">
                        <span class="material-symbols-outlined" style="font-size: 5rem; color:red;">
                            cancel
                        </span>
                    </div>
                    <div style="text-align: center" :class="[['Heading-5', 'text-h5']]">
                        Apa anda yakin untuk menghapus item {{ this.tab }} ini
                    </div>
                </div>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Close" color='blue-darken-1' @click="closeDeleteDialog"></v-btn>
                    <v-btn text="Save" color="red" @click="deleteItem(this.selectedID)"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <SnackbarView v-model:snackbarAttribute="snackbarAttribute"></SnackbarView>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { dateConversionMixin } from '../mixins/dateConversionMixin';
import { validationMixin } from '../mixins/validationMixin';
import { rentLeasingMixin } from '../mixins/rentLeasingMixin'

import SnackbarView from '../components/SnackbarView.vue'
import axios from 'axios';
</script>

<script>
export default {
    mixins: [validationMixin, rentLeasingMixin, dateConversionMixin],
    data: () => ({
        toggleHandler: {
            dialogIsActive: ref(false),
            editDialogIsActive: ref(false),
            isDeleteDialogActive: ref(false)
        },

        tab: ref(""),
        tab_items: ['Sewa', 'Leasing'],

        formData: {
            Name: ref(null),
            Start: ref(null),
            Site: ref(null),
            End: ref(null),
            Payment_Due: ref(null),
            Nominal: ref(null),
            Info: ref(null)
        },

        // Selected ID
        selectedID: ref(null),

        data: ref([]),
        editOrAdd: ref(""),

        snackbarAttribute: {
            isSnackbarOpen: ref(false),
            isSuccess: ref(null),
            message: ref(null),
        },

    }),
    components: {
        SnackbarView
    },
    methods: {
        getDaysRemain(date) {
            const dayToMilSec = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds

            const paymentDue = this.getDateObject(date)

            const daysLeft = Math.round((paymentDue - new Date()) / dayToMilSec)
            return daysLeft
        },

        showData() {
            axios.get(`${this.rentLeasingURL}/${this.tab.toLowerCase()}/`)
                .then((response) => {
                    if (response.status == 200) {
                        this.data = response.data
                    }
                }).catch((error) => {
                    console.error(error)
                })
        },

        clearForm(formData) {
            Object.keys(formData).forEach(key => {
                formData[key] = null
            })
        },

        // Dialog Action
        openDialog(item = null) {
            this.editOrAdd = "Tambah"
            if (item) {
                this.editOrAdd = "Edit"
                this.formData.ID = item.ID
                this.formData.Name = item.Name
                this.formData.Info = item.Info
                this.formData.Nominal = item.Nominal
                this.formData.Payment_Due = this.convertYYYYMMDDToDDMMYYYY(item.Payment_Due)
                // this.formData.Payment_Due = this.convertYYYYMMDDToDDMMYYYY(item.Payment_Due)
                if (this.tab == this.tab_items[0]) {
                    this.formData.Site = item.Site
                    this.formData.Start = this.convertYYYYMMDDToDDMMYYYY(item.Start)
                    this.formData.End = this.convertYYYYMMDDToDDMMYYYY(item.End)
                }
            }
            this.toggleHandler.dialogIsActive = true
        },

        closeDialog() {
            this.clearForm(this.formData)
            this.toggleHandler.dialogIsActive = false
        },

        openDeleteDialog(item) {
            this.toggleHandler.isDeleteDialogActive = true
            this.selectedID = item.ID
        },

        closeDeleteDialog() {
            this.toggleHandler.isDeleteDialogActive = false
            this.selectedID = null
        },

        // Form Action
        async submitForm() {
            const { valid } = await this.$refs.rentLeasingForm.validate()

            if (valid) {
                // Convert Date from DD/MM/YYYY to YYYY-MM-DD
                this.formData.Start = this.convertDDMMYYYYToYYYYMMDD(this.formData.Start)
                this.formData.End = this.convertDDMMYYYYToYYYYMMDD(this.formData.End)
                this.formData.Payment_Due = this.convertDDMMYYYYToYYYYMMDD(this.formData.Payment_Due)

                // if tab == Leasing
                if (this.tab == this.tab_items[1]) {
                    // Clear (start contract and end Contract)
                    delete this.formData.Start
                    delete this.formData.End
                }


                const formDataCopy = { ...this.formData }
                if (this.editOrAdd == "Edit") {
                    // Update
                    await axios.patch(`${this.rentLeasingURL}/${this.tab.toLowerCase()}/edit/${this.formData.ID}`, this.formData).
                        then((response) => {
                            if (response.data.success) {
                                // Update data
                                this.data = this.data.map(item => {
                                    if (item.ID == this.formData.ID) {
                                        return formDataCopy
                                    } else {
                                        return item
                                    }
                                })
                                // Clear Form
                                this.clearForm(this.formData)
                                // Close Dialog
                                this.closeDialog()
                                // Open Snackbar
                                this.openSnackbar(response, true)
                            }
                        }).catch((error) => {
                            this.openSnackbar(error, false)
                            console.error(error)
                        })
                } else {
                    await axios.post(`${this.rentLeasingURL}/${this.tab.toLowerCase()}/create`, this.formData)
                        .then((response) => {
                            if (response.data.success) {
                                // Append formData to display
                                this.data.push(formDataCopy)
                                // Clear Form
                                this.clearForm(this.formData)
                                // Close Dialog
                                this.closeDialog()
                                // Open Snackbar
                                this.openSnackbar(response, true)
                            }
                        }).catch((error) => {
                            this.openSnackbar(error, false)
                            console.error(error)
                        })
                }
            }
        },

        async deleteItem(ID){
            await axios.delete(`${this.rentLeasingURL}/${this.tab}/delete/${ID}`)
            .then((response)=>{
                if(response.data.success){
                    this.data = this.data.filter((item) => item.ID != ID)
                    this.openSnackbar(response, true)
                    this.closeDeleteDialog()
                }
            }).catch((error)=>{
                console.error(error)
                this.openSnackbar(error, false)
            })
        },

        openSnackbar(response, isSuccess) {
            this.addKaryawanProgressOpen = false
            this.snackbarAttribute.isSnackbarOpen = true
            this.snackbarAttribute.isSuccess = isSuccess
            this.snackbarAttribute.message = response.data.message
        },

        getStatus(item){
            if(item.End){
                if(this.getDaysRemain(item.End) <= 0){
                    return '#FF6347'
                }
            }

            if(this.getDaysRemain(item.Payment_Due) <= 7){
                return 'yellow'
            }

            return 'transparent'
        }
    },
    mounted() {
        this.tab = this.tab_items[0];  // Set default tab
    },
    watch: {
        tab(newTab) {
            this.showData()
        }
    },
    computed: {
        getData() {
            return this.data
        },
    
    }
}
</script>

<style lang="scss"></style>