const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

let students = [];

// Load and parse students.csv
fs.createReadStream('students.csv')
  .pipe(csv({
    mapHeaders: ({ header, index }) => header.trim()  // Clean up headers
  }))
  .on('data', (row) => {
    // Clean up row values (optional: convert id to number for easier lookup)
    students.push({
      id: parseInt(row.id),
      name: row.name,
      email: row.email,
      major: row.major,
      password: row.password,
      courses: row.courses,  // leave as string for now
      availability: row.availability,
      friends: row.friends,
      department: row.department,
      bio: row.bio
    });
  })
  .on('end', () => {
    console.log('Students data loaded successfully.');
  });


// GET route: retrieve full friend info based on studentId
app.get('/friends/:studentId', (req, res) => {
  const studentId = parseInt(req.params.studentId);

  const student = students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  let friendIds = [];

  try {
    // Parse friends field (stored as stringified array)
    friendIds = JSON.parse(student.friends);
  } catch (err) {
    console.error('Error parsing friends list:', err);
    friendIds = [];
  }

  // Find full friend objects
  const friendObjects = students.filter(s => friendIds.includes(s.id));

  res.json({ friends: friendObjects });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


/**const express = require('express');
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

app.listen(3001, () => {
  console.log('Friend list server running on http://localhost:3002');
});
*/