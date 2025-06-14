// server.js
const express = require('express');
const cors = require('cors');
const getFriendsRoute = require('./getFriends'); //mounting the route for get friends

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


app.use('/', getFriendsRoute);

// Dummy profile data
const userProfile = {
  id: 1,
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  bio: 'Computer Science student at XYZ University.'
};

// Routes
app.get('/api/profile', (req, res) => {
  res.json(userProfile);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
