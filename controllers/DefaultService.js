'use strict';
var redis_service = require('../services/redis_service');

exports.messagesPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * message (Message)
  **/
  // Get the message and call redis
  var message = args.message.value;
  
  redis_service.requestAddMessage(message)
      .then(function(message){
        console.log("success save message");
        console.log(message)
        res.end();
      })
      .catch(function(error){
        console.log(error)
        res.end();
      })
}

exports.messagesSynthesisGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  **/
  
  
  var examples = {};
  examples['application/json'] = [ {
  "minValue" : 123456789,
  "maxValue" : 123456789,
  "sensorType" : 123,
  "mediumValue" : 123456789
} ];
  
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
  
}

