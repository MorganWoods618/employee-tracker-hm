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
    inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "What is the title of the new role?"
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the new role?"
      },
      //getting dept number
      {
        type: "list",
        name: "department",
        message: "What department is this role in?",
        choices: res.map((department) => department.name)
      },
    ]).then(data=>{
        const chosenDepartment = res.find(department=>department.name===data.department)
        connection.query('INSERT into roles SET ?', 
        {
            title: data.title,
            salary: data.salary,
            department_id: chosenDepartment.id
        })
        console.log('new role added')
        start()
    });
  });
}



//update information
