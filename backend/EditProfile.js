const { readAllStudents, writeAllStudents } = require('./studentUtils');
const { getAllCourses } = require('./readCourses');

// Add a course to a student's list
function addCourseToStudent(studentId, courseCode) {
  getAllCourses((err, courseList) => {
    if (err) return console.error("❌ Error reading course database:", err);

    if (!courseList.includes(courseCode)) {
      return console.log(`❌ '${courseCode}' is not a valid course.`);
    }

    readAllStudents((err, students) => {
      if (err) return console.error("❌ Error reading students:", err);

      const student = students.find(s => s.id === studentId);
      if (!student) return console.log("⚠️ Student not found.");

      if (student.Courses.includes(courseCode)) {
        return console.log(`⚠️ Course '${courseCode}' already in your list.`);
      }

      student.Courses.push(courseCode);

      writeAllStudents(students, (err) => {
        if (err) return console.error("❌ Error writing student data:", err);
        console.log(`✅ '${courseCode}' added to your course list.`);
      });
    });
  });
}

// Remove a course from a student's list
function removeCourseFromStudent(studentId, courseCode) {
  readAllStudents((err, students) => {
    if (err) return console.error("❌ Error reading students:", err);

    const student = students.find(s => s.id === studentId);
    if (!student) return console.log("⚠️ Student not found.");

    const index = student.Courses.indexOf(courseCode);
    if (index === -1) {
      return console.log(`⚠️ Course '${courseCode}' not found in your list.`);
    }

    student.Courses.splice(index, 1);

    writeAllStudents(students, (err) => {
      if (err) return console.error("❌ Error writing student data:", err);
      console.log(`✅ '${courseCode}' removed from your course list.`);
    });
  });
}

// Update student's password
function updateStudentPassword(studentId, newPassword) {
  readAllStudents((err, students) => {
    if (err) return console.error("❌ Error reading students:", err);

    const student = students.find(s => s.id === studentId);
    if (!student) return console.log("⚠️ Student not found.");

    if (student.Password === newPassword) {
      return console.log("⚠️ New password cannot be the same as the old one.");
    }

    student.Password = newPassword;

    writeAllStudents(students, (err) => {
      if (err) return console.error("❌ Error writing student data:", err);
      console.log("✅ Password updated successfully.");
    });
  });
}

// Update student's availability
function updateStudentAvailability(studentId, newAvailability) {
  readAllStudents((err, students) => {
    if (err) return console.error("❌ Error reading students:", err);

    const student = students.find(s => s.id === studentId);
    if (!student) return console.log("⚠️ Student not found.");

    student.Availability = newAvailability;

    writeAllStudents(students, (err) => {
      if (err) return console.error("❌ Error writing student data:", err);
      console.log(`✅ Availability updated to: ${newAvailability}`);
    });
  });
}

// Remove a friend connection
function removeFriend(id1, id2) {
  if (typeof id1 !== 'number' || typeof id2 !== 'number') {
    return console.error("❌ Invalid input. IDs must be numbers.");
  }

  readAllStudents((err, students) => {
    if (err) return console.error("❌ Error reading students:", err);

    const student1 = students.find(s => s.id === id1);
    const student2 = students.find(s => s.id === id2);

    if (!student1 || !student2) {
      return console.log("❌ One or both students not found.");
    }

    if (!student1.Friends.includes(id2)) {
      return console.log(`⚠️ ID ${id2} is not in your friend list.`);
    }

    student1.Friends = student1.Friends.filter(id => id !== id2);
    student2.Friends = student2.Friends.filter(id => id !== id1);

    writeAllStudents(students, (err) => {
      if (err) return console.error("❌ Error writing student data:", err);
      console.log(`✅ Friend ID ${id2} removed.`);
      console.log(`👥 Updated friends list: [${student1.Friends}]`);
    });
  });
}

module.exports = {
  addCourseToStudent,
  removeCourseFromStudent,
  updateStudentPassword,
  updateStudentAvailability,
  removeFriend
};
