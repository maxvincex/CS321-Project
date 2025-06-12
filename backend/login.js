const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// POST /login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  let userFound = false;

  fs.createReadStream('users.csv')
    .pipe(csv())
    .on('data', (row) => {
      if (row.email === email && row.password === password) {
        userFound = true;
      }
    })
    .on('end', () => {
      if (userFound) {
        res.status(200).json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    })
    .on('error', (err) => {
      res.status(500).json({ success: false, message: 'Error reading CSV file', error: err.message });
    });
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
