const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const rp = require('request-promise')
const cors = require('cors')
const cron = require('node-cron')
app.use(bodyParser.json())
app.use(cors())
const joinChannelSchema = require('./validationSchemas/joinChannelSchema')

app.get('/channels', async (req, res) => {
    const channels = await db.collection('channels').find({}).toArray()
    return res.json(channels)
});

app.post('/join-channel', async ({ body }, res) => {
    const channel =  {
        link: body.link
    }
    const validationResult = joinChannelSchema.validate(channel)
    if (validationResult.error) { res.json(validationResult) }
    
    const options = {
        method: 'POST',
        uri: 'http://127.0.0.1:8000/join-channel',
        body: {
            link: channel.link
        },
        json: true
    }
    const response = await rp(options)
    if (response.error) {
        return res.json({'error': response.error})
    }
    const checkChannelInDB = await db.collection('channels').findOne({'channel_id': parseInt(response.channel_id)})
    if (!checkChannelInDB) {
        db.collection('channels').insert(response)
        return res.json(response)
    }
    return res.json(checkChannelInDB)
});
cron.schedule('00 30 * * * *', async () => {
    console.log("works")
    const channels = await db.collection('channels').find({}).toArray()
    const channelIds = channels.map(item => item.channel_id)
    console.log(channelIds)
    for(let id = 0; id <= channelIds.length; id++) {
        console.log('here')
        app.get(`/get-channel-data/:${id}`, async (req, res) => {
            console.log('here2')
            console.log(id)
            const options = {
                method: 'GET',
                uri: `http://127.0.0.1:8000/get-channel-data/${id}`,
                json: true
            };
            console.log(req.params.id)
            const result = await rp(options)
            let dbObj = {}
            const checkChannelInDB = await db.collection('channels').findOne({'channel_id': parseInt(id)})
            const oldChannelData = checkChannelInDB.history[checkChannelInDB.history.length - 1]
            const isChannelInfoUpdated = isDataUpdated(Object.values(result).splice(0,4), Object.values(oldChannelData).splice(0,4))
            if(result.title !== oldChannelData.title || result.description !== oldChannelData.description) {
                if(result.title !== oldChannelData.title) {
                    dbObj.oldTitle = oldChannelData.title
                    dbObj.lastUpdatedTitle = new Date()
                } else {
                    dbObj.lastUpdatedTitle = checkChannelInDB.lastUpdatedTitle
                }
                if(result.description !== oldChannelData.description) {
                    dbObj.oldDescription = oldChannelData.description
                    dbObj.lastUpdatedDescription = new Date()
                } else {
                    dbObj.lastUpdatedDescription = checkChannelInDB.lastUpdatedDescription
                }
            } else {
                dbObj.lastUpdatedDescription = checkChannelInDB.lastUpdatedDescription
                dbObj.lastUpdatedTitle = checkChannelInDB.lastUpdatedTitle
            }
            if(!isChannelInfoUpdated) {
                db.collection('channels').updateOne({channel_id: parseInt(id) }, {'$push':
                {'history': result}}, { "upsert": true })
                db.collection('channels').updateOne({channel_id: parseInt(id) }, {'$set':
                {
                    'updateTime': new Date(),
                    'oldTitle' : dbObj.oldTitle,
                    'oldDescription': dbObj.oldDescription,
                    'lastUpdatedTitle': dbObj.lastUpdatedTitle,
                    'lastUpdatedDescription': dbObj.lastUpdatedDescription
                }
                }, { "upsert": true })
                res.json({'message': 'Channel updated'})
                }
                return res.json({'message': 'Channel already updated'})
        })
    }
})

const isDataUpdated = (newData, oldData) => {
    return oldData.every(key => 
        oldData[key] === newData[key])
}
app.delete('/delete-channel/:id', async (req, res) => {
    const result = await db.collection('channels').remove({channel_id: parseInt(req.params.id)})
    res.json(result)
})
app.listen(3000, async () => {
    console.log('Server is working on 3000')
    db = await connectToDatabase().catch((err) => {
        console.log("Not Connected to Database ERROR! ", err)
        })
})

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