<template>
  <!-- this is a comment for trial -->
  <div class="page-wrapper">
    <h1 class="logo">StudyBuddy - Create Account</h1>

    <form class="form-box" @submit.prevent="handleCreateAccount">
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
      <p class="password-note">
        Password must consist of at least 8 characters and one number.
      </p>

      <label for="firstName">First Name *</label>
      <input
        id="firstName"
        type="text"
        placeholder="Enter your first name"
        v-model="firstName"
        required
      />

      <label for="lastName">Last Name *</label>
      <input
        id="lastName"
        type="text"
        placeholder="Enter your last name"
        v-model="lastName"
        required
      />

      <label for="major">Major *</label>
      <input
        id="major"
        type="text"
        placeholder="Enter your major"
        v-model="major"
        required
      />

      <label for="classes">Classes *</label>
      <input
        id="classes"
        type="text"
        placeholder="e.g. CS321, HIST101, MATH203"
        v-model="classes"
        required
      />

      <label>Availability *</label>
      <div class="availability-group">
        <label><input type="radio" value="anytime" v-model="availability" /> Anytime</label>
        <label><input type="radio" value="weekday" v-model="availability" /> Weekday</label>
        <label><input type="radio" value="weekend" v-model="availability" /> Weekend</label>
      </div>

      <button type="submit" class="btn btn-blue">Create Account</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const firstName = ref("");
const lastName = ref("");
const major = ref("");
const classes = ref("");
const availability = ref("anytime");

const router = useRouter();

const handleCreateAccount = () => {
  // TODO: Validate inputs, call backend API to create account

  alert(
    `Creating account for ${email.value} with availability ${availability.value}`
  );
  router.push("/"); // Redirect to homepage or sign in page after account creation
};
</script>

<style>
/* Reuse styles from Homepage.vue */
.page-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
  font-family: Arial, sans-serif;
  background-color: #f7f9f9;
  min-height: 100vh;
  padding: 20px;
}

.logo {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2f855a;
  margin-bottom: 30px;
}

.form-box {
  width: 360px;
  background: white;
  padding: 30px 40px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  text-align: left;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
}

input[type="email"],
input[type="password"],
input[type="text"] {
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
  color: #e53e3e;
  margin-top: -10px;
  margin-bottom: 15px;
}

.availability-group {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

.availability-group label {
  font-weight: normal;
  color: #2d3748;
  cursor: pointer;
}

.availability-group input {
  margin-right: 6px;
}

.btn {
  width: 100%;
  padding: 14px;
  font-size: 1.1rem;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: white;
  background-color: #3182ce; /* blue */
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #2c5282;
}
</style>
