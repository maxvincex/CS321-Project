<template>
  <div class="page-container">
    <h1 class="title">Manage Your Classes</h1>

    <form class="form-container" @submit.prevent="handleSubmit">
      <label for="class-input" class="label">Add Class:</label>
      <div class="input-group">
        <input
          id="class-input"
          v-model="input"
          placeholder="e.g. CS321"
          class="input"
        />
        <button type="button" class="add-button" @click="addClass">Add</button>
      </div>

      <ul class="class-list">
        <li v-for="(cls, index) in classList" :key="index">
          {{ cls }}
          <button type="button" class="remove-button" @click="removeClass(index)">
            ✕
          </button>
        </li>
      </ul>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="message" class="success">{{ message }}</p>

      <button type="submit" class="submit-button">Submit</button>
    </form>
  </div>
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
    // Parse CSV and normalize codes like "CS,321" into "CS321"
    this.classDBArray = classDB
      .split('\n')
      .slice(1) // skip header
      .map(line => line.trim().split(',').slice(0, 2).join('')) // "CS,321" => "CS321" 
  },
  methods: {
    addClass() {
      const trimmed = this.input.trim().toUpperCase()
      if (!trimmed) return

      if (!this.classDBArray.includes(trimmed)) {
        this.errorMessage = `Class "${trimmed}" not found in database`
        this.message = ''
        return
      }

      if (this.classList.includes(trimmed)) {
        this.errorMessage = `"${trimmed}" is already in your profile`
        this.message = ''
        return
      }

      this.classList.push(trimmed)
      this.input = ''
      this.errorMessage = ''
    },
    removeClass(index) {
      this.classList.splice(index, 1)
      this.errorMessage = ''
    },
    async handleSubmit() {
  if (this.classList.length === 0) {
    this.errorMessage = "Add at least one class.";
    this.message = "";
    return;
  }
  
  const studentId = localStorage.getItem('id'); // Make sure you're storing student ID

   for (const cls of this.classList) {
    try {
      const res = await fetch("http://localhost:3001/api/addClass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, course: cls })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || `Unknown error`);
      }

    } catch (err) {
      this.errorMessage = `❌ Could not add ${cls}: ${err.message}`;
      console.error(err);
      return;
    }
  }

  this.message = "✅ All classes added successfully!";
  this.classList = [];
}
  }
}
</script>

<style scoped>
.page-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.label {
  font-weight: 500;
  color: #444;
}

.input-group {
  display: flex;
  gap: 8px;
}

.input {
  flex: 1;
  padding: 8px 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.add-button,
.submit-button {
  background-color: #4a4ae6;
  color: white;
  border: none;
  padding: 8px 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
}

.add-button:hover,
.submit-button:hover {
  background-color: #3737b5;
}

.class-list {
  list-style: none;
  padding: 0;
}

.class-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 4px;
  background-color: #f9f9f9;
}

.remove-button {
  background: none;
  color: red;
  border: none;
  font-size: 1rem;
  cursor: pointer;
}

.error {
  color: red;
  font-weight: 500;
}

.success {
  color: green;
  font-weight: 500;
}
</style>