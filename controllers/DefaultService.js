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
        console.log(message);
        res.end();
      })
      .catch(function(error){
        console.log(error);
        res.end();
      })
}

exports.messagesSynthesisGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  **/
  
  redis_service.synthesisMessage()
  	.then(function(response){
  		res.end(JSON.stringify(response));
  	})
  	.catch(function(error){
  		res.end();
  	});  
}

