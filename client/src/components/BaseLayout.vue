<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import DefaultLayout from './DefaultLayout.vue';

const { currentRoute } = useRouter()
</script> 

<template>
  <DefaultLayout>
    <router-view></router-view>
  </DefaultLayout>
</template>