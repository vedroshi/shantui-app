<template>
  <div>
    {{ $route.query.name }}
    {{ console.log(this.karyawanData) }}
  </div>
</template>

<script>
export default {
  props: ['karyawanData'],
  data() {
    return {
 
    }
  },
 
}
</script>

<style lang="scss" scoped></style>
