<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <h2>Select Your Availability</h2>

      <label>
        <input type="radio" value="Weekdays" v-model="availability" />
        Weekdays
      </label>
      <label>
        <input type="radio" value="Weekends" v-model="availability" />
        Weekends
      </label>
      <label>
        <input type="radio" value="Anytime" v-model="availability" />
        Anytime
      </label>

      <button type="submit">Submit</button>
    </form>

    <!-- move the message here so tests can read it in wrapper.text() -->
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'TimeAvailabilityForm',
  data() {
    return {
      availability: '',
      message: ''
    };
  },
  methods: {
    handleSubmit() {
      if (this.availability) {
        this.message = `Availability set to: ${this.availability}`;
      } else {
        this.message = 'Please select your availability.';
      }
    }
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: Arial, sans-serif;
}

label {
  margin-left: 5px;
}

button {
  margin-top: 10px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
