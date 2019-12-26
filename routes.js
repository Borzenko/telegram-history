const router = require('express').Router()
const rp = require('request-promise')
const db = require('./db').collection('channels')
const {getChannelData,joinChannel} = require('./channelsMethods')
const { multerUploads, dataUri } = require('./multer')
const { uploader, cloudinaryConfig } = require('./cloudinaryConfig')
const { resolve } =  require('path')
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

router.post('/upload', multerUploads, (req, res) => {
if(req.file) {
const file = dataUri(req).content;
return uploader.upload(file).then((result) => {
const image = result.url;
return res.status(200).json({
messge: 'Your image has been uploded successfully to cloudinary',
data: {
image
}
})
}).catch((err) => res.status(400).json({
messge: 'someting went wrong while processing your request',
data: {
err
}
}))
}
})
module.exports = router