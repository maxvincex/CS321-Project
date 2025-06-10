// server.js
// const express = require('express');
// const cors = require('cors');

// const app = express();
// const PORT = 3001;

// app.use(cors());
// app.use(express.json());

// // Dummy profile data
// const userProfile = {
//   id: 1,
//   name: 'Jane Doe',
//   email: 'jane.doe@example.com',
//   bio: 'Computer Science student at XYZ University.'
// };

// // Routes
// app.get('/api/profile', (req, res) => {
//   res.json(userProfile);
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json()); // allow JSON requests

// DB connection
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Rowsar1360',
  database: 'student_database'
});

// Route to insert a student
app.post('/api/students', (req, res) => {
  const { username, password, courses, availability, friends } = req.body;

  const query = `
    INSERT INTO students (Username, Password, Courses, Availability, Friends)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.execute(
    query,
    [
      username,
      password,
      JSON.stringify(courses),
      availability,
      JSON.stringify(friends)
    ],
    (err, results) => {
      if (err) {
        console.error('Error inserting student:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.status(201).json({ message: 'Student added', id: results.insertId });
    }
  );
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
