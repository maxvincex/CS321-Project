const { getStudent } = require('./getstudent'); // Adjust path if needed

jest.mock('./studentUtils', () => ({
  readAllStudents: jest.fn()
}));

const { readAllStudents } = require('./studentUtils');

describe('getStudent', () => {
  const mockStudents = [
    { id: 1, Email: 'rowan@example.com', Password: 'test', Courses: [] },
    { id: 2, Email: 'jane@example.com', Password: 'secure', Courses: [] }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns student when email exists', (done) => {
    readAllStudents.mockImplementation(cb => cb(null, mockStudents));

    getStudent('rowan@example.com', (err, student) => {
      expect(err).toBeNull();
      expect(student).toEqual(mockStudents[0]);
      done();
    });
  });

  test('returns null when student not found', (done) => {
    readAllStudents.mockImplementation(cb => cb(null, mockStudents));
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    getStudent('nonexistent@example.com', (err, student) => {
      expect(err).toBeNull();
      expect(student).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('❌ No student found with that email.');
      consoleSpy.mockRestore();
      done();
    });
  });

  test('handles error from readAllStudents', (done) => {
    const fakeError = new Error('file read failure');
    readAllStudents.mockImplementation(cb => cb(fakeError, null));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    getStudent('rowan@example.com', (err, student) => {
      expect(err).toBe(fakeError);
      expect(student).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('❌ Failed to read students:', fakeError);
      consoleSpy.mockRestore();
      done();
    });
  });
});