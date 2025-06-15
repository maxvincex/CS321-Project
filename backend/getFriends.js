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

app.listen(3002, () => {
  console.log('Friend list server running on http://localhost:3002');
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

// // Updated: Handle /friends/:studentId
// app.get('/friends/:studentId', (req, res) => {
//   let studentId = req.params.studentId;

//   // Convert email to username (e.g., 'alice@gmail.com' => 'alice')
//   if (studentId.includes('@')) {
//     studentId = studentId.split('@')[0];
//   }

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

// app.listen(PORT, () => {
//   console.log(`Friend server running on http://localhost:${PORT}`);
// });


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

