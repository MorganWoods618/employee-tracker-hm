const mysql = require("mysql2");
const inquirer = require("inquirer");

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Coffee18~",
  database: "employees_db",
});

connection.connect(function () {
  console.log("connected");
  start();
});

function start() {
  inquirer
    .prompt([
      {
        name: "prompt",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a new department",
          "Add a new role",
          "Add a new employee",
          "Update employee roles",
          "Exit",
        ],
      },
    ])
    .then(function (res) {
      switch (res.prompt) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a new department":
          addDepartment();
          break;
        case "Add a new role":
          addRole();
          break;
        case "Add a new employee":
          addEmployee();
          break;
        case "Update employee roles":
          updateRole();
          break;
        case "exit":
          connection.end();
          break;
      }
    });
}
//view information
function viewDepartments() {
  connection.query("SELECT * from departments", (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function viewEmployees() {
  connection.query("SELECT * from employees", (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function viewRoles() {
  connection.query("SELECT * from roles", (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

//add information
function addRole() {
  connection.query("SELECT * from departments", (err, res) => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the title of the new role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the new role?",
        },
        //getting dept number
        {
          type: "list",
          name: "department",
          message: "What department is this role in?",
          choices: res.map((department) => department.name),
        },
      ])
      .then((data) => {
        const chosenDepartment = res.find(
          (department) => department.name === data.department
        );
        connection.query("INSERT into roles SET ?", {
          title: data.title,
          salary: data.salary,
          department_id: chosenDepartment.id,
        });
        console.log("new role added");
        start();
      });
  });
}

function addDepartment() {
  connection.query("SELECT * from departments", (err, res) => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "department",
          message: "What is the name of the new department?",
        },
      ])
      .then((data) => {
        connection.query("INSERT into departments SET ?", {
          name: data.name,
        });
        console.log("new department added");
        start();
      });
  });
}

//    (first_name, last_name, role_id, manager_id)
function addEmployee() {
  connection.query("SELECT * from employees", (err, res) => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the employee's first name?",
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the employees last name?",
        },
        {
          type: "list",
          name: "roles",
          message: "What is their role id?",
          choices: res.map((employee) => employee.role_id),
        },
        {
          type: "list",
          name: "manager",
          message: "What is their managers last name?",
          choices: [1, 3, 5, 7],
        },
      ])
      .then((data) => {
        connection.query(
          "INSERT into employees SET ?",
          {
            first_name: data.firstName,
            last_name: data.lastName,
            role_id: data.roles,
            manager_id: data.manager,
          },
          (err) => {
            if (err) throw err;
            console.log("new employee added");
            start();
          }
        );
      });
  });
}

//update information
function updateRole() {
  connection.query("SELECT * from employees", (err, res) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to update?",
          choices: res.map((employee) => employee.first_name),
        },
        {
          type: "list",
          name: "roleId",
          message: "What is their new role?",
          choices: res.map((employee) => employee.role_id),
        },
      ])
      .then((data) => {
        connection.query(
          "UPDATE employees SET role_id = ? where first_name = ?",
          [data.roleId, data.employee]
        );
        start();

      });
  });
}

//delete
