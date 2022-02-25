<script setup>
import { InformationCircleIcon, XIcon } from '@heroicons/vue/outline'
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: () => ''
  },
  dissmissable: {
    type: Boolean,
    default: () => false
  }
})

const statusClass = computed(() => {
  return 'bg-orange-100 border-orange-400 text-orange-700'
})

const iconColor = computed(() => {
  return 'text-orange-500'
})
</script>

<template>
  <div :class="['px-4 py-3 rounded', statusClass]" role="alert">
    <slot></slot>
    <button @click.prevent v-if="dissmissable" class="absolute top-0 bottom-0 right-0 px-4 py-3">
      <XIcon :class="['fill-current h-6 w-6', iconColor]"/>
    </button>
  </div>
</template>