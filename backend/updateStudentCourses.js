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
function addCourseToStudent(studentId, newCourse) {
  if (!newCourse || typeof studentId !== 'number') {
    console.error('❌ Invalid input for add.');
    return;
  }

  getAllCourses((err, validCourses) => {
    if (err) return console.error('❌ Failed to read courses:', err);
    if (!validCourses.includes(newCourse)) {
      return console.log(`❌ '${newCourse}' is not a valid course.`);
    }

    readAllStudents((err, students) => {
      if (err) return console.error('❌ Failed to load students:', err);

      const student = students.find(s => s.id === studentId);
      if (student.Courses.includes(newCourse)) {
        return console.log(`⚠️ Course '${newCourse}' already in your list.`);
      }

      student.Courses.push(newCourse);

      writeAllStudents(students, (err) => {
        if (err) console.error('❌ Write error:', err);
        else {
          console.log(`✅ '${newCourse}' added to your course list.`);
          console.log(`📚 Updated Courses: [${student.Courses.join(', ')}]`);
        }
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
