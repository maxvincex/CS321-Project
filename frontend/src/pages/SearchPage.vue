<template>
  <div>
    <AppHeader />
    <div class="search-page-container">
      <!-- Page Title -->
      <div class="top-row">
        <h1 class="page-title">Search Courses</h1>
      </div>

      <!-- Search Filters -->
      <div class="search-controls">
        <input
          v-model="searchQuery"
          @input="fetchMatchedStudents"
          type="text"
          placeholder="Search for a course (e.g. CS321)"
          class="search-input"
        />

        <select v-model="selectedTime" @change="fetchMatchedStudents" class="search-select">
          <option value="">All Times</option>
          <option value="anytime">Anytime</option>
          <option value="weekdays">Weekdays</option>
          <option value="weekends">Weekends</option>
        </select>
      </div>

      <!-- Results -->
      <div class="results-section">
        <div v-if="searchQuery.trim() !== ''">
          <div v-if="matchedStudents.length > 0">
            <p class="match-count"> Matched Results:</p>
            <ul class="course-list">
              <li
                v-for="student in matchedStudents"
                :key="student.id"
                class="course-item"
              >
              <span>
                {{ student.FirstName }} {{ student.LastName }} —
                {{ Array.isArray(student.Availability) && student.Availability.length > 0
                  ? student.Availability.join(', ')
                  : 'N/A' }}
                ({{ student.Courses?.join(', ') || 'No courses' }})
              </span>                
              <button class="connect-btn"@click="connectToStudent(student.id)">Connect</button>
              </li>
            </ul>
          </div>
          <div v-else class="no-results">
            No matches found for availability setting
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";

export default {
  name: "SearchPage",
  components: {
    AppHeader,
  },
  data() {
    return {
      matchedStudents: [],
      allCourses: [],
      searchQuery: "",
      selectedTime: "",
      myAvailability: (localStorage.getItem("availability") || "anytime,weekends").split(","),
      myId: localStorage.getItem("id")
        ? parseInt(localStorage.getItem("id"))
        : null,
      myConnections: JSON.parse(localStorage.getItem("connections") || "[]"),
    };
  },
  computed: {
    isValidCourse() {
      return this.allCourses.some(course =>
        course.toLowerCase() === this.searchQuery.trim().toLowerCase()
      );
    },
  },
  methods: {
    fetchMatchedStudents() {
      const course = this.searchQuery.trim().toUpperCase();
      if (!course) {
        this.matchedStudents = [];
        return;
      }

      const params = new URLSearchParams({
        course,
        myId: this.myId || 0,
        availability: this.selectedTime || "anytime",
        connections: this.myConnections.join(","),
      });

      console.log(" Fetching /api/students?" + params.toString());

      fetch(`/api/students?${params}`)
        .then(res => {
          console.log("↩  API status:", res.status);
          return res.json();
        })
        .then(data => {
          console.log("📬  API result:", data);
          this.matchedStudents = data || [];
        })
        .catch(err => {
          console.error("  Failed to fetch matched students:", err);
          this.matchedStudents = [];
        });
    },
    connectToStudent(friendId) {
      const studentId = this.myId;
      console.log("Connecting", { studentId, friendId });
      fetch("/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: parseInt(studentId),
          friendId: parseInt(friendId) }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert("✅ Connected!");
            this.myConnections.push(friendId); // update local list
            localStorage.setItem("connections", JSON.stringify(this.myConnections));
          } else {
            alert("❌ Failed to connect.");
          }
        })
        .catch(err => {
          console.error("❌ Connect error:", err);
          alert("Connection failed");
        });
    }
  },
  mounted() {
    fetch("/api/courses")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch courses");
        return res.json();
      })
      .then((data) => {
        this.allCourses = data;
      })
      .catch((err) => {
        console.error("Error loading courses:", err);
        alert("Failed to load course list. Please try again later.");
      });
  },
};
</script>

<style scoped>
.search-page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 6rem 2rem 2rem;
  font-family: Arial, sans-serif;
}

.top-row {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #25313d;
}

.search-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
}

.search-input,
.search-select {
  padding: 0.6rem 1rem;
  border-radius: 30px;
  border: 1px solid #ccc;
  background-color: #f2f2f2;
  font-size: 1rem;
  min-width: 250px;
}

.results-section {
  margin-top: 1rem;
}

.match-count {
  color: #1e7e34;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.course-list {
  list-style: none;
  padding: 0;
}

.course-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 0.8rem 1.2rem;
  margin-bottom: 1rem;
}

.connect-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
}

.connect-btn:hover {
  background-color: #0056b3;
}

.no-results {
  color: #dc3545;
  font-weight: bold;
  margin-top: 1rem;
}
</style>
