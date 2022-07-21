const inquirer = require("inquirer");
const consoleTable = require("console.table");
const mysql = require("mysql2");
const figlet = require("figlet");
require("dotenv").config();

// Connect to dB schema.sql

const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  },
  console.log(`Connected to the employees_db database.`)
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
