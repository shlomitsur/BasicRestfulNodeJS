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
  events.push(evnt);

  connection.query('INSERT INTO events SET ? ', evnt, function (err, rows, fields) {
  if (err) throw err

  console.log('The solution is: ', rows[0])
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

const port = 3001;
const server = app.listen(port, () => {
  console.log('Server running');
});

//connection.end();
