<template>
  <h1>Home</h1>
  <p>
    <img src="../assets/logo.png" alt="logo" />
  </p>
  <button @click="state.count++">count is: {{ state.count }}</button>
  <p class="virtual">msg from virtual module: {{ foo.msg }}</p>
  <pre>{{ currentUser }}</pre>
  <pre>{{ x }}</pre>
</template>

<script setup>
import foo from '@foo'
import { reactive, computed } from 'vue'
import { SharedDocument } from '@app/graphql'
import { useQuery, useResult, useMutation } from '@vue/apollo-composable'
const { result } = useQuery({
  query: SharedDocument,
});
const x = computed(() => {
  return result.value ? sharedResult.value : {}
});

const currentUser = useResult(result, null, data => data.currentUser)
// const currentUser = sharedResult.value.currentUser
const state = reactive({ count: 0 })
</script>

<style scoped>
h1,
a {
  color: green;
}
</style>
