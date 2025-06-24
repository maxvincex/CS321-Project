const express = require('express');
const cors = require('cors');
const { readAllStudents, writeAllStudents } = require('./studentUtils');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/addFriend', (req, res) => {
  const { studentId, friendId } = req.body;

  if (studentId === undefined || friendId === undefined) {
    return res.status(400).json({ error: 'Missing studentId or friendId' });
  }

  readAllStudents((err, students) => {
    if (err) {
      console.error('Failed to read students:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    const student = students.find(s => s.id === studentId);
    const friend = students.find(s => s.id === friendId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (!friend) {
      return res.status(404).json({ error: 'Friend ID not found' });
    }

    // Prevent duplicate friendships
    if (student.Friends.includes(friendId)) {
      return res.status(400).json({ error: 'Friend already added' });
    }

    // Add friend
    student.Friends.push(friendId);

    writeAllStudents(students, (err) => {
      if (err) {
        console.error('Failed to update students:', err);
        return res.status(500).json({ error: 'Write error' });
      }
      console.log(`Friend ID ${friendId} added to student ID ${studentId}`);
      return res.json({ success: true });
    });
  });
});

// Start server
app.listen(3003, () => {
  console.log('AddFriend API running on http://localhost:3003');
});

/*const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
app.use(cors());

let friendsDB = {}; // This will be filled from the CSV

// Load and parse friends.csv
fs.createReadStream('friends.csv')
  .pipe(csv({ headers: false })) // because our structure is row-based
  .on('data', (row) => {
    const values = Object.values(row);
    const studentId = values[0];
    const friendsList = values.slice(1).filter(name => name); // remove any empty columns
    friendsDB[studentId] = friendsList;
  })
  .on('end', () => {
    console.log('Friends DB loaded:', friendsDB);
  });

// GET endpoint
app.get('/friends/:studentId', (req, res) => {
  const { studentId } = req.params;
  const friends = friendsDB[studentId] || [];
  res.json({ friends });
});

app.listen(3002, () => {
  console.log('Friend list server running on http://localhost:3002');
});
*/