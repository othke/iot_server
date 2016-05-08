// Start mongo with mongod --dbpath /path/todb

var conf = require('../conf');
var mongoDbConnection = require('../connection');

mongoService = {}

/**
 * Process to add a single message
 * @param message
 * @returns {Promise}
 */
mongoService.requestAddMessage = function(message){
    return new Promise(function(resolve, reject){

        // Get mongodb connection singleton
        mongoDbConnection()
            // Insert the document
            .then(function(db){
                message.timestamp = new Date(message.timestamp);
                return mongoService.insertMessage(db, message);
            })
            // Insert success
            .then(function(result){
                resolve(result);
            })
            // Insert error
            .catch(function(error){
                reject(error);
            })
    })}

/**
 * Insert the message as a document
 * @param db database connection
 * @param message to insert
 * @returns {Promise}
 */
mongoService.insertMessage = function(db, message){
    return new Promise(function(resolve, reject){
        db.collection('messages').insertOne(message, function(error, result){
            if(error){
                reject(error);
            }
            else{
                resolve(result);
            }
        })
    })
}

module.exports = mongoService;