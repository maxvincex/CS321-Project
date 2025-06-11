const { readAllStudents } = require('./studentUtils');

/**
 * Retrieves a student by email.
 * @param {string} email - The student's email.
 * @param {function} callback - Function to handle result or error.
 */
function getStudent(email, callback) {
  readAllStudents((err, students) => {
    if (err) {
      console.error('❌ Failed to read students:', err);
      return callback(err, null);
    }

    const student = students.find(s => s.Email === email);

    if (!student) {
      console.log('❌ No student found with that email.');
      return callback(null, null);
    }

    callback(null, student);
  });
}

// Example usage:
getStudent('rowan@example.com', (err, student) => {
  if (err) {
    console.error('❌ Error:', err);
  } else if (!student) {
    console.log('⚠️ Student not found.');
  } else {
    console.log('✅ Student found:', student);
  }
});
