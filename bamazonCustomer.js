let mysql = require("mysql"); 
let inquirer = require("inquirer"); 
let consoleTable = require("console.table");
let colors = require("colors"); 

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'escuela5512',
  database: 'bamazon'
});
  connection.connect((err) => {
    if (err) throw err;
    console.log("connection established");
    selectAllItems(); 
  });

  function selectAllItems(){
    connection.query(`SELECT item_id, product_name FROM products`, function (err, res){
      //   console.log(res); 
          let stock = [] 
          for (let i = 0; i < res.length; i++){
              stock.push(res[i].product_name); 
          } 

          inquirer.prompt({
              message: "select Item to Buy",
              name: "itemToBuy",
              type: "list",
              choices: stock
            }).then((answers) => {
                
                let choice = answers.itemToBuy;

                let quantity = [];
                inquirer.prompt({
                    name: "quantity",
                    message: "How many would you like to purchase?",
                    type: "input"
              }).then(answers => {
                  console.log(answers);
                  console.log("choice", choice);
                  connection.query(`SELECT stock_quantity FROM products where product_name = "${choice}"`, function(err, res) {
                    console.log(res);
                    let availableQ = res[0].stock_quantity;
                    
                });
                connection.query(`SELECT stock_quantity FROM products WHERE product_name = "${choice}"`), function (err, res) {
                    // console.log("need this", res); 
                    let chosenItem = res.stock_quantity;
                    if (chosenItem >= answers.quantity) {
                        connection.query("SELECT price FROM products", function (err, res) {
                            let total = answers.quantity * chosenItem.price;
                            console.log("Thank you for your purchase!");
                            console.log("Your purchase total is: $" + total);
                            

                            connection.end();
                        })

                    } else {
                        console.log("Insufficient quantity!".yellow);
                        connection.end();
                    }
                };
            });
        });
    });
}