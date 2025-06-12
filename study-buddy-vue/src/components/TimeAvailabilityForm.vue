<template>
  <form @submit.prevent="handleSubmit">
    <label for="time-select">Select Availability:</label>
    <select id="time-select" v-model="selectedTime">
      <option disabled value="">Please select</option>
      <option>Weekdays</option>
      <option>Weekends</option>
      <option>Evenings</option>
      <option>Anytime</option>
    </select>
    <button type="submit">Save</button>
    <p v-if="message">{{ message }}</p>
  </form>
</template>

<script>
export default {
  name: 'TimeAvailabilityForm',
  data() {
    return {
      selectedTime: '',
      message: ''
    }
  },
  methods: {
    handleSubmit() {
      if (this.selectedTime) {
        this.message = `Availability set to: ${this.selectedTime}`;
        // You can later emit this data or save to a database
      } else {
        this.message = 'Please select a time.';
      }
    }
  }
}
</script>