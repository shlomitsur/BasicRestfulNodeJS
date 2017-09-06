'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

let contacts = require('./data');

app.get('/api/contacts', (request, response) => {
  if (!contacts) {
    response.status(404).json({ message: 'No contacts found.' });
  }
  response.json(contacts);
});

app.get('/api/contacts/:id', (request, response) => {

  let contactId = request.params.id;

  let contact = contacts.filter(contact => {
    return contact.id == contactId;
  });

  if (!contact) {
    response.status(404).json({ message: 'Contact not found' });
  }

  response.json(contact[0]);
});

app.post('/api/contacts', (request, response) => {

  let contact = {
    id: contacts.length + 1,
    user_id: request.body.user_id,
    page_id: request.body.page_id,
    page_url: request.body.page_url,
    page_referrer: request.body.page_referrer
  };

  contacts.push(contact);

  response.json(contact);

});

app.put('/api/contacts/:id', (request, response) => {

  let contactId = request.params.id;

  let contact = contacts.filter(contact => {
    return contact.id == contactId;
  })[0];

  const index = contacts.indexOf(contact);

  let keys = Object.keys(request.body);

  keys.forEach(key => {
    contact[key] = request.body[key];
  });

  contacts[index] = contact;

  // response.json({ message: `User ${contactId} updated.`});
  response.json(contacts[index]);
});

app.delete('/api/contacts/:id', (request, response) => {
  
  let contactId = request.params.id;

  let contact = contacts.filter(contact => {
    return contact.id == contactId;
  })[0];

  const index = contacts.indexOf(contact);

  contacts.splice(index, 1);

  response.json({ message: `User ${contactId} deleted.`});

});

const port = 3001;

const server = app.listen(port, () => {

  console.log(`Server running at http://localhost:${port}/`);
  
});
