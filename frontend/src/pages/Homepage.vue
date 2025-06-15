<template>
  <div class="max-w-md mx-auto mt-16 p-6 border rounded shadow">
    <h1 class="text-4xl font-bold mb-8 text-center text-green-700">StudyBuddy</h1>

    <form @submit.prevent="login" novalidate>
      <label for="email" class="block font-semibold">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        placeholder="Enter your email"
        class="w-full p-2 border rounded mb-1"
        required
      />
      <p v-if="loginError && loginErrorType === 'email'" class="text-red-600 mb-2">{{ loginError }}</p>

      <label for="password" class="block font-semibold">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        placeholder="Enter your password"
        class="w-full p-2 border rounded mb-1"
        required
      />
      <p v-if="loginError && loginErrorType === 'password'" class="text-red-600 mb-2">{{ loginError }}</p>

      <button
        type="submit"
        class="w-full bg-green-600 text-white font-semibold p-3 rounded hover:bg-green-700 transition"
      >
        Sign In
      </button>
    </form>

    <div class="mt-6 text-center">
      <p>Don't have an account? </p>
      <button
        @click="goToCreateAccount"
        class="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Create Account
      </button>
    </div>

    <p v-if="generalError" class="mt-4 text-red-600 text-center">{{ generalError }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const loginError = ref('')
const loginErrorType = ref('') // 'email' or 'password'
const generalError = ref('')

const router = useRouter()

async function login() {
  loginError.value = ''
  generalError.value = ''
  loginErrorType.value = ''

  try {
    const res = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    const result = await res.json()

    if (result.success) {
      localStorage.setItem('user', email.value)
      router.push('/profile')
    } else if (result.error === 'email_not_found') {
      loginError.value = 'This email is not linked to an account. Please create an account.'
      loginErrorType.value = 'email'
    } else if (result.error === 'wrong_password') {
      loginError.value = 'Incorrect password. Please try again.'
      loginErrorType.value = 'password'
    } else {
      generalError.value = 'Login failed. Please try again.'
    }
  } catch (err) {
    generalError.value = 'Server error. Please try later.'
    console.error(err)
  }
}

function goToCreateAccount() {
  router.push('/create-account')
}
</script>
