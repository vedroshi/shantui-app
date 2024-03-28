<template>
  <div class="calendar-container">
    <div class="calendar-wrapper">
      <div class="calendar-display">
        <FullCalendar ref="calendar" width="100%" :options="calendarOptions" />
      </div>
      <Transition name='show-agenda'>
        <div class="calendar-agenda" v-show="agendaIsOpen">
          <v-sheet rounded width="300">
            <div class="agenda-header">
              <v-btn icon variant="text" density="comfortable" @click="closeAgenda">
                <span class="material-symbols-outlined"> close </span>
              </v-btn>
              {{ setDate && moment(setDate).format('DD MMMM yyyy') }}
            </div>
            <div class="agenda-contents">
              <v-virtual-scroll width="300" height="78vh" style="padding: 1rem;" :items="agendaContents">
                <template v-slot:default="{ item }">
                  <v-card class="agenda-content">
                    {{item.title}}
                    <p>{{item.description}}</p>
                  </v-card>
                </template>
              </v-virtual-scroll>
            </div>
          </v-sheet>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import moment from 'moment'
import axios from 'axios'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { karyawanMixin } from '../mixins/karyawanMixin'
</script>

<script>
export default {
  mixins : [karyawanMixin],
  components: {
    FullCalendar
  },
  data() {
    return {
      agendaIsOpen : ref(false),
      setDate: ref(null),
      eventRange : ref(null),
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          start: 'today',
          center: 'title',
          end: 'prevYear prev next nextYear'
        },
        buttonText: {
          today: 'Today'
        },
        height: 'auto',
        selectable: true,
        dateClick: this.handleDateClick,
        datesSet : this.getEvents,
        dayMaxEventRows: 3,
        showNonCurrentDates : false,
        events : [
          // Mulai Kerja, Cuti (Add After application Accepted), Akhir Cuti, Resign, Cut Off, Lanjut Kontrak (Application Accepted), Tanggal Jatuh Tempo
          // {
          //   title: 'The Title',
          //   start: moment(new Date()).format('yyyy-MM-DD'),
          //   editable : false, 
          //   backgroundColor : 'red'
          // },
          // {
          //   title: 'The Title',
          //   start: moment(new Date()).format('yyyy-MM-DD'),
          //   editable : false, 
          //   backgroundColor : 'blue'
          // },
        ]
      },

      agendaContents : [
        // {
        //  title : 'Title',
        //  type : 'Cuti',
        //  description : 'Description'
        // },
      
      ]
    }
  },
  methods: {
    
    handleDateClick(arg) {
      this.setDate = arg.dateStr
      this.openAgenda()
      this.agendaContents = this.calendarOptions.events.filter(item => item.start == moment(arg.dateStr).format('yyyy-MM-DD'))
    },
  
    // Agenda
    openAgenda(){
      this.agendaIsOpen = true
    },
    closeAgenda(){
      this.agendaIsOpen = false
    },

    getTagColor(tags){
      if(tags == "Join"){
        return "blue"
      }else if (tags == "Expired"){
        return "red"
      }else if (tags == "Cuti"){
        return "orange"
      }else if (tags == "Cut Off"){
        return "brown"
      }else if (tags == "Resign"){
        return "black"
      }else if (tags == "Extend"){
        return "green"
      }
    },

    // Get Events in each month
    async getEvents(){
      await axios.get(`${this.karyawanURL}/calendar/?start=${moment(this.$refs.calendar.getApi().view.activeStart).format('yyyy-MM-DD')}&end=${moment(this.$refs.calendar.getApi().view.activeEnd).format('yyyy-MM-DD')}`)
      .then((response)=>{
        // Set Up Events
        this.calendarOptions.events = response.data.map(item =>{
          return ({
            title : item.Title,
            start : item.Start,
            description : item.Description,
            editable : false,
            backgroundColor : this.getTagColor(item.Tags)
          })
        })
      }).catch((error)=>{
        console.log(error)
      })
    }

  },
 
  mounted(){
  },
  computed : {
  
  }
}
</script>

<style lang="scss" scoped>

$defaultSpacing : 1rem;

.calendar-container {
  margin: $defaultSpacing;
  & .calendar-wrapper {
    display: flex;
    & .calendar-display {
      flex: 1;
      & ::v-deep(table.fc-col-header) {
        width: 100% !important;
      }
      & ::v-deep(.fc-daygrid-body) {
        width: 100% !important;
      }
      & ::v-deep(table.fc-scrollgrid-sync-table) {
        width: 100% !important;
      }
    }

    & .calendar-agenda {
      margin-left: $defaultSpacing;
      box-shadow: -6px -3px 8px -3px rgba(0, 0, 0, 0.22);

      & .agenda-header{
        padding: 0.5rem;
      }


      & .agenda-contents{

        & .agenda-content{
          padding: 0.5rem;
          @apply my-3;
          p{
            font-size: small;
            white-space: normal;
          }
        }
      }
    }
  }
}

.show-agenda-leave-active{
  transition: 0.2s ease-out;
  transform: translateX(300px);
}

.show-agenda-enter-active{
  transition: 0.2s ease-out;
  transform: translateX(0px);
}
</style>
