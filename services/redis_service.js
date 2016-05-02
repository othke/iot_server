"use strict";
/**
 * Write in services db
 */
var shortid = require('shortid');
var dateformat = require('dateformat');
var redis = require('redis');
var math = require('mathjs');

// constant time table name
var TIMETABLE = "timetable";

// Start services client
var client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

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

redisService.synthesisMessage = function(){
    return new Promise(function (resolve, reject){
		redisService.zrangebyscore()
		
		.then(function(obj){
			return redisService.getMessageById(obj);
		})
		
		.then(function(obj){
			return redisService.synthesis(obj);
		})
		
		// Success synthesis message
        .then(function(obj){
            resolve(obj);
        })
        
	    // Catch error
	    .catch(function(error){
	        reject(error);
	    });
    });
		
}

redisService.synthesis = function(obj){
	return new Promise(function(resolve,reject){
		var synthesis = new Object();
		var synthesisSerialize = new Array();
		
		for(var i = 0; i < obj.length; i++){
			var sensorId = obj[i].sensorType;
			var value = parseInt(obj[i].value);
			
			if(Array.isArray(synthesis[sensorId])){
				synthesis[sensorId].push(value);
			} else {	
				var values = new Array();
				values.push(value);
				synthesis[sensorId] = values;
			}
		}
		
		for(var sensor in synthesis){
			var key = parseInt(sensor);
			var value = synthesis[sensor];

			var json = {
				  "minValue" : math.min(value),
				  "maxValue" : math.max(value),
				  "sensorType" : key,
				  "mediumValue" : math.mean(value)
			}			
			synthesisSerialize.push(json);
		}
		
		resolve(synthesisSerialize);
		
	});
}

redisService.getMessageById = function(obj){
	return new Promise(function(resolve,reject){
		var array = new Array();
		for(var i = 0; i < obj.length; i++){		
			var tempArray = new Array();
			tempArray.push("hgetall");
			tempArray.push(obj[i]);
			array.push(tempArray);
		} 	
		
		client.multi(array)
		.exec(function (err, replies) {
			if(err){
				reject(err);
			} else {
				resolve(replies);
			}
		});
	});
}

redisService.zrangebyscore = function(){	
	var time = new Date().getTime() - 60*60*1000;	
	return new Promise(function(resolve,reject){		
		var args = ['timetable', '+inf', time];		
		client.zrevrangebyscore(args, function(err,obj){
			if(err){
				reject(err);
			} else {
				resolve(obj);
			}			
		});
	});
}


module.exports = redisService;


