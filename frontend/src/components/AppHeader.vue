<template>
    <header class="app-header">
      <!-- Left -->
      <div class="left-section">
        <span class="nav-item">Calendar</span>
      </div>
  
      <!-- Center -->
      <div class="center-section">
        <span class="app-name">Study Buddy</span>
        <img src="@/assets/gmu-logo.png" alt="GMU Logo" class="gmu-logo" />
      </div>
  
      <!-- Right -->
      <div class="right-section">
        <button class="nav-button" @click="$router.push('/search')">Search</button>
        <button class="nav-button" title="Chat" data-testid="chat-btn" @click="$router.push('/chat')">Chat</button>
        <div class="profile-wrapper" @click="toggleMenu">
          <div class="initials-circle">{{ initials }}</div>
          <div v-if="showMenu" class="dropdown-menu">
            <div @click="$router.push('/profile')">Go to Profile</div>
            <div @click="$router.push('/edit-profile')">Edit Profile</div>
            <div @click="logout">Log Out</div>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: "AppHeader",
    data() {
      return {
        showMenu: false
      };
    },
    computed: {
      initials() {
        const first = localStorage.getItem("firstName") || "";
        const last = localStorage.getItem("lastName") || "";
        return `${first[0] || ""}${last[0] || ""}`.toUpperCase();
      }
    },
    methods: {
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },
      logout() {
        localStorage.clear();
        this.$router.push("/sign-in");
      }
    },
    mounted() {
      document.addEventListener("click", this.handleClickOutside);
    },
    beforeUnmount() {
      document.removeEventListener("click", this.handleClickOutside);
    },
    methods: {
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },
      logout() {
        localStorage.clear();
        this.$router.push("/sign-in");
      },
      handleClickOutside(event) {
        if (!this.$el.contains(event.target)) {
          this.showMenu = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .app-header {
    width: 100%;
    height: 70px;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    border-bottom: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  }
  
  .left-section,
  .right-section {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding-right: 3rem;
  }
  
  .center-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .app-name {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c3e50;
  }
  
  .gmu-logo {
    height: 36px;
    width: auto;
  }
  
  .nav-item,
  .nav-button {
    font-size: 1.1rem;
    font-weight: 500;
    color: #2c3e50;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
  }
  
  .nav-button:hover {
    text-decoration: underline;
  }
  
  .profile-wrapper {
    position: relative;
    cursor: pointer;
  }
  
  .initials-circle {
    width: 40px;
    height: 40px;
    background-color: #2c3e50;
    color: #fff;
    font-weight: bold;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .dropdown-menu {
    position: absolute;
    right: 0;
    top: 50px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    z-index: 999;
  }
  
  .dropdown-menu div {
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    cursor: pointer;
    white-space: nowrap;
  }
  
  .dropdown-menu div:hover {
    background-color: #f2f2f2;
  }
  </style>
  