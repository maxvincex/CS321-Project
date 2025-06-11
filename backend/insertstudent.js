const { readAllStudents, writeAllStudents } = require('./studentUtils');
const { getAllCourses } = require('./readCourses');

function insertStudent(student) {
  getAllCourses((err, validCourses) => {
    if (err) return console.error('❌ Failed to read courses:', err);

    student.Courses = student.Courses.filter(course =>
      validCourses.includes(course)
    );

    if (student.Courses.length === 0) {
      return console.log('❌ No valid courses. Student not added.');
    }

    readAllStudents((err, students) => {
      if (students.find(s => s.Email === student.Email)) {
        return console.log('❌ Email already exists.');
      }

      const nextId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
      student.id = nextId;

      students.push(student);

      writeAllStudents(students, (err) => {
        if (err) return console.error('❌ Write error:', err);
        console.log(`✅ Student '${student.Email}' added.`);
      });
    });
  });
}

// Example
insertStudent({
  Email: 'rana@anything.com',
  Password: 'mypassword',
  Courses: ['cs262'],
  Availability: 'weekends',
  Friends: []
});
