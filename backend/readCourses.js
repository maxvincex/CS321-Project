// readCourses.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

/**
 * Reads all valid courses from DB.csv and returns an array like ['CS101', 'MATH203']
 * @param {function} callback - Function to handle result or error
 */
function getAllCourses(callback) {
  const courses = [];
  const filePath = path.join(__dirname, 'DB.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      if (row.Dept && row.Code && row.Title) {
        const dept = row.Dept.trim();
        const code = row.Code.trim();
        courses.push(`${dept}${code}`);
      }
    })
    .on('end', () => callback(null, courses))
    .on('error', (err) => {
      console.error('❌ Failed to read DB.csv:', err);
      callback(err, null);
    });
}

// Example usage:
// getAllCourses((err, courses) => {
//   if (err) console.error(err);
//   else console.log(courses);
// });

module.exports = { getAllCourses };
