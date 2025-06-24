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
            type="text"
            placeholder="Search for a course (e.g. CS321)"
            class="search-input"
          />
  
          <select v-model="selectedTime" class="search-select">
            <option value="">All Times</option>
            <option value="anytime">Anytime</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekends">Weekends</option>
          </select>

          <button class="search-btn" @click="searchMatches">Search</button>
        </div>

  
        <!-- Results -->
        <div class="results-section">
          <div v-if="searchQuery.trim() !== ''">
            <div v-if="isValidCourse">
              <div v-if="filteredCourses.length > 0">
                <p class="match-count">✅ Results:</p>
                <ul class="course-list">
                  <li
                    v-for="course in filteredCourses"
                    :key="course"
                    class="course-item"
                  >
                    <span>{{ course }}</span>
                    <button class="connect-btn">Connect</button>
                  </li>
                </ul>
              </div>
              <div v-else class="no-results">
                ⚠️ No matches found for availability setting
              </div>
            </div>
            <div v-else class="no-results">
              Not a valid course name. Please try again.
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import AppHeader from "@/components/AppHeader.vue";
  import axios from 'axios';

  export default {
    name: "SearchPage",
    components: {
      AppHeader
    },
    data() {
      return {
        searchQuery: '',
        selectedTime: '',
        targetClass: '',
        myAvailability: 'anytime', // or array of strings
        myConnections: [], // Array of student IDs
        myId: null, // set this from login or profile
        results: [],
      };
  },
  methods: {
    async searchMatches() {
      try {
        const response = await axios.post('http://localhost:3001/api/searchMatches', {
          targetClass: this.searchQuery.trim().toUpperCase(),  // use the text box value
          myId: this.myId || 1,  // hardcoded for now unless you have login
          myAvailability: this.selectedTime || 'anytime',
          myConnections: this.myConnections || []
        });

        this.results = response.data.results;
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    }
  },
    computed: {
      filteredCourses() {
        return this.allCourses.filter(course => {
          const matchText = course.toLowerCase().includes(this.searchQuery.toLowerCase());
          const matchTime =
            !this.selectedTime || this.myAvailability.includes(this.selectedTime);
          return matchText && matchTime;
        });
      },
      isValidCourse() {
        return this.allCourses.some(course =>
          course.toLowerCase() === this.searchQuery.toLowerCase()
        );
      }
    },
    mounted() {
       fetch("http://localhost:3001/api/courses")
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
  