<template>
  <div>
    <nav class="bg-white dark:bg-gray-800  shadow ">
      <div class="max-w-7xl mx-auto px-8">
        <div class="flex items-center justify-between h-16">
          <div class=" flex items-center">
            <a class="flex-shrink-0" href="/">
              <img class="h-8 w-8" src="/favicon.svg" alt="Graphile" />
            </a>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <router-link to="/">
                  <my-button>Home</my-button>
                </router-link>
                <router-link to="/about">
                  <my-button>About</my-button>
                </router-link>
                <router-link to="/option">
                  <my-button>Option api</my-button>
                </router-link>
                <router-link to="/o">
                  <my-button>Organizations</my-button>
                </router-link>
              </div>
            </div>
          </div>
          <div class="block">
            <div class="ml-4 flex items-center md:ml-6">
              <button class="icon-btn mx-2 !outline-none" title="Toggle dark" @click="toggleDark()">
                <carbon-moon v-if="isDark" />
                <carbon-sun v-else />
              </button>
              <div class="ml-3 relative">
                <div v-if="currentUser" class="relative inline-block text-left">
                  <router-link to="/login">
                    <button id="options-menu" type="button" class="  flex items-center justify-center w-full rounded-md  px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500">
                      <span>
                        {{ currentUser.name || currentUser.username }}
                      </span>
                      <carbon-user class="ml-1" />
                    </button>
                  </router-link>
                </div>
                <div v-else class="relative inline-block text-left">
                  <router-link to="/login">
                    <button id="options-menu" type="button" class="  flex items-center justify-center w-full rounded-md  px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500">
                      <span>
                        login
                      </span>
                      <carbon-login class="ml-1" />
                    </button>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>

  <div class="shadow-lg px-4 py-6 w-8/12 bg-white dark:bg-gray-700 relative text-gray-700 dark:text-white mx-auto mt-3">
    <router-view v-slot="{ Component }">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </router-view>
  </div>
</template>

<script>
// for some reason the new script setup syntax + provide + vue-apollo caused problems...
import { provide } from 'vue'
import { useSharedQuery, CurrentUserUpdatedDocument } from '@app/graphql'
export default {
  setup() {
    const { result, subscribeToMore } = useSharedQuery({
      fetchPolicy: 'cache-first',
    })
    const currentUser = useResult(result)
    console.log(currentUser.value)
    if (currentUser.value)
      subscribeToMore({ document: CurrentUserUpdatedDocument })

    provide('currentUser', currentUser)
    const isDark = useDark()
    const toggleDark = useToggle(isDark)
    return { currentUser, isDark, toggleDark }
  },
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #505d6b;
}
</style>
