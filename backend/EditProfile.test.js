const {
  addCourseToStudent,
  removeCourseFromStudent,
  updateStudentPassword,
  updateStudentAvailability,
  removeFriend
} = require('./EditProfile');

jest.mock('./studentUtils', () => ({
  readAllStudents: jest.fn(),
  writeAllStudents: jest.fn()
}));

jest.mock('./readCourses', () => ({
  getAllCourses: jest.fn()
}));

const { readAllStudents, writeAllStudents } = require('./studentUtils');
const { getAllCourses } = require('./readCourses');

describe('Student course update and profile functions', () => {
  let mockStudents;

  beforeEach(() => {
    mockStudents = [
      {
        id: 1,
        Email: 'test@example.com',
        Password: 'Rana1234',
        Courses: ['MATH203'],
        Availability: 'weekends',
        Friends: [2]
      },
      {
        id: 2,
        Email: 'friend@example.com',
        Password: 'Friend1234',
        Courses: ['BIO101'],
        Availability: 'mornings',
        Friends: [1]
      }
    ];

    readAllStudents.mockImplementation((cb) => cb(null, mockStudents));
    writeAllStudents.mockImplementation((data, cb) => cb(null));
    getAllCourses.mockImplementation((cb) => cb(null, ['CS321', 'MATH203', 'BIO101']));
  });

  test('adds a new valid course to student list and verifies course DB is checked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const getAllCoursesSpy = jest.spyOn(require('./readCourses'), 'getAllCourses');

    addCourseToStudent(1, 'CS321');

    expect(getAllCoursesSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("✅ 'CS321' added to your course list.");
    expect(mockStudents[0].Courses).toContain('CS321');

    consoleSpy.mockRestore();
    getAllCoursesSpy.mockRestore();
  });

  test('does not add duplicate course', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    addCourseToStudent(1, 'MATH203');
    expect(consoleSpy).toHaveBeenCalledWith("⚠️ Course 'MATH203' already in your list.");
    consoleSpy.mockRestore();
  });

  test('removes existing course from student list', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    removeCourseFromStudent(1, 'MATH203');
    expect(consoleSpy).toHaveBeenCalledWith("✅ 'MATH203' removed from your course list.");
    consoleSpy.mockRestore();
  });

  test('does not remove non-existent course', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    removeCourseFromStudent(1, 'BIO102');
    expect(consoleSpy).toHaveBeenCalledWith("⚠️ Course 'BIO102' not found in your list.");
    consoleSpy.mockRestore();
  });

  test("rejects 'CS009' if not found in DB.csv", () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    getAllCourses.mockImplementationOnce((cb) => cb(null, ['CS321', 'BIO101']));
    addCourseToStudent(1, 'CS009');
    expect(consoleSpy).toHaveBeenCalledWith("❌ 'CS009' is not a valid course.");
    consoleSpy.mockRestore();
  });

  test('logs warning if student not found in updateStudentPassword', () => {
    readAllStudents.mockImplementationOnce((cb) => cb(null, [])); // Simulate no students
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    updateStudentPassword(99, 'NewPass123'); // 99 does not exist

    expect(consoleSpy).toHaveBeenCalledWith('⚠️ Student not found.');

    consoleSpy.mockRestore();   
  });

  test('updates password successfully with valid input', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    updateStudentPassword(1, 'Pass1234');
    expect(consoleSpy).toHaveBeenCalledWith('✅ Password updated successfully.');
    consoleSpy.mockRestore();
  });

  test('does not update if password is the same as the old one', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    updateStudentPassword(1, 'Rana1234');
    expect(consoleSpy).toHaveBeenCalledWith('⚠️ New password cannot be the same as the old one.');
    consoleSpy.mockRestore();
  });

  test('updates availability successfully', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    updateStudentAvailability(1, 'Evenings');
    expect(consoleSpy).toHaveBeenCalledWith('✅ Availability updated to: Evenings');
    consoleSpy.mockRestore();
  });

  test('removes a friend from both students', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    removeFriend(1, 2);
    expect(consoleSpy).toHaveBeenCalledWith('✅ Friend ID 2 removed.');
    expect(consoleSpy).toHaveBeenCalledWith('👥 Updated friends list: []');
    consoleSpy.mockRestore();
  });

  test('does not remove friend if not connected', () => {
    mockStudents[0].Friends = [];
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    removeFriend(1, 2);
    expect(consoleSpy).toHaveBeenCalledWith('⚠️ ID 2 is not in your friend list.');
    consoleSpy.mockRestore();
  });

  test('handles invalid input for removeFriend', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    removeFriend('one', 'two');
    expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Invalid input. IDs must be numbers.');
    consoleErrorSpy.mockRestore();
  });
});
