<template>
  <form @submit.prevent="handleSubmit">
    <label for="class-input">Add Class</label>
    <input id="class-input" v-model="input" label="Add Class" />
    <button type="button" class="add-button" @click="addClass">Add</button>
    <ul>
      <li v-for="(cls, index) in classList" :key="index">{{ cls }}</li>
    </ul>
    <button type="submit" class="submit-button">Submit</button>
    <p v-if="message">{{ message }}</p>
  </form>
</template>

<script>
export default {
  name: 'ClassesForm',
  data() {
    return {
      input: '',
      classList: [],
      message: '',
    }
  },
  methods: {
    addClass() {
      if (this.input.trim()) {
        this.classList.push(this.input)
        this.input = ''
      }
    },
    handleSubmit() {
      if (this.classList.length > 0) {
        this.message = 'Submitted successfully'
      }
    }
  }
}
</script>
