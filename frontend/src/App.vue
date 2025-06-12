<template>
  <div>
    <nav class="bg-gray-800 text-white p-4 flex justify-center space-x-6">
      <RouterLink to="/" class="hover:underline">Home</RouterLink>
      <RouterLink to="/profile" class="hover:underline">Profile</RouterLink>
    </nav>
    <RouterView />

    <!-- Basic login form appears below router pages -->
    <div class="mt-6 p-4 bg-gray-100 max-w-md mx-auto rounded">
      <h2 class="text-lg font-bold mb-2">Login (Temporary Home Test)</h2>
      <input v-model="email" placeholder="Email" class="mb-2 p-2 border w-full" />
      <input v-model="password" type="password" placeholder="Password" class="mb-2 p-2 border w-full" />
      <button @click="login" class="bg-blue-600 text-white px-4 py-2 rounded w-full">Login</button>
    </div>
  </div>
</template>



<script setup>
import { ref } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
const email = ref('')
const password = ref('')

const login = async () => {
  try {
    const res = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const result = await res.json()
    if (result.success) {
      alert('Login successful!')
    } else {
      alert('Invalid login. Try again or create an account.')
    }
  } catch (err) {
    alert('Server error')
    console.error(err)
  }
}
</script>