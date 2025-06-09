<script setup>
import { onMounted, ref } from 'vue'

const profile = ref(null)

onMounted(async () => {
  const res = await fetch('http://localhost:3001/api/profile')
  profile.value = await res.json()
})
</script>

<template>
  <div class="p-6 text-center">
    <h1 class="text-4xl font-bold mb-4">User Profile</h1>
    <div v-if="profile">
      <p><strong>Name:</strong> {{ profile.name }}</p>
      <p><strong>Email:</strong> {{ profile.email }}</p>
      <p><strong>Bio:</strong> {{ profile.bio }}</p>
    </div>
    <div v-else>
      Loading...
    </div>
  </div>
</template>