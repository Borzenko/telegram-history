const rp = require('request-promise')
const joinChannelSchema = require('./validationSchemas/joinChannelSchema')
const moment = require('moment')
const db = require('./db').collection('channels')
const { dataUri } = require('./multer')
const { uploader } = require('./cloudinaryConfig')

const getChannelData = async (id) => {
    const options = {
        method: 'GET',
        uri: `http://127.0.0.1:8000/get-channel-data/${id}`,
        json: true
    };
    const result = await rp(options)
    const channelAvatar = await uploadChannelAvatar(result)
    result.avatar = channelAvatar
    let dbObj = {}
    const checkChannelInDB = await (await db).findOne({'channel_id': parseInt(id)})
    const oldChannelData = checkChannelInDB ? checkChannelInDB.history[checkChannelInDB.history.length - 1] : null
    const isChannelInfoUpdated = result && oldChannelData ? isDataUpdated(result, oldChannelData) : false
    if(!checkChannelInDB && !oldChannelData && !isChannelInfoUpdated) {
        await updateChannelInfoInDB(id, dbObj, result)
        return result
    }
    if(!isChannelInfoUpdated) {
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
        if(result.avatar !== oldChannelData.avatar) {
            dbObj.oldAvatar= oldChannelData.avatar
            dbObj.lastUpdatedAvatar = new Date()
        } else {
            dbObj.lastUpdatedAvatar = checkChannelInDB.lastUpdatedAvatar
        }
        await updateChannelInfoInDB(id, dbObj, result)
        return result

    } else {
        dbObj.lastUpdatedDescription = checkChannelInDB.lastUpdatedDescription
        dbObj.lastUpdatedTitle = checkChannelInDB.lastUpdatedTitle
        dbObj.lastUpdatedAvatar = checkChannelInDB.lastUpdatedAvatar
        return {
            'message': 'Channel already updated'
        }
    }
}

const isDataUpdated = (newData, oldData) => {
    const fieldsToCompare = ['title', 'description']
    return fieldsToCompare.every(key => 
        oldData[key] === newData[key])
}
const updateChannelInfoInDB = async (id, dbObj, requestResult) => {
    await (await db).updateOne({channel_id: parseInt(id) }, {'$push':
        {'history': requestResult}}, { "upsert": true })
        await (await db).updateOne({channel_id: parseInt(id) }, {'$set':
        {
            'updateTime': new Date(),
            'oldTitle' : dbObj.oldTitle,
            'oldDescription': dbObj.oldDescription,
            'oldAvatar': dbObj.oldAvatar,
            'lastUpdatedTitle': dbObj.lastUpdatedTitle,
            'lastUpdatedDescription': dbObj.lastUpdatedDescription,
            'lastUpdatedAvatar': dbObj.lastUpdatedAvatar
        }
        }, { "upsert": true })
}

const joinChannel = async(channel) => {
    const validationResult = joinChannelSchema.validate(channel)
    if (validationResult.error) { return {'error': validationResult.error } }
    
    const options = {
        method: 'POST',
        uri: 'http://127.0.0.1:8000/join-channel',
        body: {
            link: channel.link
        },
        json: true
    }
    const response = await rp(options)
    const channelInfo = await getChannelData(response.channel_id)
    if (response.error) {
        return {'error': response.error}
    }
    const checkChannelInDB = await (await db).findOne({'channel_id': parseInt(response.channel_id)})
    if (!checkChannelInDB) {
        await (await db).insert(channelInfo)
        const newChannel = await (await db).updateOne({channel_id: parseInt(response.channel_id) }, {'$set':
            {
                'updateTime': new Date()
            }
            }, { "upsert": true })
        return newChannel
    }
    return {
        'message': 'Channel already joined'
    }

}
const checkDate = (date) => {
    return moment(date).fromNow().includes('hours')

}
const uploadChannelAvatar = async(channel) => {
    const file = channel.avatar ? dataUri(channel.avatar).fileName : null
    if (file) {
        return uploader.upload(file).then((result) => {
            const image = result.url
            return image
        }).catch((error) => {
            console.log(error)
            return {'error': error}
        })
    }
}
const leaveChannel = async (id) => {
    const options = {
        method: 'DELETE',
        uri: `http://127.0.0.1:8000/delete-channel/${id}`,
        json: true
    }
    await rp(options)
    await (await db).remove({channel_id: parseInt(id)})
}

module.exports = {
    getChannelData,
    joinChannel,
    checkDate,
    leaveChannel
}