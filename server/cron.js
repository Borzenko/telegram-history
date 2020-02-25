const cron = require('node-cron')
const db = require('./db').collection('channels')

const { checkDate, getChannelData} = require('./channelsMethods')
// run cron every 5 minutes
cron.schedule('*/5 * * * *', async () => {
    const channels = await (await db).find({}).sort({updateTime: -1}).limit(10).toArray()

    channels.forEach(async item => {
       return await getChannelData(parseInt(item.channel_id))
    })
})