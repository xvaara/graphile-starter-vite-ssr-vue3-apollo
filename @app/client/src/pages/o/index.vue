<template>
  <h1 class="text-xl">
    Organizations
  </h1>
  <div v-for="orgMember,index in currentUser?.organizationMemberships?.nodes" :key="index">
    <router-link class="border-grey" :to="'/o/' + orgMember?.organization?.slug">
      {{ orgMember?.organization?.name }}
    </router-link>
  </div>
  <div class="flex flex-col w-full max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10 mx-auto">
    <div class="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white">
      Add org
    </div>
    <div v-if="error" class="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white">
      {{ error }}
    </div>

    <form autoComplete="off" @submit.prevent="mutate(newOrg)">
      <div class="flex flex-col mb-2">
        <div class="flex relative ">
          <input id="sign-in-email" v-model="newOrg.name" type="text" class="rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Name" />
        </div>
      </div>
      <div class="flex flex-col mb-6">
        <div class="flex relative ">
          <input id="sign-in-password" v-model="newOrg.slug" type="text" class=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Slug" />
        </div>
      </div>
      <div class="flex w-full">
        <button type="submit" class="py-2 px-4  bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg " @click="mutate(newOrg)">
          Add
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang=ts>
import { useCreateOrganizationMutation, useSharedQuery, CreateOrganizationInput, User } from '@app/graphql'
const currentUser: User | undefined = inject('currentUser')
const newOrg: CreateOrganizationInput = reactive({ name: '', slug: '' })
const error = ref('')
const { mutate, onError, onDone } = useCreateOrganizationMutation({
})

onError((err) => {
  error.value = err.message
})

onDone((result) => {
  console.log(result)
  error.value = ''
  const { refetch } = useSharedQuery()
  refetch()
})

</script>
