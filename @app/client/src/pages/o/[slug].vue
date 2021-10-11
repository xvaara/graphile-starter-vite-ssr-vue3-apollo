<script setup lang="ts">
import { useOrganizationBySlugQuery } from '@app/graphql'
import { useResult } from '@vue/apollo-composable'
const props = defineProps<{ slug: string }>()
const router = useRouter()
const { result } = useOrganizationBySlugQuery(() => ({ slug: props.slug }))
const organization = useResult(result)

</script>

<template>
  <div>
    <!-- <p class="text-4xl">
      <carbon-pedestrian class="inline-block" />
    </p> -->
    <p>
      {{ organization?.name }}
    </p>

    <div>
      <button
        class="py-2 px-4  bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
        @click="router.back()"
      >
        back
      </button>
    </div>
  </div>
</template>
