const Mongo = require('mongodb')
const dotenv =  require('dotenv')
dotenv.config()
// const initDb = (callback) =>  {
//     if (_db) {
//         console.warn('Trying to init DB again!')
//         return callback(null, _db)
//     }


//     const connected = (err, db) =>  {
//         if (err) {
//             return callback(err)
//         }
//         console.log('DB initialized')
//         _db = db
//         return callback(null, _db)
//     }
//     client.connect(mongo_uri, connected)
// }
// const getDb = () => {
//     assert.ok(_db, 'Db has not been initialized. Please called init first.')
//     return _db
// }

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
    connect(mongoDbUrl = process.env.MONGO_URI) {
        console.log('connecting to the db')
        if (!this.db) {
            return Mongo.MongoClient.connect(mongoDbUrl, {
                promiseLibrary: Promise
            })
            .then(db => {
                this.db = db
                return db
            });
        }
        return Promise.resolve(this.db)
    },
    collection(collection) {
        return this.connect()
            .then(db => {
                return db.collection(collection)
            })
            .catch({'message': 'error'})
    }
}