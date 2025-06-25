const { readAllStudents } = require('./studentUtils');



/** 
 * Filters the student database to return students who are taking a specific class, 
 * excluding the current user. 
 * 
 * @function classFilter 
 * @param {Array<Object>} studentDatabase - Array of all student objects. 
 * @param {string} targetClass - The class to filter students by. 
 * @param {number} myId - The ID of the current user to exclude. 
 * @returns {Array<Object>|null} - List of students taking the class (excluding self), or null if none found. 
 */ 
  function classFilter(studentDatabase, targetClass, myId) { 
    if (!Array.isArray(studentDatabase) || !targetClass) return null; 
      const filtered = studentDatabase.filter(student => 
        parseInt(student.id) !== parseInt(myId) && // exclude current user searching
        Array.isArray(student.Courses) &&          // errors if Courses is missing
        student.Courses.includes(targetClass)
      );
  return filtered.length > 0 ? filtered : null; 
}  

/** 
 * Filters students based on shared availability time. 
 * If availability is "anytime" or null, returns the original list. 
 * Otherwise, returns students with at least one matching availability time or "anytime". 
 * 
 * @function timeFilter 
 * @param {Array<Object>} classFilteredList - List of students from classFilter. 
 * @param {Array<string>|string|null} myAvailability - Current user's availability (array of time slots or "anytime"). 
 * @returns {Array<Object>} - List of students with matching time, or original list if no match. 
 */  
function timeFilter(classFilteredList, myAvailability) { 
  if (!Array.isArray(classFilteredList) || classFilteredList.length === 0) return []; 
 
  // Normalize to array of strings 
  const myAvailabilityArray = Array.isArray(myAvailability) 
    ? myAvailability.map(a => a.toLowerCase().trim()) 
    : [myAvailability?.toLowerCase().trim()]; 
 
  // If availability is "anytime" or null/empty, return full list 
  if ( 
  !myAvailabilityArray || 
  myAvailabilityArray.includes("anytime") || 
  myAvailabilityArray.includes("") || 
  myAvailabilityArray[0] === null 
  ) { 
    return classFilteredList; 
  } 
 
  return classFilteredList.filter(student => { 
    const studentAvailabilityArray = Array.isArray(student.Availability)
    ? student.Availability.map(a => a.toLowerCase().trim())
    : [student.Availability?.toLowerCase().trim()];    
    
    //return myAvailabilityArray.includes(studentAvailability) || studentAvailability === "anytime"; 
    return (
      studentAvailabilityArray.includes("anytime") ||
      myAvailabilityArray.some(a => studentAvailabilityArray.includes(a))
    );
  }); 
} 
 
/** 
 * Filters the time-filtered list to return only students that the user is already connected with. 
 * 
 * @function connectFilter 
 * @param {Array<Object>} timeFilteredList - List of students after timeFilter. 
 * @param {Array<number>} myConnections - Array of student IDs the user is already connected with. 
 * @returns {Array<Object>|null} - List of connected students, or null if no matches found. 
 */ 
function connectFilter(FilteredList, myConnections) { 
  if (!Array.isArray(FilteredList) || !Array.isArray(myConnections)) return null; 
 
  const filtered = FilteredList.filter(student => myConnections.includes(student.id)); 
 
  return filtered.length > 0 ? filtered : null; 
} 
 
 
 
/** 
 * Combines the results from class filtering, time filtering, and connection filtering into a prioritized list. 
 * 
 * Priority: 
 *   1. Connected students with same class and time 
 *   2. Students with same class and time 
 *   3. Students with same class only 
 * 
 * @function resultMethod 
 * @param {Array<Object>|null} classFiltered - Result from classFilter. 
 * @param {Array<Object>|null} timeFiltered - Result from timeFilter. 
 * @param {Array<Object>|null} connectFiltered - Result from connectFilter. 
 * @returns {Array<Object>|null} - Final prioritized result list, or null if classFiltered is null. 
 */ 
function resultMethod(classFiltered, timeFiltered, connectTimeFiltered, connectClassFilter) { 
  if (!classFiltered) return null; 
  const priorityList = []; 
 
  // 1. Connected students with same class and time 
  if (connectTimeFiltered) { 
    for (const student of connectTimeFiltered) { 
      if (!priorityList.includes(student)) { 
        priorityList.push(student); 
      } 
    } 
  } 
 
   
 
  // 2. Students with same class and time (but not already added) 
  if (timeFiltered) { 
    for (const student of timeFiltered) { 
      if (!priorityList.includes(student)) { 
        priorityList.push(student); 
      } 
    }
  } 
 
  // 3. Connected students with same class 
  if (connectClassFilter) { 
    for (const student of connectClassFilter) { 
      if (!priorityList.includes(student)) { 
        priorityList.push(student); 
      } 
    } 
  } 
   
 
  // 4. Students with same class only (but not already added) 
  for (const student of classFiltered) { 
    if (!priorityList.includes(student)) { 
      priorityList.push(student); 
    } 
  } 
 
  return priorityList.length > 0 ? priorityList : null; 
} 
 
   
 
/** 
Main method to execute the full matching process for a student., 
Steps:, 
1. Filters students by class using classFilter 
2. Filters the result by availability using timeFilter 
3. Filters again by connections using connectFilter 
4. Combines all results into a prioritized list using resultMethod 
@function mainMatch, 
@param {Array<Object>} studentDatabase - The full list of registered students., 
@param {string} targetClass - The class the student is looking to match in., 
@param {number} myId - The ID of the current student., 
@param {string|Array<string>} myAvailability - The current student's availability., 
@param {Array<number>} myConnections - List of student IDs the current student is connected with., 
@returns {Array<Object>|null} - Final prioritized list of matches, or null if no students found in the same class. 
*/ 
function mainMatch(studentDatabase, targetClass, myId, myAvailability, myConnections) { 
  const classFiltered = classFilter(studentDatabase, targetClass, myId); 
  if (!classFiltered) return null; 
 
  const timeFiltered = timeFilter(classFiltered, myAvailability); 
  const connectTimeFiltered = connectFilter(timeFiltered, myConnections); 
  const connectClassFilter = connectFilter(classFiltered, myConnections); 
 
  const finalList = resultMethod(classFiltered, timeFiltered, connectTimeFiltered, connectClassFilter);

  return finalList?.filter(student => parseInt(student.id) !== parseInt(myId)) || null;
  //return resultMethod(classFiltered, timeFiltered, connectTimeFiltered, connectClassFilter); 
} 
 
module.exports = { 
  classFilter, 
  timeFilter, 
  connectFilter, 
  resultMethod, 
  mainMatch 
}; 



readAllStudents((err, students) => {
  if (err) {
    return console.error('❌ Failed to load students:', err);
  }

  const result = mainMatch(students, 'CS262', 3, 'anytime', []);

  if (!result || result.length === 0) {
    console.log('⚠️ No matching students found.');
  } else {
    console.log('✅ Matching students:');
    result.forEach(student => {
      console.log(`- ${student.Email} (ID: ${student.id})`);
    });
  }
});