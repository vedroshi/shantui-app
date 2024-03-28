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
                <v-table>
                    <thead>
                        <tr>
                            <th>
                                Name
                            </th>
                            <th v-if="tab == 'Sewa'">
                                Site
                            </th>
                            <th>
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
                                    @click="toggleHandler.dialogIsActive = true">
                                    <span class="material-symbols-outlined"> add </span>
                                </v-btn>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in getData">
                            <td>{{ item.Name }}</td>
                            <td v-if="tab == 'Sewa'">{{ item.Site }}</td>
                            <td>{{ item.Object_Sewa }}</td>
                            <td>{{ item.Nominal }}</td>
                            <td v-if="tab == 'Sewa'">{{ formatDate(item.Start_Contract) }}</td>
                            <td v-if="tab == 'Sewa'">{{ formatDate(item.End_Contract) }}</td>
                            <td>{{ formatDate(item.Expired) }}</td>
                            <td>
                                <v-row class="justify-center">
                                    <v-btn class="mx-3" variant='tonal' color="blue">
                                        <span class="material-symbols-outlined">
                                            contract_edit
                                        </span>
                                    </v-btn>
                                    <v-btn class="mx-3" variant='tonal' color="red">
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

        <v-dialog max-width="700" v-model="toggleHandler.dialogIsActive" persistent>
            <v-card>
                <v-toolbar color="rgba(0, 0, 0, 0)" theme="light">
                    <v-toolbar-title class="text-h6"> Tambah {{ tab == "Sewa" ? 'Sewa' : 'Leasing' }} </v-toolbar-title>
                    <template v-slot:append>
                        <v-btn @click="closeAddDialog" icon="Close">
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
                            <v-text-field variant="underlined" density="compact" v-model="formData.name" :rules="[
                                (value) => this.required(value),
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
                            <v-text-field v-model="formData.start" variant="underlined" density="compact" placeholder="DD/MM/YYYY" required
                                :rules="[
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
                            <v-text-field v-model="formData.end" variant="underlined" density="compact" placeholder="DD/MM/YYYY" required
                                :rules="[
                                    (value) => this.required(value),
                                    (value) => this.isDateValid(value),
                                    (value) => this.endDateValidation(value, revertDate(formData.start))
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
                            <v-text-field v-model="formData.dueDate" variant="underlined" density="compact" placeholder="DD/MM/YYYY" :rules="[
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
                            <v-text-field v-model="formData.nominal" variant="underlined" density="compact" prefix="Rp. " :rules="[
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
                            <v-textarea v-model="formData.info" variant="underlined" rows="2" :rules="[
                                (value) => this.required(value)
                            ]"></v-textarea>
                        </v-col>
                    </v-row>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Close" color='red' @click="closeAddDialog"></v-btn>
                    <v-btn text="Save" color="blue-darken-1" @click="submitForm"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { karyawanMixin } from '../mixins/karyawanMixin';
import { validationMixin } from '../mixins/validationMixin';
</script>

<script>
export default {
    mixins: [karyawanMixin, validationMixin],
    data: () => ({
        toggleHandler: {
            dialogIsActive: ref(false)
        },
        tab: null,
        tab_items: ['Sewa', 'Leasing'],

        formData : {
            name : ref(null),
            start : ref(null),
            end : ref(null),
            dueDate : ref(null),
            nominal : ref(null),
            info : ref(null)
        },

        lists: [{
            Name: 'A',
            Site: "Morowali",
            Object_Sewa: "Kontrakan",
            Nominal: "Rp. 9.000.000",
            Start_Contract: "2024-01-01",
            End_Contract: "2025-01-01",
            Expired: "2024-04-01"
        }],

        lists_2: [{
            Name: 'B',
            Site: "Morowali",
            Object_Sewa: "Kontrakan",
            Nominal: "Rp. 9.000.000",
            Expired: "2024-04-01"
        }],
    }),
    methods : {
        clearForm(formData){
            Object.keys(formData).forEach(key => {
                formData[key] = null
            })
        },

        closeAddDialog(){
            this.clearForm(this.formData)
            this.toggleHandler.dialogIsActive = false
        },

        async submitForm(){
            const { valid } = await this.$refs.rentLeasingForm.validate()
            if(valid){
                // If tab == Sewa
                if (this.tab == this.tab_items[0]){

                }else{ // if tab == Leasing
                    // Clear (start contract and end Contract)
                    this.formData.start = null
                    this.formData.end = null
                }
            }
        }
    },
    computed: {
        getData() {
            if (this.tab == this.tab_items[0]) {
                return this.lists
            } else if (this.tab == this.tab_items[1]) {
                return this.lists_2
            }
        }
    }
}
</script>

<style lang="scss"></style>