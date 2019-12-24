const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routes')
const MongoClient = require('mongodb').MongoClient
// const initDataBase = require("./db").initDb
app.use(bodyParser.json())
app.use(cors())
app.use(routes)
// initDataBase((err) =>  {
//     app.listen(3000,(err) => {
//         if (err) {
//             throw err
//         }
//         console.log("API Up and running on port " + 3000);
//     })
// })


app.listen(3000, async () => {
    console.log('Server is working on 3000')
    db = await connectToDatabase()
    app.locals.db = db
});

const connectToDatabase = () => {
    const mongoClient = new MongoClient('mongodb://localhost:27017/', { useNewUrlParser: true });
    return new Promise((resolve, reject) => {
        mongoClient.connect((err, client) => {
            if (err) {
                return reject(err);
            }
            resolve(client.db('telegram-history'))
        })
    })
}