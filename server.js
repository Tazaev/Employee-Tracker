const inquirer = require("inquirer");
const consoleTable = require("console.table");
const mysql = require("mysql2");
const figlet = require("figlet");
require("dotenv").config();

const PORT = process.env.PORT || 3001;
// Connect to dB schema.sql

const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
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
  inquirer.prompt({
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
  });
}
startPromp();
