const inquirer = require("inquirer");
// const consoleTable = require("console.table");
const cTable = require("console.table");
const mysql = require("mysql2");
const figlet = require("figlet");
const Choices = require("inquirer/lib/objects/choices");
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
const addDepart = () => {
  inquirer
    .prompt({
      name: "add_department",
      type: "input",
      message: "Please enter new department name: ",
      validate: function validateInput(name) {
        return name !== "";
      },
    })
    .then((answer) => {
      //query to insert new data in db
      db.query(
        "INSERT INTO department SET ?",
        {
          department_name: answer.add_department,
        },
        (err) => {
          if (err) throw err;
          console.log(`Department ${answer.add_department} has been created`);

          startPromp();
        }
      );
    });
};
// add employee option
const addEmployee = () => {
  db.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "Please enter the first name of the new employee: ",
          validate: function validateInput(name) {
            return name !== "";
          },
        },
        {
          name: "last_name",
          type: "input",
          message: "Please enter the last name of the new employee: ",
          validate: function validateInput(name) {
            return name !== "";
          },
        },
        {
          name: "choose_role",
          type: "rawlist",
          choices() {
            const choices = [];
            res.forEach(({ title }) => {
              choices.push(title);
            });
            return choices;
          },
          message: "Choose a role for the employee to have: ",
        },
      ])
      .then((answers) => {
        let newRoleID;
        res.forEach((res) => {
          if (res.title === answers.choose_role) {
            newRoleID = res.id;
          }
        });

        //query to insert new data
        db.query(
          "INSERT INTO employees SET ?",
          {
            first_name: answers.first_name,
            last_name: answers.last_name,
            role_id: newRoleID,
          },
          (err) => {
            if (err) throw err;
            console.log(
              `New Employee ${answers.first_name} ${answers.last_name} added to database`
            );
            startPromp();
          }
        );
      });
  });
};
// add role to database
const addRole = () => {
  db.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "add_role",
          type: "input",
          message: "Please enter a new role title: ",
          validate: function validateInput(name) {
            return name !== "";
          },
        },
        {
          name: "add_salary",
          type: "input",
          message: "Please enter a salary for the new role: ",
          validate: function validateInput(name) {
            return name !== "";
          },
        },
        {
          name: "role_depart",
          type: "rawlist",
          choices() {
            const optionsArr = [];
            res.forEach(({ department_name }) => {
              optionsArr.push(department_name);
            });
            return optionsArr;
          },
          message: "Which department will the new role fall under?",
        },
      ])
      .then((answer) => {
        let newDepartmentID;
        res.forEach((res) => {
          if (res.department_name === answer.role_depart) {
            newDepartmentID = res.id;
          }
        });

        db.query(
          "INSERT INTO role SET ?",
          {
            title: answer.add_role,
            salary: answer.add_salary,
            department_id: newDepartmentID,
          },
          (err) => {
            if (err) throw err;
            console.log(
              `New role ${answer.add_role} has been successfully added to the database`
            );

            startPromp();
          }
        );
      });
  });
};
const removeDepart = () => {
  db.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;

    inquirer
      .prompt({
        name: "remove_depart",
        type: "rawlist",
        choices() {
          const optionsArr = [];
          res.forEach(({ department_name }) => {
            optionsArr.push(department_name);
          });
          return optionsArr;
        },
        message: "Choose a Department to remove:",
      })
      .then((answers) => {
        let dropId;
        res.forEach((res) => {
          if (res.department_name === answers.remove_depart) {
            dropId = res.id;
          }
        });
        db.query(
          "DELETE FROM department WHERE ?",
          {
            id: dropId,
          },
          (err) => {
            if (err) throw err;
            console.log(
              `${answers.remove_depart} has been successfully deleted from Departments`
            );

            startPromp();
          }
        );
      });
  });
};
const removeRole = () => {
  db.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;

    inquirer
      .prompt({
        name: "remove_role",
        type: "rawlist",
        choices() {
          const optionsArr = [];
          res.forEach(({ title }) => {
            optionsArr.push(title);
          });
          return optionsArr;
        },
        message: "Please choose role to remove:",
      })
      .then((answers) => {
        let dropRole;
        res.forEach((res) => {
          if (res.title === answers.remove_role) {
            dropRole = res.id;
          }
        });
        db.query(
          "DELETE FROM role WHERE ?",
          {
            id: dropRole,
          },
          (err) => {
            if (err) throw err;
            console.log(
              `${answers.remove_role} has been successfully deleted from roles`
            );
            startPromp();
          }
        );
      });
  });
};

startPromp();
