
const {
  Student,
  classFilter,
  timeFilter,
  connectFilter,
  resultMethod
} = require('../../src/Student');

const students = [
  new Student("alex", "pass", "CS", ["CS310", "ENGH302"], "", [10,5,2] ,1),
  new Student("bella", "pass", "CS", ["CS310", "MATH125"], "Weekdays",[1,4] ,2),
  new Student("carlos", "pass", "Math", ["MATH125"], "Weekends",[] ,3),
  new Student("dana", "pass", "CHEM", ["CHEM213","CS321"], "Anytime",[2,9,10] ,4),
  new Student("elena", "pass", "CS", ["CS405", "CS321", "CS480"], "Weekends", [1,6],5),
  new Student("frank", "pass", "ECE", ["CS310"], "Weekdays", [5,7], 6),
  new Student("grace", "pass", "ME", ["CS405", "ME231"], "Weekends",[6], 7),
  new Student("hank", "pass", "PHYS", ["PHYS160" , "PHYS161"], "Weekdays",[10], 8),
  new Student("iris", "pass", "SWE", ["SWE205", "SWE419", "CS471"], "Anytime",[4], 9),
  new Student("jack", "pass", "CS", ["CS471","CS310", "CS321","PHYS160"], "Anytime", [1,4,8],10),
  new Student("karen", "pass", "BKMT", ["BUS100", "CS405","STAT250" ], "Anytime", 11)
];




describe('classFilter', () => {
  test('filters students by class CS310 excluding self', () => {
    const result = classFilter(students, "CS310", 1);
    expect(result).toEqual([students[1], students[5], students[9]]);
  });

  test('filters students by class CS405 excluding self', () => {

    const result = classFilter(students, "CS405", 1);
    expect(result).toEqual([students[4], students[6], students[10]]);

  });

  test('returns null when no match', () => {
    expect(classFilter(students, "BIO101", 1)).toBeNull();
  });

  test('returns null when the only match is myself', () => {
    expect(classFilter(students, "ENGH302", 1)).toBeNull();
  });

});


describe('timeFilter', () => {
  const classfilter = classFilter(students, "CS310", 1);

  test('returns full list on empty string input', () => {
    expect(timeFilter(classfilter, [""])).toEqual(classfilter);
  });


  test('returns full list on "Anytime"', () => {
    expect(timeFilter(classfilter, ["Anytime"])).toEqual(classfilter); // before ->[students[9]])
  });

  test('returns empty array on no match', () => {
    expect(timeFilter(classfilter, ["weekends"])).toEqual([students[9]]);
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
  const cf = [students[1], students[3], students[4], students[9], students[10]];
  const tf = [students[1], students[4], students[9]];
  const conn = [students[4], students[9]];
  const classconn = [students[10]]

  test('returns prioritized list', () => {
    const result = resultMethod(cf, tf, conn, classconn);
    expect(result).toEqual([
      students[4], // connected + time + class
      students[9], // connected + time + class
      students[1],  //class + time
      students[10], //connected + class
      students[3] // class only

    ]);
  });

  test('returns null if classFiltered is null', () => {
    expect(resultMethod(null, tf, conn)).toBeNull();
  });
});
