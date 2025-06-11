const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const inputPath = path.join(__dirname, 'DB.csv');
const outputPath = path.join(__dirname, 'courses.csv');

// Step 1: Load existing courses to avoid duplicates
function loadExistingCourses(callback) {
  const courses = new Set();
  if (!fs.existsSync(outputPath)) return callback(courses); // file doesn't exist yet

  fs.createReadStream(outputPath)
    .pipe(csv())
    .on('data', (row) => {
      const key = `${row.dept.trim()}${row.code.trim()}`;
      courses.add(key);
    })
    .on('end', () => callback(courses))
    .on('error', err => {
      console.error('❌ Failed to read existing courses:', err);
      callback(courses);
    });
}

// Step 2: Import new courses from DB.csv
function importCourses() {
  const newCourses = [];

  loadExistingCourses((existingSet) => {
    fs.createReadStream(inputPath)
      .pipe(csv())
      .on('data', (row) => {
        if (row.Dept && row.Code && row.Title) {
          const dept = row.Dept.trim();
          const code = row.Code.trim();
          const title = row.Title.trim();
          const key = `${dept}${code}`;

          if (!existingSet.has(key)) {
            newCourses.push({ dept, code, title });
            console.log(`✅ New course found: ${dept}${code} - ${title}`);
          } else {
            console.log(`ℹ️ Skipped existing course: ${dept}${code}`);
          }
        } else {
          console.log('❌ Skipped row with missing fields:', row);
        }
      })
      .on('end', () => {
        if (newCourses.length === 0) {
          console.log('\n✅ No new courses to add.\n');
          return;
        }

        const writer = createObjectCsvWriter({
          path: outputPath,
          header: [
            { id: 'dept', title: 'dept' },
            { id: 'code', title: 'code' },
            { id: 'title', title: 'title' }
          ],
          append: true
        });

        writer.writeRecords(newCourses)
          .then(() => {
            console.log(`\n✅ Added ${newCourses.length} new course(s) to courses.csv\n`);
          })
          .catch(err => console.error('❌ Error writing courses:', err));
      });
  });
}

importCourses();
