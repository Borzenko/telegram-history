const cron = require('node-cron')
const db = require('./db').collection('channels')
const {checkDate, getChannelData} = require('./channelsMethods')
cron.schedule('00 44 * * * *', async () => {
    const channels = await (await db).find({}).toArray()
    console.log(channels)
    // const filteredArray = channels.map(item => {
    //     if(checkDate(item.updateTime)) {
    //         return item
    //     }
    // })
    channels.forEach(async item => {
        console.log(item)
       return await getChannelData(parseInt(item.channel_id))
    })
})