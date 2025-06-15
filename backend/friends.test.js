const request = require('supertest');
const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');

// Re-create a minimal version of your app in test
const app = express();
app.use(cors());

let friendsDB = {};
let students = [];

// Mock student data
beforeAll((done) => {
  students = [
    { id: "1", FirstName: "Alice", LastName: "Smith", Major: "CS" },
    { id: "2", FirstName: "Bob", LastName: "Jones", Major: "Biology" },
    { id: "3", FirstName: "Charlie", LastName: "Brown", Major: "Math" },
  ];

  friendsDB = {
    "1": ["2", "3"],  // Alice is friends with Bob and Charlie
    "2": ["1"],       // Bob is friends with Alice
  };

  // Endpoint under test
  app.get('/friends/:studentId', (req, res) => {
    const studentId = req.params.studentId.trim();
    const friendIds = friendsDB[studentId] || [];

    const friendDetails = friendIds.map(fid => {
      const student = students.find(s => s.id === fid.trim());
      return student
        ? {
            firstName: student.FirstName,
            lastName: student.LastName,
            major: student.Major
          }
        : null;
    }).filter(Boolean);

    res.json({ friends: friendDetails });
  });

  done();
});

describe('GET /friends/:studentId', () => {
  it('should return detailed list of friends for valid student ID', async () => {
    const response = await request(app).get('/friends/1');
    expect(response.statusCode).toBe(200);
    expect(response.body.friends).toEqual([
      { firstName: 'Bob', lastName: 'Jones', major: 'Biology' },
      { firstName: 'Charlie', lastName: 'Brown', major: 'Math' }
    ]);
  });

  it('should return empty list if student has no friends', async () => {
    const response = await request(app).get('/friends/3');
    expect(response.statusCode).toBe(200);
    expect(response.body.friends).toEqual([]);
  });

  it('should return empty list if student ID not in DB', async () => {
    const response = await request(app).get('/friends/999');
    expect(response.statusCode).toBe(200);
    expect(response.body.friends).toEqual([]);
  });
});
