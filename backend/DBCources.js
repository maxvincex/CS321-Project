const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2');

// MySQL connection setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',         
  password: 'Mina#4612',     // <- Replace with the actual password
  database: 'student_database'
});

// Read and insert courses from CSV
fs.createReadStream('DB.csv')
  .pipe(csv())
  .on('data', (row) => {
    console.log('DEBUG ROW:', row); // 🐞 Shows exactly what was read from the file

    if (row.Dept && row.Code && row.Title) {
      // Clean and insert
      const dept = row.Dept.trim();
      const code = row.Code.trim();
      const title = row.Title.trim();

      connection.execute(
        'INSERT IGNORE INTO courses (dept, code, title) VALUES (?, ?, ?)',
        [dept, code, title],
        (err, results) => {
          if (err) {
            console.error('❌ Error inserting row:', err);
          } else if (results.affectedRows > 0) {
            console.log(`✅ Inserted course: ${dept}${code} - ${title}`);
          } else {
            console.log(`ℹ️ Course already exists: ${dept}${code}`);
          }
        }
      );
    } else {
      console.log('❌ Skipped row due to missing fields:', row);
    }
  })
  .on('end', () => {
    console.log('\n✅ Done importing courses.\n');
    connection.end();
  });
