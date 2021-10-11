<template>
  <h1>{{ currentUser.username }} emails</h1>
  <div v-for="email,index in currentUser.userEmails.nodes" :key="index">
    {{ email }}
  </div>
</template>

<script lang="ts">
import { SettingsEmailsDocument } from '@app/graphql'

export default defineComponent({
  apollo: {
    currentUser: {
      query: SettingsEmailsDocument,
      prefetch: true,
      // fetchPolicy: 'network-only',
    },
  },
  // async serverPrefetch() {
  //   return new Promise(async (resolve) => {
  //     console.log('prefetch promis')
  //     watch(
  //         () => this.$apollo.loading,
  //       () => resolve(),
  //     );
  //       console.log('prefetch end')
  //   });
  // },
  setup() {
    return {
      msg: 'msh',
    }
  },

})
</script>
