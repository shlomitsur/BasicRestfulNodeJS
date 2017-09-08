'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const geoip = require('geoip-lite');
const useragent = require('express-useragent');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

let events = require('./data');
const AUTHENTICATION_STRING = "6i2nSgWu0DfYIE8I0ZBJOtxTmHJATRzu"; //TODOSHLOMI move to property file

var connection = mysql.createConnection({
  host     : 'mysql-test.playbuzz.com',
  user     : 'root',
  password : 'Sharona12#',
  database : 'i_want_so_much_to_hire_shlomi_tsur'
});

connection.connect()

app.use(function(req, res, next) {
  if ((req.method === 'GET') && (req.headers.authorization != AUTHENTICATION_STRING)) {
    return res.status(403).json({ error: 'No credentials sent!' });
  }
  next();
});

function getCountry(ip)
{
  const geo = geoip.lookup(ip);
  console.log("country");

console.log(geo['country']);
  return geo != null ? geo['country'] : "";
};

function getBrowser(user_agent)
{
  const ua = useragent.parse(user_agent);
  console.log("browser");
  console.log(ua['browser']);
  return ua != null ? ua['browser'] : "";
};


app.post('/api/events', (request, response) => {
  console.log("got post request"); 
  let evnt = {
    id: null,
    timestamp: request.body.timestamp,
    user_id: request.body.user_id,
    page_id: request.body.page_id,
    page_url: request.body.page_url,
    page_referrer: request.body.page_referrer,
    user_agent: request.body.user_agent,
    browser: getBrowser(request.body.user_agent),
    screen_resolution: request.body.screen_resolution,
    user_ip: request.body.user_ip,
    country: getCountry(request.body.user_ip)
  };

  console.log (evnt);
  events.push(evnt);

  connection.query('INSERT INTO events SET ? ', evnt, function (err, rows, fields) {
  if (err) throw err

  console.log('The solution is: ', rows[0])
})
  response.json(evnt);

});

function getPageViewsByCountry()
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

function getPageViewByCountryId(id)
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


function getPageViewByPageId(id)
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

function getPageViewByBrowserId(id)
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

app.get('/api/events/countries/', (request, response) => {
  let countryId = request.params.id;
  getPageViewsByCountry().then(function (res){
    response.json(res);
  });
})


app.get('/api/events/countries/:id', (request, response) => {
  let countryId = request.params.id;
  getPageViewByCountryId(countryId).then(function (res){
    response.json(res);
  });
})

app.get('/api/events/browsers/:id', (request, response) => {

  let browserId = request.params.id;
  getPageViewByBrowserId(browserId).then(function (res){
    response.json(res);
})
});

app.get('/api/events/pages/:id', (request, response) => {
  let pageId = request.params.id;
  getPageViewByPageId(pageId).then(function (res){
    response.json(res);
  });
})



const port = 3001;
const server = app.listen(port, () => {
  console.log('Server running');
});

//connection.end();
