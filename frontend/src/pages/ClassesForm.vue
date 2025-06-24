<template>
  <div class="manage-classes-container">
    <h1 class="page-title">Manage Your Classes</h1>

    <!-- ADD CLASS -->
    <div class="form-row">
      <label for="add-input">Add Class:</label>
      <input
        id="add-input"
        v-model="newCourse"
        type="text"
        placeholder="e.g. CS321"
        class="text-input"
        @keyup.enter="handleAdd"
      />
      <button type="button" class="btn add-btn" @click="handleAdd">
        Add
      </button>
    </div>

    <!-- CURRENT CLASSES LIST -->
    <div class="classes-list" v-if="classList.length">
      <h2>Your Classes:</h2>
      <ul>
        <li v-for="c in classList" :key="c">{{ c }}</li>
      </ul>
    </div>

    <!-- SAVE CHANGES -->
    <button type="button" class="btn save-btn" @click="goBack">
      Save Changes
    </button>
  </div>
</template>

<script>
export default {
  name: "ClassesForm",
  data() {
    return {
      newCourse: "",
      classList: [],
      email: "",
      userId: null,
    };
  },
  async mounted() {
    // 1) Grab id/email from localStorage (set by Login.vue)
    const idStr = localStorage.getItem("id");
    const email = localStorage.getItem("email");
    if (!idStr || !email) {
      console.error("🚨 No user id/email in localStorage");
      alert("⚠️ You must be logged in to manage classes.");
      return;
    }
    this.userId = parseInt(idStr, 10);
    this.email = email;

    // 2) Load existing classes
    await this.reloadClasses();
  },
  methods: {
    async reloadClasses() {
      try {
        console.log("Fetching classes for email:", this.email);
        const res = await fetch(
          `/api/get-classes?email=${encodeURIComponent(this.email)}`
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const { classes } = await res.json();
        this.classList = (classes || []).map((c) => c.toUpperCase());
        console.log("Loaded classes:", this.classList);
      } catch (err) {
        console.error("Failed to load classes:", err);
        alert("⚠️ Could not load your classes.");
      }
    },

    async handleAdd() {
      const course = this.newCourse.trim().toUpperCase();
      if (!course) {
        return alert("Please enter a class code to add.");
      }

      // DEBUG: log exactly what we’re about to send
      console.log("POST /api/addClass", {
        studentId: this.userId,
        course,
      });

      try {
        const res = await fetch("/api/addClass", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: this.userId,
            course,
          }),
        });
        const body = await res.json();
        console.log("Response from addClass:", res.status, body);

        if (!res.ok) {
          // server sends { error: 'Missing studentId or course' } or { error: 'Invalid course' }
          return alert(`⚠️ Could not add "${course}": ${body.error}`);
        }

        alert(`✅ "${course}" added successfully!`);
        this.newCourse = "";
        await this.reloadClasses();
      } catch (err) {
        console.error("Error in handleAdd:", err);
        alert(`⚠️ Error adding "${course}": ${err.message}`);
      }
    },

    goBack() {
      this.$router.push("/profile");
    },
  },
};
</script>

<style scoped>
.manage-classes-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px;
}
.page-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
}
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.form-row label {
  width: 120px;
  font-weight: 500;
}
.text-input {
  flex: 1;
  padding: 8px;
  margin-right: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}
.add-btn {
  background-color: #4caf50;
  color: white;
}
.save-btn {
  width: 100%;
  margin-top: 40px;
  background-color: #3f51b5;
  color: white;
  font-size: 1rem;
}
.classes-list {
  margin-top: 30px;
}
.classes-list ul {
  list-style: disc inside;
}
.classes-list li {
  margin-bottom: 4px;
}
</style>
