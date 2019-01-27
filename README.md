# bamazon

To Watch a video on how this works please click the link:
https://youtu.be/ARx7C3k9R8Y

This bamazon app is ran in node.js connecting to a database using mysql.

There are node files:

1. bamazonCustomer.js:
In this file we can see all the code required to get the Customer side running. If we choose to be a customer we can browse inventory, and purchase items. If we decide to buy an Item and the quantity that we want to buy exceeds our stock quantity it will not let us complete the purchase, but if the amount we want to buy is lower than the quantity on hand it will complete the purchase and reduce the the stock quantity.

2. bamazonManager.js
In this file we can see the code used to make the manager function work. These incluse see all the items for sale, see items with low quantity (5 or less), add inventory and add a new product.