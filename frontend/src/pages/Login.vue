<template>
  <div>
    <h1>StudyBuddy</h1>
    <div class="container">
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Sign In</button>
        <router-link to="/register" class="text-blue-600 underline text-center block mt-4">
          Create Account
        </router-link>      
      </form>
    </div>
  </div>
</template>

<script>
/* export default {
  name: "Home"
}; 
*/
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    async handleLogin() {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const found = users.find(
        (u) => u.email === this.email && u.password === this.password
      );

      if (found) {
        localStorage.setItem("firstName", found.firstName);
        localStorage.setItem("lastName", found.lastName);
        this.$router.push("/profile");
      } else {
        alert("Invalid email or password. Try again or register.");
      }
    }
  }
};
</script>
