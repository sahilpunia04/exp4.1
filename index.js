const express = require("express");

const app = express();
app.use(express.json());

// In-memory storage
let employees = [];

// Generate random ID
function generateId() {
  return Math.floor(Math.random() * 1000000000);
}

/* ================= ROUTES ================= */

// Home
app.get("/", (req, res) => {
  res.json({ message: "Employee Management System API Running" });
});

// Get all employees
app.get("/employees", (req, res) => {
  res.json(employees);
});

// Add employee
app.post("/employees", (req, res) => {
  const { name, position, salary } = req.body;

  if (!name || !position || !salary || isNaN(salary) || salary <= 0) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const newEmployee = {
    id: generateId(),
    name,
    position,
    salary: Number(salary),
  };

  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

// Update employee
app.put("/employees/:id", (req, res) => {
  const { id } = req.params;
  const { name, position, salary } = req.body;

  const employee = employees.find((emp) => emp.id == id);

  if (!employee) {
    return res.status(404).json({ error: "Employee not found" });
  }

  if (!name || !position || !salary || isNaN(salary) || salary <= 0) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  employee.name = name;
  employee.position = position;
  employee.salary = Number(salary);

  res.json({ message: "Employee updated successfully", employee });
});

// Delete employee
app.delete("/employees/:id", (req, res) => {
  const { id } = req.params;

  const index = employees.findIndex((emp) => emp.id == id);

  if (index === -1) {
    return res.status(404).json({ error: "Employee not found" });
  }

  const deleted = employees.splice(index, 1)[0];
  res.json({ message: "Employee deleted successfully", deleted });
});

// ================= TEST-ALL ROUTE =================
app.get("/test-all", (req, res) => {
  const results = {};

  // 1️⃣ Add employee
  const testEmployee = {
    id: generateId(),
    name: "Test User",
    position: "Tester",
    salary: 40000,
  };
  employees.push(testEmployee);
  results.added = testEmployee;

  // 2️⃣ Get all employees
  results.list = [...employees]; // copy array to show current state

  // 3️⃣ Update the test employee
  testEmployee.name = "Updated User";
  testEmployee.position = "Senior Tester";
  testEmployee.salary = 45000;
  results.updated = testEmployee;

  // 4️⃣ Delete the test employee
  const index = employees.findIndex(emp => emp.id === testEmployee.id);
  const deleted = employees.splice(index, 1)[0];
  results.deleted = deleted;

  // 5️⃣ List remaining employees
  results.remaining = [...employees];

  res.json(results);
});

/* ================= SERVER SETUP ================= */
if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
