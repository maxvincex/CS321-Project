<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
      <h1 class="text-3xl font-bold text-center text-blue-600 mb-6">StudyBuddy - Create Account</h1>

      <form @submit.prevent="submitForm" class="space-y-5">
        <!-- Email -->
        <div>
          <label>Email <span class="text-red-500">*</span>:</label>
          <input
            v-model="email"
            type="email"
            class="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p v-if="emailExists" class="text-red-600 text-sm mt-1">
            An account with this email already exists.
          </p>
        </div>

        <!-- Password -->
        <div>
          <label>Password <span class="text-red-500">*</span>:</label>
          <p class="text-red-600 text-sm mb-1">Password must consist of at least 8 characters and one number.</p>
          <input
            v-model="password"
            type="password"
            class="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <!-- Name -->
        <div class="flex space-x-4">
          <div class="flex-1">
            <label>First Name <span class="text-red-500">*</span>:</label>
            <input
              v-model="firstName"
              type="text"
              class="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div class="flex-1">
            <label>Last Name <span class="text-red-500">*</span>:</label>
            <input
              v-model="lastName"
              type="text"
              class="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <!-- Major -->
        <div>
          <label>Major <span class="text-red-500">*</span>:</label>
          <input
            v-model="major"
            type="text"
            class="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <!-- Classes -->
        <div>
          <label>Classes <span class="text-red-500">*</span>:</label>
          <input
            v-model="classesRaw"
            type="text"
            placeholder="e.g. CS321, HIST101, MATH203"
            class="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <!-- Availability -->
        <div>
          <label>Availability:</label>
          <div class="flex space-x-4 mt-1">
            <label class="flex items-center space-x-1">
              <input type="radio" value="anytime" v-model="availability" />
              <span>Anytime</span>
            </label>
            <label class="flex items-center space-x-1">
              <input type="radio" value="weekday" v-model="availability" />
              <span>Weekday</span>
            </label>
            <label class="flex items-center space-x-1">
              <input type="radio" value="weekend" v-model="availability" />
              <span>Weekend</span>
            </label>
          </div>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Create Account
        </button>
      </form>

      <p v-if="successMessage" class="text-green-600 mt-4">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const major = ref('')
const classesRaw = ref('')
const availability = ref('')

const emailExists = ref(false)
const successMessage = ref('')

async function submitForm() {
  emailExists.value = false // reset error state

  const classes = classesRaw.value.split(',').map(c => c.trim()).filter(Boolean)

  const newUser = {
    email: email.value,
    password: password.value,
    firstName: firstName.value,
    lastName: lastName.value,
    major: major.value,
    classes,
    availability: availability.value,
  }

  try {
    const response = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })

    const data = await response.json()

    if (!response.ok) {
      if (data.error === 'Email already exists') {
        emailExists.value = true
        return
      } else {
        alert('Signup failed: ' + data.error)
        return
      }
    }

    successMessage.value = `Account created for ${firstName.value} ${lastName.value}! Redirecting...`
    setTimeout(() => {
      router.push('/signin')
    }, 2000)
  } catch (err) {
    console.error(err)
    alert('Something went wrong.')
  }
}
</script>
