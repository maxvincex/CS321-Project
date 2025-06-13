<template>
  <form @submit.prevent="handleSubmit">
    <h2>Manage Your Classes</h2>
    <div class="input-row">
      <label for="class-input">Add Class:</label>
      <input id="class-input" v-model="input" placeholder="e.g. CS321" />
      <button type="button" class="add-button" @click="addClass">Add</button>
    </div>

    <ul class="class-list">
      <li v-for="(cls, index) in classList" :key="index">
        {{ cls }}
        <button type="button" @click="removeClass(index)">×</button>
      </li>
    </ul>

    <button type="submit" class="submit-button">Submit</button>

    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </form>
</template>

<script>
import classDB from '../DB.csv?raw'

export default {
  name: 'ClassesForm',
  data() {
    return {
      input: '',
      classList: [],
      message: '',
      errorMessage: '',
      classDBArray: []
    }
  },
  created() {
    this.classDBArray = classDB
      .split('\n')
      .slice(1) // skip header
      .map(line => {
        const [dept, code] = line.trim().split(',')
        return `${dept}${code}`.toUpperCase()
      })
  },
  methods: {
    addClass() {
      const trimmed = this.input.trim().toUpperCase()
      if (!trimmed) return

      if (!this.classDBArray.includes(trimmed)) {
        this.errorMessage = `Class "${trimmed}" not found in database`
        return
      }

      if (this.classList.includes(trimmed)) {
        this.errorMessage = `"${trimmed}" is already in your profile`
        return
      }

      this.classList.push(trimmed)
      this.input = ''
      this.errorMessage = ''
    },
    removeClass(index) {
      this.classList.splice(index, 1)
    },
    handleSubmit() {
      if (this.classList.length > 0) {
        this.message = 'Submitted successfully'
        this.errorMessage = ''
      }
    }
  }
}
</script>

<style scoped>
form {
  background-color: #1e1e1e;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  margin: 2rem auto;
  text-align: center;
}

h2 {
  color: #fff;
  margin-bottom: 1.5rem;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

input {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #2a2a2a;
  color: #fff;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background-color: #333;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #555;
}

.class-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
}

.class-list li {
  background-color: #444;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.class-list li button {
  background: crimson;
  border-radius: 50%;
  padding: 0.2rem 0.6rem;
  font-weight: bold;
  color: white;
}

.success {
  color: #00ff80;
  margin-top: 1rem;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
