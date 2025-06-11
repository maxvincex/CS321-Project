const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');

// Path to CSV
const filePath = path.join(__dirname, 'students.csv');

// CSV Writer
const csvWriter = createObjectCsvWriter({
  path: filePath,
  header: [
    { id: 'id', title: 'id' },
    { id: 'Username', title: 'Username' },
    { id: 'Password', title: 'Password' },
    { id: 'Courses', title: 'Courses' },
    { id: 'Availability', title: 'Availability' },
    { id: 'Friends', title: 'Friends' }
  ],
  append: true
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






