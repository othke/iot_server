// Start mongo with mongod --dbpath /path/todb

var conf = require('../conf');
var mongoDbConnection = require('../connection');
var round = require('mongo-round');
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

mongoService.getSynthesis = function(){
    return new Promise(function(resolve, reject){

        // Get mongodb connection singleton
        mongoDbConnection()

            .then(function(db){
                return mongoService.serializeSynthesis(db);
            })
            // Insert success
            .then(function(result){
                resolve(result);
            })
            // Insert error
            .catch(function(error){
                reject(error);
            })
    });
}

mongoService.serializeSynthesis = function(db){
    return new Promise(function(resolve, reject){

        var timeStamp = Date.now();                 
        var timeStampDelta = new Date(timeStamp - 60*60*1000);

        db.collection('messages').aggregate([
            { $match: {
                timestamp: {
                    $gte: new Date(mongoService.ISODate(new Date(timeStampDelta)))
                }
            }},
            { "$group": {
                _id:"$sensorType",
                minValue:{$min:"$value"},
                maxValue:{$max:"$value"},
                mediumValue: {$avg:"$value"}
            }},
            { $project: {
                _id: false,
                sensorType:"$_id",
                minValue: '$minValue',
                maxValue: '$maxValue',
                mediumValue: round('$mediumValue', 2)
            } }
        ], function (err, result){
            if (err) {
                reject(err);
            } else {
                resolve(JSON.stringify(result));
            }
        })
    })
}

mongoService.ISODate = function (d){
	 function pad(n){return n<10 ? '0'+n : n}
	 return d.getUTCFullYear()+'-'
	      + pad(d.getUTCMonth()+1)+'-'
	      + pad(d.getUTCDate())+'T'
	      + pad(d.getHours())+':'
	      + pad(d.getUTCMinutes())+':'
	      + pad(d.getUTCSeconds())+'Z'
}

module.exports = mongoService;
