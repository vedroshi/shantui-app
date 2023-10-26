import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { VDataTable } from 'vuetify/lib/labs/components.mjs'
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

const vuetify = createVuetify({
  components : {
    ...components,
    VDataTable,
  },
  directives,
})

const app = createApp(App)


app
.use(vuetify)
.use(VCalendar)
.use(router)
.use(store)

app.mount('#app')
