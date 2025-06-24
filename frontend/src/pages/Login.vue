<template>
  <div>
    <h1>StudyBuddy</h1>
    <div class="container">
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />
        <button type="submit">Sign In</button>
        <router-link
          to="/register"
          class="text-blue-600 underline text-center block mt-4"
        >
          Create Account
        </router-link>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch(
          "http://localhost:3001/api/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: this.email,
              password: this.password,
            }),
          }
        );

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Login failed");
        }

        // 👉 read the full user object back
        const user = await response.json();
        // 👉 stash each piece under its own key in localStorage
        localStorage.setItem("id", user.id);
        localStorage.setItem("firstName", user.firstName);
        localStorage.setItem("lastName", user.lastName);
        localStorage.setItem("email", user.email);
        localStorage.setItem("major", user.major);
        localStorage.setItem("availability", user.availability);
        localStorage.setItem(
          "classes",
          JSON.stringify(user.classes || [])
        );
        localStorage.setItem("bio", user.bio || "");

        console.log("✅ Login successful, redirecting...");
        this.$router.push("/profile");
      } catch (error) {
        console.error("❌ Login failed:", error.message);
        alert("Invalid email or password. Try again or register.");
      }
    },
  },
};
</script>
