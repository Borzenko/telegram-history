const rp = require('request-promise')
const joinChannelSchema = require('./validationSchemas/joinChannelSchema')
const moment = require('moment')
const db = require('./db').collection('channels')

const getChannelData = async (id) => {
    const options = {
        method: 'GET',
        uri: `http://127.0.0.1:8000/get-channel-data/${id}`,
        json: true
    };
    const result = await rp(options)
    let dbObj = {}
    const checkChannelInDB = await (await db).findOne({'channel_id': parseInt(id)})
    const oldChannelData = checkChannelInDB.history[checkChannelInDB.history.length - 1]
    const isChannelInfoUpdated = result && oldChannelData ? isDataUpdated(result, oldChannelData) : false
    console.log(isChannelInfoUpdated)
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
        await (await db).updateOne({channel_id: parseInt(id) }, {'$push':
        {'history': result}}, { "upsert": true })
        await (await db).updateOne({channel_id: parseInt(id) }, {'$set':
        {
            'updateTime': new Date(),
            'oldTitle' : dbObj.oldTitle,
            'oldDescription': dbObj.oldDescription,
            'lastUpdatedTitle': dbObj.lastUpdatedTitle,
            'lastUpdatedDescription': dbObj.lastUpdatedDescription
        }
        }, { "upsert": true })
        return {
            'message': 'channel updated'
        }
        }
        return {
            'message': 'Channel already updated'
        }
}

const isDataUpdated = (newData, oldData) => {
    const fieldsToCompare = ['title', 'description']
    return fieldsToCompare.every(key => 
        oldData[key] === newData[key])
}

const joinChannel = async(channel) => {
    console.log(channel)
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
    if (response.error) {
        return {'error': response.error}
    }
    const checkChannelInDB = await (await db).findOne({'channel_id': parseInt(response.channel_id)})
    if (!checkChannelInDB) {
        await (await db).insert(response)
        await (await db).updateOne({channel_id: parseInt(response.channel_id) }, {'$set':
            {
                'updateTime': new Date()
            }
            }, { "upsert": true })
        return {'message': 'join'}
    }
    return {
        'message': 'Channel already joined'
    }
}
const checkDate = (date) => {
    return moment(date).fromNow().includes('hours')

}

module.exports = {
    getChannelData,
    joinChannel,
    checkDate
}