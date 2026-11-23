const express = require("express");
const server = express();

server.use(express.json());

// In-memory records (DB connect karne se pehle temporary list)
let studentRecords = [
  { id: 201, rollNumber: "CSE2401", name: "Aarav Sharma", branch: "CSE", semester: 3, email: "aarav@example.com" },
  { id: 202, rollNumber: "ECE2402", name: "Diya Verma", branch: "ECE", semester: 3, email: "diya@example.com" },
  { id: 203, rollNumber: "CSE2403", name: "Kabir Singh", branch: "CSE", semester: 3, email: "kabir@example.com" },
];

// Auto-increment ke liye counter
let currentId = 204;

// Fetch all student entries
server.get("/api/students", (req, res) => {
  res.status(200).json(studentRecords);
});

// Filter by branch (dynamic :id route ke upar rakhna zaroori hai)
server.get("/api/students/filter", (req, res) => {
  const targetBranch = req.query.branch;

  if (!targetBranch) {
    return res.status(400).json({ message: "branch query is required" });
  }

  const matched = studentRecords.filter(
    (entry) => entry.branch.toLowerCase() === targetBranch.toLowerCase()
  );

  res.status(200).json(matched);
});

// Get single student using numeric id
server.get("/api/students/:id", (req, res) => {
  const targetId = Number(req.params.id);
  const found = studentRecords.find((entry) => entry.id === targetId);

  if (!found) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.status(200).json(found);
});

// Create a new student record
server.post("/api/students", (req, res) => {
  const { rollNumber, name, branch, semester, email } = req.body;

  const missingField = !rollNumber || !name || !branch || !semester || !email;
  if (missingField) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const invalidTextFields = [rollNumber, name, branch, email].some(
    (val) => typeof val !== "string"
  );
  if (invalidTextFields) {
    return res.status(400).json({ message: "rollNumber, name, branch and email must be strings" });
  }

  if (typeof semester !== "number") {
    return res.status(400).json({ message: "semester must be a number" });
  }

  const duplicateRoll = studentRecords.some((entry) => entry.rollNumber === rollNumber);
  if (duplicateRoll) {
    return res.status(400).json({ message: "rollNumber already exists" });
  }

  const created = {
    id: currentId++,
    rollNumber,
    name,
    branch,
    semester,
    email,
  };

  studentRecords.push(created);
  res.status(201).json(created);
});

// Replace/update an existing student's details
server.put("/api/students/:id", (req, res) => {
  const targetId = Number(req.params.id);
  const targetStudent = studentRecords.find((entry) => entry.id === targetId);

  if (!targetStudent) {
    return res.status(404).json({ message: "Student not found" });
  }

  const { rollNumber, name, branch, semester, email } = req.body;

  if (!rollNumber || !name || !branch || !semester || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (typeof semester !== "number") {
    return res.status(400).json({ message: "semester must be a number" });
  }

  Object.assign(targetStudent, { rollNumber, name, branch, semester, email });
  res.status(200).json(targetStudent);
});

// Remove student by id
server.delete("/api/students/:id", (req, res) => {
  const targetId = Number(req.params.id);
  const idx = studentRecords.findIndex((entry) => entry.id === targetId);

  if (idx === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  studentRecords.splice(idx, 1);
  res.status(200).json({ message: "Student deleted successfully" });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});