const mysql = require("mysql");
const inquirer = require("inquirer");
const customer = require("./bamazonCustomer.js");
let itemId;
let whatID;
let currentQty;
let howmany;
let newInventory;
let parseNewInventory;

const password = process.env.password;
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: password,
    database: "bamazonDB"
});

let managerDo = function managerWouldLikeToDo() {
    connection.query(
        "SELECT * FROM products", function (err, res) {
            if (err) throw err;
            forSaleData = res;
            itemId = forSaleData.map(e => `${e.id}`)
            itemNames = forSaleData.map(e => `${e.product_name}`)
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
            low();
        } else if (user.manager === "Add Inventory") {
            add();
        } else if (user.manager === "Add New Product") {
            newInv();
        } else if (user.manager === "Sign Out") {
            Out();

        }
    })
})};

let view = function viewProducts() {
    console.log("Showing Invenotry...\n");
    connection.query(
        "SELECT * FROM products", function (err, res) {
            if (err) throw err;
            forSaleData = res;
            forSaleData.forEach(e => {
                console.log(`Item#: ${e.id}  Item: ${e.product_name}  Price: ${e.price} Quantity: ${e.stock_quantity}
___________________________________________________________\n` )
            })
            managerDo();
        });
}

let low = function lowInventory() {
    console.log("Showing Items with Low Invenotry...\n");
    connection.query(
        "SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {
            if (err) throw err;
            forSaleData = res;
            forSaleData.forEach(e => {
                console.log(`Item#: ${e.id}  Item: ${e.product_name}  Price: ${e.price} Quantity: ${e.stock_quantity}
___________________________________________________________\n` )
            })
            managerDo();
        });

}

let add = function addInventory() {
    inquirer.prompt([
        {
            type: "list",
            name: "changeQty",
            message: "What is the item number of the item you would like to order?",
            choices: itemId
        },
        {
            type: "input",
            name: "howManyQty",
            message: `How many would you like to order?`,
            validate: numValidation 
        }
    ]).then(function(user){
        howmany = parseInt(user.howManyQty);
        whatID = parseInt(user.changeQty);
        // connection.query(
        //     `SELECT * FROM products WHERE product_name=${user.changeQty}`, function (err , res){
        //         if (err) throw err;
        //         let getQty = res;
        //         getQty.forEach(e => {
        //             currentQty = e.stock_quantity;
        //         })
        //         console.log(currentQty);
        //     })
        connection.query(
            `SELECT * FROM products WHERE id=${user.changeQty}`, function (err , res){
            if (err) throw err;
            let getQty = res;
            getQty.forEach(e => {
                currentQty = parseInt(e.stock_quantity);
            })
            // console.log(currentQty);
            newInventory = (currentQty + howmany);
            parseNewInventory = parseInt(newInventory)
            addInv(parseNewInventory, whatID)
        })

    })
}

let addInv = function add(newQty, id){
    const query = `UPDATE products SET stock_quantity = ${newQty} WHERE id=${id}`
    connection.query(
        query , function (err, res){
            if (err) throw err;
            console.log(`\nInventory changed
Old Inventory: ${currentQty}
New Inventory: ${parseNewInventory}\n`)
        }        
    )
    managerDo()
}

let newInv = function addNewProducts() {
    console.log("What Item would you like to add to inventory?")
    inquirer.prompt([
        {
            type: "input",
            name: "productName",
            message: "What is the product's name?"
        },
        {
            type: "input",
            name: "departmentName",
            message: `What department does it belong to?`
        },
        {
            type: "input",
            name: "price",
            message: "What is the regular price of the item",
            validate: numValidation
        },
        {
            type: "input",
            name: "qty",
            message: "What is the current Quantity",
            validate: numValidation
        }
    ]).then(function(user){
        connection.query(
            `INSERT INTO products SET ?`,
            {
                product_name: user.productName,
                department_name: user.departmentName,
                price: user.price,
                stock_quantity: user.qty
            },
            function (err, res){

                if (err) throw err;
                console.log('Item added to Inventory\n')                
            }
        )
        managerDo();
    })
}

let Out = function Out() {
    console.log("out--------")
    connection.end();
}

let numValidation = function (input) {
    // Declare function as asynchronous, and save the done callback
    var done = this.async();
    let temp = parseInt(input);
    // Do async stuff
    setTimeout(function() {
      if (isNaN(temp)) {
        // Pass the return value in the done callback
        done('You need to provide a number');
        return;
      }
      // Pass the return value in the done callback
      done(null, true);
    }, 500);
  }

module.exports = {

    manager: managerDo

}
