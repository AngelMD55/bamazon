const mysql = require("mysql");
const inquirer = require("inquirer");

let managerDo = function managerWouldLikeToDo() {
    inquirer.prompt([
        {
            type: "list",
            name: "manager",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add Inventory", "Add New Product", "Sign Out"]
        }
    ]).then(function (user) {
        if (user.manager === "View Products for Sale") {
            view();
        } else if (user.manager === "View Low Inventory") {
            lowInventory();
        } else if (user.manager === "Add Inventory") {
            addInventory();
        } else if (user.manager === "Add New Product") {
            addNewProducts();
        }
    })
}

let view = function viewProducts() {
    console.log("Showing Invenotry...\n");
    connection.query(
        "SELECT * FROM products", function (err, res) {
            if (err) throw err;
            forSaleData = res;
            // console.log(forSaleData)
            forSaleData.forEach(e => {
                console.log(`Item#: ${e.id}  Item: ${e.product_name}  Price: ${e.price} Quantity: ${e.stock_quantity}
                _____________________________________________________\n` )
            })
            managerWouldLikeToDO()
        });
}

let low = function lowInventory() {

}

let add = function addInventory() {

}

let newInv = function addNewProducts() {

}

module.exports = {

    manager: managerDo,

    view: view,

    low: low,

    add: add,

    new: newInv

}