const fs = require('fs');
const path = require('path');

// Create students directory if it doesn't exist
const studentsDir = path.join(__dirname, 'students');
if (!fs.existsSync(studentsDir)) {
  fs.mkdirSync(studentsDir);
}

// Create student data
const studentId = Date.now().toString();
const studentData = {
  id: studentId,
  studentId: studentId,
  name: "Muzzamil",
  exam: "C",
  password: "Muzzamil", // Password is same as student name
  status: "offline",
  timeElapsed: "00:00:00",
  riskScore: 0,
  createdAt: new Date().toISOString()
};

// Save student data to a JSON file
const studentFile = path.join(studentsDir, `${studentId}.json`);
fs.writeFileSync(studentFile, JSON.stringify(studentData, null, 2));

console.log(`Student "${studentData.name}" with ID ${studentId} has been added successfully.`);
console.log(`Exam: ${studentData.exam}`);
console.log(`Password: ${studentData.password}`);