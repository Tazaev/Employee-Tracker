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
          db.end();
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
const viewByRole = () => {
  console.log("-----------------------");
  console.log("EMPLOYEES BY ROLE");
  console.log("-----------------------");
  //query to retrieve data
  const query = `SELECT role.id AS "Role ID", role.title AS "Role", role.salary AS "Salary", employees.first_name AS "First Name", employees.last_name AS "Last Name"
      FROM role
      LEFT JOIN employees ON (role.id = employees.role_id)
      ORDER BY role.id;`;
  db.query(query, (err, res) => {
    if (err) throw err;
    //display returned data as table
    console.table(res);
    startPromp();
  });
};
const viewByDep = () => {
  console.log("-----------------------");
  console.log("EMPLOYEES BY DEPARTMENT");
  console.log("-----------------------");
  //query to retrieve data
  const query = `SELECT department.id, department.department_name AS "Department", employees.first_name AS "First Name", employees.last_name AS "Last Name"
    FROM department
    LEFT JOIN role ON (department.id = role.department_id)
    LEFT JOIN employees ON (role.id = employees.role_id)
    ORDER BY department.id;`;
  db.query(query, (err, res) => {
    if (err) throw err;
    //display returned data as table
    console.table(res);
    startPromp();
  });
};
const viewByManager = () => {
  const query = `SELECT id, first_name, last_name, manager_id
    FROM employees;`;
  db.query(query, (err, res) => {
    if (err) throw err;
    const allManagersArr = [];
    const employManagerArr = [];
    res.forEach((res) => {
      if (!res.manager_id) {
        allManagersArr.push({
          id: res.id,
          Manager: res.first_name + " " + res.last_name,
        });
      }
      if (res.manager_id !== null) {
        employManagerArr.push({
          Manager_id: res.manager_id,
          Employees: res.first_name + " " + res.last_name,
        });
      }
    });
    console.log("-----------------------------");
    console.log("VIEW EMPLOYEES BY MANAGER ID");
    console.log("-----------------------------");
    console.table(employManagerArr);
    console.log("-----------------------------");
    console.log("VIEW ALL MANAGERS");
    console.log("-----------------------------");
    console.table(allManagersArr);
    startPromp();
  });
};

startPromp();
