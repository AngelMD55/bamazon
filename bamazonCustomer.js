const mysql = require("mysql");
const passwordFile = require("./password.js")
const inquirer = require("inquirer");

const password = process.env.password;
let forSaleData;

// const connection = mysql.createConnection({
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     password: "Noesmonitor55",
//     database: "items_for_saleDB"
// });