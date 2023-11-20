<template>
    <v-snackbar v-model="isSnackbarOpen" :color="isSuccess ? 'success' : 'red'" bottom :timeout="2000">
      {{ message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="closeSnackbar">Close</v-btn>
      </template>
    </v-snackbar>
  </template>
  
  <script>
  export default {
    props: {
      snackbarAttribute: {
        type: Object,
        required: true,
      },
    },
    computed: {
      isSnackbarOpen: {
        get() {
          return this.snackbarAttribute.isSnackbarOpen;
        },
        set(value) {
          this.$emit('update:snackbarAttribute', { ...this.snackbarAttribute, isSnackbarOpen: value });
        },
      },
      isSuccess() {
        return this.snackbarAttribute.isSuccess;
      },
      message() {
        return this.snackbarAttribute.message;
      },
    },
    methods: {
      closeSnackbar() {
        this.isSnackbarOpen = false
      },
    },
  };
  </script>