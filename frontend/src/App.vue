<template>
  <div>
    <nav class="bg-gray-800 text-white p-4 flex justify-center space-x-6">
      <RouterLink to="/" class="hover:underline">Home</RouterLink>
      <RouterLink to="/profile" class="hover:underline">Profile</RouterLink>
    </nav>
    <RouterView />

    <!-- Basic login form appears below router pages -->
    <div v-if="!loggedInUser" class="mt-6 p-4 bg-gray-100 max-w-md mx-auto rounded">
      <h2 class="text-lg font-bold mb-2">Login (Temporary Home Test)</h2>
      <input v-model="email" placeholder="Email" class="mb-2 p-2 border w-full" />
      <input v-model="password" type="password" placeholder="Password" class="mb-2 p-2 border w-full" />
      <button @click="login" class="bg-blue-600 text-white px-4 py-2 rounded w-full">Login</button>
    </div>

     <!-- Show welcome and logout if logged in -->
    <div v-else class="mt-6 p-4 bg-green-100 max-w-md mx-auto rounded">
      <p class="text-lg mb-2">Welcome, {{ loggedInUser }}</p>
      <button @click="logout" class="bg-red-600 text-white px-4 py-2 rounded w-full">Logout</button>
    </div>

    <!-- Best Friend List -->
  <div v-if="friends.length > 0" class="mt-6 p-4 bg-white max-w-md mx-auto rounded shadow">
    <h2 class="text-lg font-bold mb-2">Your Friends</h2>
    <ul>
      <li v-for="(friend, index) in friends" :key="index">
        {{ friend }}
      </li>
    </ul>
  </div>

  </div>
</template>

   


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouterView, RouterLink } from 'vue-router'


const email = ref('')
const password = ref('')
const loggedInUser = ref(localStorage.getItem('user') || '')
const router = useRouter()
const friends = ref([])

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
      localStorage.setItem('user', email.value)
      loggedInUser.value = email.value
      fetchFriends(email.value) 

      alert('Login successful!')
    } else {
      alert('Invalid login. Try again or create an account.')
       // Instead of alert, redirect to register page
       // have the user try again but include a register button in the login screen
      //router.push('/register')
    }
  } catch (err) {
    alert('Server error')
    console.error(err)
  }
}
const logout = () => {
  localStorage.removeItem('user')
  loggedInUser.value = ''
  router.push('/')
  friends.value = []; // ✅ clear friend list on logout
}



const fetchFriends = async (userEmail) => {
  try {
    const studentId = userEmail.split('@')[0]  // Derive studentId from email
    const res = await fetch(`http://localhost:3002/friends/${studentId}`)
    const data = await res.json()
    friends.value = data.friends || []
  } catch (err) {
    console.error("Failed to load friends:", err)
  }
}

onMounted(() => {
  if (loggedInUser.value) {
    fetchFriends(loggedInUser.value);
  }
});


</script>