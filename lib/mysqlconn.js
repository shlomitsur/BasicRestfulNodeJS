//TODOSHLOMI replace this with a proper mysql wrapper node module
const mysql = require('mysql');

//TODOSHLOMI move to property file
const DB_HOST = "mysql-test.playbuzz.com"; 
const DB_USER = "root"; 
const DB_PASS = "Sharona12#"; 
const DB_NAME = "i_want_so_much_to_hire_shlomi_tsur"; 

exports.connection = mysql.createConnection({
  host     : DB_HOST,
  user     : DB_USER,
  password : DB_PASS,
  database : DB_NAME
});


