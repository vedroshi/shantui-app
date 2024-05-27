<template>
    <v-overlay
      v-model = "$store.state.sidebarExpand"
      location-strategy="connected"
      scroll-strategy="block"
    >
    <aside v-bind:class="sidebarExpand && 'is-expanded'">
      <div class="menu-toggle-wrap">
        <div class="menu-toggle">
          <v-btn density="comfortable" icon="mdi-format-list-bulleted" variant="text" @click="toggleMenu"></v-btn>
        </div>
        <div class="logo">
          <img alt="Vue logo" class="logo" src="@/assets/Shantui_Logo.png" width="125" height="125" />
        </div>
      </div>

      <div class="main-menu-items">
        <router-link class="menu-button" to="/">
          <span class="material-symbols-outlined"> dashboard </span>
          <span class="menu-label">Dashboard</span>
        </router-link>
        <router-link class="menu-button" to="/calendar">
          <span class="material-symbols-outlined"> event </span>
          <span class="menu-label">Calendar</span>
        </router-link>
        <router-link class="menu-button" to="/rentleasing">
          <span class="material-symbols-outlined"> event_upcoming </span>
          <span class="menu-label">Rental & Leasing</span>
        </router-link>
      </div>

      <div class="main-menu-items">
        <div class="menu-dropdown" v-bind:class="karyawanExpand && 'dropdown-expanded'">
          <div class="dropdown-button" @click="toggleKaryawanMenu">
            <span class="material-symbols-outlined"> group </span>
            <span class="menu-label">Employees</span>
            <span class="expand-more material-symbols-outlined"> expand_more </span>
          </div>
          <Transition name="dropdown-fall">
            <div class="dropdown-items" v-if="karyawanExpand">
              <router-link class="menu-button" to="/karyawan">
                <span class="material-symbols-outlined"> badge </span>
                <button class="menu-label">Employee List</button>
              </router-link>
              <router-link class="menu-button" to="/karyawan/contracts">
                <span class="material-symbols-outlined"> contract </span>
                <button class="menu-label">Contract List</button>
              </router-link>
            </div>
          </Transition>
        </div>
      </div>
    </aside>
    </v-overlay>
</template>

<script setup>
import { ref } from 'vue'
</script>

<script>

export default {
  data: () => ({
    isExpanded: ref(true),
    karyawanExpand: ref(false)

  }),
  methods: {
    toggleKaryawanMenu() {
      this.karyawanExpand = !this.karyawanExpand
    },

    toggleMenu() {
      this.$store.commit('expandSidebar')
    },

    shrinkSidebar(){
      this.$store.commit('shrinkSidebar')
    }
  },
  mounted(){
    
  },
  computed : {
    sidebarExpand(){
      return this.$store.state.sidebarExpand
    }
  }
}

</script>

<style lang="scss" scoped>
$sidebarWidth: 250px;

aside {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: calc(-1 * $sidebarWidth);
  overflow: hidden;
  min-height: 100vh;
  padding: 0.5rem;
  width: $sidebarWidth;
  //width: calc(2rem + 32px);
  transition: 0.3s ease-in-out;
  background-color: var(--light);
  z-index: 99;

  &.is-expanded {
    transform: translateX($sidebarWidth);
  }

  & .menu-toggle {
    display: flex;
    align-items: center;
    @apply mx-2;
  }

  .logo {
    margin: 0.15rem;

    img {
      width: 2rem;
      height: 2rem;
    }
  }

  .menu-toggle-wrap {
    display: flex;

    & button {
      display: flex;
      border-radius: 50%;
      padding: 5px;
      align-items: center;

      // &:hover {
      //   background-color: var(--primary);
      // }
    }

    .material-symbols-outlined {
      font-size: 2rem;
    }
  }

  .main-menu-items {
    margin: 1.5rem 0.5rem;

    .menu-button {
      display: flex;
      align-items: center;
      border-radius: 10px;
      text-decoration: none;
      padding: 0.5rem 0.5rem;
      margin: 0.5rem 0;
      transition: 0.2s ease-out;

      .material-symbols-outlined {
        font-size: 1.5rem;
        margin-right: 1rem;
        color: var(--dark);
        transition: 0.2s ease-out;
      }

      .menu-label {
        transition: 0.2s ease-out;
        color: var(--dark);
      }

      &:hover,
      &.router-link-exact-active {
        background-color: var(--primary);
      }
    }
  }

  .menu-button .menu-label {
    opacity: 1;
    transition: 0.3s ease-out;
  }

  .menu-dropdown {
    &.dropdown-expanded {
      & .dropdown-button {
        & .expand-more {
          transition: 0.2s ease-out;
          transform: rotate(180deg);
        }
      }
    }

    & .dropdown-button {
      display: flex;
      padding: 0 0.5rem;
      border-radius: 10px;

      &:hover {
        cursor: pointer;
      }

      .material-symbols-outlined {
        margin-right: 1rem;
      }

      & .menu-label {
        flex: 2;
      }

      & .expand-more {
        margin-right: 0;
        text-align: right;
        white-space: nowrap;
        transition: 0.2s ease-out;
      }
    }


    & .dropdown-items {
      .menu-button {
        padding: 0.1rem 0.75rem;
        padding-left: 2rem;
      }

      .material-symbols-outlined {
        font-size: 1rem;
      }

      .menu-label {
        white-space: nowrap;
        font-size: 12px;
      }
    }
  }

  .dropdown-fall-enter-active {
    transition: all 0.3s ease-out;
  }

  .dropdown-fall-leave-active {
    transition: all 0.3s ease-in;
  }

  .dropdown-fall-enter-from,
  .dropdown-fall-leave-to {
    transform: translateY(-30px);
    opacity: 0;
  }

  @media (max-width: 768px) {
    position: fixed;
    z-index: 99;
  }
}
</style>
