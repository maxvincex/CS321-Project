const { insertStudent } = require('./insertstudent');
const {
  isEmailUnique,
  areValidCourses,
  isValidPassword
} = require('./validators');

jest.mock('./studentUtils', () => ({
  readAllStudents: jest.fn(),
  writeAllStudents: jest.fn()
}));

jest.mock('./readCourses', () => ({
  getAllCourses: jest.fn()
}));

jest.mock('./validators', () => ({
  isEmailUnique: jest.fn(),
  areValidCourses: jest.fn(),
  isValidPassword: jest.fn()
}));

const { readAllStudents, writeAllStudents } = require('./studentUtils');
const { getAllCourses } = require('./readCourses');

describe('insertStudent function', () => {
  let mockStudents;

  beforeEach(() => {
    mockStudents = [];

    readAllStudents.mockImplementation((cb) => cb(null, mockStudents));
    writeAllStudents.mockImplementation((data, cb) => cb(null));
    getAllCourses.mockImplementation((cb) => cb(null, ['CS321', 'MATH203']));

    isEmailUnique.mockClear();
    areValidCourses.mockClear();
    isValidPassword.mockClear();
  });

  test('✅ inserts a valid student', (done) => {
    const student = {
      Email: 'test@example.com',
      Password: 'valid1234',
      Courses: ['CS321'],
      Availability: 'weekends',
      Friends: []
    };

    isEmailUnique.mockReturnValue(true);
    areValidCourses.mockReturnValue(['CS321']);
    isValidPassword.mockReturnValue(true);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    insertStudent(student, () => {
      expect(consoleSpy).toHaveBeenCalledWith("✅ Student 'test@example.com' added.");
      expect(mockStudents.length).toBe(1);
      expect(mockStudents[0].Email).toBe('test@example.com');
      consoleSpy.mockRestore();
      done();
    });
  });

  test('❌ rejects duplicate email', (done) => {
    const student = {
      Email: 'test@example.com',
      Password: 'valid1234',
      Courses: ['CS321'],
      Availability: 'weekends',
      Friends: []
    };

    isEmailUnique.mockReturnValue(false);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    insertStudent(student, () => {
      expect(consoleSpy).toHaveBeenCalledWith('❌ Email already exists.');
      expect(mockStudents.length).toBe(0);
      consoleSpy.mockRestore();
      done();
    });
  });

  test('❌ rejects invalid password', (done) => {
    const student = {
      Email: 'badpass@example.com',
      Password: '123',
      Courses: ['CS321'],
      Availability: 'weekends',
      Friends: []
    };

    isEmailUnique.mockReturnValue(true);
    areValidCourses.mockReturnValue(['CS321']);
    isValidPassword.mockReturnValue(false);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    insertStudent(student, () => {
      expect(consoleSpy).toHaveBeenCalledWith('❌ Invalid password. Student not added.');
      expect(mockStudents.length).toBe(0);
      consoleSpy.mockRestore();
      done();
    });
  });

  test('❌ rejects if no valid courses', (done) => {
    const student = {
      Email: 'nocourses@example.com',
      Password: 'valid1234',
      Courses: ['INVALID'],
      Availability: 'weekends',
      Friends: []
    };

    isEmailUnique.mockReturnValue(true);
    areValidCourses.mockReturnValue([]);
    isValidPassword.mockReturnValue(true);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    insertStudent(student, () => {
      expect(consoleSpy).toHaveBeenCalledWith('❌ No valid courses. Student not added.');
      expect(mockStudents.length).toBe(0);
      consoleSpy.mockRestore();
      done();
    });
  });
});
