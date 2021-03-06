'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./lib/mysqlconn');
const helpers = require('./lib/filterHelpers');
const SERVER_PORT = 3001;
//TODOSHLOMI move to a property file
const AUTHENTICATION_STRING = "6i2nSgWu0DfYIE8I0ZBJOtxTmHJATRzu";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

db.connection.connect()

app.use(function(req, res, next) {
  if ((req.method === 'GET') && (req.headers.authorization != AUTHENTICATION_STRING)) {
    return res.status(403).json({ error: 'No credentials sent!' });
  }
  next();
});

//TODOSHLOMI when I'm calling this fun. from the helper I'm getting RefferenceError, fix & remove from here
function saveEvent(request)
{
return new Promise( function(resolve , reject ){
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
  db.connection.query('INSERT INTO events SET ? ', evnt, function (err, rows, fields) {
  if (err) throw err
  return resolve("yes!");
})
});
};

//TODOSHLOMI move all routings to a controller module

app.post('/api/events', (request, response) => {
  saveEvent(request).then(function (res){
    response.json(res);
  });
})

//here I'm adding a findall() to the endpoint, not sure if required so it's only for countries
app.get('/api/events/countries/', (request, response) => {
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

//db.connection.end();
