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
  friends: []
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
    JSON.stringify(newStudent.courses),
    newStudent.availability,
    JSON.stringify(newStudent.friends)
  ],
  (err, results) => {
    if (err) {
      console.error('Error inserting student:', err);
      connection.end();
      return
    }
    console.log('Student inserted successfully with ID:', results.insertId);



// validate and insert only existing courses
    const validateCourseQuery = `SELECT * FROM courses WHERE CONCAT(dept, code) = ?`;

    newStudent.courses.forEach(courseCode => {
      connection.execute(validateCourseQuery, [courseCode], (err, rows) => {
        if (err) {
          console.error(`❌ Error checking course ${courseCode}:`, err);
        } else if (rows.length === 0) {
          console.warn(`⚠️ Course not found in DB: ${courseCode}`);
        } else {
          console.log(`✅ Course ${courseCode} exists.`);
        }
      });
    });

    // Close connection after short delay to allow all queries to complete
    setTimeout(() => {
      connection.end();
      console.log("🔚 Finished processing student and courses.");
    }, 1000);
  }
);


