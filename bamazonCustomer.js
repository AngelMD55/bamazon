const mysql = require("mysql");
const passwordFile = require("./password.js");
const inquirer = require("inquirer");
const manager = require("./bamazonManager.js");

const password = process.env.password;
let forSaleData;
let itemToPurchase;
let itemname;
let priceToPurchase;
let itemQuantity;
let howmany;
let subtotal;
let idForSaleData;
let tax;
let total;

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: password,
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        forSaleData = res;
        // console.log(forSaleData)
        // forSaleData.forEach(e => {
            // console.log(`Item#: ${e.id}  Item: ${e.product_name}  Price: ${e.price}
            // _____________________________________________________\n` )
        // })

    })
    startInquirer();
});

function startInquirer() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        forSaleData = res;
        idForSaleData = forSaleData.map(e => `${e.id}`)

        inquirer.prompt([
            {
                type: "list",
                name: "who",
                message: "Are you a customer, manager?",
                choices: ["customer", "manager"]
            }
        ]).then(function (user) {
            if (user.who === "customer") {
                customerWouldLikeToDO();
            } else {
                manager.manager();
            }
        })
    })
}

function customerWouldLikeToDO() {
    inquirer.prompt([
        {
            type: "list",
            name: "todo",
            message: "What would you like to do?",
            choices: ["Browse", "Buy", "Purchase History", "Sign Out"]
        }
    ]).then(function (user) {
        if (user.todo === "Browse") {
            browse();
        } else if (user.todo === "Buy") {
            buy();
        } else if (user.todo === "Purchase History") {
            purchaseHistory();
        } else if (user.todo === "Sign Out") {
            signOut();
        }
    })
}

function signOut() {
    connection.end();
}

function browse() {
    console.log("Showing all for sale items...\n");
    connection.query(
        "SELECT * FROM products", function (err, res) {
            if (err) throw err;
            forSaleData = res;
            // console.log(forSaleData)
            forSaleData.forEach(e => {
                console.log(`Item#: ${e.id}  Item: ${e.product_name}  Price: ${e.price}
                _____________________________________________________\n` )
            })
            customerWouldLikeToDO()
        });
}

function buy() {
    inquirer.prompt([
        {
            type: "list",
            name: "tobuy",
            message: "What is the item# of the item you would like to buy?",
            choices: idForSaleData
        }
    ]).then(function (user) {
        itemToPurchase = user.tobuy
        console.log("Is this the item you would like to buy?");
        connection.query(
            `SELECT * FROM products WHERE id=${user.tobuy}`, function (err, res) {
                if (err) throw err;
                let confirmItem = res;
                confirmItem.forEach(e => {
                    itemname = e.product_name;
                    itemQuantity = e.stock_quantity;
                    priceToPurchase = e.price;
                    console.log(`\nItem#: ${e.id}  Item: ${e.product_name}  Price: ${e.price}
_____________________________________________________\n` )
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "confirm",
                            choices: ["no", "yes"]
                        }
                    ]).then(function (user) {
                        if (user.confirm === "no") {
                            browse();
                        } else {
                            inquirer.prompt([
                                {
                                    type: "input",
                                    name: "howmany",
                                    message: "How many of this items would you like to buy?"
                                }
                            ]).then(function (user) {
                                howmany = user.howmany;

                                subtotal = +(howmany * priceToPurchase).toFixed(2);
                                tax = +(subtotal * .087).toFixed(2);
                                total = +(subtotal + tax).toFixed(2);

                                console.log(subtotal);
                                if (howmany > itemQuantity) {
                                    console.log(`Not enough items available,
there are only ${itemQuantity} units in stock`)
                                } else {
                                    console.log(`\nOrder Review:\n
Item#: ${itemToPurchase} ${itemname} Price: ${priceToPurchase} Quantity: ${howmany}
Subtotal: ${subtotal}
Tax:      ${tax}
----------------
Total:    ${total}\n`);
                                    inquirer.prompt([
                                        {
                                            type: "list",
                                            name: "confirmPurchase",
                                            message: "Would you like to continue with purchase?",
                                            choices: ["no", "yes"]
                                        }
                                    ]).then(function (user) {
                                        if (user.confirmPurchase === "no") {
                                            customerWouldLikeToDO();
                                        } else {
                                            purchaseReduceInventory();
                                        }
                                    })

                                }
                            })
                        }
                    })
                })
            })
    });
}

function purchaseReduceInventory() {
    console.log(`\n${itemname} Old Quantity: ${itemQuantity}`)
    let newInventory = (itemQuantity - howmany)
    connection.query(
        `UPDATE products SET stock_quantity=${itemQuantity - howmany} WHERE id=${itemToPurchase}`

    )
    console.log(`${itemname} New Quantity: ${newInventory}\n`);
        inquirer.prompt([
            {
                type: "list",
                name: "afterPurchase",
                message: "Would you like to keep shoping?",
                choices: ["no", "yes"]
            }
        ]).then(function(user){
            if (user.afterPurchase === "no"){
                console.log("\nThank you for shoping with us have a great day")
                signOut();
            }else {
                customerWouldLikeToDO();
            }
        })
}


function purchaseHistory() {
    console.log("under construction")
}
