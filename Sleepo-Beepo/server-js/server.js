const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const server = express();
const port = 4000;

const db = require('./queries')

server.use(cors());

server.use(bodyParser.json())
server.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

server.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
});

server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});

server.get('/properties', db.getProperties);
server.get('/properties/:max', db.getPropertiesBelowPrice);
server.get('/properties/:date', db.getPropertiesByAvailability);
server.post('/properties', db.addProperty);

