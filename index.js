const fs = require("fs");
const readline = require("readline");

const FILE = "employees.json";

// Load employees from file
function loadEmployees() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(FILE);
  return JSON.parse(data);
}

// Save employees to file
function saveEmployees(employees) {
  fs.writeFileSync(FILE, JSON.stringify(employees, null, 2));
}

let employees = loadEmployees();

function generateId() {
  return Math.floor(Math.random() * 1000000);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function menu() {
  console.log("\n=== Employee Management System ===");
  console.log("1. Add Employee");
  console.log("2. View Employees");
  console.log("3. Update Employee");
  console.log("4. Delete Employee");
  console.log("5. Exit");

  rl.question("Choose an option: ", (choice) => {
    switch (choice) {
      case "1":
        addEmployee();
        break;
      case "2":
        viewEmployees();
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
        console.log("Invalid choice!");
        menu();
    }
  });
}

function addEmployee() {
  rl.question("Enter Name: ", (name) => {
    rl.question("Enter Position: ", (position) => {
      rl.question("Enter Salary: ", (salary) => {
        if (!name || !position || isNaN(salary) || salary <= 0) {
          console.log("Invalid input!");
          return menu();
        }

        const newEmployee = {
          id: generateId(),
          name,
          position,
          salary: Number(salary)
        };

        employees.push(newEmployee);
        saveEmployees(employees);
        console.log("Employee added successfully!");
        menu();
      });
    });
  });
}

function viewEmployees() {
  console.log("\nEmployee List:");
  console.table(employees);
  menu();
}

function updateEmployee() {
  rl.question("Enter Employee ID to update: ", (id) => {
    const emp = employees.find(e => e.id == id);
    if (!emp) {
      console.log("Employee not found!");
      return menu();
    }

    rl.question("Enter New Name: ", (name) => {
      rl.question("Enter New Position: ", (position) => {
        rl.question("Enter New Salary: ", (salary) => {
          if (!name || !position || isNaN(salary) || salary <= 0) {
            console.log("Invalid input!");
            return menu();
          }

          emp.name = name;
          emp.position = position;
          emp.salary = Number(salary);

          saveEmployees(employees);
          console.log("Employee updated successfully!");
          menu();
        });
      });
    });
  });
}

function deleteEmployee() {
  rl.question("Enter Employee ID to delete: ", (id) => {
    const index = employees.findIndex(e => e.id == id);
    if (index === -1) {
      console.log("Employee not found!");
      return menu();
    }

    employees.splice(index, 1);
    saveEmployees(employees);
    console.log("Employee deleted successfully!");
    menu();
  });
}

menu();