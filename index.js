const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routes')
const connect = require("./db").connect
const { cloudinaryConfig } = require('./cloudinaryConfig')
app.use(bodyParser.json())
app.use(cors())
app.use(routes)
app.use('*', cloudinaryConfig)

app.listen(3000, async () => {
    console.log('Server is working on 3000')
    await connect()
})