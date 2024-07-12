<template>
    <div class="home-container">
        <div class="home-wrapper">
            <h3>Latest Updates</h3>
            <div class="latest-updates-karyawan">
                <v-data-table
                    :headers="headers"
                    :items="karyawan"
                    density="compact"
                    height="25vh"
                    :items-per-page="3"
                    :items-per-page-options="[
                        {value: 1, title: '1'},
                        {value: 3, title: '3'},
                        {value: 5, title: '5'},
                        {value: -1, title: '$vuetify.dataFooter.itemsPerPageAll'}
                    ]"
                >

                <template v-slot:[`item.Status.Start`]="{ value }">
                    {{ value ? moment(getDateObject(value)).format('DD MMMM YYYY') : '' }}
                </template>
                
                <template v-slot:[`item.Status.End`]="{ value }">
                    {{ value ? moment(getDateObject(value)).format('DD MMMM YYYY') : '' }}
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
                        ? `${item.Status.Status} tanggal ${moment(getDateObject(item.Status.Start)).format('DD MMMM YYYY')}`
                        : 'Belum Ajukan Form'
                    }}
                </template>

                </v-data-table>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import moment from 'moment';
import { karyawanMixin } from '../mixins/karyawanMixin';
</script>

<script>
    export default {
        mixins : [karyawanMixin],
        data : () => ({
            headers: [
            {
                title: 'NIK',
                align: 'start',
                sortable: false,
                key: 'NIK',
            },
            {
                title: 'Name',
                align: 'start',
                key: 'Name',
                sortable : false
            },
            {
                title: 'Jabatan',
                align: 'center',
                key: 'Position.Name',
                sortable : false
            },
            {
                title: 'Penempatan',
                align: 'center',
                key: 'Company.Site.Name',
                sortable : false
            },
            {
                title: 'Mulai Kontrak',
                align: 'center',
                key: 'Status.Start',
                sortable : false
            },
            {
                title: 'Akhir Kontrak',
                align: 'center',
                key: 'Status.End',
                sortable : false
            },
            {
                title: 'Status',
                align: 'center',
                key: 'Status.Status',
                sortable : false
            },
            {
                title: 'Pengajuan',
                align: 'center',
                key: 'Application.Application_Status',
                sortable : false
            }
            ],
            karyawan : []
        }),
        methods : {
            getLatestUpdates(){
                axios.get(`${this.karyawanURL}/karyawan/latestupdate`)
                .then((response)=>{
                    this.karyawan = response.data
                }).catch((error)=>{
                    console.log(error)
                })
            }
        },
        mounted(){
            this.getLatestUpdates()
        }
    }
</script>

<style lang="scss">

.home-wrapper{
    padding : 1rem;
}
</style>