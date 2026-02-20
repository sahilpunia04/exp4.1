const express = require("express");
const router = express.Router();

// In-memory storage (module scoped so state persists)
let employees = [];

function generateId() {
  return Math.floor(Math.random() * 1000000000);
}

router.get("/", (req, res) => {
  res.json(employees);
});

router.post("/", (req, res) => {
  const { name, position, salary } = req.body;
  if (!name || !position || !salary || isNaN(salary) || salary <= 0)
    return res.status(400).json({ error: "Invalid input data" });

  const newEmployee = { id: generateId(), name, position, salary: Number(salary) };
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, position, salary } = req.body;
  const employee = employees.find((emp) => emp.id == id);
  if (!employee) return res.status(404).json({ error: "Employee not found" });
  if (!name || !position || !salary || isNaN(salary) || salary <= 0)
    return res.status(400).json({ error: "Invalid input data" });

  employee.name = name;
  employee.position = position;
  employee.salary = Number(salary);

  res.json({ message: "Employee updated successfully", employee });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = employees.findIndex((emp) => emp.id == id);
  if (index === -1) return res.status(404).json({ error: "Employee not found" });

  const deleted = employees.splice(index, 1)[0];
  res.json({ message: "Employee deleted successfully", deleted });
});

// test‑all helper
router.get("/test-all", (req, res) => {
  const results = {};

  const testEmployee = { id: generateId(), name: "Test User", position: "Tester", salary: 40000 };
  employees.push(testEmployee);
  results.added = testEmployee;

  results.list = [...employees];

  testEmployee.name = "Updated User";
  testEmployee.position = "Senior Tester";
  testEmployee.salary = 45000;
  results.updated = testEmployee;

  const index = employees.findIndex((emp) => emp.id === testEmployee.id);
  results.deleted = employees.splice(index, 1)[0];

  results.remaining = [...employees];

  res.json(results);
});

module.exports = router;
