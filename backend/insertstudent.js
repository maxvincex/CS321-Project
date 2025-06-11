const mysql = require('mysql2');

// Create a Connection to the database
const connection = mysql.createConnection({
  host: 'aws.connect.psdb.cloud',
  user: 'zdp8t5ybqft1t8vhjpbr',
  password: 'pscale_pw_8yeppTlVTnkBu4Gzz8JVM76rnCLfWqz7lUT16gEEIvu',
  database: 'student_db',
  ssl: {
    rejectUnauthorized: true
  }
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






