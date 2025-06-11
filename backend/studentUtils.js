// studentUtils.js (using Email instead of Username)
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const filePath = path.join(__dirname, 'students.csv');

function readAllStudents(callback) {
  const students = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      students.push({
        id: parseInt(row.id),
        Email: row.Email,
        Password: row.Password,
        Courses: JSON.parse(row.Courses),
        Availability: row.Availability,
        Friends: JSON.parse(row.Friends)
      });
    })
    .on('end', () => callback(null, students))
    .on('error', (err) => callback(err, null));
}

function writeAllStudents(students, callback) {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'id', title: 'id' },
      { id: 'Email', title: 'Email' },
      { id: 'Password', title: 'Password' },
      { id: 'Courses', title: 'Courses' },
      { id: 'Availability', title: 'Availability' },
      { id: 'Friends', title: 'Friends' }
    ]
  });

  const formatted = students.map(s => ({
    id: s.id,
    Email: s.Email,
    Password: s.Password,
    Courses: JSON.stringify(s.Courses),
    Availability: s.Availability,
    Friends: JSON.stringify(s.Friends)
  }));

  csvWriter.writeRecords(formatted)
    .then(() => callback(null))
    .catch(err => callback(err));
}

module.exports = { readAllStudents, writeAllStudents };
