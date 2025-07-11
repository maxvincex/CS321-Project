<template>
  <div>
    <AppHeader />

    <div class="profile-container">
      <!-- Top: Name + Major -->
      <div class="top-row">
        <div class="name-block">
          <h1 class="profile-name">{{ firstName }} {{ lastName }}</h1>
        </div>
        <div class="major-pill">{{ major }}</div>
      </div>

      <!-- Avatar + Info Section -->
      <div class="main-section">
        <div class="avatar-section">
          <div class="avatar-circle">
            {{ initials }}
          </div>
        </div>

        <div class="info-section">
          <!-- Classes -->
          <div class="box classes-box">
            <div class="flex justify-between items-center mb-2">
              <h3>Classes:</h3>
              <button
                @click="editClasses"
                class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition"
                title="Edit Classes"
              >
                ✎
              </button>
            </div>
            <div class="pills">
              <span
                v-for="cls in classes"
                :key="cls"
                class="pill"
                :class="getClassColor(cls)"
              >
                {{ cls }}
              </span>
            </div>
          </div>

          <!-- Availability -->
          <div class="box time-box">
            <h3>Time Availability:</h3>
            <div class="pills">
              <span class="pill red">
                {{ availability }}
              </span>
            </div>
          </div>

          <!-- Bio -->
          <div class="box">
            <h3>Bio:</h3>
            <p class="mt-1 text-gray-700">{{ bio }}</p>
          </div>
        </div>
      </div>

      <!-- Toggle Friends -->
      <div class="mt-6">
        <button
          @click="showFriends = !showFriends"
          class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
        >
          {{ showFriends ? "Hide Friends" : "Show Friends" }}
        </button>
      </div>

      <!-- Friends List -->
      <div
        v-if="showFriends"
        class="mt-4 p-4 bg-white rounded-xl shadow-md transition-all duration-300"
      >
        <h2 class="text-xl font-bold mb-4">Your Friends</h2>
        <ul class="space-y-3">
          <li
            v-for="friend in friends"
            :key="friend.id"
            class="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
          >
            <div class="flex items-center">
              <div
                class="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center font-semibold mr-3"
              >
                {{ friend.initials }}
              </div>
              <span class="font-medium">{{ friend.name }}</span>
            </div>
            <button
              @click="disconnect(friend.id)"
              class="text-red-500 hover:text-red-700 font-semibold"
            >
              Disconnect
            </button>
          </li>
        </ul>
      </div>

      <div class="friend-box">
        <span class="friend-count">{{ friends.length }}</span> Friend
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";

export default {
  components: { AppHeader },
  data() {
    return {
      firstName: "",
      lastName: "",
      initials: "",
      major: "",
      classes: [],
      availability: "",
      bio: "",
      showFriends: false,
      friends: [],
    };
  },
  created() {
    const email = localStorage.getItem("email");

    if (!email) {
      alert("You're not logged in or your email is missing.");
      this.$router.push("/login");
      return;
    }

    fetch(`http://localhost:3001/api/profile?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((profile) => {
        this.firstName = profile.FirstName || "";
        this.lastName = profile.LastName || "";
        this.initials = `${this.firstName[0] || ""}${this.lastName[0] || ""}`.toUpperCase();
        this.major = profile.Major || "Computer Science";
        this.classes = profile.Courses || [];
        this.availability = Array.isArray(profile.Availability)
          ? profile.Availability.join(", ")
          : profile.Availability || ""
        this.bio = profile.Bio || "This is your default bio.";

        const friendIds = Array.isArray(profile.Friends)
        ? profile.Friends.map((id) => parseInt(id))
        : [];

        fetch("http://localhost:3001/api/students")        .then((res) => res.json())
          .then((allStudents) => {
            this.friends = allStudents
              .filter((student) => friendIds.includes(parseInt(student.id)))
              .map((student) => ({
                id: student.id,
                name: `${student.FirstName} ${student.LastName}`,
                initials: `${student.FirstName[0]}${student.LastName[0]}`.toUpperCase(),
              }));
              //this.friends = matchedFriends;
          })
          .catch((err) => {
            console.error("Failed to load student list for friend details:", err);
          });
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        alert("Unable to load your profile.");
      });
  },

  methods: {
    disconnect(friendId) {
      this.friends = this.friends.filter((friend) => friend.id !== friendId);
    },

    getClassColor(cls) {
      if (cls.includes("CS") || cls.includes("MATH")) return "blue";
      if (cls.includes("BIO") || cls.includes("HIST") || cls.includes("ENG")) return "red";
      if (cls.includes("GOV") || cls.includes("GEOL")) return "green";
      return "gray";
    },

    editClasses() {
      this.$router.push("/edit-classes");
    },
  },
};
</script>

<style scoped>
/* Same styles as before — kept untouched */
.profile-name {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.2rem;
  color: #25313d;
}
.avatar-circle {
  width: 160px;
  height: 160px;
  background-color: #2c3e50;
  color: #fff;
  font-size: 4rem;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.name-block {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.profile-container {
  max-width: 1000px;
  margin: 100px auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}
.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.major-pill {
  padding: 0.4rem 1rem;
  border: 2px solid #007bff;
  border-radius: 25px;
  font-weight: bold;
  color: #007bff;
}
.main-section {
  display: flex;
  margin-top: 2rem;
  gap: 2rem;
}
.avatar-section {
  flex: 1;
  display: flex;
  justify-content: center;
}
.info-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.box {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
}
.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.pill {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
}
.blue {
  color: #0d6efd;
  border-color: #0d6efd;
}
.red {
  color: #dc3545;
  border-color: #dc3545;
}
.green {
  color: #198754;
  border-color: #198754;
}
.friend-box {
  margin-top: 2rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.friend-count {
  background-color: #198754;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>