const inquirer = require("inquirer");
// const consoleTable = require("console.table");
const cTable = require("console.table");
const mysql = require("mysql2");
const figlet = require("figlet");
require("dotenv").config();

const PORT = process.env.PORT || 3001;
// Connect to dB schema.sql

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Darthjarjar",
  database: "employees_db",
  multipleStatements: true,
});
// main function
console.log(
  figlet.textSync("Employee Tracker v1", {
    font: "Doom",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 95,
    whitespaceBreak: true,
  })
);

const startPromp = () => {
  inquirer
    .prompt({
      name: "do_what",
      type: "rawlist",
      message: "Greetings, below is a list of options for you to view",
      choices: [
        "View all Employees, Departments and Roles",
        "View all Employees by Department",
        "View all Employees by Role",
        "View all Employees by Manager ID",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Remove Employee",
        "Update Employee Role",
        "Remove Role",
        "Remove Department",
        "Exit",
      ],
    })
    .then((answers) => {
      switch (answers.do_what) {
        case "View all Employees, Departments and Roles":
          viewAll();
          break;
        case "View all Employees by Department":
          viewByDep();
          break;
        case "View all Employees by Manager ID":
          viewByManager();
          break;
        case "View all Employees by Role":
          viewByRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Department":
          addDepart();
          break;
        case "Remove Employee":
          removeEmployee();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "Remove Role":
          removeRole();
          break;
        case "Remove Department":
          removeDepart();
          break;
        case "Exit":
          console.log("---------------------------");
          console.log("All Done! Have a great day!");
          console.log("---------------------------");
          connection.end();
          break;
      }
    });
};

const viewAll = () => {
  console.log("-----------------------------------------");
  console.log("NOW VIEWING ALL EMPLOYEES, ROLES AND DEPARTMENTS");
  console.log("-----------------------------------------");
  //query to retrieve data from db
  const query = `SELECT employees.id, employees.first_name AS "First Name", employees.last_name AS "Last Name", role.title AS "Role", role.salary AS "Salary", department.department_name AS "Department"
          FROM employees 
          RIGHT JOIN role ON (role.id = employees.role_id)
          RIGHT JOIN department ON (department.id = role.department_id)
          ORDER BY employees.id;`;
  db.query(query, (err, res) => {
    if (err) throw err;
    //display returned data as table
    console.table(res);
    startPromp();
  });
};
startPromp();
