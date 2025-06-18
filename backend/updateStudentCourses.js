const { readAllStudents, writeAllStudents } = require('./studentUtils');
const { getAllCourses } = require('./readCourses');

/**
 * Adds a valid course to a student's course list.
 *
 * @function addCourseToStudent
 * @param {number} studentId - The ID of the logged-in student.
 * @param {string} newCourse - The course code to add (e.g., "CS321").
 * @description
 * This function assumes the student is already authenticated. It checks if the
 * course is valid based on the course database (DB.csv) and not already in the
 * student's list. If valid, it adds the course and saves the updated data to students.csv.
 */
function addCourseToStudent(studentId, newCourse, callback) {
  if (!newCourse || typeof studentId !== 'number') {
    return callback(new Error('Invalid input'));
  }

  getAllCourses((err, validCourses) => {
    if (err) return callback(err);
    
    if (!validCourses.includes(newCourse)) {
      return callback(new Error('Invalid course'));
    }

    readAllStudents((err, students) => {
      if (err) return callback(err);
      
      const student = students.find(s => s.id === studentId);
      if (!student) return callback(new Error("Student not found."));

      if (!Array.isArray(student.Courses)) {
        student.Courses = [];
      }

      if (student.Courses.includes(newCourse)) {
        return callback(new Error('Course already exists'));
      }

      student.Courses.push(newCourse);

      writeAllStudents(students, (err) => {
        if (err) return callback(err);

        console.log(`✅ '${newCourse}' added to student ${studentId}`);
        callback(null, student.Courses); // ✅ only call after success
      });
    });
  });
}

/**
 * Removes a course from a student's course list.
 *
 * @function removeCourseFromStudent
 * @param {number} studentId - The ID of the logged-in student.
 * @param {string} courseToRemove - The course code to remove (e.g., "CS321").
 * @description
 * This function assumes the student is already authenticated. It checks if the
 * course exists in the student's list. If found, it removes the course and saves
 * the updated data to students.csv.
 */
function removeCourseFromStudent(studentId, courseToRemove) {
  if (!courseToRemove || typeof studentId !== 'number') {
    console.error('❌ Invalid input for remove.');
    return;
  }

  readAllStudents((err, students) => {
    if (err) return console.error('❌ Failed to load students:', err);

    const student = students.find(s => s.id === studentId);
    if (!student.Courses.includes(courseToRemove)) {
      return console.log(`⚠️ Course '${courseToRemove}' not found in your list.`);
    }

    student.Courses = student.Courses.filter(course => course !== courseToRemove);

    writeAllStudents(students, (err) => {
      if (err) console.error('❌ Write error:', err);
      else {
        console.log(`✅ '${courseToRemove}' removed from your course list.`);
        console.log(`📚 Updated Courses: [${student.Courses.join(', ')}]`);
      }
    });
  });
}

// Example usage (Uncomment to test):
//addCourseToStudent(1, 'CS321');
removeCourseFromStudent(1, 'CS320');

module.exports = {
  addCourseToStudent,
  removeCourseFromStudent
};
