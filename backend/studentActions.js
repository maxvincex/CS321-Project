const { readAllStudents, writeAllStudents } = require('./studentUtils');


/**
 * Adds a friend by ID to a student's Friends list.
 * @param {number} studentId - The logged-in student's ID
 * @param {number} friendId - The ID of the friend to add
 */
function addFriend(studentId, friendId) {
  if (studentId === friendId) {
    return console.log('⚠️ You cannot add yourself as a friend.');
  }

  readAllStudents((err, students) => {
    if (err) return console.error('❌ Error reading students:', err);

    const student = students.find(s => s.id === studentId);
    const friend = students.find(s => s.id === friendId);

    if (!student) return console.log('❌ Student not found.');
    if (!friend) return console.log('❌ Friend ID not found.');

    if (student.Friends.includes(friendId)) {
      return console.log(`⚠️ ID ${friendId} is already your friend.`);
    }

    student.Friends.push(friendId);

    writeAllStudents(students, (err) => {
      if (err) console.error('❌ Write error:', err);
      else console.log(`✅ Friend ID ${friendId} added.`);
    });
  });
}

/**
 * Removes a friend by ID from a student's Friends list.
 * @param {number} studentId - The logged-in student's ID
 * @param {number} friendId - The ID to remove
 */
function removeFriend(studentId, friendId) {
  readAllStudents((err, students) => {
    if (err) return console.error('❌ Error reading students:', err);

    const student = students.find(s => s.id === studentId);
    if (!student) return console.log('❌ Student not found.');

    if (!student.Friends.includes(friendId)) {
      return console.log(`⚠️ ID ${friendId} is not in your friend list.`);
    }

    student.Friends = student.Friends.filter(id => id !== friendId);

    writeAllStudents(students, (err) => {
      if (err) console.error('❌ Write error:', err);
      else console.log(`✅ Friend ID ${friendId} removed.`);
    });
  });
}

module.exports = {
  loginStudent,
  addFriend,
  removeFriend
};
