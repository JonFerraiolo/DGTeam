
const mysql = require('mysql')

var TEAM_DB_HOST = process.env.TEAM_DB_HOST;
var TEAM_DB_USER = process.env.TEAM_DB_USER;
var TEAM_DB_PASSWORD = process.env.TEAM_DB_PASSWORD;
var TEAM_DB_DATABASE = process.env.TEAM_DB_DATABASE;

var connection = mysql.createConnection({
  host: TEAM_DB_HOST,
  user: TEAM_DB_USER,
  password: TEAM_DB_PASSWORD,
  database: TEAM_DB_DATABASE,
  debug: false
});

connection.connect(function(error){
  if (!error) {
      console.log("Database connected");
  } else {
      console.error("Database connection error");
      process.exit(1);
  }
});

exports.getConnection = function() {
  return connection
};
