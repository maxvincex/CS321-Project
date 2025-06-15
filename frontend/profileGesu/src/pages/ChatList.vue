<template>
    <div class="chat-list-container">
      <AppHeader :firstName="user.firstName" :lastName="user.lastName" />
  
      <h2>Chats</h2>
      <div v-for="user in users" :key="user.id" class="chat-item" @click="goToChat(user.id)">
        <div class="avatar">{{ user.avatar }}</div>
        <div class="chat-info">
          <div class="name">{{ user.name }}</div>
          <div class="last-message">{{ user.lastMessage }}</div>
        </div>
        <div class="chat-time">{{ user.time }}</div>
      </div>
    </div>
  </template>
  
  <script>
  import AppHeader from '../components/AppHeader.vue'
  
  export default {
    name: "ChatList",
    components: {
      AppHeader
    },
    data() {
      return {
        user: {
          firstName: "Gesu",
          lastName: "Mahmadshoeva"
        },
        users: [
          { id: 1, name: "Alice", lastMessage: "See you later!", time: "4:15 PM", avatar: "👩" },
          { id: 2, name: "Bob", lastMessage: "Ready to study?", time: "3:20 PM", avatar: "👨" }
        ]
      };
    },
    methods: {
      goToChat(id) {
        this.$router.push(`/chat/${id}`);
      }
    }
  };
  </script>
  
  <style scoped>
  .chat-list-container {
    width: 100%;
    max-width: 1000px;
    margin: 40px auto;
    padding: 20px 40px;
    font-family: Arial, sans-serif;
  }
  
  .chat-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
  }
  .avatar {
    font-size: 24px;
    margin-right: 10px;
  }
  .chat-info {
    flex-grow: 1;
  }
  .name {
    font-weight: bold;
  }
  .last-message {
    font-size: 14px;
    color: gray;
  }
  .chat-time {
    font-size: 12px;
    color: #888;
  }
  </style>