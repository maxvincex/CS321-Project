class Student {
  
  
  constructor(username, password, major, classes = [], timeAvailable = "") {
    this.username = username;
    this.password = password;
    this.major = major;
    this.classes = classes;
    this.timeAvailable = timeAvailable;
    this.friends = [];
  }


  hasClass(className) {
    return this.classes.includes(className);
  }


  hasTimeAvailable(availability) {
    return this.timeAvailable === availability;
  }

  hasFriend(otherStudent) {
    return this.friends.includes(otherStudent);
  }

  
  


}
