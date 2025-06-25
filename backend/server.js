// server.js
const express = require('express');
const cors = require('cors');
//const getFriendsRoute = require('./getFriends'); //mounting the route for get friends
const { insertStudent } = require('./insertstudent');
const { getStudent } = require('./getstudent');
const { getAllCourses } = require('./readCourses'); 
const { addCourseToStudent, removeCourseFromStudent } = require('./updateStudentCourses'); // or your filename
const { mainMatch } = require('./searchAlgorithm');
const { readAllStudents } = require('./studentUtils');
const { addFriend } = require('./studentActions');
const { writeAllStudents } = require('./studentUtils');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


//app.use('/', getFriendsRoute);

// Routes
app.get('/api/profile', (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: 'Email query parameter is required' });
  }

  getStudent(email, (err, student) => {
    if (err) {
      console.error('Error fetching student:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  });
});

app.post('/api/insertStudent', (req, res) => {
  const { email, password, firstName, lastName, major, classes, availability } = req.body;

  if (!email || !password || !firstName || !lastName || !major || !classes || !availability) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  insertStudent(
    {Email: email, Password: password, FirstName: firstName, LastName: lastName, Major: major, Courses: classes, Availability: availability, Friends: [], Bio: ""},
    (err) => {
      if (err) {
        console.error("❌ Failed to insert student:", err);
        return res.status(500).json({ error: "Failed to insert student" });
      }

      console.log('✅ New student registered and inserted.');
      return res.status(201).json({ message: 'Student inserted successfully' });
    }
  );
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  getStudent(email, (err, student) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!student || student.Password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Return relevant student data (omit password for security)
    const {id, FirstName, LastName, Email, Major, Classes, Availability, Bio } = student;

    return res.status(200).json({
      id,
      firstName: FirstName,
      lastName: LastName,
      email: Email,
      major: Major,
      classes: Classes,
      availability: Availability,
      bio: Bio || ""
    });
  });
});

app.get('/api/courses', (req, res) => {
  getAllCourses((err, courses) => {
    if (err) {
      console.error('❌ Failed to load courses:', err);
      return res.status(500).json({ error: 'Failed to load courses' });
    }
    res.json(courses);
  });
});

// Add class to student
app.post('/api/addClass', (req, res) => {
  const { studentId, course } = req.body;

  if (!studentId || !course) {
    return res.status(400).json({ error: 'Missing studentId or course' });
  }

  addCourseToStudent(parseInt(studentId), course.trim().toUpperCase(), (err, updatedCourses) => {
    if (err) {
      return res.status(500).json({ error: err.message || 'Failed to add course' });
    }
    res.status(200).json({ success: true, courses: updatedCourses });
  });
});

// Remove class
app.post('/api/removeClass', (req, res) => {
  const { studentId, course } = req.body;

  if (!studentId || !course) {
    return res.status(400).json({ error: 'Missing studentId or course' });
  }

  removeCourseFromStudent(parseInt(studentId), course.trim().toUpperCase(), (err, updatedCourses) => {
    if (err) {
      return res.status(500).json({ error: err.message || 'Failed to remove course' });
    }
    res.status(200).json({ success: true, courses: updatedCourses });
  });
});

app.get('/api/students', (req, res) => {
  const { course, myId, availability, connections } = req.query;

  //if (!course || !myId) {
  if (!course) {

    return res.status(400).json({ error: 'Missing required fields: course and myId' });
  }

  //const parsedId = parseInt(myId);
  const parsedId = parseInt(myId) || 0;
  const parsedConnections = connections ? connections.split(',').map(Number) : [];

  readAllStudents((err, studentData) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read student data' });
    }

    const results = mainMatch(
      studentData,
      course.trim().toUpperCase(),
      parsedId,
      availability || "anytime",
      parsedConnections
    );

    res.status(200).json(results || []);
  });
});

/*app.post('/api/connect', (req, res) => {
  const { studentId, friendId } = req.body;

  if (!studentId || !friendId) {
    return res.status(400).json({ error: 'Missing studentId or friendId' });
  }

  if (studentId === friendId) {
    return res.status(400).json({ error: 'You cannot add yourself as a friend' });
  }

  readAllStudents((err, students) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read student data' });
    }

    const student = students.find(s => s.id === studentId);
    const friend = students.find(s => s.id === friendId);

    if (!student || !friend) {
      return res.status(404).json({ error: 'Student or friend not found' });
    }

    if (student.Friends.includes(friendId)) {
      return res.status(409).json({ error: 'Already friends' });
    }

    student.Friends.push(friendId);

    writeAllStudents(students, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to write student data' });
      }

      return res.status(200).json({ success: true });
    });
  });
});
*/

app.post('/api/connect', (req, res) => {
  const { studentId, friendId } = req.body;

  if (!studentId || !friendId) {
    return res.status(400).json({ error: 'Missing studentId or friendId' });
  }

  if (studentId === friendId) {
    return res.status(400).json({ error: 'You cannot add yourself as a friend' });
  }

  addFriend(Number(studentId), Number(friendId)); // Reuse shared logic
  return res.status(200).json({ success: true });
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
