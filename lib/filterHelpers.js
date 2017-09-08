const mysql = require('mysql');
const geoip = require('geoip-lite');
const useragent = require('express-useragent');

const AUTHENTICATION_STRING = "6i2nSgWu0DfYIE8I0ZBJOtxTmHJATRzu";
const DB_HOST = "mysql-test.playbuzz.com";
const DB_USER = "root";
const DB_PASS = "Sharona12#";
const DB_NAME = "i_want_so_much_to_hire_shlomi_tsur";

var connection = mysql.createConnection({
  host     : DB_HOST,
  user     : DB_USER,
  password : DB_PASS,
  database : DB_NAME
});

connection.connect()


exports.getBrowser  = function (user_agent)
{
  console.log("using helpers!");
  const ua = useragent.parse(user_agent);
  console.log("browser");
  console.log(ua['browser']);
  return ua != null ? ua['browser'] : "";
};

exports.getCountry  = function(ip)
{
  const geo = geoip.lookup(ip);
  console.log("country");

console.log(geo['country']);
  return geo != null ? geo['country'] : "";
};

exports.getPageViewsByCountry = function()
{
return new Promise( function(resolve , reject ){
  console.log("by country");
  connection.query('SELECT COUNT(*) AS page_views, country FROM events GROUP BY country', null, function (err, rows, fields) {
  console.log('this.sql', this.sql);
  console.log(rows);
  if (err) throw err
  return resolve(JSON.stringify(rows));
})
});
};

exports.getPageViewByCountryId = function(id)
{
return new Promise( function(resolve , reject ){
  var page_views = 0;
  connection.query('SELECT COUNT(*) AS page_views FROM events WHERE country =  ? ', id, function (err, rows, fields) {
  console.log('this.sql', this.sql); //command/query
  console.log(rows);
  if (err) throw err
  page_views = rows[0]['page_views'];
  console.log("i am returning "+page_views);
  return resolve(page_views);
})
});
};


exports.getPageViewByPageId = function(id)
{
return new Promise( function(resolve , reject ){
  var page_views = 0;
  connection.query('SELECT COUNT(*) AS page_views FROM events WHERE page_id =  ? ', id, function (err, rows, fields) {
  console.log('this.sql', this.sql); //command/query
  console.log(rows);
  if (err) throw err
  page_views = rows[0]['page_views'];
  console.log("i am returning "+page_views);
  return resolve(page_views);
})
});
};

exports.getPageViewByBrowserId = function(id)
{
return new Promise( function(resolve , reject ){
  connection.query('SELECT COUNT(*) AS page_views FROM events WHERE browser =  ? ', id, function (err, rows, fields) {
  console.log('this.sql', this.sql);
  console.log(rows);
  if (err) throw err
  const page_views = rows[0]['page_views'];
  console.log('The solution is: ', page_views)
  return resolve(page_views);
})
});
};
