const db = require('./mysqlconn');
const geoip = require('geoip-lite');
const useragent = require('express-useragent');

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

exports.saveEvent = function(request)
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


exports.getPageViewsByCountry = function()
{
return new Promise( function(resolve , reject ){
  console.log("by country");
  db.connection.query('SELECT COUNT(*) AS page_views, country FROM events GROUP BY country', null, function (err, rows, fields) {
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
  db.connection.query('SELECT COUNT(*) AS page_views FROM events WHERE country =  ? ', id, function (err, rows, fields) {
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
  db.connection.query('SELECT COUNT(*) AS page_views FROM events WHERE page_id =  ? ', id, function (err, rows, fields) {
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
  db.connection.query('SELECT COUNT(*) AS page_views FROM events WHERE browser =  ? ', id, function (err, rows, fields) {
  console.log('this.sql', this.sql);
  console.log(rows);
  if (err) throw err
  const page_views = rows[0]['page_views'];
  console.log('The solution is: ', page_views)
  return resolve(page_views);
})
});
};
