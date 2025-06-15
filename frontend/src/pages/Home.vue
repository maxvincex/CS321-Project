<template>
  <div>
    <h1>StudyBuddy</h1>
    <div class="container">
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Sign In</button>
        <a href="/create-account">Create Account</a>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>
