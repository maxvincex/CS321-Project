<template>
  <div>
    <h1>Study Buddy</h1>
    <ClassesForm />
  </div>
</template>

<script>
import ClassesForm from './components/ClassesForm.vue'
import TimeAvailabilityForm from './components/TimeAvailabilityForm.vue'

export default {
  components: {
    ClassesForm,
    TimeAvailabilityForm
  }
}
</script>
