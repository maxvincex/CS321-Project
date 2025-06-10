<template>
 <div class="p-6 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4 text-white">Create Student</h1>

    <form @submit.prevent="submitStudent" class="space-y-4">
      <input v-model="username" placeholder="Username" class="w-full p-2 rounded" />
      <input v-model="password" placeholder="Password" type="password" class="w-full p-2 rounded" />
      <input v-model="availability" placeholder="Availability" class="w-full p-2 rounded" />
      <input v-model="coursesInput" placeholder="Courses (comma-separated)" class="w-full p-2 rounded" />

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  </div>

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
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const availability = ref('')
const coursesInput = ref('') // comma-separated input

const submitStudent = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        availability: availability.value,
        courses: coursesInput.value.split(',').map(c => c.trim()),
        friends: []
      })
    })

    const result = await response.json()
    console.log('✅ Student created:', result)
    alert('Student successfully added!')
  } catch (error) {
    console.error('❌ Error adding student:', error)
    alert('Something went wrong.')
  }
}
</script>