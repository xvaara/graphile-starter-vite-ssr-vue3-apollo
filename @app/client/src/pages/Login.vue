<template>
  <div class="flex flex-col w-full max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10 mx-auto">
    <div class="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white">
      Login To Your Account
    </div>
    <div v-if="error" class="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white">
      {{ error }}
    </div>
    <div class="mt-8">
      <form autoComplete="off" @submit.prevent="loginAction(login)">
        <div class="flex flex-col mb-2">
          <div class="flex relative ">
            <span class="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
              <carbon-account />
            </span>
            <input id="sign-in-email" v-model="login.username" type="text" class="rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Your login" />
          </div>
        </div>
        <div class="flex flex-col mb-6">
          <div class="flex relative ">
            <span class="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
              <carbon-password />
            </span>
            <input
              id="sign-in-password"
              v-model="login.password"
              type="password"
              autocomplete="current-password"
              class=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Your password"
            />
          </div>
        </div>
        <div class="flex w-full">
          <button type="submit" class="py-2 px-4  bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg " @click="loginAction(login)">
            Login
          </button>
        </div>
      </form>
    </div>
    <div class="flex items-center justify-center mt-6">
      <router-link to="/register" class="inline-flex items-center text-xs font-thin text-center text-gray-500 hover:text-gray-700 dark:text-gray-100 dark:hover:text-white">
        <span class="ml-2">
          You don&#x27;t have an account?
        </span>
      </router-link>
      {{ login }}
    </div>
  </div>
</template>

<script setup lang="ts">

import { useLoginMutation, LoginInput } from '@app/graphql'
const login: LoginInput = reactive({ username: '', password: '' })
const error = ref('')
const router = useRouter()
const { mutate: loginAction, onError, onDone } = useLoginMutation({})

onError((err) => {
  console.log(err)
  error.value = err.message
})

onDone((result) => {
  console.log(result)
  router.push('/o')
})
</script>
