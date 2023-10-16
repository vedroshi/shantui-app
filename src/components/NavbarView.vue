<script setup>
import { ref } from 'vue'

const notifExpand = ref(false)

const showNotif = () => {
  notifExpand.value = !notifExpand.value
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
        <select name="language" id="lang">
          <option value="English">EN</option>
          <option value="Chinese">中文</option>
          <option value="Indonesian">ID</option>
        </select>
      </div>
      <div class="nav-menu-item notification" v-bind:class="notifExpand && 'notif-expanded'">
        <button class="notif-button" @click="showNotif">
          <span class="material-symbols-outlined"> notifications </span>
          <div class="notif-count">
            <span>1</span>
          </div>
        </button>
        <div v-show="notifExpand" class="notif-details">
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
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
$navbarHeight: 50px;

nav {
  height: $navbarHeight;
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
        border: 1px solid black;

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
        & #lang {
          padding: 0.35rem;
          margin: 0.25rem 0rem;
          border-radius: 10px;
          background-color: white;
          border: 1px solid black;

          &:hover {
            background-color: var(--lightgray);
          }

          & option {
            background-color: white;
          }
        }
      }

      &.notification {
        position: relative;
        .notif-button {
          display: flex;
          border-radius: 50%;
          padding: 8px;
          &:hover {
            background-color: var(--lightgray);
          }

          & .notif-count {
            position: absolute;
            top: 5px;
            right: 4px;
            width: 1rem;
            border-radius: 50%;
            background-color: red;
            font-weight: bold;
            font-size: 10px;
            text-align: center;
          }
        }
        & .notif-details {
          position: absolute;
          right: 0;
          width: 300px;
          border-radius: 10px;
          height: 200px;
          @apply mt-2;
        }
      }
      &.notif-expanded {
        & .notif-details {
          background-color: white;
          border: 1px solid black;
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
