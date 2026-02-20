const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const FILE = "employees.json";

function loadEmployees() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(FILE));
}

function saveEmployees(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
  res.json({ message: "Employee Management System Running 🚀" });
});

app.get("/employees", (req, res) => {
  res.json(loadEmployees());
});

app.post("/employees", (req, res) => {
  const { name, position, salary } = req.body;

  if (!name || !position || isNaN(salary) || salary <= 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const employees = loadEmployees();

  const newEmployee = {
    id: Math.floor(Math.random() * 1000000),
    name,
    position,
    salary: Number(salary)
  };

  employees.push(newEmployee);
  saveEmployees(employees);

  res.status(201).json(newEmployee);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));