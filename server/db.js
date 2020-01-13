const Mongo = require('mongodb')
const dotenv =  require('dotenv')
dotenv.config()

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