<script setup>
import { ref } from 'vue'

const isExpanded = ref(localStorage.getItem('isExpanded') === 'true')

const toggleMenu = () => {
  isExpanded.value = !isExpanded.value
  localStorage.setItem('isExpanded', isExpanded.value)
}

const karyawanExpand = ref(false)

const toggleKaryawanMenu = () => {
  karyawanExpand.value = !karyawanExpand.value
}
</script>

<template>
  <aside v-bind:class="isExpanded && 'is-expanded'">
    <div class="menu-toggle-wrap">
      <button class="menu-toogle" @click="toggleMenu">
        <span class="material-symbols-outlined"> list </span>
      </button>
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
    </div>

    <div class="main-menu-items">
      <div class="menu-dropdown" v-bind:class="karyawanExpand && 'dropdown-expanded'">
        <div class="dropdown-button" @click="toggleKaryawanMenu">
          <span class="material-symbols-outlined"> group </span>
          <span class="menu-label">Employees</span>
          <span class="expand-more material-symbols-outlined"> expand_more </span>
        </div>
        <div class="dropdown-items" v-show="karyawanExpand">
          <Transition name="dropdown-fall">
            <router-link class="menu-button" to="/karyawan">
              <span class="material-symbols-outlined"> badge </span>
              <button class="menu-label">Employee List</button>
            </router-link>
          </Transition>
          </div>
      </div>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
$sidebarWidth: 250px;

aside {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 100vh;
  padding: 0.75rem;
  width: calc(2rem + 32px);
  background-color: var(--light);
  transition: 0.2s ease-out;

  .logo {
    img {
      width: 2rem;
      height: 2rem;
      display: none;
    }
  }

  .menu-toggle-wrap {
    & button {
      display: flex;
      border-radius: 50%;
      padding: 5px;
      align-items: center;
      &:hover {
        background-color: var(--primary);
      }
    }
    .material-symbols-outlined {
      font-size: 2rem;
    }
  }

  .main-menu-items {
    margin: 1.5rem 0;
    .menu-button {
      display: flex;
      align-items: center;
      border-radius: 10px;
      text-decoration: none;
      padding: 0.5rem 0.5rem;

      transition: 0.2s ease-out;

      .material-symbols-outlined {
        font-size: 1.5rem;
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
    opacity: 0;
    transition: 0.3s ease-out;
  }

  .menu-dropdown {
    & .dropdown-button {
      display: flex;
      padding: 0.5rem 0.5rem;
      border-radius: 10px;
      &:hover {
        cursor: pointer;

      }
    }

    & .menu-label,
    .expand-more {
      opacity: 0;
      transition: 0.2s ease-out;
    }

    & .dropdown-items {
    
      .menu-button {
        padding: 0.2rem 0.75rem;
      }
      .material-symbols-outlined {
        font-size: 1rem;
      }
      .menu-label {
        white-space: nowrap;
      }
    }
  }

  &.is-expanded {
    width: $sidebarWidth;
    .menu-toggle-wrap {
      top: -3rem;
      display: flex;
    }

    .logo {
      display: flex;
      flex-direction: row;
      align-items: center;
      transition: 0.2s ease-in-out;
      transform: translateX(10px);
    }

    .menu-button .menu-label {
      opacity: 1;
      transition: 0.3s ease-out;
    }

    .main-menu-items {
      .material-symbols-outlined {
        margin-right: 1rem;
      }

      .menu-dropdown {
        & .dropdown-button {
          & .menu-label {
            opacity: 1;
            transition: 0.2s ease-out;
            flex: 2;
          }
          & .expand-more {
            opacity: 1;
            margin-right: 0;
            text-align: right;
            white-space: nowrap;
          }
        }

        .dropdown-items {
         
          & .menu-button {
            padding: 0.2rem 2rem;
          }
          & .menu-label{
            font-size: 12px;
          }
          & .material-symbols-outlined {
            font-size: 1rem;
          }
        }

        &.dropdown-expanded {
          & .dropdown-button {
            & .expand-more {
              transition: 0.2s ease-out;
              transform: rotate(180deg);
            }
          }
        }
      }
    }
  }
  @media (max-width: 768px) {
    position: fixed;
    z-index: 99;
  }
}


</style>
