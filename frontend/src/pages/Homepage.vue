<template>
  <div class="page-wrapper">
    <h1 class="logo">StudyBuddy</h1>

    <div class="form-box">
      <form @submit.prevent="handleSignIn">
        <label for="email">Email *</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          v-model="email"
          required
        />

        <label for="password">Password *</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          v-model="password"
          required
        />
        <p class="password-note">Password must consist of at least 8 characters and one number.</p>

        <button type="submit" class="btn btn-green">Sign In</button>
      </form>

      <p class="separator">or</p>

      <button @click="goToCreateAccount" class="btn btn-blue">Create Account</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const handleSignIn = () => {
  // Your sign-in logic here
  alert(`Signing in with email: ${email.value}`)
}

const goToCreateAccount = () => {
  router.push('/create-account')
}
</script>

<style>
.page-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
  font-family: Arial, sans-serif;
  background-color: #f7f9f9;
  min-height: 100vh;
  padding: 20px;
}

.logo {
  font-size: 3rem;
  font-weight: bold;
  color: #2f855a; /* dark green */
  margin-bottom: 40px;
}

.form-box {
  width: 360px;
  background: white;
  padding: 30px 40px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  box-sizing: border-box;
  text-align: center;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  text-align: left;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 12px 18px;
  margin-bottom: 15px;
  border-radius: 25px;
  border: 1px solid #ccc;
  font-size: 1rem;
  box-sizing: border-box;
  outline: none;
}

.password-note {
  font-size: 0.85rem;
  color: #e53e3e; /* red */
  margin-top: -10px;
  margin-bottom: 15px;
  text-align: left;
}

.btn {
  width: 100%;
  padding: 14px;
  font-size: 1.1rem;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.btn-green {
  background-color: #38a169; /* green */
  color: white;
  margin-bottom: 15px;
}

.btn-green:hover {
  background-color: #2f855a;
}

.btn-blue {
  background-color: #3182ce; /* blue */
  color: white;
}

.btn-blue:hover {
  background-color: #2c5282;
}

.separator {
  margin: 15px 0;
  font-weight: 600;
  color: #718096; /* gray */
}
</style>
