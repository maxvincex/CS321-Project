<template>
  <div id="app">
    <AppHeader v-if="isLoggedIn" />
    <router-view />
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";

export default {
  name: "App",
  components: { AppHeader },
  computed: {
    isLoggedIn() {
      // More reliable key if you're saving it during login/signup
      return !!localStorage.getItem("firstName");
    }
  }
};
</script>
