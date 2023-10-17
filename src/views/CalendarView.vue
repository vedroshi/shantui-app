<template>
  <div class="calendar-container">
    <div class="calendar-wrapper">
      <div class="calendar-display">
        <FullCalendar width="100%" :options="calendarOptions" />
      </div>
      <div class="calendar-agenda">
        <!-- <v-card
          width="300"
        >

        </v-card> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
</script>

<script>
export default {
  components: {
    FullCalendar
  },
  data: () => ({
    calendarOptions: {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        start: 'today',
        center: 'title',
        end: 'prev,next'
      },
      buttonText: {
        today: 'Today'
      },
      height: 'auto'
    }
  })
}
</script>

<style lang="scss" scoped>
.calendar-container {
  padding: 1rem;
  & .calendar-wrapper {
    display: flex;
    & .calendar-display {
      & .content {
        height: 100% !important;
      }
      & .fc-col-header,
      & .fc-timegrid-body {
        width: 100% !important;
        height: 100% !important;
      }
      & .fc-scrollgrid-sync-table {
        width: 100% !important;
        height: 100% !important;
      }
      & .fc-daygrid-body {
        width: 100% !important;
        height: 100% !important;
      }
      & .fc-daygrid-body-balanced {
        width: 100% !important;
        height: 100% !important;
      }
    }
  }
}
</style>
