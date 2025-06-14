<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
    <!-- Logo -->
    <h1 class="text-4xl font-bold mb-8 text-green-600">StudyBuddy</h1>

    <!-- Sign In Box -->
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-semibold mb-6 text-center">Sign In</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            v-model="email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">
            Password <span class="text-red-500">*</span>
          </label>
          <input
            v-model="password"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          class="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold transition"
        >
          Login
        </button>
      </form>

      <!-- Divider and Create Account -->
      <div class="text-center mt-6">
        <p class="text-sm text-gray-600">or</p>
        <router-link to="/create-account">
          <button
            class="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold transition"
          >
            Create Account
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Homepage',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    handleLogin() {
      // TODO: replace this with real login logic or backend request
      console.log("Login attempted with:", this.email, this.password);
    }
  }
}
</script>

<style scoped>
/* Optional: custom font or extra tweaks */
</style>
