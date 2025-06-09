const mysql = require('mysql2');

// Create a Connection to the database
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Rowsar1360',
  database: 'student_database'
});

// Example student data
const newStudent = {
  username: 'max',
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
