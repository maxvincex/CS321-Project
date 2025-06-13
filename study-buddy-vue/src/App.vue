<template>
  <div class="main-container">
    <nav>
      <router-link to="/classes">Classes</router-link>
      <router-link to="/availability">Availability</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}
router-link {
  color: #ddd;
  text-decoration: none;
}
router-link:hover {
  text-decoration: underline;
}
</style>
