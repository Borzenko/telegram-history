const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const rp = require('request-promise')
const Joi = require('@hapi/joi')
app.use(bodyParser.json())
const joinChannelSchema = require('./validationSchemas/joinChannelSchema')

app.get('/channels', async (req, res) => {
    const channels = await db.collection('channels').find({}).toArray()
    return res.json(channels)
});

app.post('/join-channel', async ({ body }, res) => {
    const channel =  {
        link: body.link,
        private: body.private
    }
    const validationResult = joinChannelSchema.validate(channel)
    if (!validationResult.error) {
        const options = {
            method: 'POST',
            uri: 'http://127.0.0.1:8000/join-channel',
            body: {
                link: channel.link,
                private: channel.private
            },
            json: true
        };
        rp(options).then(response => {
            db.collection('channels').insert(response)
            res.send(response)
        }).catch(err => {
            res.json(err)
        })

    }
});
app.get('/get-channel-data/:id', async (req, res) => {
    const options = {
        method: 'GET',
        uri: `http://127.0.0.1:8000/get-channel-data/${req.params.id}`,
        json: true
    };
    rp(options).then(async response => {
        await db.collection('channels').updateOne({channel_id: parseInt(req.params.id) }, {'$push': {'history': response}}, { "upsert": false })
        res.json(response)
    }).catch(err => {
        res.json(err)
    })
})

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