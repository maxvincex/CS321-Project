const { readAllStudents, writeAllStudents } = require('./studentUtils');
const {
  isValidCourseList,
  isEmailTaken,
  isValidPassword
} = require('./verifyStudent');

/**
 * Inserts a new student into the system after validation.
 * @param {Object} student - The student object.
 * @param {string} student.Email
 * @param {string} student.Password
 * @param {string[]} student.Courses
 * @param {string} student.Availability
 * @param {number[]} student.Friends
 */
function insertStudent(student) {
  if (!isValidPassword(student.Password, student.Email)) {
    return console.log('❌ Password must be at least 8 characters, include a letter and a number, and not be the same as the email.');
  }

  isEmailTaken(student.Email, (err, taken) => {
    if (err) return console.error('❌ Failed to check email:', err);
    if (taken) return console.log('❌ Email already exists.');

    isValidCourseList(student.Courses, (err, filteredCourses) => {
      if (err) return console.error('❌ Failed to validate courses:', err);

      student.Courses = filteredCourses;

      if (student.Courses.length === 0) {
        return console.log('❌ No valid courses. Student not added.');
      }

      readAllStudents((err, students) => {
        if (err) return console.error('❌ Failed to read students:', err);

        const nextId = students.length > 0
          ? Math.max(...students.map(s => s.id)) + 1
          : 1;
        student.id = nextId;

        students.push(student);

        writeAllStudents(students, (err) => {
          if (err) return console.error('❌ Write error:', err);
          console.log(`✅ Student '${student.Email}' added.`);
        });
      });
    });
  });
}

// Example usage:
 insertStudent({
   Email: 'rowan@example.com',
   Password: 'abcd12234',
   Courses: ['CS262', 'CS310', 'CS100'],
   Availability: 'anytime',
   Friends: [1, 2]
 });

module.exports = { insertStudent };


