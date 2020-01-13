const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routes/routes')
const connect = require("./db").connect
const { cloudinaryConfig } = require('./methods/cloudinaryConfig')
app.use(function (req, res, next) {
    console.log('Request Type:', req.url);
    next();
  });
app.use(bodyParser.json())
app.use(cors())
app.use('/api/', routes)
app.use('*', cloudinaryConfig)

app.listen(3000, async () => {
    console.log('Server is working on 3000')
    await connect()
})