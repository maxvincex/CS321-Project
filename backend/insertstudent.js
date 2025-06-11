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

// Sample student
const student = {
  id: Date.now(), // crude unique ID
  Username: 'Rowan',
  Password: 'password',
  Courses: JSON.stringify(['CS312', 'MATH202', 'ENG150']),
  Availability: 'weekends',
  Friends: JSON.stringify([])
};

// Add student to CSV
csvWriter.writeRecords([student])
  .then(() => console.log('Student added to CSV'))
  .catch(err => console.error('Error writing to CSV:', err));







