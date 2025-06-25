// studentUtils.js (using Email instead of Username)
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const filePath = path.join(__dirname, 'students.csv');

function safeParseArray(field) {
  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed)
      ? parsed.map(item => item.trim())
      : [];
  } catch (e) {
    // fallback: convert single string like "weekends" to ["weekends"]
    if (typeof field === "string") {
      return field.includes(",")
        ? field.split(",").map(f => f.trim())
        : [field.trim()];
    }
    return [];
  }
}

function readAllStudents(callback) {
  const students = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      students.push({
        id: parseInt(row.id),
        FirstName: row.FirstName,
        LastName: row.LastName,
        Email: row.Email,
        Password: row.Password,
        Courses: safeParseArray(row.Courses),
        Availability: safeParseArray(row.Availability),
        Friends: safeParseArray(row.Friends),
        Major: row.Major,
        Bio: row.Bio
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
      { id: 'FirstName', title: 'FirstName'},
      { id: 'LastName', title: 'LastName'},
      { id: 'Email', title: 'Email' },
      { id: 'Password', title: 'Password' },
      { id: 'Courses', title: 'Courses' },
      { id: 'Availability', title: 'Availability' },
      { id: 'Friends', title: 'Friends' },
      { id: 'Bio', title: 'Bio'},
    ]
  });

  const formatted = students.map(s => ({
    id: s.id,
    FirstName: s.FirstName,
    LastName: s.LastName,
    Email: s.Email,
    Password: s.Password,
    Courses: JSON.stringify(s.Courses),
    Availability: JSON.stringify(s.Availability),
    Friends: JSON.stringify(s.Friends),
    Bio: s.Bio
  }));

  csvWriter.writeRecords(formatted)
    .then(() => callback(null))
    .catch(err => callback(err));
}

module.exports = { readAllStudents, writeAllStudents, safeParseArray};
