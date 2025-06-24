<template>
  <div class="max-w-md mx-auto mt-16 p-6 border rounded shadow">
    <h1 class="text-3xl font-bold mb-6 text-center">StudyBuddy - Create Account</h1>
    <form @submit.prevent="handleCreateAccount" novalidate>
      <label for="email" class="block font-semibold">Email <span class="text-red-600">*</span></label>
      <input
        id="email"
        v-model="email"
        type="email"
        placeholder="Enter your email"
        class="w-full p-2 border rounded mb-1"
        required
      />
      <p v-if="emailError" class="text-red-600 mb-2">{{ emailError }}</p>

      <label for="password" class="block font-semibold">Password <span class="text-red-600">*</span></label>
      <input
        id="password"
        v-model="password"
        type="password"
        placeholder="Enter your password"
        class="w-full p-2 border rounded mb-1"
        required
      />
      <p class="text-red-600 mb-2">
        Password must consist of at least 8 characters and one number.
      </p>

      <label for="firstName" class="block font-semibold">First Name <span class="text-red-600">*</span></label>
      <input
        id="firstName"
        v-model="firstName"
        type="text"
        placeholder="First name"
        class="w-full p-2 border rounded mb-1"
        required
      />

      <label for="lastName" class="block font-semibold">Last Name <span class="text-red-600">*</span></label>
      <input
        id="lastName"
        v-model="lastName"
        type="text"
        placeholder="Last name"
        class="w-full p-2 border rounded mb-1"
        required
      />

      <label for="major" class="block font-semibold">Major <span class="text-red-600">*</span></label>
      <input
        id="major"
        v-model="major"
        type="text"
        placeholder="Your major"
        class="w-full p-2 border rounded mb-1"
        required
      />

      <label for="classes" class="block font-semibold">Classes <span class="text-red-600">*</span></label>
      <input
        id="classes"
        v-model="classes"
        type="text"
        placeholder="Comma-separated class codes"
        class="w-full p-2 border rounded mb-1"
        required
      />

      <p class="block font-semibold mb-1">Availability (choose one or both weekdays/weekends or anytime)</p>
      <div class="mb-4">
        <label class="inline-flex items-center mr-4">
          <input type="checkbox" value="weekday" v-model="availabilityWeekday" @change="handleAvailabilityChange" />
          <span class="ml-2">Weekday</span>
        </label>
        <label class="inline-flex items-center mr-4">
          <input type="checkbox" value="weekend" v-model="availabilityWeekend" @change="handleAvailabilityChange" />
          <span class="ml-2">Weekend</span>
        </label>
        <label class="inline-flex items-center">
          <input
            type="checkbox"
            value="anytime"
            v-model="availabilityAnytime"
            @change="handleAvailabilityChange"
          />
          <span class="ml-2">Anytime</span>
        </label>
      </div>

      <p v-if="availabilityError" class="text-red-600 mb-2">{{ availabilityError }}</p>
      <label for="bio" class="block font-semibold">Bio</label>
      <textarea
        id="bio"
        v-model="bio"
        placeholder="Tell us a bit about yourself (max 250 words)..."
        class="w-full p-2 border rounded mb-1"
        rows="5"
        maxlength="1500"
      ></textarea>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white font-semibold p-3 rounded hover:bg-blue-700 transition"
      >
        Create Account
      </button>

      <p v-if="generalError" class="mt-4 text-red-600 text-center">{{ generalError }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const major = ref('')
const classes = ref('')
const availabilityWeekday = ref(false)
const availabilityWeekend = ref(false)
const availabilityAnytime = ref(false)
const bio = ref('');

const emailError = ref('')
const availabilityError = ref('')
const generalError = ref('')

const router = useRouter()

function handleAvailabilityChange() {
  // If 'anytime' is checked, uncheck weekday and weekend, and vice versa
  if (availabilityAnytime.value) {
    availabilityWeekday.value = false
    availabilityWeekend.value = false
  } else {
    if (availabilityWeekday.value || availabilityWeekend.value) {
      availabilityAnytime.value = false
    }
  }
}

function validateForm() {
  emailError.value = ''
  availabilityError.value = ''
  generalError.value = ''

  if (!email.value) {
    emailError.value = 'Email is required.'
    return false
  }
  if (!password.value || !/(?=.*\d).{8,}/.test(password.value)) {
    generalError.value = 'Password must be at least 8 characters and contain a number.'
    return false
  }
  if (!firstName.value || !lastName.value || !major.value || !classes.value) {
    generalError.value = 'Please fill in all required fields.'
    return false
  }
  if (
    !availabilityAnytime.value &&
    !availabilityWeekday.value &&
    !availabilityWeekend.value
  ) {
    availabilityError.value = 'Please select your availability.'
    return false
  }
  return true
  if (bio.value.trim().split(/\s+/).length > 250) {
  generalError.value = 'Bio must be 250 words or less.';
  return false;
  }
}

  function handleCreateAccount() {
  if (!validateForm()) return;

  const availability = availabilityAnytime.value
    ? 'anytime'
    : [availabilityWeekday.value && 'weekdays', availabilityWeekend.value && 'weekends']
        .filter(Boolean)
        .join(',');

  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const exists = users.find(u => u.email === email.value);
  if (exists) {
    emailError.value = 'An account with this email already exists.';
    return;
  }
  const newUser = {
  email: email.value,
  password: password.value,
  firstName: firstName.value,
  lastName: lastName.value,
  major: major.value,
  classes: classes.value.split(',').map(c => c.trim()),
  availability,
  bio: bio.value.trim(),
  };

  users.push(newUser);

  fetch('http://localhost:3001/api/insertStudent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newUser)
}).then(res => res.json()).then(data => {
    console.log('✅ Student created:', data);
  }).catch(err => console.error('❌ Error creating student:', err));

  alert("Account created! You can now log in.");
  router.push("/login");
  }
</script>