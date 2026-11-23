const express = require("express");

const app = express();
const PORT = 3000;

// Middleware: JSON body parse karne ke liye
app.use(express.json());

// In-memory data (koi database nahi)
let students = [
  { id: 201, rollNumber: "CSE2401", name: "Aarav Sharma", branch: "CSE", semester: 3, email: "aarav@example.com" },
  { id: 202, rollNumber: "ECE2402", name: "Diya Verma", branch: "ECE", semester: 3, email: "diya@example.com" },
  { id: 203, rollNumber: "CSE2403", name: "Kabir Singh", branch: "CSE", semester: 3, email: "kabir@example.com" },
];

let nextId = 204;

// ---------- Validation helper ----------
function validateStudent(body, ignoreId = null) {
  const errors = [];
  if (!body || typeof body !== "object") {
    return ["Request body must be a JSON object"];
  }

  const { rollNumber, name, branch, semester, email } = body;

  if (typeof rollNumber !== "string" || rollNumber.trim() === "") {
    errors.push("rollNumber is required and must be a non-empty string");
  }
  if (typeof name !== "string" || name.trim() === "") {
    errors.push("name is required and must be a non-empty string");
  }
  if (typeof branch !== "string" || branch.trim() === "") {
    errors.push("branch is required and must be a non-empty string");
  }
  if (typeof semester !== "number" || !Number.isInteger(semester) || semester < 1 || semester > 8) {
    errors.push("semester is required and must be a number between 1 and 8");
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("email is required and must be a valid email address");
  }

  // rollNumber unique hona chahiye
  if (typeof rollNumber === "string" && rollNumber.trim() !== "") {
    const duplicate = students.find(
      (s) =>
        s.rollNumber.toLowerCase() === rollNumber.trim().toLowerCase() &&
        s.id !== ignoreId
    );
    if (duplicate) errors.push("rollNumber already exists");
  }

  return errors;
}

// ---------- Routes ----------

// 1. GET all students
app.get("/api/students", (req, res) => {
  res.status(200).json(students);
});

// 6. Filter by branch (/:id se PEHLE declare karna zaroori hai)
app.get("/api/students/filter", (req, res) => {
  const { branch } = req.query;

  if (!branch) {
    return res.status(400).json({ error: "branch query parameter is required" });
  }

  const result = students.filter(
    (s) => s.branch.toLowerCase() === branch.toLowerCase()
  );
  res.status(200).json(result); // match na mile to empty array []
});

// 3. GET student by id
app.get("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.status(200).json(student);
});

// 2. POST new student
app.post("/api/students", (req, res) => {
  const errors = validateStudent(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { rollNumber, name, branch, semester, email } = req.body;
  const newStudent = {
    id: nextId++,
    rollNumber: rollNumber.trim(),
    name: name.trim(),
    branch: branch.trim(),
    semester,
    email: email.trim(),
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

// 4. PUT update student
app.put("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Student not found" });
  }

  const errors = validateStudent(req.body, id);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { rollNumber, name, branch, semester, email } = req.body;
  students[index] = {
    id, // id kabhi change nahi hoti
    rollNumber: rollNumber.trim(),
    name: name.trim(),
    branch: branch.trim(),
    semester,
    email: email.trim(),
  };

  res.status(200).json(students[index]);
});

// 5. DELETE student
app.delete("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Student not found" });
  }

  const deleted = students.splice(index, 1)[0];
  res.status(200).json({ message: "Student deleted successfully", student: deleted });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});