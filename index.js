const fs = require("fs");
const readline = require("readline");

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Load employees from JSON file
let employees = [];

function loadEmployees() {
  if (fs.existsSync("employees.json")) {
    const data = fs.readFileSync("employees.json");
    employees = JSON.parse(data);
  }
}

// Save employees to JSON file
function saveEmployees() {
  fs.writeFileSync("employees.json", JSON.stringify(employees, null, 2));
}

// Generate random ID
function generateId() {
  return Math.floor(Math.random() * 1000000000);
}

// Add Employee
function addEmployee() {
  rl.question("Employee Name: ", (name) => {
    rl.question("Position: ", (position) => {
      rl.question("Salary: ", (salary) => {
        if (isNaN(salary) || salary <= 0) {
          console.log("Invalid salary. Must be a positive number.");
          mainMenu();
          return;
        }

        const employee = {
          id: generateId(),
          name,
          position,
          salary: Number(salary),
        };

        employees.push(employee);
        saveEmployees();
        console.log("Employee added successfully!");
        mainMenu();
      });
    });
  });
}

// List Employees
function listEmployees() {
  console.log("\nEmployee List:");

  if (employees.length === 0) {
    console.log("No employees found.");
  } else {
    employees.forEach((emp) => {
      console.log(
        `ID: ${emp.id}, Name: ${emp.name}, Position: ${emp.position}, Salary: $${emp.salary}`
      );
    });
  }

  console.log(`Total employees: ${employees.length}`);
  mainMenu();
}

// Update Employee
function updateEmployee() {
  rl.question("Enter Employee ID to update: ", (id) => {
    const employee = employees.find((emp) => emp.id == id);

    if (!employee) {
      console.log("Employee not found.");
      mainMenu();
      return;
    }

    rl.question("New Name: ", (name) => {
      rl.question("New Position: ", (position) => {
        rl.question("New Salary: ", (salary) => {
          if (isNaN(salary) || salary <= 0) {
            console.log("Invalid salary.");
            mainMenu();
            return;
          }

          employee.name = name;
          employee.position = position;
          employee.salary = Number(salary);

          saveEmployees();
          console.log("Employee updated successfully!");
          mainMenu();
        });
      });
    });
  });
}

// Delete Employee
function deleteEmployee() {
  rl.question("Enter Employee ID to delete: ", (id) => {
    const index = employees.findIndex((emp) => emp.id == id);

    if (index === -1) {
      console.log("Employee not found.");
    } else {
      employees.splice(index, 1);
      saveEmployees();
      console.log("Employee deleted successfully!");
    }

    mainMenu();
  });
}

// Main Menu
function mainMenu() {
  console.log("\nEmployee Management System");
  console.log("1. Add Employee");
  console.log("2. List Employees");
  console.log("3. Update Employee");
  console.log("4. Delete Employee");
  console.log("5. Exit");

  rl.question("Select an option: ", (choice) => {
    switch (choice) {
      case "1":
        addEmployee();
        break;
      case "2":
        listEmployees();
        break;
      case "3":
        updateEmployee();
        break;
      case "4":
        deleteEmployee();
        break;
      case "5":
        rl.close();
        break;
      default:
        console.log("Invalid option.");
        mainMenu();
    }
  });
}

// Start program
loadEmployees();
mainMenu();