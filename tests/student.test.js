const {
  Student,
  classFilter,
  timeFilter,
  connectFilter,
  resultMethod
} = require('../Student');

const students = [
  new Student(1, "alex", "pass", "CS", ["CS310"], "Mon"),
  new Student(2, "bella", "pass", "CS", ["CS310", "MATH125"], "Wed"),
  new Student(3, "carlos", "pass", "Math", ["MATH125"], "Mon"),
  new Student(4, "dana", "pass", "CS", ["CS310"], "anytime"),
  new Student(5, "elena", "pass", "CS", ["CS310"], "Fri")
];

describe('classFilter', () => {
  test('filters students by class excluding self', () => {
    const result = classFilter(students, "CS310", 1);
    expect(result).toEqual([students[1], students[3], students[4]]);
  });

  test('returns null when no match', () => {
    expect(classFilter(students, "BIO101", 1)).toBeNull();
  });
});

describe('timeFilter', () => {
  const input = [students[1], students[3], students[4]];

  test('filters by shared availability', () => {
    expect(timeFilter(input, ["Wed"])).toEqual([students[1], students[3]]);
  });

  test('returns full list on "anytime"', () => {
    expect(timeFilter(input, "anytime")).toEqual(input);
  });

  test('returns full list on null input', () => {
    expect(timeFilter(input, null)).toEqual(input);
  });

  test('returns empty array on no match', () => {
    expect(timeFilter(input, ["Sun"])).toEqual([]);
  });
});

describe('connectFilter', () => {
  const input = [students[1], students[3], students[4]];

  test('returns only connected students', () => {
    expect(connectFilter(input, [2, 4])).toEqual([students[1], students[3]]);
  });

  test('returns null when no connections match', () => {
    expect(connectFilter(input, [99])).toBeNull();
  });
});

describe('resultMethod', () => {
  const cf = [students[1], students[3], students[4]];
  const tf = [students[1], students[3]];
  const conn = [students[3]];

  test('returns prioritized list', () => {
    const result = resultMethod(cf, tf, conn);
    expect(result).toEqual([
      students[3], // connected + time + class
      students[1], // time + class
      students[4]  // class only
    ]);
  });

  test('returns null if classFiltered is null', () => {
    expect(resultMethod(null, tf, conn)).toBeNull();
  });
});
