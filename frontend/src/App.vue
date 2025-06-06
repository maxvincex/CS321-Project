<template>
  <div>
    <nav class="bg-gray-800 text-white p-4 flex justify-center space-x-6">
      <RouterLink to="/" class="hover:underline">Home</RouterLink>
      <RouterLink to="/profile" class="hover:underline">Profile</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>