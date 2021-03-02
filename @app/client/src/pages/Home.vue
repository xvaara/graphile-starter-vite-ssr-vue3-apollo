<template>
  <h1>Home</h1>
  <p>
    <img src="../assets/logo.png" alt="logo" />
  </p>
  <button @click="state.count++">count is: {{ state.count }}</button>
  <p class="virtual">msg from virtual module: {{ foo.msg }}</p>
  <pre v-if="sharedResult">{{ sharedResult.currentUser }}</pre>
  <pre>{{ x }}</pre>
</template>

<script setup>
import foo from '@foo'
import { reactive, computed } from 'vue'
import { SharedDocument } from '@app/graphql'
import { useQuery } from 'villus';
const { data: sharedResult } = useQuery({
  query: SharedDocument,
});
const x = computed(() => {
  return sharedResult.value ? sharedResult.value.currentUser : {}
});
// const currentUser = sharedResult.value.currentUser
const state = reactive({ count: 0 })
</script>

<style scoped>
h1,
a {
  color: green;
}
</style>
