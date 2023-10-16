<script setup>
import { ref } from 'vue'

import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'

const notifExpand = ref(false)

const showNotif = () => {
  notifExpand.value = !notifExpand.value
}

const langOptions = [
  {
    lang: 'en',
    value: 'EN',
    name: 'English'
  },
  {
    lang: 'cn',
    value: '中文',
    name: 'Chinese'
  },
  {
    lang: 'id',
    value: 'ID',
    name: 'Indonesian'
  }
]
const selectedLang = ref(langOptions[0])
</script>

<script>
export default {
  data: () => ({})
}
</script>

<template>
  <nav>
    <div class="nav-path">
      <ol class="nav-path-lists">
        <li class="inline-flex items-center">
          <router-link to="/" class="nav-path-link">
            <span class="material-symbols-outlined text-base mr-2"> home </span>
            Dashboard
          </router-link>
        </li>
        <li>
          <div class="flex items-center">
            <span class="material-symbols-outlined text-slate-400"> navigate_next </span>
            <a href="#" class="nav-path-link"> Templates </a>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <span class="material-symbols-outlined text-slate-400"> navigate_next </span>
            <span class="nav-path-current">Flowbite</span>
          </div>
        </li>
      </ol>
    </div>
    <div class="nav-menu">
      <div class="nav-menu-item search">
        <input type="text" placeholder="Search" />
        <button>
          <span class="material-symbols-outlined"> search </span>
        </button>
      </div>
      <div class="nav-menu-item language">
        <Listbox v-model="selectedLang">
          <div class="relative w-100">
            <ListboxButton class="lang-list-button">
              <span class="truncate">{{ selectedLang.value }}</span>
              <span
                class="material-symbols-outlined pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
              >
                arrow_drop_down
              </span>
            </ListboxButton>

            <transition
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions class="lang-list-options">
                <ListboxOption
                  v-slot="{ active, selected }"
                  v-for="langOption in langOptions"
                  :key="langOption.lang"
                  :value="langOption"
                  as="template"
                >
                  <li
                    :class="[
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-3 hover:cursor-pointer'
                    ]"
                  >
                    <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                      {{ langOption.value }}
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </div>
      <div class="nav-menu-item notification" v-bind:class="notifExpand && 'notif-expanded'">
        <!-- <button class="notif-button" @click="showNotif">
          <span class="material-symbols-outlined"> notifications </span>
          <div class="notif-count">
            <span>1</span>
          </div>
        </button> -->
        <v-btn class="notif-button" @click="showNotif">
          <v-badge class="notif-count" content="1" color="error">
            <span class="material-symbols-outlined"> notifications </span>
          </v-badge>
        </v-btn>
        <v-card v-show="notifExpand" class="notif-details">
          <v-card-title> Notification </v-card-title>
          <v-divider :thickness='3' color="black"></v-divider>
          <v-virtual-scroll height="400" width="350">
            <div class="notif-detail">
              <div class="notif-content">
                <h4>Title</h4>
                <p>Description</p>
              </div>
              <div class="notif-status">
                <p>10/10/23</p>
                <span class="status"></span>
              </div>
            </div>
          </v-virtual-scroll>
        </v-card>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
$navbarHeight: 50px;

nav {
  height: $navbarHeight;
  width: auto;
  background-color: var(--light);
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  & .nav-path {
    padding: 1rem;

    & .nav-path-lists {
      @apply inline-flex;
      @apply items-center;
      @apply space-x-1;
      @apply md:space-x-3;

      & .nav-path-link {
        @apply inline-flex;
        @apply items-center;
        @apply text-sm;
        @apply font-medium;
        @apply text-gray-700;
        @apply md:ml-2;
        @apply dark:text-gray-400;

        &:hover {
          text-decoration: underline;
          background-color: transparent;
        }
      }

      & .nav-path-current {
        @apply text-sm;
        @apply font-medium;
        @apply text-gray-500;
        @apply md:ml-2;
        @apply dark:text-gray-400;
      }
    }

    & .nav-item {
      color: var(--dark);
      &:hover {
        text-decoration: underline;
        background-color: transparent;
      }
    }
  }

  & .nav-menu {
    display: flex;
    padding: 0.25rem;

    .nav-menu-item {
      margin: 0 5px;

      &.search {
        display: flex;
        margin: 0.25rem;
        border-radius: 10px;
        @apply ring-1;
        @apply ring-black;
        @apply ring-opacity-5;
        @apply focus:outline-none;

        & input {
          padding: 1rem;
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
          border: none;
          width: 200px;
        }
        & button {
          z-index: 5;
          display: flex;
          justify-content: center;
          align-items: center;
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
          background-color: var(--primary);
          width: 50px;
          &:hover {
            background-color: var(--secondary);
          }
        }
      }

      &.language {
        padding: 0.1rem 0;
        & .lang-list-button {
          @apply relative;
          @apply w-full;
          @apply cursor-default;
          @apply rounded-lg;
          @apply bg-white;
          @apply shadow-sm;
          @apply py-2;
          @apply pl-3;
          @apply pr-12;
          @apply text-left;
          @apply focus:outline-none;
          @apply focus-visible:border-indigo-500;
          @apply focus-visible:ring-2;
          @apply focus-visible:ring-white;
          @apply focus-visible:ring-opacity-75;
          @apply focus-visible:ring-offset-2;
          @apply focus-visible:ring-offset-orange-300;
          @apply sm:text-sm;
          @apply hover:cursor-pointer;
          @apply hover:bg-gray-300;
        }

        & .lang-list-options {
          @apply absolute;
          @apply mt-1;
          @apply max-h-60;
          @apply w-full;
          @apply overflow-auto;
          @apply rounded-md;
          @apply bg-white;
          @apply text-base;
          @apply shadow-md;
          @apply ring-1;
          @apply ring-black;
          @apply ring-opacity-5;
          @apply focus:outline-none;
          @apply sm:text-sm;
        }
      }

      &.notification {
        .notif-button {
          border-radius: 50%;
          min-width: 30px;
          padding: 0 0.4rem;
          box-shadow: none;
          background-color: transparent;
          
          &:hover {
            background-color: var(--lightgray);
          }

        }

        & .notif-details {
          position: absolute;
          right: 10px;
          border-radius: 10px;
          height: 200px;
          @apply mt-2;
        }
      }
      &.notif-expanded {
        & .notif-details {
          background-color: white;
          overflow-y: auto;
          scrollbar-width: thin;
          transition: 0.2s ease-out;

          & .notif-detail {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid var(--lightgray);
            padding: 5px 10px;
            p {
              font-size: 11px;
            }
            & .notif-status {
              & .status {
                display: block;
                height: 10px;
                width: 10px;
                margin: 8px 15px;
                border-radius: 50%;
                background-color: red;
              }
            }
          }
        }
      }
    }
  }
}
</style>
