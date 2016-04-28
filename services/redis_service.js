"use strict";
/**
 * Write in services db
 */
var shortid = require('shortid');
var dateformat = require('dateformat');
var redis = require('redis');

// constant time table name
var TIMETABLE = "timetable";

// Start services client
var client = redis.createClient('6379', '192.168.99.100');

var redisService = {};


redisService.validMessage = function(message){
    return new Promise(function(resolve, reject){

        // Check properties
        var isValid = true;
        var prop = "";
        var props = [
            {name: 'id', type: 'string'},
            {name: 'timestamp', type: 'string'},
            {name: 'sensorType', type: 'number'},
            {name: 'value', type: 'number'}
        ]

        for(var i = 0; i < props.length; i++){
            // Check property name
            if (! message.hasOwnProperty(props[i].name)){
                isValid = false;
                prop = props[i].name;
                break;
            }
            // Check property type
            if ( typeof message[props[i].name] != props[i].type ){
                isValid = false;
                break;
            }
            
            // Return promise
            if(! isValid){
                reject(new Error("error with property " + prop));
            }
            else{
                resolve(message);
            }
        }
    });
}

/**
 * Get id request
 * @param message
 * @returns Promise | resolve return the message
 */
redisService.getIdRequest = function(message){
    return new Promise(function(resolve, reject){
        client.incr('id_request', function(error, incr){
            if(error){
                reject(error);
            }
            else{
                resolve(message);
            }
        })
    });
};

/**
 * Check the message id does not exist
 * @param id
 * @returns Promise | resolve return the message
 */
redisService.unsetId = function(message){
    return new Promise(function(resolve, reject){
        client.hgetall(message.id, function(error, result){
            if(error){
                // Error in request
                reject(error);
            }
            else{
                // Id is not set = success
                if(result == null){
                    resolve(message);
                }
                // Id is set = error
                else{
                    var errorMessage = "id still exist";
                    console.log(errorMessage)
                    reject(new Error(errorMessage))
                }
            }
        });
    });
};

/**
 * Add the message id in the timetable
 * @param message
 * @returns Promise | resolve return the message
 */
redisService.addMessageIdInTimetable = function(message){
    return new Promise(function(resolve, reject){
        client.zadd(TIMETABLE, Date.parse(message.timestamp), message.id, function(error, result){
            if(error){
                reject(error);
            }
            else{
                resolve(message);
            }
        });
    });
};

/**
 * Add the message in the db
 * @param message
 * @returns Promise | resolve return the message
 */
redisService.addMessage = function(message){
  return new Promise(function(resolve, reject){
        client.hmset(message.id, message, function(error, result){
            if(error){
                reject(error);
            }
            else{
                resolve(message);
            }
        });
    });
};

/**
 * Make all the process for add request
 */
redisService.requestAddMessage = function(message){

    return new Promise(function (resolve, reject){

        redisService.getIdRequest(message)
        // Check message validity
        .then(function(message){
            return redisService.validMessage(message);
        })
        // Check id message is not set
        .then(function(message){
            return redisService.unsetId(message);
        })
        // Add the id in the timetable
        .then(function(message){
            return redisService.addMessageIdInTimetable(message);
        })
        // Add the message in the db
        .then(function(message){
            return redisService.addMessage(message);
        })
        // Success Add message
        .then(function(message){
            resolve(message)
        })
        // Catch error
        .catch(function(error){
            reject(error)
        });
    });
};

module.exports = redisService;


