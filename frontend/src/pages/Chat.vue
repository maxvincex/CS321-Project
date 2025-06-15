<template>
  <div class="chat-container">
    <AppHeader />

    <div class="chat-person">
      <h3>Chatting with: {{ chatPartner }}</h3>
    </div>

    <div class="chat-log" ref="chatLog">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['chat-bubble', msg.sender === username ? 'me' : 'other']"
      >
        <span class="sender">{{ msg.sender }}:</span> {{ msg.content }}
        <div class="timestamp">{{ msg.time }}</div>
      </div>
    </div>

    <div class="chat-input">
      <input
        v-model="newMessage"
        placeholder="Type your message..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">✉️</button>
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";

export default {
  name: "Chat",
  components: {
    AppHeader,
  },
  props: ["id"],
  data() {
    return {
      chatPartner: "",
      username: "Me",
      newMessage: "",
      messages: [
        { id: 1, sender: "Alice", content: "Hey!", time: "4:00 PM" },
        { id: 2, sender: "Me", content: "Hi Alice!", time: "4:01 PM" }
      ]
    };
  },
  mounted() {
    const partners = {
      1: "Alice",
      2: "Bob"
    };
    this.chatPartner = partners[this.id] || "Unknown";
    this.scrollToBottom();
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() === "") return;

      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      this.messages.push({
        id: Date.now(),
        sender: this.username,
        content: this.newMessage,
        time
      });

      this.newMessage = "";
      this.scrollToBottom();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatLog;
        container.scrollTop = container.scrollHeight;
      });
    }
  }
};
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: auto;
  font-family: Arial, sans-serif;
  padding: 20px;
  background: white;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.top-right {
  display: flex;
  gap: 10px;
  align-items: center;
}
.circle {
  background: #007bff;
  color: white;
  padding: 5px 10px;
  border-radius: 50%;
}
.gm {
  color: green;
}
.chat-person {
  text-align: center;
  margin: 10px 0;
}
.chat-log {
  height: 300px;
  overflow-y: auto;
  background: #f9f9f9;
  padding: 10px;
  border: 1px solid #ccc;
}
.chat-bubble {
  max-width: 80%;
  margin: 5px 0;
  padding: 10px;
  border-radius: 12px;
  word-wrap: break-word;
}
.chat-bubble.me {
  background: #dcf8c6;
  align-self: flex-end;
  text-align: right;
}
.chat-bubble.other {
  background: #ececec;
  align-self: flex-start;
}
.sender {
  font-weight: bold;
}
.timestamp {
  font-size: 10px;
  color: #999;
  margin-top: 4px;
}
.chat-input {
  display: flex;
  margin-top: 10px;
  gap: 10px;
}
.chat-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.chat-input button {
  padding: 8px 12px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 4px;
}
</style>
