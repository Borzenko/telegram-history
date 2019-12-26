const router = require('express').Router()
const db = require('./db').collection('channels')
const {getChannelData,joinChannel} = require('./channelsMethods')
const { cloudinaryConfig } = require('./cloudinaryConfig')
router.use('*', cloudinaryConfig)
router.get('/channels', async (req, res) => {
    const channels = await (await db).find({}).toArray()
    return res.json(channels)
})

router.post('/join-channel', async ({body}, res) => {
    const channel = {
        link: body.link
    }
    const result = await joinChannel(channel)
    res.json(result)
})

router.get('/get-channel-data/:id', async (req, res) => {
    const result = await getChannelData(req.params.id)
    res.json(result)
})


router.delete('/delete-channel/:id', async (req, res) => {
    const result = await (await db).remove({channel_id: parseInt(req.params.id)})
    res.json(result)
})

module.exports = router