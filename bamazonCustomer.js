var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8080,


    user: "root",


    password: "begin2017",
    database: "bamazonDB"
});

inquirer.prompt([

    {
        type: "list",
        message: "What is the ID of the product for purchase?",
        choices: ["A1", "B2", "C3", "D4", "E5", "F6", "G7", "H8", "I9", "J11"],
        name: "menu"
    },
]).then(function(user) {

    if (user.menu == "POST") {

        inquirer.prompt([

            {
                type: "input",
                message: "How many of the products would you like to buy?",
                name: "item_id"
            }


        ]).then(function(user) {

            connection.query("INSERT INTO items SET ?", [{
                item: user.item,
                category: user.category,
                bid: user.bid

            }], function(err, res) {
                if (err) throw err;
                console.log(res);
            });


        });


    } else if (user.menu == "BID") {
        bidding();


    } else if (user.menu == "ADMIN") {
        connection.query("SELECT * FROM items", function(err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {

                console.log(res[i].item + " | " + res[i].category + " | " + res[i].bid);
            }
            console.log("_______________________________________________________");
        });



    };



    function bidding() {
        inquirer.prompt([

            {
                type: "input",
                message: "What auction would you like to place a bid in?",
                name: "item"
            },

            {
                type: "input",
                message: "How much would you like to bid?",
                name: "bid"
            },

        ]).then(function(user) {
            connection.query("SELECT * FROM items WHERE item=?", [user.item], function(err, res) {
                if (err) throw err;
                if (res[0] == undefined) {
                    console.log("Item not found.")

                    bidding();
                } else {




                    if (res[0].bid >= user.bid) {
                        console.log("Bid is too low. Try again.");
                        bidding();
                    } else {
                        connection.query("UPDATE items SET ? WHERE ?", [{
                                bid: user.bid
                            },

                            {
                                item: user.item

                            }

                        ], function(err, res) {
                            if (err) throw err;
                            console.log("Bid placed successfully!");
                            endConnection();
                        });
                    };
                }
            });



        });
    }

});

function endConnection() {
    connection.end(function(err) {
        if (err) throw err;
    })