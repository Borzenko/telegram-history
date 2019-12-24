const assert = require('assert')
const client = require('mongodb').MongoClient
const mongo_uri = 'mongodb://localhost:27017/telegram-history'

let _db

const initDb = (callback) =>  {
    if (_db) {
        console.warn('Trying to init DB again!')
        return callback(null, _db)
    }


    const connected = (err, db) =>  {
        if (err) {
            return callback(err)
        }
        console.log('DB initialized')
        _db = db
        return callback(null, _db)
    }
    client.connect(mongo_uri, connected)
}
const getDb = () => {
    assert.ok(_db, 'Db has not been initialized. Please called init first.')
    return _db
}

// module.exports = class DataBaseConnection {
//     static get db() {
//         return _db
//     }
//     static initDb(callback) {
//         if (_db) {
//             console.warn('Trying to init DB again!')
//             return callback(null, _db)
//         }
    
    
//         const connected = (err, db) =>  {
//             if (err) {
//                 return callback(err)
//             }
//             console.log('DB initialized')
//             _db = db
//             return callback(null, _db)
//         }
//         client.connect(mongo_uri, connected)
//     }
// }

module.exports = {
    initDb,
    getDb
}