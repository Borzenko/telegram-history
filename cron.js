const cron = require('node-cron')
const {checkDate, getChannelData} = require('./channelsMethods')
cron.schedule('00 30 * * * *', async () => {
    const db = req.app.locals.db
    console.log(db)
    const channels = await db.collection('channels').find({}).toArray()
    console.log(channels)
    const filteredArray = channels.map(item => {
        if(checkDate(item.updateTime)) {
            return item
        }
    })
    console.log(filteredArray)
    const channelIds = filteredArray.map(item => item.channel_id)
    channelIds.forEach(item => {
       return getChannelData(item, db)
    })
})