<template>
    <div class="contracts-header">
        <v-row dense>
            <!-- Search -->
            <v-col>
                <v-text-field variant="underlined" density="compact" v-model="search" prepend-inner clearable>
                    <span class="material-symbols-outlined mr-3"> search </span>
                </v-text-field>
            </v-col>
            <!-- Signed Status -->
            <v-col>
                <v-select v-model="signedSearch" variant="underlined" density="compact" multiple
                    :items="signedList" item-title="title" item-value="value" label="Tanda Tangan">
                </v-select>
            </v-col>
            <!-- Month -->
            <v-col>
                <v-select v-model="selectedPeriod" variant="underlined" density="compact" :item-props="periodFormat" :items="periods" label="Periode">
                </v-select>
            </v-col>
            <!-- Karyawan Baru / Lama -->
            <v-col>
                <v-select v-model="statusSearch" variant="underlined" density="compact" :items="statusList" item-title="title" item-value="value"
                    label="Status Kontrak" multiple> 
                </v-select>
            </v-col>
        </v-row>
    </div>
    <div class="contracts-contents">
        <v-data-table :items="filterContracts" :headers="contractsHeader" :search="search" height="70vh"
            density="compact" class="elavation-1" item-key="No_Contract" fixed-header>
            <template v-slot:[`item.No_Contract`]="{ value }">
                {{ `${value.toString().padStart(4, '0')}/HRD/PKWT/MR/SI/${romanicNumber[selectedPeriod.month - 1]}/${selectedPeriod.year}` }}
            </template>
            <template v-slot:[`item.Start`]="{ value }">
                {{ value ? moment(getDateObject(value)).format('DD MMMM YYYY') : '' }}
            </template>
            <template v-slot:[`item.End`]="{ value }">
                {{ value ? moment(getDateObject(value)).format('DD MMMM YYYY') : '' }}
            </template>
            <template v-slot:[`item.Signed`]="{ item }">
                <v-checkbox v-model="item.Signed" :disabled="item.Signed === true" @change="signContract(item)"></v-checkbox>
            </template>
        </v-data-table>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios';
import moment from 'moment';
import { karyawanMixin } from '../../mixins/karyawanMixin';
</script>

<script>
export default {
    mixins: [karyawanMixin],
    data: () => ({
        search: ref(null),
        signedSearch: ref([]),
        periodSearch: ref(null),
        statusSearch: ref(null),

        contracts: ref([]),
        selectedPeriod: ref(null),


        // constants
        periods: ref([]),
        signedList : [
            {title : 'Signed', value : true},
            {title : 'Unsigned', value : false}
        ],
        contractsHeader: [
            {
                title: "Nomor Kontrak",
                key: "No_Contract"
            },
            {
                title: "Nama",
                key: "Employee.Name"
            },
            {
                title: "Mulai Kontrak",
                key: "Start"
            },
            {
                title: "Akhir Kontrak",
                key: "End"
            },
            {
                title: "Tanda Tangan",
                key: "Signed"
            }
        ],
        statusList : [
            {title : 'Karyawan Baru', value : 'new'},
            {title : 'Karyawan Lama', value : 'old'}
        ],
        romanicNumber : ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
    }),
    methods: {
        showContracts(month, year) {
            axios.get(`${this.karyawanURL}/contract/show?month=${month}&year=${year}`)
                .then((response) => {
                    if (response.status === 200) {
                        this.contracts = response.data.contracts
                    }
                }).catch((error) => {
                    console.error(error)
                })
        },

        periodList() {
            axios.get(`${this.karyawanURL}/contract/getperiod`)
                .then((response) => {
                    if (response.status === 200) {
                        this.periods = response.data.period
                        if (this.periods.length > 0) {
                            this.selectedPeriod = this.periods[0];
                            this.showContracts(this.selectedPeriod.month, this.selectedPeriod.year);
                        }
                    }
                }).catch((error) => {
                    console.error(error)
                })
        },

        periodFormat(item){
            return {
                title : `${moment(item.month, "M").format("MMMM")} ${item.year}`
            }
        },

        signContract(item){
            axios.patch(`${this.karyawanURL}/contract/sign/${item.No_Contract}`)
            .then((response)=>{
                if(response.status == 200){
                  item.Signed = true
                }
            }).catch((error)=>{
                console.error(error)
            })
        }
    },
    mounted() {
        this.periodList();
    },
    watch: {
        selectedPeriod() {
            this.showContracts(this.selectedPeriod.month, this.selectedPeriod.year);
        },
    },
    computed: {
        filterContracts() {
            let filteredContracts = this.contracts.slice()

            // Filter Signed
            if (this.signedSearch.length > 0) {
                filteredContracts = filteredContracts.filter((contract) =>
                    this.signedSearch.includes(contract.Signed)
                );
            }

            if(this.statusSearch == 'new'){
                filteredContracts = filteredContracts.filter((contract)=>
                    contract.Employee.Join_Date == contract.Start
            )}

            if(this.statusSearch == 'old'){
                filteredContracts = filteredContracts.filter((contract)=>
                    contract.Employee.Join_Date != contract.Start
            )}


            return filteredContracts
        },
    }
}
</script>

<style>
.contracts-header {
    @apply m-3
}
</style>