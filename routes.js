const router = require('express').Router()
const rp = require('request-promise')
// const dataBaseConnection = require('./db').getDb
const {getChannelData,joinChannel} = require('./channelsMethods')
router.get('/channels', async (req, res) => {
    const db = req.app.locals.db
    const channels = await db.collection('channels').find({}).toArray()
    return res.json(channels)
})

router.post('/join-channel', async ({body}, res) => {
    const db = res.app.locals.db
    const channel = {
        link: body.link
    }
    const result = await joinChannel(channel, db)
    res.json(result)
})

router.get('/get-channel-data/:id', async (req, res) => {
    const db = req.app.locals.db
    const result = await getChannelData(req.params.id, db)
    res.json(result)
})


router.delete('/delete-channel/:id', async (req, res) => {
    const result = await db.collection('channels').remove({channel_id: parseInt(req.params.id)})
    res.json(result)
})

module.exports = router