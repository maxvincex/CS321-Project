const mysql = require('mysql2');

// Create a Connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'zawse',
  password: 'CS321',
  database: 'student_database'
});

// Example student datacd
const newStudent = {
  username: 'Rowan',
  password: 'password',
  courses: JSON.stringify(["CS312", "MATH202", "ENG150"]),
  availability: 'weekeneds',
  friends: JSON.stringify([])
};

// Insert query
const query = `
  INSERT INTO students (Username, Password, Courses, Availability, Friends)
  VALUES (?, ?, ?, ?, ?)
`;

connection.execute(
  query,
  [
    newStudent.username,
    newStudent.password,
    newStudent.courses,
    newStudent.availability,
    newStudent.friends
  ],
  (err, results) => {
    if (err) {
      console.error('Error inserting student:', err);
    } else {
      console.log('Student inserted with ID:', results.insertId);
    }

    connection.end();
  }
);




function addStudent(username, password, courses, availability, friends) {
  const sql = `
    INSERT INTO students (Username, Password, Courses, Availability, Friends)
    VALUES (?, ?, ?, ?, ?)
  `;

  // Convert arrays to JSON strings for storage
  const coursesJson = JSON.stringify(courses);
  const friendsJson = JSON.stringify(friends);

  connection.execute(
    sql,
    [username, password, coursesJson, availability, friendsJson],
  )
}


/**
 * Retrieves a student by username.
 * @param {string} username - The student's username.
 * @param {function} callback - A function to handle the result or error.
 */
function getStudent(username, callback) {
  const sql = `
    SELECT * FROM students WHERE Username = ?
  `;

  connection.execute(sql, [username], (err, results) => {
    if (err) {
      console.error('Error retrieving student:', err.message);
      callback(err, null);
    } else if (results.length === 0) {
      console.log('No student found with that username.');
      callback(null, null);
    } else {
      // Convert JSON strings back to arrays
      const student = results[0];
      student.Courses = JSON.parse(student.Courses);
      student.Friends = JSON.parse(student.Friends);

      callback(null, student);
    }
  });
}
