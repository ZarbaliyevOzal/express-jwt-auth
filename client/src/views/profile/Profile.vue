<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useStore } from 'vuex';
import router from '../../routes';

const store = useStore()

const accessToken = computed(() => store.getters['auth/accessToken'])

const decodedAccessToken = computed(() => store.getters['auth/decodedAccessToken'])


const currentTime = ref('')
setInterval(() => {
  currentTime.value = new Date()
}, 100)


const posts = ref([])
// onBeforeMount(() => {
//   fetchPosts()
// })

const fetchPosts = () => {
  axios.get('/posts')
    .then((res) => posts.value = res.data)
    .catch((err) => console.log(err.message))
    .finally(() => console.log('request successfull new token is: ' + accessToken.value))
}

const logout = () => {
  store.dispatch('auth/logout')
    .then(() => {
      router.push({ name: 'SignIn' })
    })
}
</script>

<template>
  
</template>