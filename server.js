const inquirer = require("inquirer");
// const consoleTable = require("console.table");
const cTable = require("console.table");
const mysql = require("mysql2");
const figlet = require("figlet");
require("dotenv").config();

const PORT = process.env.PORT || 3001;
// Connect to dB schema.sql

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "Darthjarjar",
    database: "employee_db",
    multipleStatements: true,
  },
  console.log(`you are now Connected to the database.`)
);
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

function startPromp() {
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
        "Update Employee Manager",
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
        case "View all Employees by Role":
          viewByRole();
          break;
        case "View all Employees by Manager ID":
          viewByManager();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Department":
          addDepart();
          break;
        case "Add Role":
          addRole();
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
        case "Update Employee Manager":
          updateManager();
          break;
        //if 'Exit' is chosen, end connection
        case "Exit":
          console.log("---------------------------");
          console.log("All Done! Have a great day!");
          console.log("---------------------------");
          connection.end();
          break;
      }
    });
}
startPromp();
