<template>
  <div class="karyawan-container">
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
            <v-btn rounded style="background-color: var(--primary)">
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
                :items ="employees"
                :search="search"
                class="elavation-1"
                density="compact"
                item-key="nik"
                height='auto'
            >
                <template v-slot:[`item.status`]="{ value }">
                    <v-chip :color="getColor(value)" style='margin : 5px'>
                        {{ value }}
                    </v-chip>
                </template>
            </v-data-table>
        </div>
    </div>
  </div>
</template>

<script setup>
    import {ref} from 'vue'
</script>

<script>
export default {
  data: () => ({
    
    search : ref(''),

    employees : [
      {
        nik : '1200012232500021',
        name : 'Andy',
        dob : '13/10/1998',
        pob : 'Jakarta',
        address : 'Jl. ',
        position : 'Operator Mixer',
        join_date : '19/10/2020',
        status : 'active'
      },
      {
        nik : '1200012232500021',
        name : 'Bob',
        dob : '11/04/1994',
        pob : 'Makassar',
        address : 'Jl. ',
        position : 'Operator Crane',
        join_date : '19/10/2020',
        status : 'Close Project'
      },
      {
        nik : '1200012232500021',
        name : 'Alice',
        dob : '12/9/1994',
        pob : 'Tangerang',
        address : 'Jl. ',
        position : 'Jubir',
        join_date : '19/10/2020',
        status : 'Close Project'
      },
    ],
    headers : [
        {
            title : 'NIK',
            align : 'start',
            sortable : false,
            key : 'nik'
        },
        {
            title : 'Name',
            align : 'start',
            key : 'name'
        },
        {
            title : 'Tanggal Lahir',
            align : 'center',
            key : 'dob'
        },
        {
            title : 'Tempat Lahir',
            align : 'center',
            key : 'pob'
        },
        {
            title : 'Alamat',
            align : 'start',
            key : 'address'
        },
        {
            title : 'Jabatan',
            align : 'center',
            key : 'position'
        },
        {
            title : 'Tanggal Join',
            align : 'center',
            key : 'join_date'
        },
        {
            title : 'Status',
            align : 'center',
            key : 'status'
        }
    ]
  }),
  methods: {
    getColor (status) {
        if (status == "Warning") return 'orange'
        else if (status == "Close Project") return 'red'
        else return 'green'
    },

   
  }
}
</script>

<style lang="scss" scoped>
.karyawan-container {

  & .karyawan-header {
    @apply m-3;
  }

  &.karyawan-contents{
    display: flex;
  }

}
</style>
