const { getAllCourses } = require('./readCourses');
const { readAllStudents } = require('./studentUtils');

/**
 * Validates and filters a student's course list.
 * @param {string[]} courses - The list of courses to validate.
 * @param {function} callback - (err, validCourses[])
 */
function isValidCourseList(courses, callback) {
  getAllCourses((err, validCourses) => {
    if (err) return callback(err, null);

    const filtered = courses.filter(course => validCourses.includes(course));
    callback(null, filtered);
  });
}

/**
 * Checks if the provided email is already in use.
 * @param {string} email - The email to check.
 * @param {function} callback - (err, boolean)
 */
function isEmailTaken(email, callback) {
  readAllStudents((err, students) => {
    if (err) return callback(err, null);

    const exists = students.some(s => s.Email === email);
    callback(null, exists);
  });
}

/**
 * Checks if the password is valid (min 8 chars, at least 1 letter, 1 number, not same as email).
 * @param {string} password - The password to verify.
 * @param {string} email - The user's email (for comparison).
 * @returns {boolean}
 */
function isValidPassword(password, email) {
  if (typeof password !== 'string' || typeof email !== 'string') return false;

  const longEnough = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const notSameAsEmail = password !== email;

  return longEnough && hasLetter && hasNumber && notSameAsEmail;
}

module.exports = {
  isValidCourseList,
  isEmailTaken,
  isValidPassword
};
