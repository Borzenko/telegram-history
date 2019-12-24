const rp = require('request-promise')
const joinChannelSchema = require('./validationSchemas/joinChannelSchema')
const moment = require('moment')


const getChannelData = async (id, db) => {
    const options = {
        method: 'GET',
        uri: `http://127.0.0.1:8000/get-channel-data/${id}`,
        json: true
    };
    const result = await rp(options)
    let dbObj = {}
    const checkChannelInDB = await db.collection('channels').findOne({'channel_id': parseInt(id)})
    const oldChannelData = checkChannelInDB.history[checkChannelInDB.history.length - 1]
    const isChannelInfoUpdated = oldChannelData && result ? isDataUpdated(Object.values(result).splice(0,4), Object.values(oldChannelData).splice(0,4)) : false
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
        return {
            'message': 'channel updated'
        }
        }
        return {
            'message': 'Channel already updated'
        }
}

const isDataUpdated = (newData, oldData) => {
    return newData.every(key => 
        newData[key] === oldData[key])
}

const joinChannel = async(channel, db) => {
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
    const checkChannelInDB = await db.collection('channels').findOne({'channel_id': parseInt(response.channel_id)})
    if (!checkChannelInDB) {
        db.collection('channels').insert(response)
        db.collection('channels').updateOne({channel_id: parseInt(response.channel_id) }, {'$set':
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