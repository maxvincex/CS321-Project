const express = require('express');
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
