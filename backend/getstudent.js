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

   /* if (!student) {
      console.log('❌ No student found with that email.');
      return callback(null, null);
    }

    callback(null, student);
  });
}
*/

if (!student) {
  console.log('❌ No student found with that email.');
  return callback(null, null);
}

// ✅ Parse Friends array safely
if (student.Friends && typeof student.Friends === "string") {
  try {
    const parsed = JSON.parse(student.Friends);
    student.Friends = Array.isArray(parsed) ? parsed.map(Number) : [];
  } catch {
    student.Friends = [];
  }
}

// ✅ Parse Availability if needed
if (student.Availability && typeof student.Availability === "string") {
  try {
    const parsed = JSON.parse(student.Availability);
    student.Availability = Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    student.Availability = [];
  }
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

module.exports = {getStudent};