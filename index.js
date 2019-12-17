const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.get('/channels', async (req, res) => {
    const channels = await db.collection('channels').find({}).toArray()
    return res.json(channels)
});

app.post('/join-channel', async ({ body }, res) => {
    const channel = {
        link: String(body.link),
        privat: Boolean(body.privat) 
    }
    res.send(channel)
});

app.listen(3000, async () => {
    console.log('Server is working on 3000')
    db = await connectToDatabase().catch((err) => {
        console.log("Not Connected to Database ERROR! ", err);
        });
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