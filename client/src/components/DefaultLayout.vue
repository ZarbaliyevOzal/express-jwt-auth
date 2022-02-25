<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Navbar from './Navbar.vue'
import Notification from './Notification.vue'

const store = useStore()

const resendVerificationLink = () => {
  store.dispatch('auth/resendVerificationLink')
    .then((res) => res)
    .catch((err) => console.log(err))
}

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])

const decodedAccessToken = computed(() => store.getters['auth/decodedAccessToken'])

const isVerified = computed(() => decodedAccessToken.value ? decodedAccessToken.value.verified_at : null)

</script>

<template>
  <div>
    <Navbar/>
    <div class="py-4 sm:py-6 px-4 sm:px-6 mx-auto max-w-7xl" v-if="isAuthenticated && !isVerified">
      <Notification>
        <span class="font-mediums">
          Please verify your email address. 
          Check your email address for verification link 
          or 
          <button @click.prevent="resendVerificationLink" class="underline font-medium text-indigo-700">
            click 
          </button>
          for getting new one
        </span>
      </Notification>
    </div>
    <slot></slot>
  </div>
</template>