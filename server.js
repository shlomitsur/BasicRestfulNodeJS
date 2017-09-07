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
/*
app.use(function(req, res, next) {
  if ((req.method === 'GET') && (req.headers.authorization != AUTHENTICATION_STRING)) {
    return res.status(403).json({ error: 'No credentials sent!' });
  }
  next();
});
*/
app.get('/api/events', (request, response) => {
  if (!events) {
    response.status(404).json({ message: 'No events found.' });
  }
  response.json(events);
});

app.get('/api/events/:id', (request, response) => {

  let evntId = request.params.id;

  let evnt = events.filter(evnt => {
    return evnt.id == evntId;
  });

  if (!evnt) {
    response.status(404).json({ message: 'Contact not found' });
  }

  response.json(evnt[0]);
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
  connection.query('SELECT COUNT(*) AS page_views, country FROM events GROUP BY country', null, function (err, rows, fields) {
  console.log('this.sql', this.sql);
  console.log(rows);
  if (err) throw err
  return JSON.stringify(rows);
})
};

function getPageViewByCountryId(id)
{
return new Promise( function(resolve , reject ){
  if(id == null) 
    return resolve(getPageViewsByCountry());
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

app.get('/api/events/country/:id', (request, response) => {
  let countryId = request.params.id;
  getPageViewByCountryId(countryId).then(function (res){
    response.json(res);
  });
})

app.get('/api/events/browser/:id', (request, response) => {

  let browser = request.params.id;
  var page_views = 0;
  connection.query('SELECT COUNT(*) AS page_views FROM events WHERE browser =  ? ', browser, function (err, rows, fields) {
console.log('this.sql', this.sql); //command/query
  console.log(rows);
  if (err) throw err
  page_views = rows[0]['page_views'];
  console.log('The solution is: ', page_views)
  response.json(page_views);
})

});


app.put('/api/events/:id', (request, response) => {

  let evntId = request.params.id;

  let evnt = events.filter(evnt => {
    return evnt.id == evntId;
  })[0];

  const index = events.indexOf(evnt);

  let keys = Object.keys(request.body);

  keys.forEach(key => {
    evnt[key] = request.body[key];
  });

  events[index] = evnt;

  // response.json({ message: `User ${evntId} updated.`});
  response.json(events[index]);
});

app.delete('/api/events/:id', (request, response) => {
  
  let evntId = request.params.id;

  let evnt = events.filter(evnt => {
    return evnt.id == evntId;
  })[0];

  const index = events.indexOf(evnt);

  events.splice(index, 1);

  response.json({ message: `User ${evntId} deleted.`});

});

const port = 3001;

const server = app.listen(port, () => {

  console.log(`Server running at http://localhost:${port}/`);
  
});

//connection.end();
