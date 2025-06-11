const {
  addCourseToStudent,
  removeCourseFromStudent
} = require('./updateStudentCourses');

jest.mock('./studentUtils', () => ({
  readAllStudents: jest.fn(),
  writeAllStudents: jest.fn()
}));

jest.mock('./readCourses', () => ({
  getAllCourses: jest.fn()
}));

const { readAllStudents, writeAllStudents } = require('./studentUtils');
const { getAllCourses } = require('./readCourses');

describe('Student course update functions', () => {
  let mockStudents;

  /**
   * Sets up mock student data and mocks for read/write functions.
   * Runs before each test to ensure clean state.
   */
  beforeEach(() => {
    mockStudents = [
      {
        id: 1,
        Email: 'test@example.com',
        Password: '1234',
        Courses: ['MATH203'],
        Availability: 'weekends',
        Friends: [2]
      }
    ];

    readAllStudents.mockImplementation((cb) => cb(null, mockStudents));
    writeAllStudents.mockImplementation((data, cb) => cb(null));
    getAllCourses.mockImplementation((cb) => cb(null, ['CS321', 'MATH203', 'BIO101']));
  });

  /**
   * @test
   * @description Tests adding a new valid course not already in the student's list.
   * Expects the course to be added and logged.
   */
  test('adds a new valid course to student list', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    addCourseToStudent(1, 'CS321');

    expect(consoleSpy).toHaveBeenCalledWith("✅ 'CS321' added to your course list.");
    expect(mockStudents[0].Courses).toContain('CS321');

    consoleSpy.mockRestore();
  });

  /**
   * @test
   * @description Tests that adding a duplicate course is prevented and logged as a warning.
   */
  test('does not add duplicate course', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    addCourseToStudent(1, 'MATH203');

    expect(consoleSpy).toHaveBeenCalledWith("⚠️ Course 'MATH203' already in your list.");
    expect(mockStudents[0].Courses.filter(c => c === 'MATH203').length).toBe(1);

    consoleSpy.mockRestore();
  });

  /**
   * @test
   * @description Tests removing a course that exists in the student's list.
   * Expects the course to be removed and logged.
   */
  test('removes existing course from student list', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    removeCourseFromStudent(1, 'MATH203');

    expect(consoleSpy).toHaveBeenCalledWith("✅ 'MATH203' removed from your course list.");
    expect(mockStudents[0].Courses).not.toContain('MATH203');

    consoleSpy.mockRestore();
  });

  /**
   * @test
   * @description Tests attempting to remove a course that is not in the student's list.
   * Expects a warning message and no change in course list.
   */
  test('does not remove non-existent course', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    removeCourseFromStudent(1, 'BIO101');

    expect(consoleSpy).toHaveBeenCalledWith("⚠️ Course 'BIO101' not found in your list.");
    expect(mockStudents[0].Courses).not.toContain('BIO101');

    consoleSpy.mockRestore();
  });

  /**
   * @test
   * @description Tests that invalid courses (not in the DB) are not added.
   */
  test('does not add invalid course', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    getAllCourses.mockImplementationOnce((cb) => cb(null, ['CS321'])); // make MATH203 invalid

    addCourseToStudent(1, 'MATH203');

    expect(consoleSpy).toHaveBeenCalledWith("❌ 'MATH203' is not a valid course.");

    consoleSpy.mockRestore();
  });
});
