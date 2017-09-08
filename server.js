'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const helpers = require('./lib/filterHelpers');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


const SERVER_PORT = 3001;
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

app.use(function(req, res, next) {
  if ((req.method === 'GET') && (req.headers.authorization != AUTHENTICATION_STRING)) {
    return res.status(403).json({ error: 'No credentials sent!' });
  }
  next();
});

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
    browser: helpers.getBrowser(request.body.user_agent),
    screen_resolution: request.body.screen_resolution,
    user_ip: request.body.user_ip,
    country: helpers.getCountry(request.body.user_ip)
  };

  console.log (evnt);

  connection.query('INSERT INTO events SET ? ', evnt, function (err, rows, fields) {
  if (err) throw err
})
  response.json(evnt);
});


app.get('/api/events/countries/', (request, response) => {
  const countryId = request.params.id;
  helpers.getPageViewsByCountry().then(function (res){
    response.json(res);
  });
})


app.get('/api/events/countries/:id', (request, response) => {
  const countryId = request.params.id;
  helpers.getPageViewByCountryId(countryId).then(function (res){
    response.json(res);
  });
})

app.get('/api/events/browsers/:id', (request, response) => {
  const browserId = request.params.id;
  helpers.getPageViewByBrowserId(browserId).then(function (res){
    response.json(res);
})
});

app.get('/api/events/pages/:id', (request, response) => {
  const pageId = request.params.id;
  helpers.getPageViewByPageId(pageId).then(function (res){
    response.json(res);
  });
})

const server = app.listen(SERVER_PORT, () => {
  console.log('Server running');
});

//connection.end();
