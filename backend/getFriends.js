const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');

const router = express.Router();
const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Updated: Handle /friends/:studentId
app.get('/friends/:studentId', (req, res) => {
  let studentId = req.params.studentId;

  // Convert email to username (e.g., 'alice@gmail.com' => 'alice')
  if (studentId.includes('@')) {
    studentId = studentId.split('@')[0];
  }

  const friends = [];

  fs.createReadStream('friends.csv')
    .pipe(csv())
    .on('data', (row) => {
      if (row.studentId === studentId) {
        friends.push(row.friendId);
      }
    })
    .on('end', () => {
      res.json({ friends });
    });
});

app.listen(PORT, () => {
  console.log(`Friend server running on http://localhost:${PORT}`);
});


// const express = require('express');
// const cors = require('cors');
// const fs = require('fs');
// const csv = require('csv-parser');

// const router = express.Router();
// const app = express();
// const PORT = 3002;

// app.use(cors());
// app.use(express.json());




// app.get('/friends/:studentId', (req, res) => {
//   const studentId = req.params.studentId;
//   const friends = [];

//   fs.createReadStream('friends.csv')
//     .pipe(csv())
//     .on('data', (row) => {
//       if (row.studentId === studentId) {
//         friends.push(row.friendId);
//       }
//     })
//     .on('end', () => {
//       res.json({ friends });
//     });
// });

// module.exports = router;

// app.listen(PORT, () => {
//   console.log(`Friend server running on http://localhost:${PORT}`);
// });

