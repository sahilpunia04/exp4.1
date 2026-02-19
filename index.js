const express = require("express");

const app = express();
app.use(express.json());

// In-memory storage (NO fs)
let employees = [];

// Generate random ID
function generateId() {
  return Math.floor(Math.random() * 1000000000);
}

// Home
app.get("/", (req, res) => {
  res.json({ message: "Employee Management System API Running" });
});

// Get All Employees
app.get("/employees", (req, res) => {
  res.json(employees);
});

// Add Employee
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

// Update Employee
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

// Delete Employee
app.delete("/employees/:id", (req, res) => {
  const { id } = req.params;

  const index = employees.findIndex((emp) => emp.id == id);

  if (index === -1) {
    return res.status(404).json({ error: "Employee not found" });
  }

  employees.splice(index, 1);

  res.json({ message: "Employee deleted successfully" });
});

module.exports = app;
