<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/solid'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { LogoutIcon, PencilAltIcon } from '@heroicons/vue/outline'

const store = useStore()

const token = computed(() => store.getters['auth/decodedAccessToken'])

const label = computed(() => {
  if (!token.value.first_name) return 'account'
  if (token.value.first_name.length > 5) return token.value.first_name.slice(0, 5) + '...'
  return token.value.first_name
})

const signOut = () => {
  store.dispatch('auth/logout')
    .then(() => {
      window.location = '/signin'
    })
}
</script>

<template>
  <Menu as="div" class="relative inline-block text-left" v-slot="{ open }">
    <div>
      <MenuButton
        :class="[ open ? 'text-gray-900' : 'text-gray-500', 'bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500']"
      >
        {{ label }}
        <ChevronDownIcon
          class="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
          aria-hidden="true"
        />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="px-1 py-1 text-sm">
          <ul class="ml-7 px-2 py-2"> 
            <li class="block">Signed is as:</li>
            <li class="block break-words" :title="token.email"> {{ token.email }} </li>
          </ul>
        </div>

        <div class="px-1 py-1">
          <MenuItem v-slot="{ active }">
            <button
              :class="[
                active ? 'bg-violet-500 text-white' : 'text-gray-900',
                'group flex rounded-md items-center w-full px-2 py-2 text-sm',
              ]"
            >
              <PencilAltIcon
                :active="active"
                class="w-5 h-5 mr-2 text-violet-400"
                aria-hidden="true"
              />
              Profile
            </button>
          </MenuItem>
        </div>

        <div class="px-1 py-1">
          <MenuItem v-slot="{ active }">
            <button
              :class="[
                active ? 'bg-violet-500 text-white' : 'text-gray-900',
                'group flex rounded-md items-center w-full px-2 py-2 text-sm',
              ]"
              @click.prevent="signOut"
            >
              <LogoutIcon
                :active="active"
                class="w-5 h-5 mr-2 text-violet-400"
                aria-hidden="true"
              />
              Sign out
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>